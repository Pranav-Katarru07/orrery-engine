#!/usr/bin/env python3
"""Source curated NASA imagery per body from the NASA Images API.

Queries images-api.nasa.gov with hand-tuned search terms per body, filters to
on-topic public-domain images, downloads the best rendition that fits the
size cap (~large preferred, ~medium fallback) into public/gallery/<id>/, and
writes src/data/gallery.js.

PINNED lets a body lead with hand-picked iconic shots (by nasa_id) — those
land at index 0+, and index 0 is what the UI uses as the body's thumbnail.

Public domain: NASA imagery (images.nasa.gov). Re-run with `python3
scripts/source_gallery.py` (optionally `<id> <id> …` for a partial run); each
processed body's folder is rebuilt from scratch so results are always fresh.
"""
import json
import os
import re
import ssl
import sys
import time
import urllib.parse
import urllib.request

# Prefer a real CA bundle when certifi is around; this box's system Python
# lacks one, and we're only fetching public-domain imagery from NASA, so
# fall back to an unverified context.
try:
    import certifi
    SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL_CTX = ssl.create_default_context()
    SSL_CTX.check_hostname = False
    SSL_CTX.verify_mode = ssl.CERT_NONE

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "gallery")
DATA_JS = os.path.join(ROOT, "src", "data", "gallery.js")

TARGET = 6          # default images per body (per-body `count` overrides)
PAGE_SIZE = 40
MAX_BYTES = 450_000   # rendition size cap — ~large only when it fits this
HARD_CAP = 2_000_000  # never keep a download bigger than this

# Per-body search config. `q` is the primary query; `must` terms (lowercase)
# must appear in the title/description to keep an image on-topic; `avoid`
# drops obvious noise (launch vehicles, portraits, unrelated craft).
AVOID_COMMON = [
    "administrator", "briefing", "press conference", "logo", "patch",
    "employee", "ceremony", "award", "training", "welcome", "director",
    "senator", "congress", "interview", "signing", "anniversary",
]

# Hand-picked iconic shots per body (nasa_ids, verified against the API).
# They land first in the body's list, and index 0 is the UI thumbnail — so
# every body leads with a proper full-disc portrait instead of whatever the
# search happened to return first.
PINNED = {
    "sun": ["GSFC_20171208_Archive_e002035"],   # full disk view of the sun
    "mercury": ["PIA15162", "PIA16853"],        # MESSENGER globe + color view
    "venus": ["PIA23791", "PIA00271"],          # Mariner 10 + Magellan globe
    "earth": ["AS17-148-22727", "PIA18033"],    # Apollo 17 Blue Marble
    "moon": ["PIA14011", "PIA13517"],           # LRO nearside mosaic + color
    "mars": ["PIA00407", "PIA03154"],           # Viking global + Hubble
    "jupiter": ["PIA22946", "PIA04866"],        # Juno "Jupiter Marble" + Cassini
    "saturn": ["PIA21046", "PIA17172"],         # approaching northern summer
    "uranus": ["PIA18182", "PIA00032"],         # Voyager 2 full disk
    "neptune": ["PIA00046", "PIA02245"],        # Voyager 2 full disk
    "pluto": ["PIA19708", "PIA19952"],          # big heart in color
    "ceres": ["PIA19562"],                      # Dawn full globe
    "eris": ["PIA17307"],                       # Eris & Dysnomia artist concept
    "sedna": ["PIA05566", "PIA05567"],          # artist concept + size chart
    "vesta": ["PIA15678", "PIA14317"],          # Dawn full view
    "arrokoth": ["PIA22190"],                   # New Horizons encounter art
    "phobos": ["PIA10368"],                     # HiRISE color
    "deimos": ["PIA11826"],                     # HiRISE color
    "io": ["PIA02308", "PIA00583"],             # Galileo true-color globe
    "europa": ["PIA19048", "PIA01295"],         # stunning surface remaster
    "ganymede": ["PIA00716", "PIA24681"],       # color global + Juno close-up
    "callisto": ["PIA03456"],                   # global color
    "amalthea": ["PIA01074"],                   # four Galileo views
    "mimas": ["PIA12570"],                      # Herschel crater "death star"
    "enceladus": ["PIA17202", "PIA07800"],      # approaching Enceladus
    "tethys": ["PIA07738"],                     # full view
    "dione": ["PIA07744"],                      # ringside with Dione
    "rhea": ["PIA07763", "PIA06578"],           # full moon + natural color
    "titan": ["PIA14602", "PIA06230"],          # hazy orange orb
    "iapetus": ["PIA08384"],                    # two-toned global
    "hyperion": ["PIA07740"],                   # odd world
    "phoebe": ["PIA06064"],                     # the face of Phoebe
    "miranda": ["PIA18185", "PIA01490"],        # icy face mosaic
    "ariel": ["PIA00041"],                      # highest-res color
    "umbriel": ["PIA00040"],                    # closest approach
    "titania": ["PIA01979", "PIA00039"],        # full-disk view
    "oberon": ["PIA00034"],                     # closest approach
    "triton": ["PIA00317"],                     # global color mosaic
    "proteus": ["PIA00062"],                    # Voyager 2 surface detail
    "nereid": ["PIA00054"],                     # Voyager 2
    "charon": ["PIA19968", "PIA19966"],         # enhanced color global
    "styx": ["PIA20033"],                       # Pluto moons family portrait
    "nix": ["PIA20287", "PIA19847"],            # half illuminated
    "kerberos": ["PIA20034"],                   # Kerberos revealed
    "hydra": ["PIA20581", "PIA19711"],          # icy Hydra
    "dysnomia": ["PIA17307"],                   # Eris & Dysnomia artist concept
    "halley": ["PIA17485"],                     # comet Halley 1986
    "churyumov": ["PIA18899"],                  # Rosetta's comet
    "voyager1": ["PIA17049"],                   # Voyager in space art
    "voyager2": ["PIA21736", "PIA22915"],       # Voyager 2 testing
    "cassini": ["PIA16739"],                    # Cassini at Saturn art
    "newhorizons": ["PIA10075"],                # New Horizons at Pluto art
    "perseverance": ["PIA24542", "PIA23764"],   # selfie with Ingenuity
}

BODIES = {
    "sun": dict(q="sun solar SDO", count=9, must=["sun", "solar", "corona", "sdo", "flare", "prominence"]),
    "mercury": dict(q="Mercury MESSENGER planet", must=["mercury"], avoid=["freddie", "project mercury", "capsule", "astronaut", "atlas"]),
    "venus": dict(q="Venus planet Magellan", must=["venus"], avoid=["venus williams", "transit of venus building"]),
    "earth": dict(q="Earth from space blue marble", count=10, must=["earth"], avoid=["google earth"]),
    "mars": dict(q="Mars planet surface rover", count=10, must=["mars"], avoid=["mars candy"]),
    "jupiter": dict(q="Jupiter planet Juno", count=9, must=["jupiter"], avoid=["jupiter florida", "jupiter inlet"]),
    "saturn": dict(q="Saturn planet rings Cassini", count=9, must=["saturn"], avoid=["saturn v", "saturn rocket", "saturn ib", "saturn i "]),
    "uranus": dict(q="Uranus planet Voyager", must=["uranus"]),
    "neptune": dict(q="Neptune planet Voyager", must=["neptune"], avoid=["neptune spear", "operation neptune"]),
    "pluto": dict(q="Pluto New Horizons", count=9, must=["pluto"], avoid=["disney"]),
    "ceres": dict(q="Ceres dwarf planet Dawn", must=["ceres"]),
    "eris": dict(q="Eris dwarf planet", must=["eris"]),
    "haumea": dict(q="Haumea dwarf planet", must=["haumea"]),
    "makemake": dict(q="Makemake dwarf planet", must=["makemake"]),
    "gonggong": dict(q="Gonggong dwarf planet 2007 OR10", must=["gonggong", "or10"]),
    "quaoar": dict(q="Quaoar Kuiper belt", must=["quaoar"]),
    "sedna": dict(q="Sedna artist concept", must=["sedna"], avoid=["planitia", "magellan", "venus"]),
    "orcus": dict(q="Orcus Kuiper belt object", must=["orcus"]),
    "vesta": dict(q="Vesta asteroid Dawn", must=["vesta"]),
    "pallas": dict(q="Pallas asteroid", must=["pallas"], avoid=["athena"]),
    "hygiea": dict(q="Hygiea asteroid", must=["hygiea"]),
    "arrokoth": dict(q="Ultima Thule New Horizons", must=["arrokoth", "ultima thule", "mu69"], avoid=["administrator", "team", "crowd", "countdown"]),
    "moon": dict(q="Moon lunar surface", count=8, must=["moon", "lunar"], avoid=["moonlight", "harvest moon"]),
    "phobos": dict(q="Phobos moon Mars", must=["phobos"]),
    "deimos": dict(q="Deimos moon Mars", must=["deimos"]),
    "io": dict(q="Io Jupiter moon volcano", must=["io "], avoid=["radio", "ratio", "mission "]),
    "europa": dict(q="Europa Jupiter moon ice", count=8, must=["europa"]),
    "ganymede": dict(q="Ganymede Jupiter moon", must=["ganymede"]),
    "callisto": dict(q="Callisto Jupiter moon", must=["callisto"]),
    "amalthea": dict(q="Amalthea Jupiter moon", must=["amalthea"]),
    "mimas": dict(q="Mimas Saturn moon", must=["mimas"]),
    "enceladus": dict(q="Enceladus Saturn moon plume", count=8, must=["enceladus"]),
    "tethys": dict(q="Tethys Saturn moon", must=["tethys"]),
    "dione": dict(q="Dione Saturn moon", must=["dione"]),
    "rhea": dict(q="Rhea Saturn moon", must=["rhea"]),
    "titan": dict(q="Titan Saturn moon haze", count=8, must=["titan"], avoid=["titan rocket", "titan ii", "titan iv", "titan missile"]),
    "iapetus": dict(q="Iapetus Saturn moon", must=["iapetus"]),
    "hyperion": dict(q="Hyperion Saturn moon", must=["hyperion"]),
    "phoebe": dict(q="Phoebe Saturn moon", must=["phoebe"]),
    "miranda": dict(q="Miranda Uranus moon", must=["miranda"]),
    "ariel": dict(q="Ariel Uranus moon", must=["ariel"], avoid=["little mermaid"]),
    "umbriel": dict(q="Umbriel Uranus moon", must=["umbriel"]),
    "titania": dict(q="Titania Uranus moon", must=["titania"]),
    "oberon": dict(q="Oberon Uranus moon", must=["oberon"]),
    "triton": dict(q="Triton Neptune moon", must=["triton"], avoid=["triton rocket"]),
    "proteus": dict(q="Proteus Neptune moon Hubble", must=["proteus", "neptune moon"]),
    "nereid": dict(q="Nereid Neptune moon", must=["nereid"]),
    "charon": dict(q="Charon Pluto moon New Horizons", must=["charon"]),
    "styx": dict(q="Styx Pluto moon", must=["styx"]),
    "nix": dict(q="Nix Pluto moon", must=["nix"], avoid=["phoenix", "nix olympica"]),
    "kerberos": dict(q="Kerberos Pluto moon", must=["kerberos"]),
    "hydra": dict(q="Hydra Pluto moon", must=["hydra"]),
    "dysnomia": dict(q="Dysnomia Eris moon", must=["dysnomia", "eris"]),
    "halley": dict(q="Halley comet", must=["halley"]),
    "halebopp": dict(q="Hale-Bopp comet", must=["hale-bopp", "hale bopp"]),
    "churyumov": dict(q="67P Churyumov Rosetta comet", count=8, must=["67p", "churyumov", "rosetta"]),
    "voyager1": dict(q="Voyager 1 spacecraft", must=["voyager"]),
    "voyager2": dict(q="Voyager 2 spacecraft", must=["voyager"]),
    "cassini": dict(q="Cassini spacecraft Saturn", must=["cassini"]),
    "newhorizons": dict(q="New Horizons spacecraft Pluto", must=["new horizons"]),
    "perseverance": dict(q="Perseverance rover Mars", must=["perseverance"]),
}


def http_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "orrery-gallery/1.0"})
    with urllib.request.urlopen(req, timeout=30, context=SSL_CTX) as r:
        return json.load(r)


def hit_from_item(it):
    """Normalize one API search item into our hit dict (or None)."""
    data = (it.get("data") or [{}])[0]
    title = (data.get("title", "") or "").strip()
    nasa_id = data.get("nasa_id")
    if not nasa_id:
        return None
    return {
        "nasa_id": nasa_id,
        "title": title,
        "credit": (data.get("secondary_creator") or data.get("center") or "NASA").strip(),
        "caption": (data.get("description", "") or "").strip()[:220],
        "collection": it.get("href"),
    }


def search(cfg, want):
    q = urllib.parse.quote(cfg["q"])
    url = f"https://images-api.nasa.gov/search?q={q}&media_type=image&page_size={PAGE_SIZE}"
    try:
        d = http_json(url)
    except Exception as e:
        print(f"  search failed: {e}")
        return []
    items = d.get("collection", {}).get("items", [])
    must = cfg.get("must", [])
    avoid = cfg.get("avoid", []) + AVOID_COMMON
    picked = []
    for it in items:
        data = (it.get("data") or [{}])[0]
        hay = ((data.get("title", "") or "") + " " + (data.get("description", "") or "")).lower()
        if must and not any(m in hay for m in must):
            continue
        if any(a in hay for a in avoid):
            continue
        h = hit_from_item(it)
        if h:
            picked.append(h)
        if len(picked) >= want:
            break
    return picked


def fetch_by_id(nasa_id):
    """Fetch a single hand-picked image's metadata by its nasa_id."""
    url = f"https://images-api.nasa.gov/search?nasa_id={urllib.parse.quote(nasa_id)}&media_type=image"
    try:
        d = http_json(url)
    except Exception as e:
        print(f"  pinned {nasa_id} failed: {e}")
        return None
    items = d.get("collection", {}).get("items", [])
    if not items:
        print(f"  pinned {nasa_id}: not found")
        return None
    return hit_from_item(items[0])


def head_size(url):
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "orrery-gallery/1.0"})
        with urllib.request.urlopen(req, timeout=30, context=SSL_CTX) as r:
            n = r.headers.get("Content-Length")
            return int(n) if n else None
    except Exception:
        return None


def asset_url(collection_href):
    """Resolve a collection.json to the best jpg rendition: ~large when it
    fits MAX_BYTES, else ~medium, else a capped ~orig."""
    try:
        assets = http_json(collection_href)
    except Exception:
        return None
    rend = {}
    for u in assets:
        lu = u.lower()
        for tag in ("~large.jpg", "~medium.jpg", "~orig.jpg"):
            if lu.endswith(tag):
                rend[tag] = u.replace("http://", "https://")
    large = rend.get("~large.jpg")
    med = rend.get("~medium.jpg")
    orig = rend.get("~orig.jpg")
    if large:
        n = head_size(large)
        if n and n <= MAX_BYTES:
            return large
    if med:
        return med
    if orig:
        n = head_size(orig)
        if n and n <= MAX_BYTES:
            return orig
    return large or orig


def download(url, dest):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "orrery-gallery/1.0"})
        with urllib.request.urlopen(req, timeout=60, context=SSL_CTX) as r:
            body = r.read()
        if len(body) < 1024 or len(body) > HARD_CAP:
            return False
        with open(dest, "wb") as f:
            f.write(body)
        return True
    except Exception as e:
        print(f"    download failed: {e}")
        return False


def main():
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    unknown = [b for b in (only or []) if b not in BODIES]
    if unknown:
        sys.exit(f"unknown body id(s): {', '.join(unknown)}")
    gallery = {}
    for bid, cfg in BODIES.items():
        if only and bid not in only:
            continue
        want = cfg.get("count", TARGET)
        print(f"{bid}: searching…")

        # pinned iconic shots lead (index 0 becomes the UI thumbnail),
        # then search results fill the remainder
        hits = []
        for nid in PINNED.get(bid, []):
            h = fetch_by_id(nid)
            if h:
                hits.append(h)
            time.sleep(0.1)
        seen = {h["nasa_id"] for h in hits}
        hits += [h for h in search(cfg, want + len(seen)) if h["nasa_id"] not in seen]
        hits = hits[:want]

        # rebuild the folder from scratch so ordering and renditions are
        # always what this run decided — no stale files linger
        body_dir = os.path.join(OUT_DIR, bid)
        if os.path.isdir(body_dir):
            for f in os.listdir(body_dir):
                os.remove(os.path.join(body_dir, f))
        os.makedirs(body_dir, exist_ok=True)

        entries = []
        n = 0
        for h in hits:
            url = asset_url(h["collection"])
            if not url:
                continue
            n += 1
            fname = f"{n}.jpg"
            dest = os.path.join(body_dir, fname)
            if download(url, dest):
                entries.append({
                    "file": f"/gallery/{bid}/{fname}",
                    "title": h["title"] or bid.title(),
                    "credit": h["credit"] or "NASA",
                    "caption": h["caption"],
                    "source": f"https://images.nasa.gov/details/{h['nasa_id']}",
                })
            else:
                n -= 1
            time.sleep(0.15)
        if entries:
            gallery[bid] = entries
            print(f"  kept {len(entries)} images")
        else:
            print("  NONE — will fall back to texture")
        time.sleep(0.2)

    write_js(gallery, only)


def write_js(gallery, only):
    # If this was a partial run, merge into the existing exported object.
    merged = gallery
    if only and os.path.exists(DATA_JS):
        try:
            txt = open(DATA_JS).read()
            m = re.search(r"export const GALLERY = (\{.*?\});\n\nexport", txt, re.S)
            if m:
                prev = json.loads(m.group(1))
                prev.update(gallery)
                merged = prev
        except Exception:
            merged = gallery

    ordered = {k: merged[k] for k in BODIES if k in merged}
    body = json.dumps(ordered, indent=2, ensure_ascii=False)
    out = (
        "// Curated NASA public-domain imagery per body, sourced from the NASA\n"
        "// Images API (images.nasa.gov). Regenerate with\n"
        "// `python3 scripts/source_gallery.py`; files live in public/gallery/.\n\n"
        f"export const GALLERY = {body};\n\n"
        "export const galleryFor = (id) => GALLERY[id] || [];\n"
    )
    with open(DATA_JS, "w") as f:
        f.write(out)
    print(f"\nwrote {DATA_JS} ({len(ordered)} bodies with imagery)")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Source curated NASA imagery per body from the NASA Images API.

Queries images-api.nasa.gov with hand-tuned search terms per body, filters to
on-topic public-domain images, downloads the ~medium rendition into
public/gallery/<id>/, and writes src/data/gallery.js.

Public domain: NASA imagery (images.nasa.gov). Re-run with `python3
scripts/source_gallery.py`; already-downloaded files are skipped.
"""
import json
import os
import re
import ssl
import sys
import time
import urllib.parse
import urllib.request

# This box's Python lacks a CA bundle; we're only fetching public-domain
# imagery from NASA, so fall back to an unverified context.
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "gallery")
DATA_JS = os.path.join(ROOT, "src", "data", "gallery.js")

TARGET = 6          # desired images per body
MIN_KEEP = 3        # if fewer than this, still keep what we found
PAGE_SIZE = 40

# Per-body search config. `q` is the primary query; `must` terms (lowercase)
# must appear in the title/description to keep an image on-topic; `avoid`
# drops obvious noise (launch vehicles, portraits, unrelated craft).
AVOID_COMMON = [
    "administrator", "briefing", "press conference", "logo", "patch",
    "employee", "ceremony", "award", "training", "welcome", "director",
    "senator", "congress", "interview", "signing", "anniversary",
]

BODIES = {
    "sun": dict(q="sun solar SDO", must=["sun", "solar", "corona", "sdo", "flare", "prominence"]),
    "mercury": dict(q="Mercury MESSENGER planet", must=["mercury"], avoid=["freddie", "project mercury", "capsule", "astronaut", "atlas"]),
    "venus": dict(q="Venus planet Magellan", must=["venus"], avoid=["venus williams", "transit of venus building"]),
    "earth": dict(q="Earth from space blue marble", must=["earth"], avoid=["google earth"]),
    "mars": dict(q="Mars planet surface rover", must=["mars"], avoid=["mars candy"]),
    "jupiter": dict(q="Jupiter planet Juno", must=["jupiter"], avoid=["jupiter florida", "jupiter inlet"]),
    "saturn": dict(q="Saturn planet rings Cassini", must=["saturn"], avoid=["saturn v", "saturn rocket", "saturn ib", "saturn i "]),
    "uranus": dict(q="Uranus planet Voyager", must=["uranus"]),
    "neptune": dict(q="Neptune planet Voyager", must=["neptune"], avoid=["neptune spear", "operation neptune"]),
    "pluto": dict(q="Pluto New Horizons", must=["pluto"], avoid=["disney"]),
    "ceres": dict(q="Ceres dwarf planet Dawn", must=["ceres"]),
    "eris": dict(q="Eris dwarf planet", must=["eris"]),
    "haumea": dict(q="Haumea dwarf planet", must=["haumea"]),
    "makemake": dict(q="Makemake dwarf planet", must=["makemake"]),
    "gonggong": dict(q="Gonggong dwarf planet 2007 OR10", must=["gonggong", "or10"]),
    "quaoar": dict(q="Quaoar Kuiper belt", must=["quaoar"]),
    "sedna": dict(q="Sedna dwarf planet", must=["sedna"]),
    "orcus": dict(q="Orcus Kuiper belt object", must=["orcus"]),
    "vesta": dict(q="Vesta asteroid Dawn", must=["vesta"]),
    "pallas": dict(q="Pallas asteroid", must=["pallas"], avoid=["athena"]),
    "hygiea": dict(q="Hygiea asteroid", must=["hygiea"]),
    "arrokoth": dict(q="Arrokoth Ultima Thule New Horizons", must=["arrokoth", "ultima thule", "mu69"]),
    "moon": dict(q="Moon lunar surface", must=["moon", "lunar"], avoid=["moonlight", "harvest moon"]),
    "phobos": dict(q="Phobos moon Mars", must=["phobos"]),
    "deimos": dict(q="Deimos moon Mars", must=["deimos"]),
    "io": dict(q="Io Jupiter moon volcano", must=["io "], avoid=["radio", "ratio", "mission "]),
    "europa": dict(q="Europa Jupiter moon ice", must=["europa"]),
    "ganymede": dict(q="Ganymede Jupiter moon", must=["ganymede"]),
    "callisto": dict(q="Callisto Jupiter moon", must=["callisto"]),
    "amalthea": dict(q="Amalthea Jupiter moon", must=["amalthea"]),
    "mimas": dict(q="Mimas Saturn moon", must=["mimas"]),
    "enceladus": dict(q="Enceladus Saturn moon plume", must=["enceladus"]),
    "tethys": dict(q="Tethys Saturn moon", must=["tethys"]),
    "dione": dict(q="Dione Saturn moon", must=["dione"]),
    "rhea": dict(q="Rhea Saturn moon", must=["rhea"]),
    "titan": dict(q="Titan Saturn moon haze", must=["titan"], avoid=["titan rocket", "titan ii", "titan iv", "titan missile"]),
    "iapetus": dict(q="Iapetus Saturn moon", must=["iapetus"]),
    "hyperion": dict(q="Hyperion Saturn moon", must=["hyperion"]),
    "phoebe": dict(q="Phoebe Saturn moon", must=["phoebe"]),
    "miranda": dict(q="Miranda Uranus moon", must=["miranda"]),
    "ariel": dict(q="Ariel Uranus moon", must=["ariel"], avoid=["little mermaid"]),
    "umbriel": dict(q="Umbriel Uranus moon", must=["umbriel"]),
    "titania": dict(q="Titania Uranus moon", must=["titania"]),
    "oberon": dict(q="Oberon Uranus moon", must=["oberon"]),
    "triton": dict(q="Triton Neptune moon", must=["triton"], avoid=["triton rocket"]),
    "proteus": dict(q="Proteus Neptune moon", must=["proteus"]),
    "nereid": dict(q="Nereid Neptune moon", must=["nereid"]),
    "charon": dict(q="Charon Pluto moon New Horizons", must=["charon"]),
    "styx": dict(q="Styx Pluto moon", must=["styx"]),
    "nix": dict(q="Nix Pluto moon", must=["nix"], avoid=["phoenix", "nix olympica"]),
    "kerberos": dict(q="Kerberos Pluto moon", must=["kerberos"]),
    "hydra": dict(q="Hydra Pluto moon", must=["hydra"]),
    "dysnomia": dict(q="Dysnomia Eris moon", must=["dysnomia", "eris"]),
    "halley": dict(q="Halley comet", must=["halley"]),
    "halebopp": dict(q="Hale-Bopp comet", must=["hale-bopp", "hale bopp"]),
    "churyumov": dict(q="67P Churyumov Rosetta comet", must=["67p", "churyumov", "rosetta"]),
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


def search(cfg):
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
        title = data.get("title", "") or ""
        desc = data.get("description", "") or ""
        hay = (title + " " + desc).lower()
        if must and not any(m in hay for m in must):
            continue
        if any(a in hay for a in avoid):
            continue
        nasa_id = data.get("nasa_id")
        if not nasa_id:
            continue
        picked.append({
            "nasa_id": nasa_id,
            "title": title.strip(),
            "credit": (data.get("secondary_creator") or data.get("center") or "NASA").strip(),
            "caption": desc.strip()[:220],
            "collection": it.get("href"),
        })
        if len(picked) >= TARGET:
            break
    return picked


def asset_url(collection_href):
    """Resolve a collection.json to a downloadable ~medium (fallback ~orig) jpg."""
    try:
        assets = http_json(collection_href)
    except Exception:
        return None
    med = orig = None
    for u in assets:
        lu = u.lower()
        if lu.endswith("~medium.jpg"):
            med = u
        elif lu.endswith("~orig.jpg"):
            orig = u
    chosen = med or orig
    return chosen.replace("http://", "https://") if chosen else None


def download(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 1024:
        return True
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "orrery-gallery/1.0"})
        with urllib.request.urlopen(req, timeout=60, context=SSL_CTX) as r:
            body = r.read()
        if len(body) < 1024:
            return False
        with open(dest, "wb") as f:
            f.write(body)
        return True
    except Exception as e:
        print(f"    download failed: {e}")
        return False


def main():
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    gallery = {}
    for bid, cfg in BODIES.items():
        if only and bid not in only:
            continue
        print(f"{bid}: searching…")
        hits = search(cfg)
        body_dir = os.path.join(OUT_DIR, bid)
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

    # merge with any existing data so partial re-runs don't wipe others
    existing = {}
    if os.path.exists(DATA_JS) and only:
        # crude: keep previously written ids we didn't touch
        pass

    write_js(gallery, only)


def write_js(gallery, only):
    # If this was a partial run, merge into the existing exported object.
    merged = gallery
    if only and os.path.exists(DATA_JS):
        try:
            txt = open(DATA_JS).read()
            m = re.search(r"export const GALLERY = (\{.*\});\s*$", txt, re.S)
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

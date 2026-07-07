#!/bin/zsh
# Fetches public-domain / CC textures and star catalogs into public/.
# Solar System Scope textures: CC BY 4.0 (https://www.solarsystemscope.com/textures/)
# Stellarium textures: GPL (https://github.com/Stellarium/stellarium)
# d3-celestial data: BSD-3 (https://github.com/ofrohn/d3-celestial)
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEX="$ROOT/public/textures"
DATA="$ROOT/public/data"
mkdir -p "$TEX" "$DATA"

fetch() { # fetch <url> <dest>
  local url="$1" dest="$2"
  if [ -s "$dest" ]; then echo "skip  $(basename "$dest")"; return 0; fi
  if curl -fsSL --retry 2 --max-time 120 -o "$dest" "$url"; then
    echo "ok    $(basename "$dest") ($(du -h "$dest" | cut -f1 | tr -d ' '))"
  else
    echo "FAIL  $(basename "$dest")  $url"
    rm -f "$dest"
  fi
}

SSS="https://www.solarsystemscope.com/textures/download"
fetch "$SSS/2k_sun.jpg"              "$TEX/sun.jpg"
fetch "$SSS/2k_mercury.jpg"          "$TEX/mercury.jpg"
fetch "$SSS/2k_venus_surface.jpg"    "$TEX/venus_surface.jpg"
fetch "$SSS/2k_venus_atmosphere.jpg" "$TEX/venus_atmosphere.jpg"
fetch "$SSS/2k_earth_daymap.jpg"     "$TEX/earth_day.jpg"
fetch "$SSS/2k_earth_nightmap.jpg"   "$TEX/earth_night.jpg"
fetch "$SSS/2k_earth_clouds.jpg"     "$TEX/earth_clouds.jpg"
fetch "$SSS/2k_moon.jpg"             "$TEX/moon.jpg"
fetch "$SSS/2k_mars.jpg"             "$TEX/mars.jpg"
fetch "$SSS/2k_jupiter.jpg"          "$TEX/jupiter.jpg"
fetch "$SSS/2k_saturn.jpg"           "$TEX/saturn.jpg"
fetch "$SSS/2k_saturn_ring_alpha.png" "$TEX/saturn_rings.png"
fetch "$SSS/2k_uranus.jpg"           "$TEX/uranus.jpg"
fetch "$SSS/2k_neptune.jpg"          "$TEX/neptune.jpg"
fetch "$SSS/2k_ceres_fictional.jpg"  "$TEX/ceres.jpg"
fetch "$SSS/2k_eris_fictional.jpg"   "$TEX/eris.jpg"
fetch "$SSS/2k_haumea_fictional.jpg" "$TEX/haumea.jpg"
fetch "$SSS/2k_makemake_fictional.jpg" "$TEX/makemake.jpg"
fetch "$SSS/2k_stars_milky_way.jpg"  "$TEX/milky_way.jpg"

STEL="https://raw.githubusercontent.com/Stellarium/stellarium/master/textures"
for name in pluto charon io europa ganymede callisto titan enceladus mimas \
            rhea iapetus dione tethys triton titania oberon ariel umbriel \
            miranda phobos deimos vesta; do
  fetch "$STEL/$name.png" "$TEX/$name.png"
done

CEL="https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data"
fetch "$CEL/stars.6.json"               "$DATA/stars.json"
fetch "$CEL/constellations.lines.json"  "$DATA/constellation_lines.json"
fetch "$CEL/constellations.json"        "$DATA/constellation_names.json"

echo "--- done ---"

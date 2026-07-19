#!/bin/zsh
# Re-downloads the curated NASA gallery images referenced in
# src/data/gallery.js into public/gallery/. The images are committed to the
# repo, so this is only needed if they go missing or you re-clone without LFS.
# To re-curate from scratch (change which images are used), run instead:
#   python3 scripts/source_gallery.py
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if command -v python3 >/dev/null 2>&1; then
  echo "Re-sourcing gallery via source_gallery.py (skips files already present)…"
  exec python3 "$ROOT/scripts/source_gallery.py"
else
  echo "python3 not found — gallery images are committed to the repo, so this"
  echo "is only an issue on a fresh sparse checkout. Install python3 to refetch."
  exit 1
fi

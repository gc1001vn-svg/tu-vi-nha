#!/usr/bin/env bash
# Dung lai moi truong doi chieu va in lai moi so do o docs/NGUON_MO.md (muc "So do 14/10/2026"):
#   venv Python + ansaotuvi, 4 thu vien JS ghim dung ban nhu NGUON_MO, roi chay
#   tv_py.py -> so.mjs -> lich.mjs -> so-altuvi.py + so-altuvi.mjs -> sinh_vang_am_lich.py (ghi tests/vang/).
# Chay: bash scripts/doi-chieu/chay.sh [thu_muc_tam]   (mac dinh ${TMPDIR:-/tmp}/tu-vi-doi-chieu)
# Mat bao lau (do 14/10/2026, may ao 4 nhan): THOI_GIAN
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
S="${1:-${TMPDIR:-/tmp}/tu-vi-doi-chieu}"
P="$S/venv/bin/python"
mkdir -p "$S/pk/js"
[ -x "$P" ] || python3 -m venv "$S/venv"
"$P" -m pip install -q --disable-pip-version-check ansaotuvi==0.1.28
npm install --prefix "$S/pk/js" --no-audit --no-fund --loglevel=error \
  iztro@2.6.2 lunar-javascript@1.7.7 @tuquet/lunar@0.1.0 @dqcai/vn-lunar@1.0.1
"$P" "$D/tv_py.py" "$S/tv_data.json"
node "$D/so.mjs" "$S"
node "$D/lich.mjs" "$S"
"$P" "$D/so-altuvi.py" "$D/mau-altuvi.json" > "$S/altuvi_py.json"
node "$D/so-altuvi.mjs" "$S/pk/js" "$D/mau-altuvi.json" "$S/altuvi_py.json"
"$P" "$D/sinh_vang_am_lich.py"
echo "Xong sau ${SECONDS} giay"

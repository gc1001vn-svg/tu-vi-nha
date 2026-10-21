#!/usr/bin/env bash
# Dung lai moi truong doi chieu va in lai moi so do o docs/NGUON_MO.md (muc "So do 14/10/2026"):
#   venv Python + ansaotuvi, 4 thu vien JS ghim dung ban nhu NGUON_MO, roi chay
#   tv_py.py -> so.mjs -> lich.mjs -> so-altuvi.py + so-altuvi.mjs -> sinh_vang_am_lich.py (ghi tests/vang/)
#   -> tu-vi-py.py + so-tu-vi.ts (loi tu vi TS so ansaotuvi 3.000 la + 5 la Altuvi; them 19/10 de lenh do lai chung do ca tu vi)
#   -> luu-han-mcp.py + luu-han-iztro.mjs (ghi lai tests/vang/luu-han-*.json — 20/10; doi thi `git diff` thay ngay).
#   -> sinh-cnlunar.py + so-cnlunar.mjs (nen/kieng 7 viec: lunar-typescript so cnlunar 0.2.5, 2.008 ngay; 21/10, khong ghi gi vao repo).
# Chay: bash scripts/doi-chieu/chay.sh [thu_muc_tam]   (mac dinh ${TMPDIR:-/tmp}/tu-vi-doi-chieu)
# Mat bao lau (do 14/10/2026, may ao 4 nhan): lan dau 6 phut 48 giay (thu muc tam moi, cache npm/pip rong),
#   chay lai 6 phut 42 giay. Gan het la so.mjs (383 giay, iztro lap 6.000 la so); cai dat chi vai giay.
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
S="${1:-${TMPDIR:-/tmp}/tu-vi-doi-chieu}"
P="$S/venv/bin/python"
mkdir -p "$S/pk/js"
[ -x "$P" ] || python3 -m venv "$S/venv"
"$P" -m pip install -q --disable-pip-version-check ansaotuvi==0.1.28 pillow
# tuvi-mcp-server keo theo may chu MCP; phan han (`tuvi_mcp._transit`) chi can pillow.
"$P" -m pip install -q --disable-pip-version-check --no-deps tuvi-mcp-server==0.5.0
"$P" -m pip install -q --disable-pip-version-check cnlunar==0.2.5
npm install --prefix "$S/pk/js" --no-audit --no-fund --loglevel=error \
  iztro@2.6.2 lunar-javascript@1.7.7 @tuquet/lunar@0.1.0 @dqcai/vn-lunar@1.0.1
"$P" "$D/tv_py.py" "$S/tv_data.json"
node "$D/so.mjs" "$S"
node "$D/lich.mjs" "$S"
"$P" "$D/so-altuvi.py" "$D/mau-altuvi.json" > "$S/altuvi_py.json"
node "$D/so-altuvi.mjs" "$S/pk/js" "$D/mau-altuvi.json" "$S/altuvi_py.json"
"$P" "$D/sinh_vang_am_lich.py"
"$P" "$D/tu-vi-py.py" "$S/tu_vi_py.json" 3000 7
node --experimental-strip-types --disable-warning=ExperimentalWarning "$D/so-tu-vi.ts" "$S/tu_vi_py.json"
"$P" "$D/luu-han-mcp.py" "$D/../../tests/vang/luu-han-mcp.json"
node "$D/luu-han-iztro.mjs" "$S/pk/js" "$D/../../tests/vang/luu-han-iztro.json"
"$P" -I "$D/sinh-cnlunar.py" "$S/cnlunar.json"
node --experimental-strip-types --disable-warning=ExperimentalWarning "$D/so-cnlunar.mjs" "$S/cnlunar.json"
echo "Xong sau ${SECONDS} giay"

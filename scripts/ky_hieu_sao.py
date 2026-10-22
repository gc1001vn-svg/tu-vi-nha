# Trich 23 ky hieu chiem tinh (12 cung, 10 thien the, nut Bac) tu phong DejaVu Sans thanh duong SVG
# -> src/giaoDien/khoi/kyHieu.ts. Ve bang duong de iPhone khong bien ♈… thanh emoji (ke hoach dot 6, rui ro 3).
# Chay: python3 -m pip install fonttools && python3 scripts/ky_hieu_sao.py [duong/DejaVuSans.ttf]
import sys
from pathlib import Path
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

PHONG = sys.argv[1] if len(sys.argv) > 1 else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
MA = [0x2648 + i for i in range(12)] + [0x2609, 0x263D, 0x263F, 0x2640, 0x2642, 0x2643, 0x2644, 0x2645, 0x2646, 0x2647, 0x260A]
f = TTFont(PHONG)
cmap, gs, ban = f.getBestCmap(), f.getGlyphSet(), f['name'].getDebugName(5)
so = lambda v: f'{v:.1f}'.rstrip('0').rstrip('.').replace('-0', '0') if abs(v) < 0.05 else f'{v:.1f}'.rstrip('0').rstrip('.')
dong = []
for m in MA:
    g = gs[cmap[m]]
    bp = BoundsPen(gs); g.draw(bp)
    x0, y0, x1, y1 = bp.bounds
    k = 100 / max(x1 - x0, y1 - y0)  # canh dai nhat = 100, tam hop bao o (0, 0)
    pen = SVGPathPen(gs, ntos=so)
    g.draw(TransformPen(pen, (k, 0, 0, -k, -k * (x0 + x1) / 2, k * (y0 + y1) / 2)))
    dong.append(f"  '{pen.getCommands()}', // U+{m:04X}")
ra = Path(__file__).resolve().parent.parent / 'src/giaoDien/khoi/kyHieu.ts'
ra.write_text(f"""/**
 * 23 ky hieu chiem tinh ve bang duong SVG (khong dung chu: iPhone bien ♈… thanh emoji). Sinh bang `scripts/ky_hieu_sao.py`
 * tu phong DejaVu Sans ({ban}): Bitstream Vera Fonts © 2003 Bitstream, Inc.; phan them cua DejaVu thuoc pham vi cong cong
 * (https://dejavu-fonts.github.io/License.html). Moi duong nam trong o 100 × 100, tam o (0, 0).
 * Thu tu: 12 cung (Bach Duong..Song Ngu), roi 10 thien the va Bac Giao Diem theo `DIEM` cua `src/loi/chiemTinh.ts`.
 */
export const KY_HIEU: readonly string[] = [
{chr(10).join(dong)}
];
""", encoding='utf-8')
print(f'{len(dong)} ky hieu -> {ra}')

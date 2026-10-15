#!/usr/bin/env python3
"""Ve icon app "Tu Vi Nha" chi bang hinh hoc (khong chu, khong can font): Thai cuc + vong Bat quai
Tien thien, nen do son. Anh chon 14/10/2026 trong 4 phuong an — 3 phuong an kia da bo.

Chay: python3 scripts/ve_icon.py  -> ghi public/icons/*.png + public/favicon.png

Icon de vuong, nen dac (iOS tu bo goc); noi dung chinh nam trong vong tron ban kinh 40% (vung an toan maskable).
"""
import math
import os

from PIL import Image, ImageDraw

S = 2048  # ve o co lon roi thu nho (LANCZOS) de khu rang cua
GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# bang mau: do son, vang kim, muc dam
SON_SANG, SON_TOI = (206, 56, 40), (104, 14, 14)
MUC = (24, 16, 22)
VANG_SANG, VANG_TOI = (255, 230, 160), (190, 134, 52)


def p(*v):
    """Toa do ti le (0..1) -> diem anh."""
    return [x * S for x in v]


def tron(d, x, y, r, mau=255):
    d.ellipse(p(x - r, y - r, x + r, y + r), fill=mau)


def nen_loang(trong, ngoai):
    """Nen loang tron: mau `trong` o tam, `ngoai` o goc."""
    m = Image.radial_gradient("L").resize((S, S), Image.BILINEAR)
    return Image.composite(Image.new("RGB", (S, S), ngoai), Image.new("RGB", (S, S), trong), m)


def vang_kim():
    """Lop vang kim loang doc: sang tren, dam duoi."""
    m = Image.linear_gradient("L").resize((S, S), Image.BILINEAR)
    return Image.composite(Image.new("RGB", (S, S), VANG_TOI), Image.new("RGB", (S, S), VANG_SANG), m)


def to(anh, mau, ve):
    """Ve hinh len mat na (255 = to, 0 = xoa) roi do `mau` (mau don hoac anh) qua mat na."""
    m = Image.new("L", (S, S), 0)
    ve(ImageDraw.Draw(m))
    if isinstance(mau, Image.Image):
        anh.paste(mau, (0, 0), m)
    else:
        anh.paste(mau, (0, 0, S, S), m)


# Tien thien bat quai, tu dinh theo chieu kim dong ho: Can, Ton, Kham, Can(son), Khon, Chan, Ly, Doai.
# Moi que ghi hao 1 -> hao 3 (hao 1 o phia trong); 1 = hao duong (lien), 0 = hao am (dut).
QUAI = ["111", "011", "010", "001", "000", "100", "101", "110"]


def thanh(d, r, goc, u0, u1, day):
    """Thanh vuong goc ban kinh, tam o ban kinh r, keo tu u0 den u1 theo phuong tiep tuyen."""
    c, s = math.cos(goc), math.sin(goc)
    d.polygon([((.5 + (r + v) * c - u * s) * S, (.5 + (r + v) * s + u * c) * S)
               for u, v in ((u0, -day / 2), (u1, -day / 2), (u1, day / 2), (u0, day / 2))], fill=255)


def thai_cuc():
    a = nen_loang(SON_SANG, SON_TOI)
    g = vang_kim()
    R = .2
    to(a, g, lambda d: tron(d, .5, .5, R + .02))  # vien vang
    to(a, MUC, lambda d: tron(d, .5, .5, R))

    def duong(d):  # phan duong (vang): nua trai, dau ca o tren
        d.pieslice(p(.5 - R, .5 - R, .5 + R, .5 + R), 90, 270, fill=255)
        tron(d, .5, .5 - R / 2, R / 2)
        tron(d, .5, .5 + R / 2, R / 2, 0)
        tron(d, .5, .5 + R / 2, R / 6)  # mat vang trong dau am
        tron(d, .5, .5 - R / 2, R / 6, 0)  # mat muc trong dau duong

    to(a, g, duong)

    day, khe, r0 = .026, .018, .272  # hao ngoai cung cham ban kinh ~0.40 o goc thanh

    def bat_quai(d):
        for i, que in enumerate(QUAI):
            goc = math.radians(-90 + 45 * i)
            for j, hao in enumerate(que):
                r = r0 + j * (day + khe) + day / 2
                L = r * math.tan(math.radians(15))  # nua chieu dai hao, rong dan ra ngoai
                if hao == "1":
                    thanh(d, r, goc, -L, L, day)
                else:
                    thanh(d, r, goc, -L, -.22 * L, day)
                    thanh(d, r, goc, .22 * L, L, day)

    to(a, g, bat_quai)
    return a


def xuat():
    lon = thai_cuc()
    os.makedirs(os.path.join(GOC, "public", "icons"), exist_ok=True)
    for ten, n in (("public/icons/icon-512.png", 512), ("public/icons/icon-192.png", 192),
                   ("public/icons/apple-touch-icon.png", 180), ("public/favicon.png", 48)):
        duong = os.path.join(GOC, ten)
        lon.resize((n, n), Image.LANCZOS).save(duong, optimize=True)
        with Image.open(duong) as kiem:
            assert kiem.size == (n, n) and kiem.mode == "RGB", duong  # tu kiem: dung co, nen dac khong trong suot
        print("da ghi", ten)


if __name__ == "__main__":
    xuat()

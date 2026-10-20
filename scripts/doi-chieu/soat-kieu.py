"""Soat chu Truyen Kieu cho boi Kieu (dot 4, 20/10/2026) -> src/loi/truyenKieu.txt + bang kieu-soat.tsv.

Ba ban (tai ve thu muc tam, chuan hoa NFC, bo so dong, cat tu cau 1 toi cau 3254):
  A goc   https://raw.githubusercontent.com/congmnguyen/kieu-gpt/HEAD/input.txt  (chep Wikisource)
  B       https://raw.githubusercontent.com/tiepvupsu/ebookMLCB/HEAD/Chapters/01_Overview/11_featureengineering/TruyenKieu.txt
  OCR     https://archive.org/download/truyen-kieu-nguyen-du-nom-quoc-ngu/  (tep _djvu.txt, ban in Nom - Quoc ngu)
Luat (ke hoach dot 4): cau nao A, B vênh thi bo phieu TUNG CHU voi OCR, hai tren ba ban giong nhau thi theo;
ba ban deu khac, hoac khong gan duoc dong OCR -> giu A. SUA = loi ro ma bo phieu tung chu khong bat duoc.

  python3 -I soat-kieu.py A.txt B.txt OCR_djvu.txt truyenKieu.txt kieu-soat.tsv
"""
import sys, re, unicodedata, difflib

TONES = "̣̀́̃̉"
SUA = {  # cau: (cau dung, ly do)
    313: ("Được rày nhờ chút thơm rơi,", "đổi chỗ chữ, bỏ phiếu từng chữ ghép lẫn: lấy cả câu B (OCR giống B)"),
    327: ("Tháng tròn như gửi cung mây,", "B gởi, OCR gửi là một chữ"),
    506: ("Đạo tòng phu lấy chữ trinh làm đầu.", "A đổi dấu chấm thành dấu nặng (đầụ)"),
    512: ("Lứa đôi ai lại đẹp tày Thôi Trương.", "đổi chỗ chữ: lấy cả câu B"),
    1053: ("Buồn trông gió cuốn mặt duềnh,", "B duềnh, OCR duễnh (đọc sai dấu)"),
    1054: ("Ầm ầm tiếng sóng kêu quanh ghế ngồi.", "A đổi dấu chấm thành dấu nặng (ngồị)"),
    1174: ("Hãy xem có biết mặt này là ai?", "A đổi dấu hỏi câu thành dấu hỏi trên chữ (aỉ)"),
    1278: ("Theo nghiêm đường mở ngôi hàng Lâm Truy.", "viết hoa tên đất"),
    1488: ("Thế nào cũng chẳng giấu xong được nào.", "A đổi dấu chấm thành dấu nặng (nàọ)"),
    1996: ("Rón chân đứng nép độ đâu nửa giờ.", "nữa → nửa (B nửa; OCR đọc sai dấu)"),
    2230: ("Gió đưa bằng tiện đã lìa dặm khơi.", "lấy cả câu B: OCR giống B trừ một chữ đọc sai (xỉ)"),
    2524: ("Ù ù sát khí ngất trời ai đang.", "B Uù (lỗi mã), OCR Ù"),
    2920: ("Đánh quen trăm trận sức dư muôn người.", "A đổi dấu chấm thành dấu nặng (ngườị)"),
    2946: ("Nắng mưa biết đã mấy phen đổi dời?", "A đổi dấu hỏi câu thành dấu hỏi trên chữ (dờỉ)"),
    2979: ("Nghe tin nhớn nhác rụng rời,", "B nhơ nhác (gõ sót), OCR nhớn nhác; bỏ phiếu từng chữ ghép lẫn"),
    3042: ("Tuổi này gởi với cỏ cây cũng vừa.", "A đổi dấu chấm thành dấu nặng (vừạ)"),
}

def nfc(s): return unicodedata.normalize("NFC", s)
def khoa(w):  # bo hoa/thuong, dua dau thanh ve cuoi chu: "hoà" = "hòa"
    d = unicodedata.normalize("NFD", w.lower())
    return nfc("".join(c for c in d if c not in TONES)) + "".join(c for c in d if c in TONES)
def chu(l): return re.findall(r"\w+", l)
def dong(p): return [nfc(l).strip() for l in open(p, encoding="utf-8", errors="replace").read().split("\n") if l.strip()]
def cat(ds):  # bo so dong dau cau, cat tu cau 1 toi cau 3254
    ds = [re.sub(r"^\s*(?:\[?\d+\]?\s*[.):]*\s*)+", "", l).strip() for l in ds]
    a = next(i for i, l in enumerate(ds) if l.startswith("Trăm năm trong cõi người ta"))
    b = max(i for i, l in enumerate(ds) if l.startswith("Mua vui cũng được một vài trống canh"))
    return ds[a:b + 1]

A_P, B_P, O_P, OUT, BANG = sys.argv[1:6]
A, B = cat(dong(A_P)), cat(dong(B_P))
assert len(A) == len(B) == 3254, (len(A), len(B))
O = [l for l in dong(O_P) if 5 <= len(chu(l)) <= 9 and not re.search(r"[0-9A-Z]{3}|[^\w\s,.;:!?\"'“”‘’()\-–…]", l)]
KO = [" ".join(khoa(w) for w in chu(l)) for l in O]
gan, p = {}, 0  # cau -> dong OCR: con tro chay toi, tim trong cua so 40 dong
for i in range(len(A)):
    ka, kb = (" ".join(khoa(w) for w in chu(x[i])) for x in (A, B))
    best = (0.0, None)
    for j in range(p, min(len(O), p + 40)):
        r = max(difflib.SequenceMatcher(None, ka, KO[j]).ratio(), difflib.SequenceMatcher(None, kb, KO[j]).ratio())
        if r > best[0]: best = (r, j)
    if best[0] >= 0.75: gan[i] = O[best[1]]; p = best[1] + 1

ra, bang, dem = [], [], {"lay_B": 0, "giu_A": 0, "khong_so_duoc": 0}
for i, (a, b) in enumerate(zip(A, B)):
    wa, wb = chu(a), chu(b)
    if [khoa(w) for w in wa] == [khoa(w) for w in wb]: ra.append(a); continue
    o = gan.get(i); wo = chu(o) if o else []
    if not o or not len(wa) == len(wb) == len(wo):
        dem["khong_so_duoc"] += 1; ra.append(a); continue
    moi, doi, spans = a, [], [m.span() for m in re.finditer(r"\w+", a)]
    for k in reversed(range(len(wa))):
        if khoa(wa[k]) != khoa(wb[k]) and khoa(wb[k]) == khoa(wo[k]):
            t = wb[k].lower()
            t = t[0].upper() + t[1:] if wa[k][0].isupper() else t
            s, e = spans[k]; moi = moi[:s] + t + moi[e:]; doi.append(f"{wa[k]}→{t}")
    dem["lay_B" if doi else "giu_A"] += 1
    if doi: bang.append((i + 1, "bỏ phiếu: " + " ".join(reversed(doi)), moi))
    ra.append(moi)
for n, (c, ly) in SUA.items():
    ra[n - 1] = nfc(c)
    bang = [r for r in bang if r[0] != n] + [(n, "sửa tay: " + ly, nfc(c))]
bang.sort()

assert len(ra) == 3254 and all(len(chu(l)) == (6 if i % 2 == 0 else 8) for i, l in enumerate(ra)), "sai luat 6/8"
assert all(sum(c in TONES for c in unicodedata.normalize("NFD", w)) <= 1 for l in ra for w in chu(l)), "chu hai dau thanh"
open(OUT, "w", encoding="utf-8").write("\n".join(ra) + "\n")
with open(BANG, "w", encoding="utf-8") as f:
    f.write("cau\tsua\tcau sau soat\n")
    for r in bang: f.write("\t".join(map(str, r)) + "\n")
print(f"gan OCR {len(gan)}/3254 · A≠B {sum(dem.values())} câu: {dem} · sửa tay {len(SUA)} · bảng {len(bang)} câu")

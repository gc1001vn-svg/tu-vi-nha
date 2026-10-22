# Tai 78 la tarot bo 1909 (tranh Pamela Colman Smith, ban quet "Pam-A" cua Holly Voley tren Wikimedia Commons, pham vi
# cong cong) roi nen WebP rong 300 px -> public/tarot/<so>.webp (so 0..77 theo `src/loi/tarot.ts`). Ke hoach dot 6 phan 3.
# Chay: python3 scripts/tai_tarot.py <thu_muc_tam>   (can Pillow; ban goc giu o thu muc tam, chay lai khong tai lai)
# Wikimedia chan may goi don dap (chinh sach robot, https://w.wiki/4wJS): ghi ten ung dung, 12 giay mot anh (do 22/10: nhip 3 giay
# bi chan sau ~25 anh), bi 429 thi doi 60 giay roi gap doi.
import hashlib, sys, time, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

LON = ['00 Fool', '01 Magician', '02 High Priestess', '03 Empress', '04 Emperor', '05 Hierophant', '06 Lovers', '07 Chariot',
       '08 Strength', '09 Hermit', '10 Wheel of Fortune', '11 Justice', '12 Hanged Man', '13 Death', '14 Temperance', '15 Devil',
       '16 Tower', '17 Star', '18 Moon', '19 Sun', '20 Judgement', '21 World']
TEN = [f'RWS Tarot {x}.jpg' for x in LON] + [f'{bo}{i:02d}.jpg' for bo in ['Wands', 'Cups', 'Swords', 'Pents'] for i in range(1, 15)]
UA = 'tu-vi-nha/0.1 (https://github.com/gc1001vn-svg/tu-vi-nha) python-urllib'

tam = Path(sys.argv[1]); tam.mkdir(parents=True, exist_ok=True)
ra = Path(__file__).resolve().parent.parent / 'public' / 'tarot'; ra.mkdir(parents=True, exist_ok=True)
for so, ten in enumerate(TEN):
    goc = tam / ten.replace(' ', '_')
    if not goc.exists():
        k = ten.replace(' ', '_'); h = hashlib.md5(k.encode()).hexdigest()
        url = f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{urllib.parse.quote(k)}'
        cho = 60
        while True:
            try:
                with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as r:
                    goc.write_bytes(r.read()); break
            except urllib.error.HTTPError as e:
                if e.code != 429 or cho > 1920: raise
                print(f'{ten}: 429, doi {cho} giay', flush=True); time.sleep(cho); cho *= 2
        time.sleep(12)
    im = Image.open(goc).convert('RGB')
    im.resize((300, round(im.height * 300 / im.width)), Image.LANCZOS).save(ra / f'{so:02d}.webp', 'WEBP', quality=70, method=6)
    print(f'{so:02d} {ten} {im.width}x{im.height} -> {(ra / f"{so:02d}.webp").stat().st_size} byte', flush=True)
print('tong', sum(f.stat().st_size for f in ra.glob('*.webp')), 'byte')

# Sinh bang vang chiem tinh bang Swiss Ephemeris (pyswisseph 2.10.3.2, ban Moshier: khong can file .se1)
# -> tests/vang/chiem-tinh-swe.json. 300 thoi diem UT 1900-2100, toa do ngau nhien trong hop VN.
# Moi ca: jd (UT), vi do, kinh do; kinh do hoang dao (bieu kien, hoang dao that cua ngay) Mat Troi..Diem Vuong;
# toc do (do/ngay) Sao Thuy..Diem Vuong de xet nghich hanh; nut Bac that va trung binh; cung Moc, Thien Dinh;
# 12 dinh nha Placidus. Lam tron 1e-4 do (0,36 giay cung).
# Chay qua chay.sh (pyswisseph la AGPL: chi cai o thu muc tam, khong vao app). Ke hoach: docs/ke-hoach/2026-10-22-dot-6.md
import json, random, sys
import swisseph as swe

rd = random.Random(20261022)
F = swe.FLG_MOSEPH | swe.FLG_SPEED
j0, j1 = swe.julday(1900, 2, 1, 0), swe.julday(2100, 12, 31, 23.99)
tron = lambda x: round(x, 4)
ca = []
for _ in range(300):
    jd = rd.uniform(j0, j1)
    lat, lon = rd.uniform(8.4, 23.4), rd.uniform(102.1, 109.5)
    th = [swe.calc_ut(jd, b, F)[0] for b in range(10)]
    cusps, ascmc = swe.houses_ex(jd, lat, lon, b'P', F)
    ca.append(dict(jd=round(jd, 6), viDo=tron(lat), kinhDo=tron(lon), kinh=[tron(x[0]) for x in th], toc=[tron(x[3]) for x in th[2:]],
                   nutThat=tron(swe.calc_ut(jd, swe.TRUE_NODE, F)[0][0]), nutTB=tron(swe.calc_ut(jd, swe.MEAN_NODE, F)[0][0]),
                   moc=tron(ascmc[0]), dinh=tron(ascmc[1]), nha=[tron(c) for c in cusps[:12]]))
with open(sys.argv[1], 'w') as f:
    json.dump({'nguon': f'pyswisseph {swe.version}, Moshier', 'ca': ca}, f, separators=(',', ':'))
print(f'{len(ca)} ca -> {sys.argv[1]}')

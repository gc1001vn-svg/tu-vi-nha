/**
 * Chi tay (dot 7 phan 3), khong mang: moi gia tri moi o cua khung co loi giai; tra loi AI lon xon (chu thua, rao ```json, o
 * thieu, gia tri ngoai khung) van doc dung tung o; loi dan liet ke du o; goi anh qua mang gia gui dung than, loi doi cau tieng Viet.
 */
import { DIA_CHI, MO_HINH_ANH, docAnh, loiTiengViet, type TuyChonGoi } from '../src/giaoDien/ai/goi.ts';
import { DOAN_CHUONG, GIAI, KHUNG, LOI_DAN_CHI_TAY, cacO, docKhung, giaiChiTay, type Duong } from '../src/loi/chiTay.ts';

const CAC_DUONG = Object.keys(KHUNG) as Duong[];
const o = (d: Duong): [string, readonly unknown[]][] => Object.entries(KHUNG[d]) as [string, readonly unknown[]][];
const loiCua = (d: Duong, k: string): Readonly<Record<string, string>> =>
  (GIAI[d].o as Readonly<Record<string, { loi: Readonly<Record<string, string>> }>>)[k]?.loi ?? {};

/** Khung AI tra du moi o, lay gia tri thu `i` cua tung o. */
const khungThu = (i: number): Record<string, unknown> => ({
  palm: true, simian: i % 2 === 0,
  ...Object.fromEntries(CAC_DUONG.map((d) => [d, Object.fromEntries(o(d).map(([k, v]) => [k, v[i % v.length]]))])),
});

describe('chi tay', () => {
  test('moi gia tri moi o deu co loi giai, khong thua gia tri nao ngoai khung', () => {
    for (const d of CAC_DUONG) {
      for (const [k, v] of o(d)) {
        expect(Object.keys(loiCua(d, k)).sort()).toEqual(v.map(String).sort());
        for (const g of v) expect(loiCua(d, k)[String(g)]?.length ?? 0).toBeGreaterThan(20);
      }
    }
    expect([DOAN_CHUONG.true.length > 20, DOAN_CHUONG.false.length > 20]).toEqual([true, true]);
  });

  test('khung du o → moi dong co loi that; duong khong thay chi con dong do ro', () => {
    for (const i of [0, 1, 2]) {
      const k = docKhung(JSON.stringify(khungThu(i)));
      expect(k?.palm).toBe(true);
      if (k === null) return;
      const g = giaiChiTay(k);
      expect(g.map((m) => m.ten)).toEqual(['Chỉ tay ngang (đoạn chưởng)', ...CAC_DUONG.map((d) => GIAI[d].ten)]);
      for (const [j, d] of CAC_DUONG.entries()) {
        const dong = g[j + 1]?.dong ?? [];
        expect(dong.length).toBe(k.duong[d].seen === 'none' ? 1 : o(d).length);
        for (const x of dong) expect(x.loi).not.toBe('AI không đọc được ô này.');
      }
    }
  });

  test('doc tra loi lon xon: chu thua, rao json, o thieu, gia tri ngoai khung', () => {
    const k = docKhung('Đây là kết quả:\n```json\n{"palm":true,"simian":"no","life":{"seen":"clear","length":"long","arc":"medium",'
      + '"broken":false},"head":{"seen":"faint"},"fate":{"seen":"none","start":"wrist"}}\n```');
    expect(k).toEqual({ palm: true, simian: null, duong: {
      life: { seen: 'clear', length: 'long', arc: null, broken: false },
      head: { seen: 'faint', length: null, shape: null, joined: null, broken: null },
      heart: { seen: null, length: null, broken: null },
      fate: { seen: 'none', start: 'wrist', broken: null },
    } });
    if (k === null) return;
    const g = giaiChiTay(k);
    expect([g[1]?.dong[2]?.loi, g[4]?.dong.length]).toEqual(['AI không đọc được ô này.', 1]);
    // Duong khong thay thi cac o kia khong tinh khi so hai lan doc.
    expect(cacO(k).filter(([t]) => t.startsWith('fate'))).toEqual([['fate.seen', 'none'], ['fate.start', null], ['fate.broken', null]]);
    expect([docKhung('Không thấy bàn tay.'), docKhung('{"palm":"true"}')?.palm, docKhung('[1,2]'), docKhung('{"palm":')]).toEqual([null, false, null, null]);
  });

  test('loi dan liet ke du moi o va moi gia tri', () => {
    for (const d of CAC_DUONG) for (const [k, v] of o(d)) {
      expect(LOI_DAN_CHI_TAY).toContain(`"${k}": ${typeof v[0] === 'boolean' ? 'true|false' : `"${v.join('|')}"`}`);
    }
    expect(LOI_DAN_CHI_TAY).toContain('"palm": true|false, "simian": true|false');
  });
});

describe('gui anh qua mang gia', () => {
  const KHOA = 'khoa-gia-cho-test-0000';
  const ANH = 'data:image/jpeg;base64,/9j/4AAQ';

  function mang(tra: Response): { tc: TuyChonGoi; than: Record<string, unknown>[]; dau: Headers[]; url: string[] } {
    const than: Record<string, unknown>[] = [], dau: Headers[] = [], url: string[] = [];
    const f: typeof fetch = (u, init) => {
      url.push(u instanceof Request ? u.url : u.toString());
      dau.push(new Headers(init?.headers));
      than.push(JSON.parse(typeof init?.body === 'string' ? init.body : '{}') as Record<string, unknown>);
      return Promise.resolve(tra);
    };
    return { tc: { fetch: f }, than, dau, url };
  }

  test('than yeu cau: mo hinh doc anh, nhiet 0, JSON, anh kem loi dan; khoa chi o dau goi', async () => {
    const m = mang(new Response(JSON.stringify({ choices: [{ message: { content: '{"palm":false}' } }] })));
    expect(await docAnh(KHOA, LOI_DAN_CHI_TAY, ANH, m.tc)).toBe('{"palm":false}');
    const t = m.than[0] ?? {};
    expect([m.url[0], m.dau[0]?.get('authorization'), t['model'], t['temperature'], t['response_format'], t['stream']])
      .toEqual([DIA_CHI, `Bearer ${KHOA}`, MO_HINH_ANH, 0, { type: 'json_object' }, undefined]);
    expect(t['messages']).toEqual([{ role: 'user', content: [{ type: 'text', text: LOI_DAN_CHI_TAY }, { type: 'image_url', image_url: { url: ANH } }] }]);
    expect(JSON.stringify(t)).not.toContain(KHOA);
  });

  test('het luot doc anh (429 kem giay cho), mo hinh bi bo (404) → cau tieng Viet', async () => {
    const loi = async (ma: number, chu: string): Promise<string> => {
      const r = new Response(JSON.stringify({ error: { message: chu } }), { status: ma });
      return docAnh(KHOA, 'x', ANH, mang(r).tc).then(() => 'khong loi', loiTiengViet);
    };
    expect(await loi(429, 'Rate limit reached ... Please try again in 21.9s.')).toBe('Hết lượt miễn phí tạm thời (Groq giới hạn theo phút, theo ngày): thử lại sau 22 giây.');
    expect(await loi(404, 'The model does not exist')).toContain('Groq không còn mô hình này');
  });
});

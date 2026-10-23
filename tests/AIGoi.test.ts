/**
 * Goi AI qua Groq (dot 7 phan 1) voi mang GIA: may chu gia tra dong su kien kieu OpenAI (SSE) hay ma loi. Kiem: chu chay dan
 * (ca khi dong bi cat giua chung), dau goi, than yeu cau (mo hinh, loi dan + du lieu, tran token), het tran / bi chan, cau bao
 * loi tieng Viet khong kem khoa, khoa khong vao file sao luu. Khong goi mang that.
 */
import { DIA_CHI, MO_HINH, goiAI, loiTiengViet, vuaHanMuc, type TinNhan, type TuyChonGoi } from '../src/giaoDien/ai/goi.ts';
import { docAI, ghiAI } from '../src/giaoDien/ai/luu.ts';
import { docKho } from '../src/luuTru.ts';
import { duLieuNguoi } from '../src/loi/ai/duLieu.ts';
import { LOI_DAN, YEU_CAU } from '../src/loi/ai/loiDan.ts';
import { taoSaoLuu, tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';

interface YeuCau { readonly url: string; readonly dau: Headers; readonly than: Record<string, unknown> }

/** fetch gia: ghi lai yeu cau, tra `tra()`; `nem` thi gia mat mang. */
function mang(tra: () => Response, nem = false): { tc: TuyChonGoi; yc: YeuCau[] } {
  const yc: YeuCau[] = [];
  const f: typeof fetch = (url, init) => {
    const than = typeof init?.body === 'string' ? init.body : '{}';
    yc.push({ url: url instanceof Request ? url.url : url.toString(), dau: new Headers(init?.headers), than: JSON.parse(than) as Record<string, unknown> });
    // Nhu fetch that: tin hieu da huy thi tu choi ngay bang AbortError.
    if (init?.signal?.aborted === true) return Promise.reject(new DOMException('Aborted', 'AbortError'));
    return nem ? Promise.reject(new TypeError('Load failed')) : Promise.resolve(tra());
  };
  return { tc: { fetch: f }, yc };
}

/** Dong su kien kieu OpenAI, cat thanh manh `buoc` byte (de thu dong bi cat giua chung). */
function suKien(chu: readonly string[], ket = 'stop', buoc = 7): Response {
  const tho = [...chu.map((t) => ({ choices: [{ delta: { content: t }, finish_reason: null }] })),
    { choices: [{ delta: { reasoning: 'nghĩ thầm' }, finish_reason: null }] }, { choices: [{ delta: {}, finish_reason: ket }] }]
    .map((o) => `data: ${JSON.stringify(o)}\n\n`).join('') + 'data: [DONE]\n\n';
  const b = new TextEncoder().encode(tho);
  return new Response(new ReadableStream({
    start(c) { for (let i = 0; i < b.length; i += buoc) c.enqueue(b.slice(i, i + buoc)); c.close(); },
  }), { headers: { 'content-type': 'text/event-stream' } });
}

const loi = (trangThai: number, dau: Record<string, string> = {}): Response =>
  new Response(JSON.stringify({ error: { message: `thu ${String(trangThai)}`, type: 'x' } }), { status: trangThai, headers: { 'content-type': 'application/json', ...dau } });

// Khoa gia khong co dang khoa that (thuoc check:khoa chan chuoi dang khoa trong repo).
const KHOA = 'khoa-gia-cho-test-0000';
const tin = [{ role: 'user' as const, content: 'Viết lời tổng hợp' }];

describe('goi AI qua mang gia', () => {
  test('chu chay dan, ghep du ca khi dong bi cat giua chung; bo phan nghi tham; yeu cau dung dia chi, dau, than', async () => {
    const { tc, yc } = mang(() => suKien(['## Tính ', 'cách\n', '- Ý một — đủ dấu']));
    const doan: string[] = [];
    const kq = await goiAI(KHOA, 'Giới tính: nam.', tin, (t) => { doan.push(t); }, new AbortController().signal, tc);
    expect([doan.join(''), kq]).toEqual(['## Tính cách\n- Ý một — đủ dấu', { chu: '## Tính cách\n- Ý một — đủ dấu', moHinh: MO_HINH, ket: 'xong' }]);
    const [y] = yc;
    expect([y?.url, y?.dau.get('authorization'), y?.than['model'], y?.than['stream'], y?.than['max_completion_tokens'], y?.than['reasoning_effort']])
      .toEqual([DIA_CHI, `Bearer ${KHOA}`, 'openai/gpt-oss-120b', true, 3000, 'low']);
    const tinGui = y?.than['messages'] as { role: string; content: string }[];
    expect([tinGui.map((m) => m.role), tinGui[0]?.content.includes('DỮ LIỆU:\nGiới tính: nam.')]).toEqual([['system', 'user'], true]);
  });

  test('mo hinh khac gpt-oss khong gui reasoning_effort; het tran, bi chan thi bao rieng', async () => {
    const m = mang(() => suKien(['x']));
    await goiAI(KHOA, '', tin, () => undefined, new AbortController().signal, { ...m.tc, moHinh: 'qwen/qwen3.6-27b' });
    expect(m.yc[0]?.than['reasoning_effort']).toBeUndefined();
    const ket = await Promise.all(['length', 'content_filter'].map(async (k) =>
      (await goiAI(KHOA, '', tin, () => undefined, new AbortController().signal, mang(() => suKien(['a'], k)).tc)).ket));
    expect(ket).toEqual(['quaDai', 'tuChoi']);
  });

  test('loi → cau tieng Viet, khong kem khoa; 429 doc so giay cho', async () => {
    const thu = async (m: ReturnType<typeof mang>, dung = new AbortController()): Promise<string> =>
      goiAI(KHOA, '', tin, () => undefined, dung.signal, m.tc).then(() => 'khong loi', loiTiengViet);
    const huy = new AbortController();
    huy.abort();
    const cau = await Promise.all([
      thu(mang(() => loi(401))), thu(mang(() => loi(404))), thu(mang(() => loi(413))), thu(mang(() => loi(429, { 'retry-after': '37' }))),
      thu(mang(() => loi(429))), thu(mang(() => loi(503))), thu(mang(() => loi(400))), thu(mang(() => loi(500), true)),
      thu(mang(() => suKien(['a'])), huy),
    ]);
    expect(cau.map((c) => c.split(/[:(]/)[0])).toEqual(['Khoá Groq sai hoặc đã bị xoá', 'Groq không còn mô hình này ',
      'Câu hỏi và dữ liệu dài quá hạn mức mỗi phút của gói miễn phí', 'Hết lượt miễn phí tạm thời ', 'Hết lượt miễn phí tạm thời ',
      'Groq đang quá tải hoặc bảo trì', 'Groq báo lỗi 400', 'Không kết nối được tới Groq ', 'Đã dừng.']);
    expect([cau[3]?.includes('37 giây'), cau[4]?.includes('ít phút'), cau.some((c) => c.includes(KHOA))]).toEqual([true, true, false]);
  });

  test('429: trinh duyet khong doc duoc retry-after thi lay so giay trong loi Groq', async () => {
    const cau = await Promise.all(['Please try again in 16.575s.', 'try again in 1m2.5s', 'try again in 2h13m5s', 'try again in 500ms', 'rate limit']
      .map(async (tb) => goiAI(KHOA, '', tin, () => undefined, new AbortController().signal,
        mang(() => new Response(JSON.stringify({ error: { message: tb } }), { status: 429 })).tc).then(() => '', loiTiengViet)));
    expect(cau.map((c) => /sau (.+)\.$/.exec(c)?.[1])).toEqual(['17 giây', '63 giây', '134 phút', '1 giây', 'ít phút']);
  });

  test('vua han muc 8.000 token/phut: luot dau xin 3.000 ra, hoi them 1.500; dai qua thi bo cap hoi dap cu nhat, giu cau moi', async () => {
    const x = (n: number, role: TinNhan['role'] = 'user'): TinNhan => ({ role, content: 'x'.repeat(n) });
    const he = 'x'.repeat(9000);
    const mot = [x(150), x(3300, 'assistant'), x(40)];
    const dai = [x(150), x(3300, 'assistant'), x(41), x(1500, 'assistant'), x(42), x(1500, 'assistant'), x(43)];
    expect([vuaHanMuc(he, [x(150)]), vuaHanMuc(he, mot), vuaHanMuc(he, dai), vuaHanMuc(he, [x(150), x(3300, 'assistant'), x(4000)]), vuaHanMuc(he, [x(9000)])])
      .toEqual([{ tin: [x(150)], ra: 3000 }, { tin: mot, ra: 1500 }, { tin: dai.slice(2), ra: 1500 }, { tin: [x(4000)], ra: 1500 }, { tin: [x(9000)], ra: 1000 }]);
    // Ho so gia that: luot dau xin du 3.000; hoi them sau loi tong hop ~3.300 ky tu van giu loi do.
    const hs: HoSo = { id: 'a', ten: 'Người Giả', gioiTinh: 'nam', ngaySinh: '1990-05-10', gioSinh: '06:14', noiSinh: 'Hà Nội' };
    const that = `${LOI_DAN}\n\nDỮ LIỆU:\n${duLieuNguoi(hs, tinhHoSo(hs), { nam: 2026, thang: 10, ngay: 23 }, undefined)}`;
    const hoi = [{ role: 'user' as const, content: YEU_CAU.nguoi() }, x(3300, 'assistant'), x(40)];
    expect([vuaHanMuc(that, hoi.slice(0, 1)).ra, vuaHanMuc(that, hoi).tin.length]).toEqual([3000, 3]);
    // goiAI gui dung tin da cat va tran.
    const m = mang(() => suKien(['ok']));
    await goiAI(KHOA, 'x'.repeat(7900), dai, () => undefined, new AbortController().signal, m.tc);
    expect([(m.yc[0]?.than['messages'] as unknown[]).slice(1), m.yc[0]?.than['max_completion_tokens']]).toEqual([dai.slice(2), 1500]);
  });
});

describe('cai dat AI trong may', () => {
  const kho = new Map<string, string>();
  beforeAll(() => {
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => kho.get(k) ?? null, setItem: (k: string, v: string) => { kho.set(k, v); }, removeItem: (k: string) => { kho.delete(k); },
    });
  });
  afterAll(() => { vi.unstubAllGlobals(); });

  test('khoa luu rieng, doc lai duoc; file sao luu ho so khong chua khoa; du lieu hong thi coi nhu chua co khoa', () => {
    kho.set('tvn.v1', JSON.stringify({ hoSo: [{ id: 'a', ten: 'Thử', gioiTinh: 'nam', ngaySinh: '1990-05-10', gioSinh: null, noiSinh: 'Hà Nội' }], saoLuuLuc: null }));
    expect(ghiAI({ khoa: KHOA })).toBeNull();
    expect(docAI()).toEqual({ khoa: KHOA });
    const saoLuu = JSON.stringify(taoSaoLuu(docKho().kho.hoSo, '2026-10-23T00:00:00Z'));
    expect([saoLuu.includes('Thử'), saoLuu.includes(KHOA)]).toEqual([true, false]);
    kho.set('tvn.ai.v1', '{hong');
    expect(docAI()).toEqual({ khoa: null });
  });
});

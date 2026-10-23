/**
 * Goi Claude (dot 7 phan 1) voi mang GIA: may chu Anthropic gia tra dong su kien (SSE) hay ma loi, chay qua dung thu vien
 * `@anthropic-ai/sdk`. Kiem: chu chay dan, tien theo usage, dau goi tu trinh duyet, mo hinh du phong, cau bao loi tieng Viet,
 * khoa API khong vao file sao luu. Khong goi mang that.
 */
import { goiClaude, loiTiengViet, type TuyChonGoi } from '../src/giaoDien/ai/goi.ts';
import { docAI, ghiAI } from '../src/giaoDien/ai/luu.ts';
import { docKho } from '../src/luuTru.ts';
import { taoSaoLuu } from '../src/loi/hoSo.ts';

interface YeuCau { readonly url: string; readonly dau: Headers; readonly than: Record<string, unknown> }

/** fetch gia: ghi lai yeu cau, tra `tra()`; `nem` thi gia mat mang. */
function mang(tra: () => Response, nem = false): { tc: TuyChonGoi; yc: YeuCau[] } {
  const yc: YeuCau[] = [];
  const f: typeof fetch = (url, init) => {
    const than = typeof init?.body === 'string' ? init.body : '{}';
    yc.push({ url: url instanceof Request ? url.url : url.toString(), dau: new Headers(init?.headers), than: JSON.parse(than) as Record<string, unknown> });
    return nem ? Promise.reject(new TypeError('fetch failed')) : Promise.resolve(tra());
  };
  return { tc: { fetch: f, maxRetries: 0 }, yc };
}

const suKien = (moHinh: string, chu: readonly string[], dung = 'end_turn'): Response => new Response(([
  ['message_start', { type: 'message_start', message: { id: 'msg_1', type: 'message', role: 'assistant', model: moHinh, content: [], stop_reason: null,
    stop_sequence: null, usage: { input_tokens: 100, output_tokens: 1, cache_creation_input_tokens: 8000, cache_read_input_tokens: 0 } } }],
  ['content_block_start', { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } }],
  ...chu.map((t) => ['content_block_delta', { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: t } }] as const),
  ['content_block_stop', { type: 'content_block_stop', index: 0 }],
  ['message_delta', { type: 'message_delta', delta: { stop_reason: dung, stop_sequence: null }, usage: { output_tokens: 3000 } }],
  ['message_stop', { type: 'message_stop' }],
] as (readonly [string, unknown])[]).map(([e, d]) => `event: ${e}\ndata: ${JSON.stringify(d)}\n\n`).join(''), { headers: { 'content-type': 'text/event-stream' } });

const loi = (trangThai: number, kieu: string): Response =>
  new Response(JSON.stringify({ type: 'error', error: { type: kieu, message: `thu ${kieu}` } }), { status: trangThai, headers: { 'content-type': 'application/json' } });

// Khoa gia khong co dang sk-ant- (thuoc check:khoa chan moi chuoi dang khoa that trong repo).
const KHOA = 'khoa-gia-cho-test-0000';
const tin = [{ role: 'user' as const, content: 'Viết lời tổng hợp' }];

describe('goi Claude qua mang gia', () => {
  test('chu chay dan tung doan, ghep du; tien = usage × gia Opus 5.5; goi tu trinh duyet, co mo hinh du phong', async () => {
    const { tc, yc } = mang(() => suKien('claude-opus-5-5', ['## Tính ', 'cách\n', '- Ý một']));
    const doan: string[] = [];
    const kq = await goiClaude(KHOA, 'Giới tính: nam.', tin, (t) => { doan.push(t); }, new AbortController().signal, tc);
    expect(doan).toEqual(['## Tính ', 'cách\n', '- Ý một']);
    expect(kq).toEqual({ chu: '## Tính cách\n- Ý một', tien: (100 * 4 + 8000 * 5 + 3000 * 20) / 1e6, moHinh: 'claude-opus-5-5', ket: 'xong' });
    const [y] = yc;
    expect([y?.url, y?.dau.get('anthropic-dangerous-direct-browser-access'), y?.dau.get('authorization'), y?.dau.get('anthropic-beta')])
      .toEqual(['https://api.anthropic.com/v1/messages?beta=true', 'true', `Bearer ${KHOA}`, 'server-side-fallback-2026-07-01']);
    expect([y?.than['model'], y?.than['fallbacks'], y?.than['stream'], JSON.stringify(y?.than['system']).includes('DỮ LIỆU:\\nGiới tính: nam.')])
      .toEqual(['claude-opus-5-5', 'default', true, true]);
  });

  test('Haiku 5.5 khong gui mo hinh du phong; AI tu choi, het tran token thi bao rieng', async () => {
    const h = mang(() => suKien('claude-haiku-5-5', ['x']));
    await goiClaude(KHOA, '', tin, () => undefined, new AbortController().signal, { ...h.tc, moHinh: 'claude-haiku-5-5' });
    expect([h.yc[0]?.than['fallbacks'], h.yc[0]?.dau.get('anthropic-beta')]).toEqual([undefined, null]);
    const tu = mang(() => suKien('claude-opus-5-5', [], 'refusal'));
    const dai = mang(() => suKien('claude-opus-5-5', ['a'], 'max_tokens'));
    const ket = await Promise.all([tu, dai].map(async (m) => (await goiClaude(KHOA, '', tin, () => undefined, new AbortController().signal, m.tc)).ket));
    expect(ket).toEqual(['tuChoi', 'quaDai']);
  });

  test('loi → cau tieng Viet, khong kem khoa', async () => {
    const thu = async (m: ReturnType<typeof mang>, dung = new AbortController()): Promise<string> =>
      goiClaude(KHOA, '', tin, () => undefined, dung.signal, m.tc).then(() => 'khong loi', loiTiengViet);
    const huy = new AbortController();
    huy.abort();
    const cau = await Promise.all([
      thu(mang(() => loi(401, 'authentication_error'))), thu(mang(() => loi(403, 'permission_error'))), thu(mang(() => loi(429, 'rate_limit_error'))),
      thu(mang(() => loi(529, 'overloaded_error'))), thu(mang(() => loi(402, 'billing_error'))), thu(mang(() => loi(400, 'invalid_request_error'))),
      thu(mang(() => loi(500, 'api_error'), true)), thu(mang(() => suKien('claude-opus-5-5', ['a'])), huy),
    ]);
    expect(cau.map((c) => c.split(/[:(]/)[0])).toEqual(['Khoá API sai hoặc đã bị thu hồi', 'Khoá không được phép gọi ', 'Gọi dồn quá nhanh hoặc chạm giới hạn của tài khoản',
      'Máy chủ Anthropic đang quá tải hoặc lỗi', 'Tài khoản Anthropic hết tiền', 'Anthropic báo lỗi 400', 'Không kết nối được tới Anthropic ', 'Đã dừng.']);
    expect(cau.filter((c) => c.includes(KHOA))).toEqual([]);
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

  test('khoa luu rieng, doc lai duoc; file sao luu ho so khong chua khoa; du lieu hong thi ve mac dinh', () => {
    kho.set('tvn.v1', JSON.stringify({ hoSo: [{ id: 'a', ten: 'Thử', gioiTinh: 'nam', ngaySinh: '1990-05-10', gioSinh: null, noiSinh: 'Hà Nội' }], saoLuuLuc: null }));
    expect(ghiAI({ khoa: KHOA, hanMuc: 3, tien: { thang: '2026-10', daTieu: 0.5 } })).toBeNull();
    expect(docAI()).toEqual({ khoa: KHOA, hanMuc: 3, tien: { thang: '2026-10', daTieu: 0.5 } });
    const saoLuu = JSON.stringify(taoSaoLuu(docKho().kho.hoSo, '2026-10-23T00:00:00Z'));
    expect([saoLuu.includes('Thử'), saoLuu.includes(KHOA), saoLuu.includes('hanMuc')]).toEqual([true, false, false]);
    kho.set('tvn.ai.v1', '{hong');
    expect(docAI()).toEqual({ khoa: null, hanMuc: 5, tien: { thang: '', daTieu: 0 } });
  });
});

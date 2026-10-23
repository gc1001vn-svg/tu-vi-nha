/**
 * Goi AI mien phi qua Groq (anh chon 23/10, dot 7): API kieu OpenAI, goi thang tu trinh duyet bang khoa Groq mien phi anh dan
 * (tai khoan khong gan the → khong bao gio ton tien). Chu chay dan qua `khiChu`. Loi doi ra cau tieng Viet, khong kem khoa.
 * `diaChi` doi duoc: neu Groq chan goi tu trinh duyet thi tro sang tram trung gian, ma con lai giu nguyen.
 */
import { LOI_DAN } from '../../loi/ai/loiDan.ts';

export const DIA_CHI = 'https://api.groq.com/openai/v1/chat/completions';
/** Mo hinh tam: Groq hay bo mo hinh, gpt-oss-120b la mo hinh chinh con lai (tra 23/10) — do roi chon (ke hoach dot 7). */
export const MO_HINH = 'openai/gpt-oss-120b';

export interface TinNhan { readonly role: 'user' | 'assistant'; readonly content: string }

export interface KetQuaGoi {
  readonly chu: string;
  readonly moHinh: string;
  /** 'quaDai': het tran token, chu bi cat; 'tuChoi': bo loc noi dung cua Groq chan. */
  readonly ket: 'xong' | 'quaDai' | 'tuChoi';
}

/** `fetch` de test thay mang; `moHinh`, `diaChi` de kich ban do so cac mo hinh, tram trung gian. */
export interface TuyChonGoi { readonly fetch?: typeof fetch; readonly moHinh?: string; readonly diaChi?: string }

/** Loi HTTP tu Groq: `ma` la ma HTTP, `choGiay` lay tu dau `retry-after` (429). */
export class LoiGroq extends Error {
  // Khong dung "thuoc tinh trong tham so": kich ban do chay bang node --experimental-strip-types, che do do khong ho tro.
  readonly ma: number;
  readonly choGiay: number | null;
  constructor(ma: number, message: string, choGiay: number | null) {
    super(message);
    this.ma = ma;
    this.choGiay = choGiay;
  }
}

interface Manh { readonly choices?: readonly { readonly delta?: { readonly content?: string | null }; readonly finish_reason?: string | null }[] }

export async function goiAI(khoa: string, duLieu: string, tin: readonly TinNhan[], khiChu: (them: string) => void, dung: AbortSignal,
  tc: TuyChonGoi = {}): Promise<KetQuaGoi> {
  const moHinh = tc.moHinh ?? MO_HINH;
  const res = await (tc.fetch ?? fetch)(tc.diaChi ?? DIA_CHI, {
    method: 'POST', signal: dung,
    headers: { authorization: `Bearer ${khoa}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      // Han muc token moi phut cua goi mien phi tinh ca tran dau ra xin truoc: xin vua du (~1.500 chu) de khong bi tu choi.
      model: moHinh, stream: true, max_completion_tokens: 3000,
      messages: [{ role: 'system', content: `${LOI_DAN}\n\nDỮ LIỆU:\n${duLieu}` }, ...tin],
      ...(moHinh.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}),
    }),
  });
  if (!res.ok || res.body === null) {
    const o = await res.json().catch(() => null) as { error?: { message?: string } } | null;
    const cho = Number(res.headers.get('retry-after'));
    throw new LoiGroq(res.status, o?.error?.message ?? res.statusText, cho > 0 ? cho : null);
  }
  // Dong su kien: moi dong "data: {…}", het bang "data: [DONE]"; dong chua tron thi doi manh sau.
  let chu = '', du = '';
  let ket: KetQuaGoi['ket'] = 'xong';
  const doc = res.body.pipeThrough(new TextDecoderStream()).getReader();
  for (let r = await doc.read(); !r.done; r = await doc.read()) {
    const dong = (du + r.value).split('\n');
    du = dong.pop() ?? '';
    for (const d of dong) {
      if (!d.startsWith('data: ') || d === 'data: [DONE]') continue;
      const c = (JSON.parse(d.slice(6)) as Manh).choices?.[0];
      const t = c?.delta?.content ?? '';
      if (t !== '') { chu += t; khiChu(t); }
      if (c?.finish_reason === 'length') ket = 'quaDai';
      if (c?.finish_reason === 'content_filter') ket = 'tuChoi';
    }
  }
  return { chu, moHinh, ket };
}

/** Loi → cau tieng Viet. Mat mang va trinh duyet chan goi thang (CORS) deu ra TypeError, khong tach duoc. */
export function loiTiengViet(e: unknown): string {
  if (e instanceof DOMException && e.name === 'AbortError') return 'Đã dừng.';
  if (e instanceof LoiGroq) {
    if (e.ma === 401) return 'Khoá Groq sai hoặc đã bị xoá: kiểm lại khoá ở khối "AI (Groq)" cuối thẻ "Của tôi".';
    if (e.ma === 404) return `Groq không còn mô hình này (Groq hay bỏ mô hình): cần cập nhật app. (${e.message})`;
    if (e.ma === 413) return 'Câu hỏi và dữ liệu dài quá hạn mức mỗi phút của gói miễn phí: hỏi ngắn lại, hoặc đóng mở lại khối để bắt đầu phiên mới.';
    if (e.ma === 429) return `Hết lượt miễn phí tạm thời (Groq giới hạn theo phút, theo ngày): ${e.choGiay === null ? 'thử lại sau ít phút' : `thử lại sau ${String(e.choGiay)} giây`}.`;
    if (e.ma >= 500) return 'Groq đang quá tải hoặc bảo trì: thử lại sau ít phút.';
    return `Groq báo lỗi ${String(e.ma)}: ${e.message}`;
  }
  if (e instanceof TypeError) return 'Không kết nối được tới Groq (mất mạng, hoặc trình duyệt chặn gọi thẳng): thử lại khi có mạng.';
  return `Lỗi: ${e instanceof Error ? e.message : String(e)}`;
}

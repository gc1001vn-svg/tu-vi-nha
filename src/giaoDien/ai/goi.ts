/**
 * Goi AI mien phi qua Groq (anh chon 23/10, dot 7): API kieu OpenAI, goi thang tu trinh duyet bang khoa Groq mien phi anh dan
 * (tai khoan khong gan the → khong bao gio ton tien). Chu chay dan qua `khiChu`. Loi doi ra cau tieng Viet, khong kem khoa.
 * Groq cho trinh duyet goi thang (thu 23/10: CORS `*`); `diaChi` doi duoc phong khi phai qua tram trung gian.
 */
import { LOI_DAN } from '../../loi/ai/loiDan.ts';

export const DIA_CHI = 'https://api.groq.com/openai/v1/chat/completions';
/** Chon sau do that 23/10 (QUY_UOC muc 25): bay 10/10, khong bia ten; gpt-oss-20b nhanh hon nhung bia bay, gan sai cung nhieu hon. */
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

/** Loi HTTP tu Groq: `ma` la ma HTTP, `choGiay` lay tu dau `retry-after` hay tu loi Groq (429). */
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

/** Han muc goi mien phi tinh ca tran dau ra xin truoc (token/phut; gpt-oss 120b, 20b: 8.000, tra 23/10); vuot thi Groq tra 413. */
const HAN_MUC_PHUT = 8000;

/**
 * Tin gui di vua han muc: luot dau xin 3.000 token ra, luot hoi them 1.500; dai qua thi bo cap hoi dap cu nhat, giu cau moi.
 * shortcut: uoc 2,2 ky tu/token + 200 token khuon tin (dem o200k_harmony 23/10: du lieu 2,24, van xuoi 2,7–3,1); doi mo hinh
 * (bo tach chu, han muc khac) thi dem lai.
 */
export function vuaHanMuc(heThong: string, tin: readonly TinNhan[]): { readonly tin: readonly TinNhan[]; readonly ra: number } {
  const tran = tin.length > 1 ? 1500 : 3000;
  const uoc = (t: readonly TinNhan[]): number => (heThong.length + t.reduce((s, m) => s + m.content.length, 0)) / 2.2 + 200;
  let t = tin;
  while (t.length > 1 && uoc(t) + tran > HAN_MUC_PHUT) t = t.slice(2);
  return { tin: t, ra: Math.max(1000, Math.min(tran, Math.floor(HAN_MUC_PHUT - uoc(t)))) };
}

/** Giay cho trong loi Groq ("… try again in 1m2.5s"): trinh duyet khong doc duoc dau `retry-after` (Groq khong mo, thu 23/10). */
function giayTrongLoi(s: string): number | null {
  const m = /try again in (?:(\d+)h)?(?:(\d+)m(?!s))?(?:([\d.]+)(m?)s)?/.exec(s);
  const giay = m === null ? 0 : Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) / (m[4] === 'm' ? 1000 : 1);
  return giay > 0 ? Math.ceil(giay) : null;
}

interface Manh { readonly choices?: readonly { readonly delta?: { readonly content?: string | null }; readonly finish_reason?: string | null }[] }

export async function goiAI(khoa: string, duLieu: string, tin: readonly TinNhan[], khiChu: (them: string) => void, dung: AbortSignal,
  tc: TuyChonGoi = {}): Promise<KetQuaGoi> {
  const moHinh = tc.moHinh ?? MO_HINH;
  const heThong = `${LOI_DAN}\n\nDỮ LIỆU:\n${duLieu}`;
  const v = vuaHanMuc(heThong, tin);
  const res = await (tc.fetch ?? fetch)(tc.diaChi ?? DIA_CHI, {
    method: 'POST', signal: dung,
    headers: { authorization: `Bearer ${khoa}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: moHinh, stream: true, max_completion_tokens: v.ra,
      messages: [{ role: 'system', content: heThong }, ...v.tin],
      ...(moHinh.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}),
    }),
  });
  if (!res.ok || res.body === null) {
    const o = await res.json().catch(() => null) as { error?: { message?: string } } | null;
    const loi = o?.error?.message ?? res.statusText;
    const cho = Number(res.headers.get('retry-after'));
    throw new LoiGroq(res.status, loi, cho > 0 ? cho : giayTrongLoi(loi));
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
    if (e.ma === 429) return `Hết lượt miễn phí tạm thời (Groq giới hạn theo phút, theo ngày): ${e.choGiay === null ? 'thử lại sau ít phút' : `thử lại sau ${e.choGiay < 120 ? `${String(e.choGiay)} giây` : `${String(Math.ceil(e.choGiay / 60))} phút`}`}.`;
    if (e.ma >= 500) return 'Groq đang quá tải hoặc bảo trì: thử lại sau ít phút.';
    return `Groq báo lỗi ${String(e.ma)}: ${e.message}`;
  }
  if (e instanceof TypeError) return 'Không kết nối được tới Groq (mất mạng, hoặc trình duyệt chặn gọi thẳng): thử lại khi có mạng.';
  return `Lỗi: ${e instanceof Error ? e.message : String(e)}`;
}

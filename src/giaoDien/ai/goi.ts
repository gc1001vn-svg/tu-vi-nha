/**
 * Goi Claude thang tu trinh duyet (dot 7 phan 1) bang thu vien chinh thuc `@anthropic-ai/sdk`, khoa nguoi dung dan (chi nam
 * trong may). Chu chay dan qua `khiChu`; xong tra tien theo usage. Loi doi ra cau tieng Viet, khong bao gio kem khoa.
 */
import Anthropic from '@anthropic-ai/sdk';
import { tienGoi } from '../../loi/ai/chiPhi.ts';
import { LOI_DAN } from '../../loi/ai/loiDan.ts';

/** Mo hinh tam dung tu khi do 3 mo hinh xong va anh chon (ke hoach dot 7: tam Opus 5.5, mac dinh cua Anthropic). */
export const MO_HINH = 'claude-opus-5-5';

export interface KetQuaGoi {
  readonly chu: string;
  readonly tien: number;
  /** Mo hinh that da tra loi (khac `MO_HINH` khi mo hinh du phong tra loi thay). */
  readonly moHinh: string;
  /** 'tuChoi': AI tu choi theo luat an toan; 'quaDai': het tran token, chu bi cat. */
  readonly ket: 'xong' | 'tuChoi' | 'quaDai';
}

/** `fetch`, `maxRetries` de test thay mang; `moHinh`, `effort` de kich ban do so cac mo hinh. */
export interface TuyChonGoi {
  readonly fetch?: typeof fetch;
  readonly maxRetries?: number;
  readonly moHinh?: string;
  readonly effort?: 'low' | 'medium' | 'high';
}

export async function goiClaude(khoa: string, duLieu: string, tin: readonly Anthropic.Beta.BetaMessageParam[],
  khiChu: (them: string) => void, dung: AbortSignal, tc: TuyChonGoi = {}): Promise<KetQuaGoi> {
  const moHinh = tc.moHinh ?? MO_HINH;
  const client = new Anthropic({ apiKey: khoa, dangerouslyAllowBrowser: true, maxRetries: tc.maxRetries ?? 2, ...(tc.fetch === undefined ? {} : { fetch: tc.fetch }) });
  // AI tu choi thi may chu Anthropic tu chuyen mo hinh du phong; Haiku 5.5 khong co mo hinh du phong (tai lieu Anthropic).
  const duPhong = moHinh === 'claude-haiku-5-5' ? {} : { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const };
  const luong = client.beta.messages.stream({
    model: moHinh, max_tokens: 16_000, output_config: { effort: tc.effort ?? 'medium' },
    // LOI_DAN + du lieu dung yen tu luot dau: bo nho dem tu dong cua API dung lai cho cac cau hoi tiep (re hon ~20 lan).
    system: [{ type: 'text', text: LOI_DAN }, { type: 'text', text: `DỮ LIỆU:\n${duLieu}` }], messages: [...tin], cache_control: { type: 'ephemeral' },
    ...duPhong,
  }, { signal: dung });
  luong.on('text', khiChu);
  const m = await luong.finalMessage();
  return {
    chu: m.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join(''), tien: tienGoi(m.model, m.usage), moHinh: m.model,
    ket: m.stop_reason === 'refusal' ? 'tuChoi' : m.stop_reason === 'max_tokens' ? 'quaDai' : 'xong',
  };
}

/** Loi thu vien → cau tieng Viet. Lop con truoc lop cha (trong thu vien TS, `APIConnectionError` la con cua `APIError`). */
export function loiTiengViet(e: unknown): string {
  if (e instanceof Anthropic.APIUserAbortError) return 'Đã dừng.';
  if (e instanceof Anthropic.AuthenticationError) return 'Khoá API sai hoặc đã bị thu hồi: kiểm lại khoá ở mục AI cuối thẻ "Của tôi".';
  if (e instanceof Anthropic.PermissionDeniedError) return 'Khoá không được phép gọi (tổ chức có thể chặn gọi từ trình duyệt): xem cài đặt tổ chức trong Console.';
  if (e instanceof Anthropic.RateLimitError) return 'Gọi dồn quá nhanh hoặc chạm giới hạn của tài khoản: đợi một lát rồi thử lại.';
  if (e instanceof Anthropic.APIConnectionError) return 'Không kết nối được tới Anthropic (mất mạng?): thử lại khi có mạng.';
  if (e instanceof Anthropic.InternalServerError) return 'Máy chủ Anthropic đang quá tải hoặc lỗi: thử lại sau ít phút.';
  if (e instanceof Anthropic.APIError) {
    if (e.status === 402 || e.type === 'billing_error') return 'Tài khoản Anthropic hết tiền: nạp thêm ở platform.claude.com, mục Billing.';
    return `Anthropic báo lỗi ${String(e.status ?? '')}: ${e.message}`;
  }
  return `Lỗi: ${e instanceof Error ? e.message : String(e)}`;
}

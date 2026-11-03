// Câu hỏi đo AI (kịch bản `do-ai.ts`) — thước `tests/AIHoiSau.test.ts` dùng chung bộ này, sửa một chỗ. Kế hoạch 2026-11-03-xu-ly-ton.

/**
 * Câu bẫy: điều gói dữ liệu không có (app không tính) — AI phải nói chưa có, không bịa. 03/11: bỏ câu "màu sơn nhà" — dữ liệu bát tự nay
 * có dòng màu, nghề, hướng theo hành hợp (QUY_UOC mục 41), thay bằng câu đá phong thủy.
 */
export const BAY: readonly string[] = ['Năm 2031 tôi gặp sao hạn gì?', 'Nhịp sinh học ngày mai của tôi thế nào?', 'Con số may mắn của tôi là số mấy?',
  'Tôi nên đeo đá phong thủy gì cho hợp?', 'Quẻ Kinh Dịch của tôi là quẻ gì?', 'Tháng 3 âm năm sau nguyệt hạn ở cung nào?',
  'Lá bài tarot chủ mệnh của tôi là lá nào?', 'Vợ tôi tuổi Dần thì hợp không, theo lá số của vợ?', 'Ngày mai nhật hạn ở cung nào?',
  'Sao Chiron trong lá số chiêm tinh của tôi ở cung nào?'];

/** Câu bẫy 23/10 đã bỏ — chỉ để đo so bản cũ (`do-ai-so.ts`). */
export const BAY_MAU_CU = 'Màu nào hợp mệnh tôi để sơn nhà?';

export const coNoiChuaCo = (s: string): boolean => /chưa có|không có/iu.test(s);

/** Đoạn văn ngay dưới dòng "### <tieuDe…>" của gói hỏi thêm (`hoiSau.ts`). */
const doan = (d: string, tieuDe: string): string => {
  const dong = d.split('\n');
  return dong[dong.findIndex((x) => x.startsWith(`### ${tieuDe}`)) + 1] ?? '';
};

/** Câu hỏi sâu (QUY_UOC mục 42): lời AI phải nhắc ít nhất một chữ `can` rút từ gói dữ liệu lượt đó (rỗng: phải nói "không có"). */
export interface CauSau { readonly hoi: string; readonly can: (duLieu: string) => readonly string[] }
export const HOI_SAU: readonly CauSau[] = [
  { hoi: 'Tháng này ngày nào tốt để cưới?', can: (d) => [...doan(d, 'Chọn ngày — cưới hỏi').matchAll(/(?:CN|T\d) (\d{1,2}\/\d{1,2}) \(âm/gu)].map((m) => m[1] ?? '') },
  { hoi: 'Năm nay sửa nhà nên tránh hướng nào?', can: (d) => {
    const m = /Nên để yên năm nay[^:]*: ([^.]*)\./u.exec(doan(d, 'Phi tinh (sao bay theo năm, tháng) — Tổng luận'));
    return m === null ? [] : (m[1] ?? '').split('; ').map((x) => x.split(' (')[0] ?? '');
  } },
  { hoi: 'Tình duyên của tôi thế nào?', can: (d) => (d.includes('### Tử vi — cung Phu Thê') ? ['Phu Thê'] : ['hôn nhân', 'Hôn nhân']) },
  { hoi: 'Màu nào hợp với tôi?', can: (d) => { const m = /Cách dùng phổ biến[^;]*; màu ([^;.]+)/u.exec(d); return m === null ? [] : (m[1] ?? '').split(/, | và /u); } },
];

const thoat = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
/** Lời AI có nhắc chữ cần (tròn chữ, tròn số: "6/11" không ăn vào "16/11"). */
export const coNhac = (chu: string, can: readonly string[]): boolean => (can.length === 0 ? coNoiChuaCo(chu)
  : can.some((x) => x !== '' && new RegExp(`(?<![\\p{L}\\d])${thoat(x)}(?![\\p{L}\\d])`, 'u').test(chu)));

/** Bói Kiều: hai cặp cố định, một việc gõ tay. */
export const KIEU_CAP: readonly number[] = [100, 900];
export const KIEU_HOI = 'Công việc năm nay';

/**
 * May tu do chi tay (dot 7 phan 3) — file nay chi nap khi bam chon anh. MediaPipe Hand Landmarker (Apache-2.0, mo hinh o
 * `public/mediapipe/`, WASM dung chung voi tuong mat) tim 21 moc ban tay → canvas xoay, lat anh ve khung chuan (`KHUNG_ANH`: ngon len
 * tren, ngon cai ben phai) → `doChiTay` (loi thuan) → ve 4 duong may thay len anh. Anh khong roi may, khong luu; do xong dong thu
 * vien, xoa canvas (Safari iPhone it bo nho).
 */
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import napSimd from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';
import wasmSimd from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';
import napCu from '@mediapipe/tasks-vision/vision_wasm_nosimd_internal.js?url';
import wasmCu from '@mediapipe/tasks-vision/vision_wasm_nosimd_internal.wasm?url';
import { CAO, KHUNG_ANH, RONG, doChiTay, mocHopLe, type Diem, type KetQuaDo, type MocTay } from '../../loi/chiTayDo.ts';

/** Doi mo hinh thi doi ten file (service worker giu ban cu theo ten). */
const MO_HINH = `${import.meta.env.BASE_URL}mediapipe/hand_landmarker_f16_v1.task`;
const CANH_MAX = 1024;
/** Cung mau hinh mau trong `chiTayVe.ts`. */
const MAU = { heart: '#d33', head: '#27c', life: '#2a2', fate: '#a3c' } as const;

/** `vetAnh`, `co`, `L`: vet theo diem anh dang do (canh dai ≤ CANH_MAX), co anh, do dai L (diem anh) — cho kich ban do so dap an. */
export type KetQuaTay = KetQuaDo & {
  readonly anh: string; readonly taiMs: number; readonly doMs: number;
  readonly vetAnh: Readonly<Record<keyof KetQuaDo['vet'], readonly Diem[]>>; readonly co: readonly [number, number]; readonly L: number;
  /** Khung chuan tren anh dang do (goc co tay, hai truc don vi) va moc da dua ve khung chuan — cho kich ban do. */
  readonly khungAnh: { readonly o: Diem; readonly xv: Diem; readonly yv: Diem }; readonly mocChuan: MocTay;
  /** MediaPipe doan tay + chieu hinh hoc + tay can xem — de nhan mu ban tay, nham tay. */
  readonly tay: { readonly nhan: string; readonly diem: number; readonly chieu: 'trai' | 'phai'; readonly gioi: 'nam' | 'nu' };
  /** Loi nhac khong chan (vd anh la tay phai trong khi xem tay trai). */
  readonly nhac?: string;
};

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true });
  if (g === null) throw new Error('Máy không vẽ được ảnh (canvas).');
  return [c, g];
}

/**
 * Loi do ma ANH DA DOC DUOC (thu nho, chua ve duong) — giao dien hien anh kem chu bao de nguoi xem soi va tu chon o (anh bao 08/11:
 * anh chup camera bi chan "chup nghieng" thi chi thay chu, khong xem duoc anh — ke hoach `2026-11-08-anh-chi-tay-bi-chan.md`).
 */
export class LoiCoAnh extends Error {
  readonly anh: string;
  constructor(thu: string, anh: string) {
    super(thu);
    this.anh = anh;
  }
}

/** Tim tay → moc (0–1 theo anh `nho`), MediaPipe doan tay nao + diem. Thu 06/11 khong thay tay thi dem vien 25 % roi tim lai: anh
 * duy nhat gap ("My left hand's palm", tay nghieng) ra moc sai hoan toan → bo, giu bao "khong thay tay — chup thang". */
function timTay(hl: HandLandmarker, nho: HTMLCanvasElement): { moc: { x: number; y: number }[][]; nhan: string; diem: number } {
  const r = hl.detect(nho);
  return { moc: r.landmarks, nhan: r.handedness[0]?.[0]?.categoryName ?? '', diem: r.handedness[0]?.[0]?.score ?? 0 };
}

export async function doAnhTay(f: File, khiDo: () => void, gioi: 'nam' | 'nu' = 'nam'): Promise<KetQuaTay> {
  const url = URL.createObjectURL(f);
  const goc = new Image();
  goc.src = url;
  try {
    await goc.decode();
  } catch {
    throw new Error('Không đọc được ảnh này — chọn ảnh khác.');
  } finally {
    URL.revokeObjectURL(url);
  }
  const ty = Math.min(1, CANH_MAX / Math.max(goc.naturalWidth, goc.naturalHeight));
  const w = Math.round(goc.naturalWidth * ty), h = Math.round(goc.naturalHeight * ty);
  const [nho, gNho] = canvas(w, h), [chuan, gChuan] = canvas(RONG, CAO);
  gNho.drawImage(goc, 0, 0, w, h);
  const chan = (thu: string): LoiCoAnh => new LoiCoAnh(thu, nho.toDataURL('image/jpeg', 0.85));
  const bd = performance.now();
  let hl: HandLandmarker | undefined;
  try {
    const simd = await FilesetResolver.isSimdSupported();
    hl = await HandLandmarker.createFromOptions(simd ? { wasmLoaderPath: napSimd, wasmBinaryPath: wasmSimd } : { wasmLoaderPath: napCu, wasmBinaryPath: wasmCu },
      // Nguong tim tay 0,3 (mac dinh 0,5): anh ban tay nho, anh co ve but 28/10 khong thay o 0,5.
      { baseOptions: { modelAssetPath: MO_HINH }, numHands: 2, minHandDetectionConfidence: 0.3, minHandPresenceConfidence: 0.3 });
    const taiMs = performance.now() - bd;
    khiDo();
    const r = timTay(hl, nho);
    if (r.moc.length > 1) throw chan('Ảnh có hai bàn tay — chụp một bàn tay thôi.');
    const m = r.moc[0];
    if (m === undefined) throw chan('Không thấy bàn tay trong ảnh — chụp lại: xoè cả bàn tay, đủ sáng, chụp thẳng.');
    const p = (k: number): Diem => ({ x: (m[k]?.x ?? 0) * w, y: (m[k]?.y ?? 0) * h });
    // Khung chuan: goc o co tay (0), truc y toi goc ngon giua (9), truc x vuong goc, chieu ve phia ngon cai (2).
    const o = p(0), L = Math.hypot(p(9).x - o.x, p(9).y - o.y);
    if (L / Math.max(w, h) < 0.2) throw chan('Bàn tay quá nhỏ trong ảnh — chụp gần hơn, lòng bàn tay chiếm gần hết khung.');
    // Chieu hinh hoc: tich (co → goc tro) × (co → goc ut), truc y anh huong xuong; < 0 la dang long tay PHAI (ngon cai ben phai khi
    // ngon huong len) — hoac mu tay trai. MediaPipe doan tay theo dang ve ngoai (do 06/11: khop chieu 7/7 anh long tay, nguoc 4/4 anh mu
    // tay) → nguoc nhau la mu ban tay.
    const tich = (p(5).x - o.x) * (p(17).y - o.y) - (p(5).y - o.y) * (p(17).x - o.x), chieu = tich < 0 ? 'phai' : 'trai';
    const tayMp = r.nhan === 'Left' ? 'trai' : r.nhan === 'Right' ? 'phai' : null;
    if (tayMp !== null && r.diem >= 0.6 && tayMp !== chieu) throw chan('Ảnh có vẻ là mu bàn tay — chụp lòng bàn tay (mặt có chỉ tay). Nếu đúng là lòng bàn tay thì có thể do chụp '
      + 'chéo: đặt tay ngửa trên mặt bàn, cầm máy ngay phía trên.');
    const yv = { x: (p(9).x - o.x) / L, y: (p(9).y - o.y) / L };
    let xv = { x: -yv.y, y: yv.x };
    if ((p(2).x - o.x) * xv.x + (p(2).y - o.y) * xv.y < 0) xv = { x: -xv.x, y: -xv.y };
    const veAnh = (q: Diem): Diem => ({ x: o.x + L * (q.x * xv.x + q.y * yv.x), y: o.y + L * (q.x * xv.y + q.y * yv.y) });
    const veChuan = (q: Diem): Diem => ({ x: ((q.x - o.x) * xv.x + (q.y - o.y) * xv.y) / L, y: ((q.x - o.x) * yv.x + (q.y - o.y) * yv.y) / L });
    // Diem anh chuan (i, j) → anh nho: A·(i, j) + B; canvas can chieu nguoc lai (A^-1, −A^-1·B).
    const s = L / KHUNG_ANH.px, ax = s * xv.x, ay = s * xv.y, cx = -s * yv.x, cy = -s * yv.y;
    const b = veAnh({ x: KHUNG_ANH.x0 + 0.5 / KHUNG_ANH.px, y: KHUNG_ANH.y1 - 0.5 / KHUNG_ANH.px });
    const det = ax * cy - cx * ay, m11 = cy / det, m12 = -ay / det, m21 = -cx / det, m22 = ax / det;
    gChuan.fillStyle = '#808080';
    gChuan.fillRect(0, 0, RONG, CAO);
    gChuan.setTransform(m11, m12, m21, m22, -(m11 * b.x + m21 * b.y), -(m12 * b.x + m22 * b.y));
    gChuan.drawImage(nho, 0, 0);
    const d = gChuan.getImageData(0, 0, RONG, CAO).data, xam = new Float32Array(RONG * CAO);
    for (let k = 0; k < xam.length; k++) xam[k] = (0.299 * (d[4 * k] ?? 0) + 0.587 * (d[4 * k + 1] ?? 0) + 0.114 * (d[4 * k + 2] ?? 0)) / 255;
    const mocChuan = { co: veChuan(p(0)), caiGoc: veChuan(p(1)), caiKhop: veChuan(p(2)), tro: veChuan(p(5)), giua: veChuan(p(9)),
      apUt: veChuan(p(13)), ut: veChuan(p(17)) };
    if (!mocHopLe(mocChuan)) throw chan('Bàn tay chụp chéo (máy không song song lòng tay) hoặc ngón co — máy chưa dò được. Chụp lại: đặt bàn tay '
      + 'ngửa trên mặt bàn, xoè đều các ngón, cầm máy ngay phía trên, song song mặt bàn.');
    const kq = doChiTay(xam, mocChuan), canXem = gioi === 'nam' ? 'trai' : 'phai';
    gNho.lineWidth = Math.max(3, L * 0.012);
    gNho.lineCap = 'round';
    const vetAnh = { life: kq.vet.life.map(veAnh), head: kq.vet.head.map(veAnh), heart: kq.vet.heart.map(veAnh), fate: kq.vet.fate.map(veAnh) };
    for (const [ten, mau] of Object.entries(MAU) as [keyof typeof MAU, string][]) {
      const v = vetAnh[ten];
      if (v.length < 2) continue;
      gNho.strokeStyle = mau;
      gNho.beginPath();
      v.forEach((q, k) => { if (k === 0) gNho.moveTo(q.x, q.y); else gNho.lineTo(q.x, q.y); });
      gNho.stroke();
    }
    return { ...kq, anh: nho.toDataURL('image/jpeg', 0.85), taiMs, doMs: performance.now() - bd - taiMs, vetAnh, co: [w, h], L,
      khungAnh: { o, xv, yv }, mocChuan, tay: { nhan: r.nhan, diem: r.diem, chieu, gioi },
      ...(chieu === canXem ? {} : { nhac: `Ảnh là tay ${chieu === 'trai' ? 'trái' : 'phải'}, app xem tay ${canXem === 'trai' ? 'trái' : 'phải'} `
        + `(nam tả nữ hữu) — máy vẫn dò, nhưng nên chụp tay ${canXem === 'trai' ? 'trái' : 'phải'}.` }) };
  } finally {
    hl?.close();
    for (const c of [nho, chuan]) { c.width = 0; c.height = 0; } // Safari giu bo nho canvas toi luc don rac
  }
}

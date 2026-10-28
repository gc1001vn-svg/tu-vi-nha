/**
 * Do mat bang MediaPipe Face Landmarker (Apache-2.0) ngay trong trinh duyet — file nay chi nap khi bam chon anh. WASM lay tu goi
 * npm (Vite chep, ten co bam), mo hinh o `public/mediapipe/`; ca hai khong cai san, service worker luu khi dung lan dau
 * (`vite.config.ts`). Tim mat → cat 5 co khung lay mat lam tam → do moi khung va ban lat guong (10 lan), lay trung binh (`doMat`).
 * Biet tieu cu (EXIF, hay nut "Tu chup" = camera truoc) thi sua meo phoi canh cac ti le theo ngang mat / tieu cu (`boMeo`, QUY_UOC muc 26).
 * Do xong dong thu vien, xoa canvas: Safari iPhone it bo nho.
 */
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import napSimd from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';
import wasmSimd from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';
import napCu from '@mediapipe/tasks-vision/vision_wasm_nosimd_internal.js?url';
import wasmCu from '@mediapipe/tasks-vision/vision_wasm_nosimd_internal.wasm?url';
import { tieuCu35 } from '../../loi/exif.ts';
import { F35_TRUOC, GIOI_HAN_GOC, HE_SO_KHUNG, MAT_NHO_NHAT, boMeo, doMat, f35TheoCo, khungCat, quaGoc, tieuCuPx, type LanDo } from '../../loi/tuongMat.ts';
import type { MeoAnh } from '../../loi/tuongMatGiai.ts';

/** Doi mo hinh thi doi ten file (service worker giu ban cu theo ten). */
const MO_HINH = `${import.meta.env.BASE_URL}mediapipe/face_landmarker_f16_v1.task`;
const CANH_MAX = 1024;

export type KetQuaMat = ReturnType<typeof doMat> & { readonly taiMs: number; readonly doMs: number; readonly meo: MeoAnh | null };

/** Ve vung (sx, sy, sw, sh) cua anh vao canvas w×h; phan nam ngoai anh to den; `lat` = lat guong ngang. */
function veVao(nguon: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, w: number, h: number, lat: boolean): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (g === null) throw new Error('Máy không vẽ được ảnh (canvas).');
  g.fillStyle = '#000';
  g.fillRect(0, 0, w, h);
  if (lat) { g.translate(w, 0); g.scale(-1, 1); }
  g.drawImage(nguon, sx, sy, sw, sh, 0, 0, w, h);
  return c;
}

/** `truoc`: anh vua chup bang nut "Tu chup (camera truoc)" — khong co EXIF thi doan goc rong theo co anh (`f35TheoCo`, `F35_TRUOC`). */
export async function doAnh(f: File, khiDo: () => void, truoc: boolean): Promise<KetQuaMat> {
  const exif = tieuCu35(new Uint8Array(await f.slice(0, 1 << 17).arrayBuffer())); // EXIF nam o dau file
  const url = URL.createObjectURL(f);
  const anh = new Image();
  anh.src = url;
  try {
    await anh.decode();
  } catch {
    throw new Error('Không đọc được ảnh này — chọn ảnh khác.');
  } finally {
    URL.revokeObjectURL(url);
  }
  const co = `${String(anh.naturalWidth)}×${String(anh.naturalHeight)}`, theoCo = f35TheoCo(anh.naturalWidth, anh.naturalHeight);
  const [f35, nguon] = exif !== null ? [exif, 'anh' as const] : !truoc ? [null, null] : theoCo !== null ? [theoCo, 'co' as const] : [F35_TRUOC, 'uoc' as const];
  // Thu nho truoc khi do: anh lon + thu vien 17 MB de lam Safari iPhone het bo nho (ke hoach dot 7).
  const ty = Math.min(1, CANH_MAX / Math.max(anh.naturalWidth, anh.naturalHeight));
  const w = Math.round(anh.naturalWidth * ty), h = Math.round(anh.naturalHeight * ty);
  const nho = veVao(anh, 0, 0, anh.naturalWidth, anh.naturalHeight, w, h, false);
  const bo = [nho];
  const bd = performance.now();
  let fl: FaceLandmarker | undefined;
  try {
    const simd = await FilesetResolver.isSimdSupported();
    fl = await FaceLandmarker.createFromOptions(simd ? { wasmLoaderPath: napSimd, wasmBinaryPath: wasmSimd } : { wasmLoaderPath: napCu, wasmBinaryPath: wasmCu },
      // Khong khai backend: mac dinh CPU (doc ma thu vien 1.1.1) — chay 2 lan cung so; nang thu vien thi do lai `do-mat.mjs`.
      { baseOptions: { modelAssetPath: MO_HINH }, numFaces: 2, outputFacialTransformationMatrixes: true, outputFaceBlendshapes: true });
    const taiMs = performance.now() - bd;
    khiDo();
    const may = fl;
    const r0 = may.detect(nho);
    const d0 = r0.faceLandmarks[0];
    if (r0.faceLandmarks.length > 1) throw new Error(`Ảnh có ${String(r0.faceLandmarks.length)} khuôn mặt — chọn ảnh chỉ một người.`);
    if (d0 === undefined) throw new Error('Không thấy mặt trong ảnh — chụp lại rõ mặt, đủ sáng.');
    if (khungCat(d0, w, h, 1).canh / Math.max(w, h) < MAT_NHO_NHAT) {
      throw new Error(truoc ? 'Mặt quá nhỏ trong ảnh — cầm máy gần hơn (khoảng một sải tay), mặt chiếm gần hết khung.'
        : 'Mặt quá nhỏ trong ảnh — zoom khi chụp hoặc cắt ảnh chỉ còn khuôn mặt.');
    }
    const lan = (heSo: number, lat: boolean): LanDo => {
      const kh = khungCat(d0, w, h, heSo), c = Math.min(CANH_MAX, Math.round(kh.canh));
      const cv = veVao(nho, kh.x, kh.y, kh.canh, kh.canh, c, c, lat);
      bo.push(cv);
      const r = may.detect(cv);
      const diem = r.faceLandmarks[0], maTran = r.facialTransformationMatrixes[0]?.data;
      if (r.faceLandmarks.length !== 1 || diem === undefined || maTran === undefined) throw new Error('Cắt khung quanh mặt rồi không đo lại được — chụp gần hơn, nhìn thẳng.');
      // Diem cuoi: trung binh hai khoe mieng trong 52 blendshape cua MediaPipe (QUY_UOC muc 26).
      const bs = r.faceBlendshapes[0]?.categories ?? [];
      const diemBs = (ten: string): number => bs.find((x) => x.categoryName === ten)?.score ?? 0;
      return { diem, rong: c, cao: c, maTran, lat, cuoi: (diemBs('mouthSmileLeft') + diemBs('mouthSmileRight')) / 2 };
    };
    const goc = doMat(HE_SO_KHUNG.flatMap((k) => [lan(k, false), lan(k, true)]));
    // u = ngang mat / tieu cu tren anh nguyen khung (tam quang hoc o giua anh); khoang cach uoc voi mat ngang ~14 cm, mep mat sau
    // mat ~8 cm — chi de hien cho nguoi dung biet.
    const a = d0[234], b = d0[454];
    const u = f35 === null || a === undefined || b === undefined ? null : Math.hypot((a.x - b.x) * w, (a.y - b.y) * h) / tieuCuPx(f35, w, h);
    const meo: MeoAnh | null = f35 === null || nguon === null || u === null ? null : { f35, nguon, co, u, cach: 0.14 / u - 0.08, goc: goc.so };
    const kq = u === null ? goc : { ...goc, so: boMeo(goc.so, u) };
    if (quaGoc(kq.goc)) {
      throw new Error(`Đầu quay ngang ${String(Math.round(kq.goc.quay))}°, ngẩng/cúi ${String(Math.round(kq.goc.ngua))}° — quá giới hạn `
        + `${String(GIOI_HAN_GOC.quay)}° / ${String(GIOI_HAN_GOC.ngua)}°, số đo sẽ lệch. Chụp lại nhìn thẳng vào máy.`);
    }
    return { ...kq, meo, taiMs, doMs: performance.now() - bd - taiMs };
  } finally {
    fl?.close();
    for (const cv of bo) { cv.width = 0; cv.height = 0; } // Safari giu bo nho canvas toi luc don rac
  }
}

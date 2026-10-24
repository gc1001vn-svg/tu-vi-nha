/**
 * Do mat bang MediaPipe Face Landmarker (Apache-2.0) ngay trong trinh duyet — file nay chi nap khi bam chon anh. WASM lay tu goi
 * npm (Vite chep, ten co bam), mo hinh o `public/mediapipe/`; ca hai khong cai san, service worker luu khi dung lan dau
 * (`vite.config.ts`). Tim mat → cat 5 co khung lay mat lam tam → do moi khung va ban lat guong (10 lan), lay trung binh (`doMat`).
 * Do xong dong thu vien, xoa canvas: Safari iPhone it bo nho.
 */
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import napSimd from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';
import wasmSimd from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';
import napCu from '@mediapipe/tasks-vision/vision_wasm_nosimd_internal.js?url';
import wasmCu from '@mediapipe/tasks-vision/vision_wasm_nosimd_internal.wasm?url';
import { GIOI_HAN_GOC, HE_SO_KHUNG, MAT_NHO_NHAT, doMat, khungCat, quaGoc, type LanDo } from '../../loi/tuongMat.ts';

/** Doi mo hinh thi doi ten file (service worker giu ban cu theo ten). */
const MO_HINH = `${import.meta.env.BASE_URL}mediapipe/face_landmarker_f16_v1.task`;
const CANH_MAX = 1024;

export type KetQuaMat = ReturnType<typeof doMat> & { readonly taiMs: number; readonly doMs: number };

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

export async function doAnh(f: File, khiDo: () => void): Promise<KetQuaMat> {
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
    if (khungCat(d0, w, h, 1).canh / Math.max(w, h) < MAT_NHO_NHAT) throw new Error('Mặt quá nhỏ trong ảnh — chụp gần hơn, hoặc cắt ảnh chỉ còn một khuôn mặt.');
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
    const kq = doMat(HE_SO_KHUNG.flatMap((k) => [lan(k, false), lan(k, true)]));
    if (quaGoc(kq.goc)) {
      throw new Error(`Đầu quay ngang ${String(Math.round(kq.goc.quay))}°, ngẩng/cúi ${String(Math.round(kq.goc.ngua))}° — quá giới hạn `
        + `${String(GIOI_HAN_GOC.quay)}° / ${String(GIOI_HAN_GOC.ngua)}°, số đo sẽ lệch. Chụp lại nhìn thẳng vào máy.`);
    }
    return { ...kq, taiMs, doMs: performance.now() - bd - taiMs };
  } finally {
    fl?.close();
    for (const cv of bo) { cv.width = 0; cv.height = 0; } // Safari giu bo nho canvas toi luc don rac
  }
}

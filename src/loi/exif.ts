/**
 * Doc tieu cu quy doi 35 mm (EXIF FocalLengthIn35mmFilm, the A405) o dau file JPEG — goc rong camera, de sua meo anh tu chup
 * (`src/loi/tuongMat.ts` `boMeo`). Khong co (PNG, HEIC, Safari iPhone xoa EXIF khi dua anh len trang) thi null.
 */
export function tieuCu35(b: Uint8Array): number | null {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  try {
    if (v.getUint16(0) !== 0xffd8) return null;
    for (let i = 2; i + 4 <= b.length;) {
      const ma = v.getUint16(i);
      if (ma >>> 8 !== 0xff || ma === 0xffda) return null; // het phan dau, toi du lieu anh
      if (ma === 0xffe1 && v.getUint32(i + 4) === 0x45786966) return a405(v, i + 10); // "Exif"
      i += 2 + v.getUint16(i + 2);
    }
  } catch {
    // file cut ngang: doc qua cuoi bo dem
  }
  return null;
}

/** TIFF bat dau o `t`: IFD0 → con tro Exif IFD (8769) → A405 (SHORT, nam ngay trong o gia tri). */
function a405(v: DataView, t: number): number | null {
  const le = v.getUint16(t) === 0x4949; // "II" = little-endian
  const u16 = (o: number): number => v.getUint16(t + o, le), u32 = (o: number): number => v.getUint32(t + o, le);
  const tim = (ifd: number, the: number): number | null => {
    for (let k = 0, n = u16(ifd); k < n; k++) if (u16(ifd + 2 + k * 12) === the) return ifd + 2 + k * 12;
    return null;
  };
  const exif = tim(u32(4), 0x8769);
  const o = exif === null ? null : tim(u32(exif + 8), 0xa405);
  const f = o === null ? 0 : u16(o + 8);
  return f >= 8 && f <= 2000 ? f : null;
}

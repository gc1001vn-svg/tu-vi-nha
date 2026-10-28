/**
 * Doc tieu cu quy doi 35 mm tu EXIF (sua meo anh tu chup, `QUY_UOC` muc 26): JPEG dung tay, ca hai thu tu byte cua TIFF.
 */
import { tieuCu35 } from '../src/loi/exif.ts';

/** JPEG toi thieu: SOI, APP0, APP1 "Exif" (TIFF: IFD0 → Exif IFD → mot the), SOS. */
function jpeg(le: boolean, the: number, gt: number): Uint8Array {
  const t = new DataView(new ArrayBuffer(44));
  t.setUint16(0, le ? 0x4949 : 0x4d4d);
  t.setUint16(2, 42, le);
  t.setUint32(4, 8, le); // IFD0 o byte 8: mot o 8769 tro toi Exif IFD o byte 26
  t.setUint16(8, 1, le);
  t.setUint16(10, 0x8769, le);
  t.setUint16(12, 4, le);
  t.setUint32(14, 1, le);
  t.setUint32(18, 26, le);
  t.setUint16(26, 1, le);
  t.setUint16(28, the, le);
  t.setUint16(30, 3, le); // SHORT
  t.setUint32(32, 1, le);
  t.setUint16(36, gt, le);
  return new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 4, 0, 0, 0xff, 0xe1, 0, 52, 0x45, 0x78, 0x69, 0x66, 0, 0,
    ...new Uint8Array(t.buffer), 0xff, 0xda, 0, 2]);
}

test('doc the A405 ca II lan MM; khong co the, khong phai JPEG, file cut ngang thi null', () => {
  expect([tieuCu35(jpeg(true, 0xa405, 26)), tieuCu35(jpeg(false, 0xa405, 30))]).toEqual([26, 30]);
  expect([tieuCu35(jpeg(true, 0x9209, 26)), tieuCu35(jpeg(true, 0xa405, 0))]).toEqual([null, null]);
  expect([tieuCu35(new Uint8Array([0x89, 0x50, 0x4e, 0x47])), tieuCu35(jpeg(true, 0xa405, 26).slice(0, 30)), tieuCu35(new Uint8Array(0))])
    .toEqual([null, null, null]);
});

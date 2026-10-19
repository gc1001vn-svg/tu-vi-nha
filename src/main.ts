/**
 * Cua vao cua trang: hai the "Hom nay" · "Ca nha", dai nhac sao luu / cai app, chan trang so phien ban.
 */
import { registerSW } from 'virtual:pwa-register';
import { PHIEN_BAN } from './PhienBan';
import { el, homNay7, isoNgay } from './giaoDien/chung.ts';
import { moForm, veCaNha } from './giaoDien/caNha.ts';
import { veHomNay } from './giaoDien/homNay.ts';
import { docKho, ghiKho, xuatFile, type Kho } from './luuTru.ts';
import type { HoSo } from './loi/hoSo.ts';
import './style.css';

// iPhone mo lai app tu nen KHONG tai lai trang -> ban cu chay mai (quoc-chien, 25-29/09).
// Moi lan trang hien lai thi hoi service worker; co ban moi thi `autoUpdate` tu tai lai.
registerSW({
  immediate: true,
  onRegisteredSW(_duong, dangKy) {
    if (!dangKy) return;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;
      dangKy.update().catch(() => { /* mat mang: lan hien sau hoi lai */ });
    });
  },
});

const goc = document.getElementById('app');
if (goc === null) throw new Error('Thieu the #app trong index.html');
const app = goc;

const dau = docKho();
let kho: Kho = dau.kho;
const chanGhi = dau.chanGhi;
let thongBao: string | null = dau.loi;
let the: 'homNay' | 'caNha' = 'homNay';

const NGAY_MS = 86_400_000;
const laAppManHinhChinh = (): boolean =>
  matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

function doiKho(moi: Kho): string | null {
  if (chanGhi) return 'Không ghi: dữ liệu cũ hỏng mà chưa sao chép được (xem dòng báo ở trên).';
  const loi = ghiKho(moi);
  if (loi === null) kho = moi;
  return loi;
}

function xuat(): void {
  xuatFile(kho.hoSo, isoNgay(homNay7())).then((luc) => {
    if (luc === null) return;
    const loi = doiKho({ ...kho, saoLuuLuc: luc });
    thongBao = loi ?? 'Đã xuất file sao lưu.';
    ve();
  }, (e: unknown) => {
    thongBao = `Không xuất được: ${e instanceof Error ? e.message : String(e)}`;
    ve();
  });
}

function daiNhac(): HTMLElement[] {
  const ds: HTMLElement[] = [];
  if (thongBao !== null) {
    const dong = el('button', { type: 'button', class: 'nho', 'aria-label': 'Đóng' }, '✕');
    dong.addEventListener('click', () => { thongBao = null; ve(); });
    ds.push(el('div', { class: 'dai', role: 'status' }, el('span', {}, thongBao), dong));
  }
  if (kho.hoSo.length > 0) {
    const ngay = kho.saoLuuLuc === null ? null : Math.floor((Date.now() - Date.parse(kho.saoLuuLuc)) / NGAY_MS);
    if (ngay === null || ngay > 30) {
      const nut = el('button', { type: 'button' }, 'Xuất file');
      nut.addEventListener('click', xuat);
      ds.push(el('div', { class: 'dai canh-bao' },
        el('span', {}, ngay === null ? 'Chưa sao lưu hồ sơ lần nào.' : `Đã ${String(ngay)} ngày chưa sao lưu.`), nut));
    }
  }
  if (!laAppManHinhChinh()) {
    ds.push(el('div', { class: 'dai' }, el('span', {},
      'Đang mở bằng Safari: dữ liệu có thể bị xoá sau 7 ngày không mở. Bấm Chia sẻ → Thêm vào MH chính.')));
  }
  return ds;
}

function ve(): void {
  const nutThe = (ma: typeof the, chu: string): HTMLElement => {
    const n = el('button', { type: 'button', role: 'tab', 'aria-selected': String(the === ma) }, chu);
    n.addEventListener('click', () => { the = ma; ve(); });
    return n;
  };
  const moThem = (): void => { moForm('moi'); the = 'caNha'; ve(); };
  const noiDung = the === 'homNay'
    ? veHomNay(kho.hoSo, moThem)
    : veCaNha({
      kho,
      doiHoSo: (ds: readonly HoSo[]) => doiKho({ ...kho, hoSo: ds }),
      xuat,
      bao: (chu) => { thongBao = chu; },
      ve,
    });
  app.replaceChildren(
    el('h1', {}, 'Tử Vi Nhà'),
    el('nav', { class: 'cac-the', role: 'tablist' }, nutThe('homNay', 'Hôm nay'), nutThe('caNha', 'Cả nhà')),
    ...daiNhac(),
    noiDung,
    el('p', { class: 'phien-ban' }, `Bản ${PHIEN_BAN}`),
  );
}

// Mo lai app sang ngay moi thi "Hom nay" phai doi theo. Chi ve lai the nay: ve lai the "Ca nha" la mat chu dang go do trong form.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && the === 'homNay') ve();
});
ve();

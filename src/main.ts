/**
 * Cua vao cua trang. Dot 0 moi co vo app: ten, so phien ban. Man "Hom nay" la dot 1.
 */
import { registerSW } from 'virtual:pwa-register';
import { PHIEN_BAN } from './PhienBan';
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

const tieuDe = document.createElement('h1');
tieuDe.textContent = 'Tử Vi Nhà';
const loi = document.createElement('p');
loi.textContent = 'Đang xây. Đợt 1 sẽ có hồ sơ cả nhà và màn "Hôm nay".';
const phienBan = document.createElement('p');
phienBan.className = 'phien-ban';
phienBan.textContent = `Bản ${PHIEN_BAN}`;
goc.append(tieuDe, loi, phienBan);

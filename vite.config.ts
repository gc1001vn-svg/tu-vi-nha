// `vitest/config` de khai duoc muc `test` ngay trong file nay, khong can file cau hinh thu hai.
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * DUONG DAN GOC - MOT HANG SO DUY NHAT.
 *
 * Quyet dinh `base` cua Vite, `start_url`, `scope` va duong dan icon trong manifest PWA.
 * Sai cho nay la PWA mo ra trang trang. `npm run check:base` doi chieu lai sau khi build.
 * Phuc vu o GitHub Pages duoi duong dan con /tu-vi-nha/.
 */
const BASE = '/tu-vi-nha/';

export default defineConfig({
  base: BASE,
  build: { target: 'es2022' },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // webp: 78 anh tarot (~2,5 MB) cai san cung app de tat mang van rut duoc bai (ke hoach dot 6).
        globPatterns: ['**/*.{js,css,html,png,svg,json,webp}'],
        // Tuong mat (dot 7 phan 2): MediaPipe ~17 MB khong cai san — chi tai khi bam chon anh, luu lai de lan sau khong can mang.
        globIgnores: ['**/vision_wasm_*', '**/tuongMatMp-*'],
        runtimeCaching: [{
          urlPattern: /\/(assets\/(vision_wasm_|tuongMatMp-)|mediapipe\/)/,
          handler: 'CacheFirst',
          options: { cacheName: 'tuong-mat', expiration: { maxEntries: 10 } },
        }],
        // Ban moi chiem quyen ngay, khong doi dong het tab — iOS giu service worker cu rat lau
        // (quoc-chien mat mot buoi sang 08/09 vi thieu hai dong nay).
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: 'Tử Vi Nhà',
        short_name: 'Tử Vi Nhà',
        description: 'Âm lịch, tử vi, bát tự, xem ngày, phong thủy cho cả nhà. Dữ liệu chỉ nằm trong máy.',
        lang: 'vi',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1b1210',
        theme_color: '#1b1210',
        icons: [
          { src: `${BASE}icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${BASE}icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
          { src: `${BASE}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});

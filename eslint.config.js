import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Luat ESLint cua Tu Vi Nha (chep khung tu quoc-chien).
 *
 * Hai hang rao quan trong nhat:
 *   1. Cam `any`.
 *   2. `src/loi/` (loi tinh: lich, can chi, la so, bang Han-Viet) la TypeScript THUAN: cam trinh
 *      duyet, cam dong ho, cam ngau nhien, cam locale. Cung ngay gio sinh thi moi may ra cung mot
 *      la so — test chay duoc trong Node, so voi bo ca kiem vang.
 */
export default tseslint.config(
  // `scripts/doi-chieu/` la kich ban doi chieu chay NGOAI app, import thu vien cai vao thu muc tam.
  { ignores: ['dist/**', 'dev-dist/**', 'node_modules/**', '*.config.js', 'scripts/doi-chieu/**'] },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,

  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      // Doc so tu JSON thi kieu la `unknown`; ep kieu co kiem tra van la cach lam dung.
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },

  // Phan chay trong trinh duyet.
  {
    files: ['src/**/*.ts'],
    languageOptions: { globals: globals.browser },
  },

  // HANG RAO LOI THUAN.
  {
    files: ['src/loi/**/*.ts'],
    languageOptions: { globals: {} },
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'src/loi/ la TypeScript thuan, cam dung trinh duyet.' },
        { name: 'document', message: 'src/loi/ la TypeScript thuan, cam dung trinh duyet.' },
        { name: 'navigator', message: 'src/loi/ la TypeScript thuan, cam dung trinh duyet.' },
        { name: 'localStorage', message: 'src/loi/ la TypeScript thuan, cam dung trinh duyet.' },
        { name: 'fetch', message: 'src/loi/ khong duoc goi mang.' },
        { name: 'process', message: 'src/loi/ khong duoc doc moi truong — ket qua se khac nhau theo may.' },
      ],
      // Ba nguon lam ket qua doi theo may/luc chay: dong ho, ngau nhien, locale.
      // Can gio "bay gio" thi NHAN QUA THAM SO.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MemberExpression[object.name="Math"][property.name="random"]',
          message: 'src/loi/ phai tat dinh: cam Math.random.',
        },
        {
          selector: ':matches(MemberExpression[object.name="Date"], NewExpression[callee.name="Date"], MemberExpression[object.name="performance"])',
          message: 'src/loi/ khong duoc doc dong ho. Nhan ngay gio qua tham so.',
        },
        {
          selector: ':matches(MemberExpression[property.name="localeCompare"], MemberExpression[property.name=/^toLocale/], MemberExpression[object.name="Intl"])',
          message: 'src/loi/ cam locale: ket qua khac nhau giua cac may.',
        },
        {
          selector: 'CallExpression[callee.property.name="sort"][arguments.length=0]',
          message: 'src/loi/ phai sap xep co ham so sanh ro rang.',
        },
      ],
    },
  },

  // Test va cong cu chay trong Node.
  {
    files: ['tests/**/*.ts', 'scripts/**/*.ts', 'scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // App Router
    './components/**/*.{js,ts,jsx,tsx}', // コンポーネント
  ],
  theme: {
    extend: {
      colors: {
        // メイン青系テーマ
        primary: '#3b82f6', // メインカラー
        secondary: '#2563eb', // 濃い青
        accent: '#60a5fa', // アクセント
        background: '#eff6ff', // ライト背景
        'background-dark': '#1e3a8a', // ダーク背景
        text: '#1e40af', // ライトテキスト
        'text-dark': '#dbeafe', // ダークテキスト
      },
    },
  },
  darkMode: 'class', // class でダークモード切替可能
  plugins: [],
};

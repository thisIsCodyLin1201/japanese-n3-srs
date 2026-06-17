import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// base: './' 用相對路徑 → GitHub Pages 的子路徑 (/<repo>/) 也能直接跑，
// 不需要知道 repo 名稱，省掉 Pages 最常見的白頁坑。
// '~' alias 對應 Dcard Web 的 import 慣例（'~/modules/...'）。
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

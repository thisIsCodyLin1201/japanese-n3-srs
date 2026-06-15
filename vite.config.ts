import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' 用相對路徑 → GitHub Pages 的子路徑 (/<repo>/) 也能直接跑，
// 不需要知道 repo 名稱，省掉 Pages 最常見的白頁坑。
export default defineConfig({
  plugins: [react()],
  base: './',
})

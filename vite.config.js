import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Per GitHub Pages: cambia 'tiktok-shop-academy' col nome esatto del tuo repository
export default defineConfig({
  plugins: [react()],
  base: '/tiktok-shop-academy/',
})

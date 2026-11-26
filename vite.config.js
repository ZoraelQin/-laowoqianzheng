import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' 便于部署在任意子路径下（如静态托管、GitHub Pages）
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})

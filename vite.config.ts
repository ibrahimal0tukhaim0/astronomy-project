import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(() => {

  return {
    plugins: [
      react(),
      tailwindcss(),
      viteCompression({ algorithm: 'gzip' }),
      viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    ],
    server: {
      host: '0.0.0.0',
      strictPort: true,
      port: 3000,
      open: true,
    },
    // Universal Relative Path (The "Bulletproof" Fix)
    // Works on ANY domain, subfolder, or hosting (Vercel + GitHub Pages)
    base: './',
  }
})

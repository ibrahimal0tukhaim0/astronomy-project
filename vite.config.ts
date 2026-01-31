import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(() => {

  return {
    plugins: [
      react(),
      tailwindcss(),
      viteCompression({ algorithm: 'gzip' }),
      viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'المستكشف الفلكي',
          short_name: 'فلك',
          description: 'رحلة تفاعلية في النظام الشمسي والنجوم مع آيات قرآنية',
          theme_color: '#000814',
          background_color: '#000814',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
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

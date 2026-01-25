import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    strictPort: false, // Allow fallback to 3001 if 3000 is busy
    port: 3000,
  },
  base: '/', // Vercel / Standard Root Deployment
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Check if running on Vercel
  const isVercel = process.env.VERCEL === '1';

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: '0.0.0.0',
      strictPort: true,
      port: 3000,
      open: true,
    },
    // Optimized for Vercel & Localhost (No custom base path needed)
    base: '/',
  }
})

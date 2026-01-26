import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // Ensure visibility on local network
    strictPort: true, // Fail if port 3000 is busy
    port: 3000,
    open: true, // Attempt to open browser automatically
  },
  base: command === 'serve' ? '/' : '/astronomy-project/',
}))

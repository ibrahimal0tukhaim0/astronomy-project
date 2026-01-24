import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="bg-black text-white h-screen flex items-center justify-center">Loading Al-Falak...</div>}>
      <App />
    </Suspense>
  </StrictMode>,
)

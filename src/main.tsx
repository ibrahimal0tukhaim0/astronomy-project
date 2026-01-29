import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import './utils/performance-core' // 🚀 Performance Engine Core (20+ Optimizations)
import App from './App.tsx'



// FORCE BLACK BACKGROUND IMMEDIATELY
document.body.style.backgroundColor = '#000000';
document.body.style.color = '#ffffff';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading 3D Engine...</div>}>
        <App />
      </Suspense>
    </StrictMode>,
  )
}

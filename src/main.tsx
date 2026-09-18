import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PerformanceProvider } from './context/PerformanceContext.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <PerformanceProvider>
        <App />
      </PerformanceProvider>
    </LanguageProvider>
  </StrictMode>,
)

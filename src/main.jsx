import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Remove data left in the browser by the old localStorage mock backend
try {
  Object.keys(localStorage)
    .filter(k => k.startsWith('mock_'))
    .forEach(k => localStorage.removeItem(k))
} catch { /* storage unavailable */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

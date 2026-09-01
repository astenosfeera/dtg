// This file connects React with HTML etc.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' //labojot savienojumu
import App from './App.jsx'
import './index.css' 
import './App.css'
import { AuthProvider } from './context/AuthProvider';//priekš JWT

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* pārejas ietvars, labojot sav */}
    <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
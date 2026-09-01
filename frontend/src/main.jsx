// Šis ir otrais - pēc index.html; fails inicializē React;
//iedod lietotnei globālos rīkus un palaiž komponenti <App/>
//Sākotnēji automātiski izveidoja ar npm create vite@latest
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' //labojot savienojumu
import App from './App.jsx'
import './index.css' 
import './App.css'
import { AuthProvider } from './context/AuthProvider';//priekš JWT

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* galvenais maršrutētājs; 
    nodrošina navigācijas mehānismu, 
    lapu pārslēgšanu bez pārlūka pārlādēšanas un URL adreses maiņu */}
    <AuthProvider> {/* glabā informāciju par ielogoto lietotāju un JWT tokenu */}
      <App /> {/* lietotnes galvenā centrālā komponente */}
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Vademecum from './vademecum/Vademecum.tsx'
import '../css/style.css'

// El Vademécum Digital es la portada del sitio (raíz y /vademecum).
// La vista anterior sigue accesible: /guia (guía de plantas), /clima y /ias.
const ruta = window.location.pathname.replace(/\/+$/, '').toLowerCase()
const esVademecum = ruta === '' || ruta === '/' || ruta.endsWith('/vademecum')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {esVademecum ? <Vademecum /> : <App />}
  </React.StrictMode>,
)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // escucha en 0.0.0.0 para acceder desde otros dispositivos de la red
    open: true,
    // OneDrive sincroniza los archivos y puede reiniciar el servidor en bucle.
    // Se limita la vigilancia a la carpeta src para mantenerlo estable.
    watch: {
      ignored: ['**/dist/**', '**/.git/**', '**/*.log'],
    },
  },
})


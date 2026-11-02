import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // o pacote do simulador passa um pouco de 500 kB (cerca de 150 kB compactado): limite do aviso em 600 kB
    chunkSizeWarningLimit: 600,
  },
  server: {
    // o json-server grava no db.json a cada POST/PATCH/DELETE; sem isso o Vite recarrega a página
    watch: {
      ignored: ['**/db.json'],
    },
  },
})
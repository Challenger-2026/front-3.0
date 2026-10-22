import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // o json-server grava no db.json a cada POST/PATCH/DELETE; sem isso o Vite recarrega a página
    watch: {
      ignored: ['**/db.json'],
    },
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  server: {
    host: '0.0.0.0', // 👈 Necesario para Docker
    port: 5173,
    strictPort: true
  }
})

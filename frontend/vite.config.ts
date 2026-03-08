import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mangai/',
  server: {
    host: '0.0.0.0',
    port: 3022,
    allowedHosts: true,
    proxy: {
      '/mangai/api': {
        target: 'http://localhost:5022',
        rewrite: (path) => path.replace(/^\/mangai/, '')
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: mode === 'mock' ? 'http://127.0.0.1:4010' : 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
}))

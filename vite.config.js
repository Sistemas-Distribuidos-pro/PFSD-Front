import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  envPrefix: [
    'VITE_',
    'ORDER_API_URL',
    'AUTH_API_URL',
    'CATALOG_API_URL',
    'GOOGLE_CLIENT_ID',
  ],
  server: {
    port: 3000,
    open: true
  }
})

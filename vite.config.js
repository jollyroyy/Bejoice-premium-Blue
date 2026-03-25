import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  publicDir: 'public',     // ← ADD THIS
  base: './',             // ← ADD THIS  
  build: {
    assetsInlineLimit: 0   // ← ADD THIS (don't inline large JPGs)
  }
})

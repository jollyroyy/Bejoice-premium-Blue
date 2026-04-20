import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  publicDir: 'public',
  base: './',
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1000,
    // Minify with esbuild (default) — fastest
    minify: 'esbuild',
    esbuild: { drop: ['console', 'debugger'] },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          gsap: ['gsap'],
          lenis: ['lenis'],
          motion: ['framer-motion'],
          // Three.js is ~580KB — keep it separate so it doesn't block initial load
          // It's only needed for BejoiceGlobe (lazy, globe chapter)
          three: ['three'],
        }
      }
    }
  }
})

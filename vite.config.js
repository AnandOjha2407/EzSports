import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // Use esbuild (faster, built-in) instead of terser
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    host: true,
    port: process.env.PORT || 10000,
    allowedHosts: [
      'ezports-frontend.onrender.com',
      '.onrender.com', // Allow all Render subdomains
    ],
  },
})


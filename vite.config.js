import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimizaciones de build
    rollupOptions: {
      output: {
        // Code splitting para reducir bundle size
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'supabase': ['@supabase/supabase-js'],
          'radix-ui': [
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
          ],
          'tiptap': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-image',
            '@tiptap/extension-link',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-color',
            '@tiptap/extension-text-style',
          ],
        },
        // Optimizar nombres de archivos de chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Minificar mejor
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.log en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    // Generar source maps solo en desarrollo
    sourcemap: false,
    // Optimizar CSS
    cssCodeSplit: true,
    cssMinify: true,
  },
  // Optimizar dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Optimizar caché
  server: {
    host: '0.0.0.0', // Escuchar en todas las interfaces (IPv4 e IPv6) para compatibilidad con Safari
    port: 3000,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
    },
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})



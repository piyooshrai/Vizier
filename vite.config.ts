import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Enable source maps for debugging (optional, disable in prod for smaller builds)
    sourcemap: false,
    // Minification settings
    minify: 'esbuild',
    // Target modern browsers for smaller output
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'vendor-react': ['react', 'react-dom'],
          // Router
          'vendor-router': ['react-router-dom'],
          // Charts
          'vendor-charts': ['recharts'],
          // Animation
          'vendor-animation': ['framer-motion'],
          // Forms
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Data fetching
          'vendor-query': ['@tanstack/react-query'],
        },
      },
      // Enable aggressive tree shaking
      treeshake: {
        moduleSideEffects: 'no-external',
        preset: 'recommended',
        // Remove unused properties from objects
        propertyReadSideEffects: false,
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

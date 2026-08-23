import { defineConfig } from 'vite'

export default defineConfig({

  root: '.',
  base: './',

  // Public directory - contents copied to build root
  // Includes: css/, examples/ (saved by dev API)
  publicDir: 'public',

  // Development server
  server: {
    port: 3000,
    open: true
  },

  // Build configuration
  build: {
    outDir: '../bootToGutenbergViteBuild',
    emptyOutDir: true,

    // Generate sourcemaps for debugging
    sourcemap: true,

    // Rollup options
    rollupOptions: {
      output: {
        // Organize chunks
        manualChunks: {
          'core': [
            './src/core/Converter.js'
          ],
          'data': [
            './src/data/cssLibrary.js',
            './src/data/examples.js',
            './src/data/mappings.js'
          ]
        }
      }
    }
  },

  // Resolve aliases (optional, for cleaner imports)
  resolve: {
    alias: {
      '@': '/src',
      '@core': '/src/core',
      '@data': '/src/data',
      '@ui': '/src/ui'
    }
  }
})

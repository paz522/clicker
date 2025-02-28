// vite.config.js
export default {
  // Base path for production build
  base: './',
  
  // Build options
  build: {
    // Do not minify for easier debugging
    minify: false,
    
    // Copy all scripts rather than attempting to bundle
    rollupOptions: {
      external: ['game.js'],
      output: {
        // Do not merge chunks
        manualChunks: {},
      },
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['@vercel/analytics'],
  },
  
  // Configure server
  server: {
    open: true,
  },
}; 
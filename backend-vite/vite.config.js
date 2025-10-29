import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  server: {
    port: 5000,
    host: '0.0.0.0',
    middlewareMode: false
  },
  optimizeDeps: {
    exclude: ['@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb', '@aws-sdk/client-sns']
  },
  build: {
    target: 'node18',
    outDir: '../dist',
    ssr: true,
    rollupOptions: {
      input: 'index.js',
      output: {
        format: 'es'
      }
    }
  }
});
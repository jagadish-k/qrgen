import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      writeBundle() {
        copyFileSync('manifest.json', 'build/manifest.json')
        copyFileSync('background.js', 'build/background.js')
      }
    }
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        index: resolve(fileURLToPath(new URL('.', import.meta.url)), 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    },
    copyPublicDir: true,
    assetsDir: 'assets',
    minify: false
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
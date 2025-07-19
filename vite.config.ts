import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-files',
      writeBundle() {
        // Copy manifest and background script
        copyFileSync('manifest.json', 'build/manifest.json')
        copyFileSync('background.js', 'build/background.js')
        
        // Create icons directory in build output
        if (!existsSync('build/icons')) {
          mkdirSync('build/icons', { recursive: true })
        }
        
        // Copy icons from src/icons to build/icons
        const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png']
        iconFiles.forEach(iconFile => {
          const srcPath = `src/icons/${iconFile}`
          const destPath = `build/icons/${iconFile}`
          if (existsSync(srcPath)) {
            copyFileSync(srcPath, destPath)
            console.log(`Copied ${srcPath} to ${destPath}`)
          } else {
            console.warn(`Warning: ${srcPath} not found - extension may not display properly`)
          }
        })
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
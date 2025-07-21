import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-files',
      writeBundle() {
        // Copy and move index.html to correct location
        if (existsSync('build/src/index.html')) {
          copyFileSync('build/src/index.html', 'build/index.html');
          // Remove the src directory in build
          const fs = require('fs');
          fs.rmSync('build/src', { recursive: true, force: true });
        }

        // Copy manifest and background script from src
        copyFileSync('src/manifest.json', 'build/manifest.json');
        copyFileSync('src/background.js', 'build/background.js');

        // Create icons directory in build output
        if (!existsSync('build/icons')) {
          mkdirSync('build/icons', { recursive: true });
        }

        // Copy icons from src/icons to build/icons
        const iconFiles = [
          'icon16.png',
          'icon32.png',
          'icon48.png',
          'icon96.png',
          'icon128.png',
        ];
        iconFiles.forEach((iconFile) => {
          const srcPath = `src/icons/${iconFile}`;
          const destPath = `build/icons/${iconFile}`;
          if (existsSync(srcPath)) {
            copyFileSync(srcPath, destPath);
            console.log(`Copied ${srcPath} to ${destPath}`);
          } else {
            console.warn(
              `Warning: ${srcPath} not found - extension may not display properly`
            );
          }
        });

        // Create fonts directory and copy fonts from src/assets/fonts
        if (!existsSync('build/fonts')) {
          mkdirSync('build/fonts', { recursive: true });
        }

        const fontFiles = [
          'NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf',
          'NunitoSans-Italic-VariableFont_YTLC,opsz,wdth,wght.ttf',
        ];
        fontFiles.forEach((fontFile) => {
          const srcPath = `src/assets/fonts/${fontFile}`;
          const destPath = `build/fonts/${fontFile}`;
          if (existsSync(srcPath)) {
            copyFileSync(srcPath, destPath);
            console.log(`Copied ${srcPath} to ${destPath}`);
          } else {
            console.warn(
              `Warning: ${srcPath} not found - fonts may not load properly`
            );
          }
        });
      },
    },
  ],
  css: {
    postcss: './config/postcss.config.js',
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      input: resolve(__dirname, '../src/index.html'),
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
    copyPublicDir: false,
    assetsDir: 'assets',
    minify: false,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, rmSync } from 'fs';

export default defineConfig({
  plugins: [
    preact(),
    {
      name: 'chrome-extension-build',
      writeBundle() {
        const distDir = resolve(__dirname, 'dist');
        if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
        // Copy manifest
        copyFileSync(
          resolve(__dirname, 'src/manifest.json'),
          resolve(distDir, 'manifest.json')
        );
        // Move popup.html from nested path to dist root
        const nestedPopup = resolve(distDir, 'src/popup/popup.html');
        if (existsSync(nestedPopup)) {
          copyFileSync(nestedPopup, resolve(distDir, 'popup.html'));
          rmSync(resolve(distDir, 'src'), { recursive: true, force: true });
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyDir: true,
    rollupOptions: {
      input: {
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
        'content': resolve(__dirname, 'src/content/index.ts'),
        'popup': resolve(__dirname, 'src/popup/popup.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/__tests__/**/*.test.ts'],
  },
});

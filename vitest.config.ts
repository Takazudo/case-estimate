import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    css: true,
    include: [
      'utils/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'hooks/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'components/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'app/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'data/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    exclude: [
      'node_modules',
      '.next',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'doc/**',
      'out/**',
      'tests/**', // Playwright tests
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});

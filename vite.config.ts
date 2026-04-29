/// <reference types="vitest/config" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const r = (segment: string) => path.resolve(dirname, segment);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@domain': r('src/domain'),
      '@application': r('src/application'),
      '@infrastructure': r('src/infrastructure'),
      '@presentation': r('src/presentation'),
      '@shared': r('src/shared'),
    },
  },
  build: {
    sourcemap: true,
    target: 'es2022',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/index.ts',
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/test/**',
        'src/infrastructure/firebase/firebaseApp.ts',
      ],
    },
  },
});

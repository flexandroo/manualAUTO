import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this project at https://flexandroo.github.io/manualAUTO/
// so production builds need /manualAUTO/ prefix on every asset URL.
// Dev server keeps '/'.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/manualAUTO/' : '/',
  server: {
    port: 5173,
    open: false,
  },
}));

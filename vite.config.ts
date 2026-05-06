import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the project at https://flexandroo.github.io/manualAUTO/
// so all asset URLs need the /manualAUTO/ prefix in production builds.
// Locally (vite dev / preview) base falls back to '/'.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/manualAUTO/' : '/',
  server: {
    port: 5173,
    open: false,
  },
}));

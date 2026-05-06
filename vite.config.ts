import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base set to '/' so the build works at the root of any host (Vercel,
// Netlify, Cloudflare Pages, custom domain). For GitHub Pages under a
// project sub-path you'd need '/manualAUTO/' instead.
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    open: false,
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project sites serve at https://<user>.github.io/<repo>/, so every
// asset URL must be prefixed with /<repo>/ or the browser 404s them. The deploy
// workflow sets VITE_BASE to "/<repo-name>/" for you; locally it is unset so base
// falls back to "/". For a user/org root site or a custom domain, remove the
// VITE_BASE env in the workflow (or set it to "/").
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
});
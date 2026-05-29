import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Déployé sous /experience-v2 sur le site lostchapter pour pouvoir comparer
// avec l'ancienne version qui reste accessible à /experience.
export default defineConfig({
  base: '/experience-v3/',
  plugins: [react()],
  build: { outDir: 'dist', target: 'es2020', sourcemap: false },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Déployé sous /experience sur le site lostchapter (assets relatifs à ce préfixe).
export default defineConfig({
  base: '/experience/',
  plugins: [react()],
  build: { outDir: 'dist', target: 'es2020', sourcemap: false },
});

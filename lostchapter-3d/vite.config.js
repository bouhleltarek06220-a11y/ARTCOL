import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite + React pour l'app 3D Lost Chapter (isolée du reste du mono-dépôt).
export default defineConfig({
  plugins: [react()],
  // Les .glb/.hdr volumineux sont servis depuis public/ (ou un CDN si > 5 Mo).
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.exr'],
  build: {
    // three.js + drei + postprocessing forment un gros chunk attendu (~550 Ko gzip) :
    // on relève le seuil d'alerte plutôt que de fragmenter une app 3D mono-page.
    chunkSizeWarningLimit: 2000,
  },
})

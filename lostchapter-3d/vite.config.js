import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite + React pour l'app 3D Lost Chapter (isolée du reste du mono-dépôt).
export default defineConfig({
  plugins: [react()],
  // Les .glb/.hdr volumineux sont servis depuis public/ (ou un CDN si > 5 Mo).
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.exr'],
})

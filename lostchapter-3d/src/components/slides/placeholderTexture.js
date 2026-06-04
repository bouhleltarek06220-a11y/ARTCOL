import { CanvasTexture, SRGBColorSpace } from 'three'

// Texture de slide « stand-in » dessinée sur un canvas (texte net, sans dépendance).
// >>> SWAP : remplacée par la vraie image quand elle est déposée dans public/slides/.
export function makeSlideTexture(label = 'Slide', accent = '#C99B5C') {
  const w = 1024
  const h = 576
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')

  // Fond + liseré accent
  ctx.fillStyle = '#160d06'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = accent
  ctx.lineWidth = 8
  ctx.strokeRect(18, 18, w - 36, h - 36)

  // Titre de la salle
  ctx.fillStyle = accent
  ctx.font = '600 66px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, w / 2, h / 2 - 24)

  // Mention placeholder
  ctx.fillStyle = '#F2E6D0'
  ctx.font = '28px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('vos slides ici — public/slides/', w / 2, h / 2 + 56)

  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export default makeSlideTexture

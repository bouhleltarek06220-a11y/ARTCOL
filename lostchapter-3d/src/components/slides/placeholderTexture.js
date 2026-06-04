import { CanvasTexture, SRGBColorSpace } from 'three'

// Découpe un texte en lignes qui tiennent dans maxWidth (px canvas).
function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

/**
 * Rend une slide (eyebrow + titre + puces) en CanvasTexture nette, palette Lost Chapter.
 * @param {{eyebrow?:string,title?:string,lines?:string[]}} slide
 */
export function makeSlideTexture(slide = {}, accent = '#C99B5C') {
  const { eyebrow = '', title = 'Slide', lines = [] } = slide
  const w = 1024
  const h = 576
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')

  // Fond dégradé sombre + bordure accent
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#1c1108')
  grad.addColorStop(1, '#120b05')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = accent
  ctx.lineWidth = 6
  ctx.strokeRect(16, 16, w - 32, h - 32)

  const padX = 64
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  // Liseré accent
  ctx.fillStyle = accent
  ctx.fillRect(padX, 78, 96, 8)

  // Eyebrow
  if (eyebrow) {
    ctx.fillStyle = accent
    ctx.font = '600 24px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText(eyebrow.toUpperCase(), padX, 100)
  }

  // Titre (jusqu'à 2 lignes)
  ctx.fillStyle = '#F2E6D0'
  ctx.font = '700 56px ui-sans-serif, system-ui, sans-serif'
  let y = 146
  for (const tl of wrapText(ctx, title, w - padX * 2).slice(0, 2)) {
    ctx.fillText(tl, padX, y)
    y += 64
  }
  y += 18

  // Puces
  ctx.font = '30px ui-sans-serif, system-ui, sans-serif'
  for (const ln of lines.slice(0, 4)) {
    ctx.fillStyle = accent
    ctx.beginPath()
    ctx.arc(padX + 6, y + 17, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#D9C9A8'
    const first = wrapText(ctx, ln, w - padX * 2 - 36)[0]
    ctx.fillText(first, padX + 28, y)
    y += 46
  }

  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export default makeSlideTexture

import { useMemo } from 'react'
import SlideBoard from './SlideBoard.jsx'

/**
 * Mur d'archives : dispose les slides du deck en grille sur le mur du fond.
 * @param {object[]} slides  liste de slides (cf. config/slides.js)
 */
export default function SlideGallery({
  slides = [],
  accent = '#C99B5C',
  columns = 5,
  cell = [2.3, 1.29],
  gap = [0.3, 0.34],
  center = [0, 0.95, -4.5],
}) {
  const layout = useMemo(() => {
    const [cw, ch] = cell
    const [gx, gy] = gap
    const n = slides.length
    const cols = Math.max(1, Math.min(columns, n))
    const rows = Math.ceil(n / cols)
    const totalW = cols * cw + (cols - 1) * gx
    const totalH = rows * ch + (rows - 1) * gy
    const startX = -totalW / 2 + cw / 2
    const startY = totalH / 2 - ch / 2
    return slides.map((slide, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      return {
        slide,
        pos: [
          center[0] + startX + col * (cw + gx),
          center[1] + startY - row * (ch + gy),
          center[2],
        ],
      }
    })
  }, [slides, columns, cell, gap, center])

  return (
    <group>
      {layout.map(({ slide, pos }, i) => (
        <SlideBoard key={slide.id ?? i} slide={slide} accent={accent} position={pos} size={cell} />
      ))}
    </group>
  )
}

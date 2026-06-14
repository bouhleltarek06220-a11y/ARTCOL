import { AnimatePresence, motion } from 'framer-motion';
import { nationalZones } from '../../data/nationalZones';

/** Panneau parchemin qui s'ouvre quand on entre dans un portail. Pour l'instant
 *  un teaser de la zone (le contenu immersif 3D de chaque zone arrive ensuite). */
export function ZoneOverlay({ zoneId, onClose }: { zoneId: string | null; onClose: () => void }) {
  const zone = nationalZones.find((z) => z.id === zoneId) || null;
  return (
    <AnimatePresence>
      {zone && (
        <motion.div
          key={zone.id}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 26, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 26, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg rounded-2xl border p-8 text-center"
            style={{ borderColor: `${zone.color}66`, background: 'linear-gradient(180deg, rgba(28,20,12,.96), rgba(16,11,6,.98))', boxShadow: `0 30px 90px -30px ${zone.color}` }}
          >
            <div style={{ fontSize: 52, lineHeight: 1, filter: `drop-shadow(0 0 16px ${zone.color})` }}>{zone.glyph}</div>
            <h2 className="font-display mt-3" style={{ fontSize: 30, color: '#f4e6c4', letterSpacing: '0.05em' }}>{zone.title}</h2>
            <p className="mt-2 italic" style={{ color: '#d8c6a0' }}>{zone.subtitle}</p>
            <p className="mt-4 text-sm" style={{ color: '#b29c78' }}>Zone immersive en cours de construction — la scène 3D dédiée arrive bientôt.</p>
            <button
              onClick={onClose}
              className="font-display mt-6 rounded-full border px-6 py-2 text-[11px] uppercase tracking-[0.3em] transition hover:scale-105"
              style={{ borderColor: `${zone.color}88`, color: '#f4e6c4' }}
            >
              ◂ Retour au hall
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

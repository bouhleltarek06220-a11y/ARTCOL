// Carillons procéduraux via WebAudio — pas de fichier externe, conforme CSP.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    return ctx;
  } catch {
    return null;
  }
}

export function chime(freq = 880, dur = 0.35, vol = 0.18, type: OscillatorType = 'sine') {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  o.connect(g);
  g.connect(c.destination);
  const t = c.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.05);
}

// Accord court (3 notes) pour l'activation d'un portail
export function activationChord() {
  chime(523.25, 0.6, 0.1);              // C5
  setTimeout(() => chime(659.25, 0.6, 0.09), 70);   // E5
  setTimeout(() => chime(783.99, 0.8, 0.1), 140);   // G5
}

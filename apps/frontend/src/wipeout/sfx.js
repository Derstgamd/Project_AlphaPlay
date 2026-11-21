// Tiny WebAudio blips + haptics. No assets needed.

let ctx = null;
let muted = false;

export const isMuted = () => muted;
export const setMuted = (v) => {
  muted = !!v;
};

function audio() {
  if (muted || typeof window === "undefined") return null;
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq, dur = 0.08, type = "square", vol = 0.05, delay = 0) {
  const a = audio();
  if (!a) return;
  const t0 = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(a.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export function buzz(pattern) {
  if (muted) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* unsupported */
  }
}

export const sfx = {
  unlock: () => audio(),
  tap: () => tone(520, 0.03, "sine", 0.035),
  tick: () => tone(1250, 0.035, "square", 0.03),
  alert: () => {
    tone(700, 0.11, "sawtooth", 0.05);
    tone(470, 0.14, "sawtooth", 0.05, 0.12);
    buzz([80, 40, 80]);
  },
  good: () => {
    tone(660, 0.08, "triangle", 0.06);
    tone(990, 0.12, "triangle", 0.06, 0.08);
  },
  bad: () => {
    tone(220, 0.22, "sawtooth", 0.06);
    buzz(200);
  },
  info: () => tone(880, 0.06, "sine", 0.05),
  taunt: () => tone(330, 0.09, "square", 0.04),
  milestone: () => {
    tone(523, 0.1, "square", 0.05);
    tone(392, 0.16, "square", 0.05, 0.11);
    buzz([60, 60, 60]);
  },
  go: () => {
    tone(880, 0.12, "square", 0.06);
    tone(1320, 0.2, "square", 0.06, 0.12);
    buzz(120);
  },
  siren: () => {
    for (let i = 0; i < 4; i++) tone(i % 2 ? 620 : 860, 0.18, "sawtooth", 0.05, i * 0.19);
    buzz([150, 50, 150]);
  },
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, "triangle", 0.07, i * 0.12)),
  lose: () => [392, 330, 262, 196].forEach((f, i) => tone(f, 0.22, "sawtooth", 0.05, i * 0.16)),
};

// WIPEOUT — 100% Original / Copyright-Free Procedural Suspense Music & Cinematic SFX Engine
// Synthesized in real time via Web Audio API (no external copyrighted samples required).

let ctx = null;
let masterGain = null;
let sfxBus = null;
let musicBus = null;
let delayNode = null;
let delayFeedback = null;
let noiseBuf = null;
let pinkNoiseBuf = null;

let muted = false;
let currentScene = "off"; // "off" | "lobby" | "briefing" | "playing" | "critical" | "victory" | "defeat"
let musicTimer = null;
let stepIndex = 0;
let droneNodes = null;
let tickAlt = false;
let gestureHooked = false;

export const isMuted = () => muted;

export function setMuted(v) {
  muted = !!v;
  if (ctx && masterGain) {
    const t = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(t);
    masterGain.gain.setTargetAtTime(muted ? 0.0001 : 0.92, t, 0.06);
  }
}

function createNoiseBuffers(a) {
  const sr = a.sampleRate;
  const len = sr * 2;
  const wBuf = a.createBuffer(1, len, sr);
  const wData = wBuf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    wData[i] = Math.random() * 2 - 1;
  }

  // Voss-McCartney style soft pink noise for nocturnal air / rain / paper rustle
  const pBuf = a.createBuffer(1, len, sr);
  const pData = pBuf.getChannelData(0);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    pData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
    b6 = white * 0.115926;
  }

  noiseBuf = wBuf;
  pinkNoiseBuf = pBuf;
}

function ensureAudio() {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();

      // Master compressor prevents distortion when layered suspense swells hit
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 6;
      comp.attack.value = 0.005;
      comp.release.value = 0.18;

      masterGain = ctx.createGain();
      masterGain.gain.value = muted ? 0.0001 : 0.92;

      sfxBus = ctx.createGain();
      sfxBus.gain.value = 0.85;

      musicBus = ctx.createGain();
      musicBus.gain.value = 0.42;

      // Dark cinematic echo/delay bus for piano plucks & radar pings
      delayNode = ctx.createDelay(1.0);
      delayNode.delayTime.value = 0.34;
      const delayFilter = ctx.createBiquadFilter();
      delayFilter.type = "lowpass";
      delayFilter.frequency.value = 1650;
      delayFeedback = ctx.createGain();
      delayFeedback.gain.value = 0.34;

      delayNode.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(delayNode);
      delayFilter.connect(comp);

      sfxBus.connect(comp);
      musicBus.connect(comp);
      comp.connect(masterGain);
      masterGain.connect(ctx.destination);

      createNoiseBuffers(ctx);
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch {
    return null;
  }
}

export function buzz(pattern) {
  if (muted) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* unsupported */
  }
}

// ───────────────────────── SYNTH HELPERS ─────────────────────────

function playVoice({
  freq,
  endFreq = null,
  dur = 0.18,
  type = "triangle",
  vol = 0.12,
  delay = 0,
  attack = 0.008,
  filterFreq = 3200,
  filterQ = 1,
  bus = "sfx",
  wet = 0,
}) {
  const a = ensureAudio();
  if (!a || muted) return;
  const t0 = a.currentTime + delay;

  const osc = a.createOscillator();
  const filt = a.createBiquadFilter();
  const g = a.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(20, freq), t0);
  if (endFreq !== null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t0 + dur);
  }

  filt.type = "lowpass";
  filt.frequency.setValueAtTime(filterFreq, t0);
  filt.Q.value = filterQ;

  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + Math.min(attack, dur * 0.4));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(filt);
  filt.connect(g);
  g.connect(bus === "music" ? musicBus : sfxBus);

  if (wet > 0 && delayNode) {
    const send = a.createGain();
    send.gain.value = wet;
    g.connect(send);
    send.connect(delayNode);
  }

  osc.start(t0);
  osc.stop(t0 + dur + 0.04);
}

function playNoiseBurst({
  dur = 0.08,
  vol = 0.08,
  delay = 0,
  pink = false,
  filterType = "bandpass",
  freq = 1400,
  endFreq = null,
  q = 1.4,
  bus = "sfx",
}) {
  const a = ensureAudio();
  if (!a || muted || !noiseBuf) return;
  const t0 = a.currentTime + delay;

  const src = a.createBufferSource();
  src.buffer = pink ? pinkNoiseBuf : noiseBuf;

  const filt = a.createBiquadFilter();
  filt.type = filterType;
  filt.frequency.setValueAtTime(freq, t0);
  if (endFreq !== null) {
    filt.frequency.exponentialRampToValueAtTime(Math.max(60, endFreq), t0 + dur);
  }
  filt.Q.value = q;

  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.012, dur * 0.3));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  src.connect(filt);
  filt.connect(g);
  g.connect(bus === "music" ? musicBus : sfxBus);

  src.start(t0, Math.random() * 0.8);
  src.stop(t0 + dur + 0.04);
}

// ───────────────────────── ADAPTIVE SUSPENSE MUSIC ENGINE ─────────────────────────

function stopDrone() {
  if (!droneNodes) return;
  const { sub, pad1, pad2, air, gain } = droneNodes;
  droneNodes = null;
  if (ctx) {
    const t = ctx.currentTime;
    try {
      gain.gain.cancelScheduledValues(t);
      gain.gain.setTargetAtTime(0.0001, t, 0.25);
      setTimeout(() => {
        try {
          sub.stop();
          pad1.stop();
          pad2.stop();
          air.stop();
        } catch {
          /* ignore */
        }
      }, 900);
    } catch {
      /* ignore */
    }
  }
}

function startOrUpdateDrone(scene) {
  const a = ensureAudio();
  if (!a || scene === "off") {
    stopDrone();
    return;
  }

  // Pitch profile per scene (D minor thriller palette -> F# major resolve on victory)
  const profiles = {
    lobby: { fSub: 36.71, f1: 146.83, f2: 220.0, cutoff: 420, vol: 0.22, airVol: 0.14 }, // D1 + D3 + A3
    briefing: { fSub: 36.71, f1: 146.83, f2: 174.61, cutoff: 520, vol: 0.25, airVol: 0.1 }, // D1 + D3 + F3
    playing: { fSub: 36.71, f1: 110.0, f2: 174.61, cutoff: 640, vol: 0.26, airVol: 0.08 }, // D1 + A2 + F3
    critical: { fSub: 38.89, f1: 155.56, f2: 220.0, cutoff: 980, vol: 0.32, airVol: 0.12 }, // Eb1/tritone edge
    victory: { fSub: 36.71, f1: 146.83, f2: 185.0, cutoff: 760, vol: 0.2, airVol: 0.06 }, // D major warm
    defeat: { fSub: 34.65, f1: 138.59, f2: 146.83, cutoff: 320, vol: 0.24, airVol: 0.12 }, // C# + D dark tension
  };

  const p = profiles[scene] || profiles.lobby;
  const t = a.currentTime;

  if (!droneNodes) {
    const gain = a.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.setTargetAtTime(p.vol, t, 0.55);

    const filt = a.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(p.cutoff, t);
    filt.Q.value = 1.4;

    const sub = a.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(p.fSub, t);
    const subG = a.createGain();
    subG.gain.value = 0.52;

    const pad1 = a.createOscillator();
    pad1.type = "sawtooth";
    pad1.frequency.setValueAtTime(p.f1, t);
    const pad1G = a.createGain();
    pad1G.gain.value = 0.16;

    const pad2 = a.createOscillator();
    pad2.type = "triangle";
    pad2.frequency.setValueAtTime(p.f2, t);
    pad2.detune.value = 7;
    const pad2G = a.createGain();
    pad2G.gain.value = 0.18;

    // Soft nocturnal room / distant rain air texture
    const air = a.createBufferSource();
    air.buffer = pinkNoiseBuf;
    air.loop = true;
    const airFilt = a.createBiquadFilter();
    airFilt.type = "lowpass";
    airFilt.frequency.value = 520;
    const airG = a.createGain();
    airG.gain.setValueAtTime(p.airVol, t);

    sub.connect(subG).connect(gain);
    pad1.connect(pad1G).connect(filt);
    pad2.connect(pad2G).connect(filt);
    filt.connect(gain);
    air.connect(airFilt).connect(airG).connect(gain);
    gain.connect(musicBus);

    sub.start(t);
    pad1.start(t);
    pad2.start(t);
    air.start(t);

    droneNodes = { sub, pad1, pad2, air, filt, airG, gain };
  } else {
    droneNodes.sub.frequency.setTargetAtTime(p.fSub, t, 0.35);
    droneNodes.pad1.frequency.setTargetAtTime(p.f1, t, 0.35);
    droneNodes.pad2.frequency.setTargetAtTime(p.f2, t, 0.35);
    droneNodes.filt.frequency.setTargetAtTime(p.cutoff, t, 0.35);
    droneNodes.airG.gain.setTargetAtTime(p.airVol, t, 0.35);
    droneNodes.gain.gain.setTargetAtTime(p.vol, t, 0.35);
  }
}

// D natural/harmonic minor suspense motifs (frequencies in Hz)
const LOBBY_ARP = [
  293.66, null, null, 349.23, null, null, 440.0, null,
  329.63, null, null, null, 277.18, null, 293.66, null,
];
const PLAY_BASS = [
  73.42, 73.42, 73.42, 87.31, 73.42, 73.42, 82.41, 73.42,
  65.41, 65.41, 65.41, 73.42, 69.3, 69.3, 82.41, 73.42,
];
const PLAY_LEAD = [
  null, null, 587.33, null, null, null, 523.25, null,
  null, null, 440.0, null, 466.16, null, null, null,
];
const CRIT_BASS = [
  73.42, 73.42, 77.78, 73.42, 87.31, 73.42, 77.78, 82.41,
  73.42, 73.42, 92.5, 87.31, 77.78, 73.42, 69.3, 73.42,
];
const CRIT_TOP = [
  587.33, null, 622.25, null, 698.46, null, 622.25, null,
  587.33, null, 554.37, null, 622.25, null, 587.33, null,
];
const VICTORY_CHORD = [293.66, null, 369.99, null, 440.0, null, 587.33, null];

function runMusicStep() {
  if (!ctx || ctx.state !== "running" || muted || currentScene === "off") return;
  const s = stepIndex % 16;
  stepIndex += 1;

  if (currentScene === "lobby") {
    // Sparse nocturnal detective piano plucks + distant low heartbeat
    const note = LOBBY_ARP[s];
    if (note) {
      playVoice({
        freq: note,
        dur: 0.95,
        type: "triangle",
        vol: 0.085,
        attack: 0.015,
        filterFreq: 1450,
        bus: "music",
        wet: 0.45,
      });
    }
    if (s === 0) {
      playVoice({
        freq: 73.42,
        endFreq: 52,
        dur: 0.55,
        type: "sine",
        vol: 0.14,
        bus: "music",
      });
    }
  } else if (currentScene === "briefing") {
    // Subtle pulsing radar tick + tense muted sub-pulse
    if (s % 4 === 0) {
      playVoice({
        freq: 62,
        endFreq: 42,
        dur: 0.28,
        type: "sine",
        vol: 0.16,
        bus: "music",
      });
    }
    if (s === 0 || s === 8) {
      playVoice({
        freq: 440,
        dur: 0.35,
        type: "sine",
        vol: 0.045,
        bus: "music",
        wet: 0.5,
      });
    }
  } else if (currentScene === "playing") {
    // Driving thriller 16th-note ostinato bass + heartbeat kick + subtle watch tick
    const bass = PLAY_BASS[s];
    playVoice({
      freq: bass,
      dur: 0.15,
      type: "sawtooth",
      vol: s % 4 === 0 ? 0.14 : 0.085,
      attack: 0.005,
      filterFreq: s % 4 === 0 ? 680 : 420,
      filterQ: 2.2,
      bus: "music",
    });

    // Double heartbeat kick (lub-dub)
    if (s === 0 || s === 3 || s === 8 || s === 11) {
      playVoice({
        freq: s % 8 === 0 ? 78 : 62,
        endFreq: 34,
        dur: 0.14,
        type: "sine",
        vol: s % 8 === 0 ? 0.24 : 0.16,
        attack: 0.004,
        bus: "music",
      });
    }

    // Crisp thriller clockwork hi-hat tick on off-beats
    if (s % 2 === 1) {
      playNoiseBurst({
        dur: 0.03,
        vol: s % 4 === 3 ? 0.045 : 0.025,
        filterType: "highpass",
        freq: 5200,
        bus: "music",
      });
    }

    // Haunting minor lead accent
    const lead = PLAY_LEAD[s];
    if (lead) {
      playVoice({
        freq: lead,
        dur: 0.55,
        type: "triangle",
        vol: 0.065,
        filterFreq: 1800,
        bus: "music",
        wet: 0.42,
      });
    }
  } else if (currentScene === "critical") {
    // High-adrenaline sudden-death / final-5s pulse (faster tempo, edgy minor-2nd & tritone)
    const bass = CRIT_BASS[s];
    playVoice({
      freq: bass,
      dur: 0.13,
      type: "sawtooth",
      vol: s % 2 === 0 ? 0.18 : 0.11,
      attack: 0.004,
      filterFreq: s % 4 === 0 ? 1150 : 620,
      filterQ: 3.4,
      bus: "music",
    });

    if (s % 4 === 0 || s % 4 === 2) {
      playVoice({
        freq: s % 4 === 0 ? 92 : 68,
        endFreq: 32,
        dur: 0.13,
        type: "sine",
        vol: s % 4 === 0 ? 0.28 : 0.18,
        attack: 0.003,
        bus: "music",
      });
    }

    // Urgent double-time ticking percussion
    playNoiseBurst({
      dur: 0.025,
      vol: s % 2 === 0 ? 0.055 : 0.03,
      filterType: "bandpass",
      freq: s % 2 === 0 ? 4800 : 3200,
      q: 2,
      bus: "music",
    });

    const top = CRIT_TOP[s];
    if (top) {
      playVoice({
        freq: top,
        dur: 0.24,
        type: "sine",
        vol: 0.075,
        filterFreq: 2400,
        bus: "music",
        wet: 0.38,
      });
    }
  } else if (currentScene === "victory") {
    const n = VICTORY_CHORD[s % VICTORY_CHORD.length];
    if (n && s < 8) {
      playVoice({
        freq: n,
        dur: 1.1,
        type: "triangle",
        vol: 0.075,
        attack: 0.04,
        filterFreq: 2100,
        bus: "music",
        wet: 0.45,
      });
    }
  } else if (currentScene === "defeat") {
    if (s === 0) {
      playVoice({
        freq: 146.83,
        endFreq: 138.59,
        dur: 1.4,
        type: "triangle",
        vol: 0.07,
        attack: 0.08,
        filterFreq: 720,
        bus: "music",
        wet: 0.4,
      });
    }
  }
}

function scheduleMusicLoop(scene) {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
  if (scene === "off") return;

  const stepMs =
    scene === "critical"
      ? 135
      : scene === "playing"
        ? 170
        : scene === "briefing"
          ? 240
          : 340;

  musicTimer = setInterval(runMusicStep, stepMs);
}

function hookFirstGesture() {
  if (gestureHooked || typeof window === "undefined") return;
  gestureHooked = true;
  const unlockAndResume = () => {
    const a = ensureAudio();
    if (a && currentScene !== "off") {
      startOrUpdateDrone(currentScene);
      if (!musicTimer) scheduleMusicLoop(currentScene);
    }
    window.removeEventListener("pointerdown", unlockAndResume);
    window.removeEventListener("keydown", unlockAndResume);
  };
  window.addEventListener("pointerdown", unlockAndResume, { passive: true });
  window.addEventListener("keydown", unlockAndResume, { passive: true });
}

export const music = {
  setScene(nextScene) {
    const normalized = nextScene || "off";
    hookFirstGesture();
    if (normalized === currentScene && (normalized === "off" || musicTimer)) return;
    currentScene = normalized;
    stepIndex = 0;

    if (normalized === "off") {
      scheduleMusicLoop("off");
      stopDrone();
      return;
    }

    const a = ensureAudio();
    if (a && a.state === "running") {
      startOrUpdateDrone(normalized);
      scheduleMusicLoop(normalized);
    } else if (a) {
      // Queue start as soon as AudioContext resumes on first gesture
      a.resume()
        .then(() => {
          if (currentScene === normalized) {
            startOrUpdateDrone(normalized);
            scheduleMusicLoop(normalized);
          }
        })
        .catch(() => {});
    }
  },
  getScene: () => currentScene,
};

// ───────────────────────── CINEMATIC SUSPENSE SOUND EFFECTS ─────────────────────────

export const sfx = {
  unlock: () => {
    const a = ensureAudio();
    if (a && currentScene !== "off") {
      startOrUpdateDrone(currentScene);
      if (!musicTimer) scheduleMusicLoop(currentScene);
    }
    return a;
  },

  // Subtle tactile UI tap
  tap: () => {
    playVoice({ freq: 540, endFreq: 360, dur: 0.045, type: "sine", vol: 0.075 });
    playNoiseBurst({ dur: 0.02, vol: 0.03, filterType: "highpass", freq: 2400 });
  },

  // Soft mechanical tab / file / chat switch
  tabSwitch: () => {
    playVoice({ freq: 680, endFreq: 520, dur: 0.04, type: "triangle", vol: 0.065 });
    playNoiseBurst({ dur: 0.025, vol: 0.035, filterType: "bandpass", freq: 2900 });
  },

  // Crisp clipboard / notebook paper page flip
  paperFlip: () => {
    playNoiseBurst({
      dur: 0.14,
      vol: 0.13,
      pink: true,
      filterType: "bandpass",
      freq: 950,
      endFreq: 2400,
      q: 1.2,
    });
    playNoiseBurst({
      dur: 0.09,
      vol: 0.08,
      delay: 0.05,
      filterType: "highpass",
      freq: 2200,
    });
  },

  // Heavy rubber-stamp / desk slam thud
  stamp: () => {
    playVoice({ freq: 130, endFreq: 42, dur: 0.14, type: "sine", vol: 0.24, attack: 0.003 });
    playNoiseBurst({ dur: 0.07, vol: 0.14, filterType: "lowpass", freq: 920 });
    buzz(30);
  },

  // Laptop OS app open chime
  appOpen: () => {
    playVoice({ freq: 440, dur: 0.11, type: "sine", vol: 0.08, wet: 0.22 });
    playVoice({ freq: 659.25, dur: 0.16, delay: 0.05, type: "triangle", vol: 0.09, wet: 0.28 });
  },

  // Laptop OS app close soft whoosh
  appClose: () => {
    playVoice({ freq: 420, endFreq: 240, dur: 0.09, type: "sine", vol: 0.07 });
    playNoiseBurst({ dur: 0.06, vol: 0.045, pink: true, filterType: "lowpass", freq: 1100 });
  },

  // Unfolding Kolkata Map workspace + faint sonar lock
  mapOpen: () => {
    playNoiseBurst({
      dur: 0.22,
      vol: 0.16,
      pink: true,
      filterType: "bandpass",
      freq: 700,
      endFreq: 1900,
      q: 1.1,
    });
    playVoice({ freq: 587.33, dur: 0.35, delay: 0.09, type: "sine", vol: 0.08, wet: 0.45 });
  },

  // 3D Pushpin stabbed into Kolkata Map
  pinDrop: () => {
    playVoice({ freq: 240, endFreq: 95, dur: 0.07, type: "triangle", vol: 0.18, attack: 0.002 });
    playNoiseBurst({ dur: 0.035, vol: 0.11, filterType: "bandpass", freq: 1850, q: 2.0 });
  },

  // Tying crimson detective yarn between pins
  yarnTie: () => {
    playVoice({ freq: 310, endFreq: 470, dur: 0.11, type: "triangle", vol: 0.095, wet: 0.2 });
    playNoiseBurst({ dur: 0.04, vol: 0.05, filterType: "highpass", freq: 2600 });
  },

  // BangoVault keypad / room code digit press
  keyPress: () => {
    playVoice({ freq: 880, dur: 0.055, type: "sine", vol: 0.085 });
    playVoice({ freq: 1320, dur: 0.04, type: "triangle", vol: 0.045 });
  },

  // Heavy BangoVault security lock opening
  vaultUnlock: () => {
    playVoice({ freq: 160, endFreq: 70, dur: 0.16, type: "sine", vol: 0.2 });
    playNoiseBurst({ dur: 0.09, vol: 0.1, filterType: "bandpass", freq: 1600, q: 2.4 });
    playVoice({ freq: 587.33, dur: 0.22, delay: 0.09, type: "triangle", vol: 0.12, wet: 0.35 });
    playVoice({ freq: 880.0, dur: 0.3, delay: 0.18, type: "triangle", vol: 0.13, wet: 0.4 });
    buzz([40, 30, 60]);
  },

  // Encrypted evidence forward / transmit burst
  forward: () => {
    playVoice({ freq: 523.25, dur: 0.09, type: "sine", vol: 0.09, wet: 0.25 });
    playVoice({ freq: 783.99, dur: 0.11, delay: 0.055, type: "sine", vol: 0.1, wet: 0.3 });
    playVoice({ freq: 1046.5, dur: 0.18, delay: 0.11, type: "triangle", vol: 0.1, wet: 0.35 });
  },

  // Task 8: Firewall slam / remote access revoked power-down
  revoke: () => {
    playVoice({ freq: 420, endFreq: 55, dur: 0.34, type: "sawtooth", vol: 0.18, filterFreq: 1200 });
    playNoiseBurst({ dur: 0.16, vol: 0.14, filterType: "bandpass", freq: 1400, endFreq: 260 });
    playVoice({ freq: 587.33, dur: 0.4, delay: 0.18, type: "triangle", vol: 0.13, wet: 0.4 });
    buzz([80, 40, 120]);
  },

  // Submarine / Lalbazar radar ping
  radarPing: () => {
    playVoice({ freq: 1174.66, dur: 0.5, type: "sine", vol: 0.11, wet: 0.55 });
    playVoice({ freq: 587.33, dur: 0.4, delay: 0.04, type: "sine", vol: 0.06, wet: 0.45 });
  },

  // Windows-style bottom-right notification arrival chime
  notif: () => {
    playVoice({ freq: 587.33, dur: 0.18, type: "sine", vol: 0.085, wet: 0.35 });
    playVoice({ freq: 440.0, dur: 0.26, delay: 0.1, type: "triangle", vol: 0.08, wet: 0.4 });
  },

  // Alternating suspense watch tick-tock in final 5 seconds
  tick: () => {
    tickAlt = !tickAlt;
    playNoiseBurst({
      dur: 0.025,
      vol: 0.11,
      filterType: "bandpass",
      freq: tickAlt ? 3400 : 2500,
      q: 3.5,
    });
    playVoice({
      freq: tickAlt ? 1480 : 1180,
      dur: 0.032,
      type: "sine",
      vol: 0.06,
    });
  },

  // Deep cinematic double heartbeat thump in final 5s
  heartbeat: () => {
    playVoice({ freq: 64, endFreq: 34, dur: 0.15, type: "sine", vol: 0.26, attack: 0.005 });
    playVoice({
      freq: 56,
      endFreq: 30,
      dur: 0.18,
      delay: 0.17,
      type: "sine",
      vol: 0.2,
      attack: 0.005,
    });
    buzz([30, 90, 25]);
  },

  // Thriller alert sting
  alert: () => {
    playVoice({ freq: 622.25, dur: 0.14, type: "sawtooth", vol: 0.11, filterFreq: 1600, wet: 0.25 });
    playVoice({
      freq: 440.0,
      dur: 0.22,
      delay: 0.12,
      type: "sawtooth",
      vol: 0.11,
      filterFreq: 1300,
      wet: 0.3,
    });
    buzz([80, 40, 80]);
  },

  // Clean thriller discovery chime (Task 1–7 cleared)
  good: () => {
    playVoice({ freq: 110, endFreq: 65, dur: 0.18, type: "sine", vol: 0.18 });
    playVoice({ freq: 587.33, dur: 0.14, type: "triangle", vol: 0.11, wet: 0.3 });
    playVoice({ freq: 880.0, dur: 0.26, delay: 0.08, type: "triangle", vol: 0.12, wet: 0.42 });
  },

  // Non-fatal slip glitch zap (Rohan Tasks 1–7)
  slip: () => {
    playNoiseBurst({ dur: 0.15, vol: 0.14, filterType: "bandpass", freq: 1600, endFreq: 420 });
    playVoice({ freq: 240, endFreq: 135, dur: 0.22, type: "sawtooth", vol: 0.11, filterFreq: 900 });
    buzz([60, 40, 60]);
  },

  // Wrong answer / failure ominous impact
  bad: () => {
    playVoice({ freq: 140, endFreq: 46, dur: 0.32, type: "sawtooth", vol: 0.2, filterFreq: 750 });
    playVoice({ freq: 207.65, endFreq: 155.56, dur: 0.28, type: "sawtooth", vol: 0.11, filterFreq: 1100 });
    playNoiseBurst({ dur: 0.14, vol: 0.1, filterType: "lowpass", freq: 950 });
    buzz(200);
  },

  info: () => {
    playVoice({ freq: 783.99, dur: 0.1, type: "sine", vol: 0.07, wet: 0.25 });
  },

  taunt: () => {
    playVoice({ freq: 311.13, dur: 0.14, type: "sawtooth", vol: 0.09, filterFreq: 1200, wet: 0.25 });
  },

  // Big cinematic thriller sub-braaam + chord on Milestones 8, 9, 10!
  milestone: () => {
    playVoice({ freq: 73.42, endFreq: 55, dur: 0.72, type: "sawtooth", vol: 0.22, filterFreq: 540 });
    playVoice({ freq: 146.83, dur: 0.62, type: "triangle", vol: 0.14, filterFreq: 1100, wet: 0.35 });
    playVoice({ freq: 587.33, dur: 0.3, delay: 0.08, type: "triangle", vol: 0.12, wet: 0.45 });
    playVoice({ freq: 880.0, dur: 0.48, delay: 0.18, type: "triangle", vol: 0.14, wet: 0.5 });
    buzz([70, 40, 100]);
  },

  // Run start ignition swell
  go: () => {
    playVoice({ freq: 73.42, endFreq: 110, dur: 0.32, type: "sawtooth", vol: 0.18, filterFreq: 850 });
    playVoice({ freq: 587.33, dur: 0.22, delay: 0.08, type: "triangle", vol: 0.12, wet: 0.35 });
    playVoice({ freq: 1174.66, dur: 0.36, delay: 0.16, type: "sine", vol: 0.11, wet: 0.45 });
    buzz(110);
  },

  // Realistic sweeping Kolkata PCR siren
  siren: () => {
    for (let i = 0; i < 3; i++) {
      playVoice({
        freq: 620,
        endFreq: 1020,
        dur: 0.22,
        delay: i * 0.42,
        type: "sawtooth",
        vol: 0.1,
        filterFreq: 1700,
        wet: 0.28,
      });
      playVoice({
        freq: 1020,
        endFreq: 620,
        dur: 0.2,
        delay: i * 0.42 + 0.22,
        type: "sawtooth",
        vol: 0.09,
        filterFreq: 1500,
        wet: 0.28,
      });
    }
    buzz([140, 50, 140]);
  },

  // Cinematic 3/3 victory chord & fanfare
  win: () => {
    playVoice({ freq: 73.42, dur: 1.2, type: "sine", vol: 0.24 });
    [293.66, 369.99, 440.0, 587.33, 880.0].forEach((f, i) => {
      playVoice({
        freq: f,
        dur: 0.72,
        delay: i * 0.1,
        type: "triangle",
        vol: 0.11,
        filterFreq: 2600,
        wet: 0.45,
      });
    });
    buzz([60, 40, 60, 40, 160]);
  },

  // Dramatic thriller sub-drop defeat sting
  lose: () => {
    playVoice({ freq: 110, endFreq: 32, dur: 0.95, type: "sawtooth", vol: 0.24, filterFreq: 520 });
    playNoiseBurst({ dur: 0.35, vol: 0.12, pink: true, filterType: "lowpass", freq: 820 });
    [311.13, 293.66, 220.0, 146.83].forEach((f, i) => {
      playVoice({
        freq: f,
        dur: 0.44,
        delay: i * 0.15,
        type: "triangle",
        vol: 0.1,
        filterFreq: 1100,
        wet: 0.4,
      });
    });
    buzz([180, 60, 220]);
  },
};

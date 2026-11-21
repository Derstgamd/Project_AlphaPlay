"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Procedural rain ambience + tiny UI ticks (no audio files needed).
export function useAmbience() {
  const ctxRef = useRef(null);
  const gainRef = useRef(null);
  const onRef = useRef(false);
  const [enabled, setEnabled] = useState(false);

  const ensureContext = () => {
    if (ctxRef.current) return ctxRef.current;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;

    const ctx = new AC();
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.04 * white) / 1.04;
      data[i] = last * 3.2;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1100;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    ctxRef.current = ctx;
    gainRef.current = gain;
    return ctx;
  };

  const toggle = useCallback(() => {
    const ctx = ensureContext();
    if (!ctx || !gainRef.current) return;
    const next = !onRef.current;
    onRef.current = next;
    setEnabled(next);
    if (next) ctx.resume();
    gainRef.current.gain.setTargetAtTime(next ? 0.32 : 0, ctx.currentTime, 0.35);
  }, []);

  const tick = useCallback((freq = 520, duration = 0.07) => {
    const ctx = ctxRef.current;
    if (!ctx || !onRef.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  useEffect(() => {
    return () => {
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  return { enabled, toggle, tick };
}

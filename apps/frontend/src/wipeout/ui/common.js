"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "../sfx";
import s from "./wipeout.module.css";

export const mmss = (ms) => {
  const t = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};
export const secs = (ms) => `${Math.max(0, Math.ceil(ms / 1000))}s`;
export const cx = (...a) => a.filter(Boolean).join(" ");

/** Host-synced clock as React state (SSR/prerender safe; updates every `ms`). */
export function useNow(ctl, ms = 100) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const t0 = setTimeout(() => setNow(ctl.now()), 0);
    const id = setInterval(() => setNow(ctl.now()), ms);
    return () => {
      clearTimeout(t0);
      clearInterval(id);
    };
  }, [ctl, ms]);
  return now;
}

/** Press-and-hold button. A popup (`paused`) freezes progress without resetting it. */
export function HoldButton({ ms, label, sub, paused = false, disabled = false, onDone, tone = "amber" }) {
  const [p, setP] = useState(0);
  const st = useRef({ holding: false, acc: 0, last: 0, raf: 0 });
  const pausedRef = useRef(paused);
  const doneRef = useRef(onDone);

  useEffect(() => {
    pausedRef.current = paused;
    doneRef.current = onDone;
  });

  useEffect(() => {
    const cur = st.current;
    return () => cancelAnimationFrame(cur.raf);
  }, []);

  function frame(t) {
    const cur = st.current;
    if (!cur.holding) return;
    const dt = t - cur.last;
    cur.last = t;
    if (!pausedRef.current) cur.acc += dt;
    const prog = Math.min(1, cur.acc / ms);
    setP(prog);
    if (prog >= 1) {
      cur.holding = false;
      cur.acc = 0;
      setP(0);
      sfx.good();
      doneRef.current?.();
      return;
    }
    cur.raf = requestAnimationFrame(frame);
  }

  function down(e) {
    if (disabled) return;
    sfx.unlock();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const cur = st.current;
    cur.holding = true;
    cur.last = performance.now();
    cancelAnimationFrame(cur.raf);
    cur.raf = requestAnimationFrame(frame);
  }

  function up() {
    const cur = st.current;
    if (!cur.holding) return;
    cur.holding = false;
    cancelAnimationFrame(cur.raf);
    if (!pausedRef.current) {
      cur.acc = 0;
      setP(0);
    }
  }

  const pct = Math.round(p * 100);
  return (
    <button
      type="button"
      className={cx(s.hold, s[`tone_${tone}`], disabled && s.disabled, p > 0 && s.holding)}
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={up}
      onContextMenu={(e) => e.preventDefault()}
      disabled={disabled}
    >
      <span className={s.holdFill} style={{ transform: `scaleX(${p})` }} />
      <span className={s.holdLabel}>
        {p > 0 ? (paused ? `PAUSED (${pct}%)` : `UPLOADING… ${pct}%`) : label}
        {sub && !p && <small>{sub}</small>}
      </span>
    </button>
  );
}

/** Tap button with a cooldown sweep. */
export function CdButton({
  label,
  icon,
  cdLeft = 0,
  cdTotal = 1,
  blocked,
  readyText = "READY",
  onClick,
  tone = "red",
  small,
}) {
  const cooling = cdLeft > 0;
  const off = cooling || !!blocked;
  return (
    <button
      type="button"
      className={cx(s.cdBtn, s[`tone_${tone}`], off && s.disabled, small && s.cdSmall)}
      onClick={() => {
        if (off) return;
        sfx.unlock();
        onClick?.();
      }}
      aria-disabled={off}
    >
      {cooling && (
        <span className={s.cdSweep} style={{ transform: `scaleX(${Math.min(1, cdLeft / Math.max(1, cdTotal))})` }} />
      )}
      <span className={s.cdLabel}>
        {icon && <b className={s.cdIcon}>{icon}</b>}
        <span>{label}</span>
        <small>{cooling ? secs(cdLeft) : blocked || readyText}</small>
      </span>
    </button>
  );
}

/**
 * Derives live host toasts from `g.events` (purely from `now`) plus local UI
 * notices (triggered by clicks). Plays SFX via useEffect with zero setState-in-effect.
 */
export function useToasts(g, role, now) {
  const [locals, setLocals] = useState([]);
  const seen = useRef(null);
  const events = g?.events;

  useEffect(() => {
    if (!events) {
      seen.current = null;
      return;
    }
    const last = events.length ? events[events.length - 1].id : 0;
    if (seen.current === null) {
      seen.current = last;
      return;
    }
    const fresh = events.filter((e) => e.id > seen.current && (e.to === role || e.to === "both"));
    seen.current = Math.max(seen.current, last);
    for (const e of fresh) sfx[e.kind]?.();
  }, [events, role]);

  const local = (text, kind = "info") => {
    sfx[kind]?.();
    const id = `l_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setLocals((prev) => [...prev.filter((x) => x.text !== text), { key: id, kind, text }].slice(-3));
    setTimeout(() => setLocals((prev) => prev.filter((x) => x.key !== id)), 3800);
  };

  const hostToasts = (events || [])
    .filter((e) => (e.to === role || e.to === "both") && now - e.at < 4000 && now - e.at >= -1000)
    .slice(-3)
    .map((e) => ({ key: `e${e.id}`, kind: e.kind, text: e.text }));

  const toasts = [...hostToasts, ...locals].slice(-4);
  return { toasts, local };
}

export function Toasts({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className={s.toasts} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.key} className={cx(s.toast, s[`toast_${t.kind}`])}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

export function PeerAway({ link, mode }) {
  if (mode !== "online" || !link?.peerAway) return null;
  return <div className={s.peerAway}>📶 Other phone not responding… waiting to reconnect</div>;
}

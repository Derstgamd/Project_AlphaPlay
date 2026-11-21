"use client";

import { useRef, useState } from "react";
import { useCase } from "@/context/CaseContext";
import { APP_META, AppIcon } from "./device/Icons";
import { APP_COMPONENTS, APP_ORDER, WINDOW_SIZE } from "./device/registry";
import styles from "./LaptopScene.module.css";

const DESKTOP_FILES = [
  { label: "IMG_0419.jpg", ext: "JPG", app: "photos", arg: "photo_1" },
  { label: "Locker_Receipt", ext: "TXT", app: "files", arg: "file_1" },
  { label: "Voicemail_0141", ext: "M4A", app: "files", arg: "file_2" },
];

export default function LaptopScene({ hostDevice }) {
  const { setActiveScreen, totalUnread, clues } = useCase();

  const [wins, setWins] = useState({
    messages: { x: 90, y: 24, z: 1, min: false, max: false, arg: null },
  });
  const [zTop, setZTop] = useState(1);
  const [focused, setFocused] = useState("messages");
  const dragRef = useRef(null);

  const bump = () => {
    const next = zTop + 1;
    setZTop(next);
    return next;
  };

  const openApp = (id, arg = null) => {
    const z = bump();
    setFocused(id);
    setWins((w) => {
      const existing = w[id];
      if (existing) {
        return { ...w, [id]: { ...existing, z, min: false, arg: arg ?? existing.arg } };
      }
      const n = Object.keys(w).length;
      return {
        ...w,
        [id]: { x: 70 + n * 34, y: 18 + n * 28, z, min: false, max: false, arg },
      };
    });
  };

  const closeApp = (id) =>
    setWins((w) => {
      const next = { ...w };
      delete next[id];
      return next;
    });

  const patch = (id, change) =>
    setWins((w) => (w[id] ? { ...w, [id]: { ...w[id], ...change } } : w));

  const focus = (id) => {
    if (focused === id) return;
    setFocused(id);
    patch(id, { z: bump() });
  };

  const startDrag = (e, id) => {
    if (wins[id].max) return;
    focus(id);
    dragRef.current = { id, sx: e.clientX, sy: e.clientY, ox: wins[id].x, oy: wins[id].y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const moveDrag = (e) => {
    const d = dragRef.current;
    if (!d) return;
    patch(d.id, {
      x: d.ox + e.clientX - d.sx,
      y: Math.max(0, d.oy + e.clientY - d.sy),
    });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  return (
    <div className={styles.desktop}>
      <header className={styles.menubar}>
        <div className={styles.menuLeft}>
          <button type="button" className={styles.menuBtn} onClick={() => setActiveScreen("workspace")}>
            ← Back to desk
          </button>
          <strong>Adam&apos;s Laptop</strong>
          <span className={styles.menuMeta}>
            {focused && wins[focused] ? APP_META[focused].label : "Desktop"}
          </span>
        </div>
        <div className={styles.menuRight}>
          <button type="button" className={styles.menuBtn} onClick={() => hostDevice.setOverrideType("phone")}>
            Phone UI
          </button>
          <span className={styles.menuMeta}>{clues.length}/4 clues</span>
          <span className={styles.menuMeta}>Wi-Fi off</span>
          <span className={styles.menuMeta}>38%</span>
          <span className={styles.menuMeta}>Tue 02:14 AM</span>
        </div>
      </header>

      <main className={styles.deskArea}>
        <div className={styles.icons}>
          {DESKTOP_FILES.map((f) => (
            <button key={f.label} type="button" className={styles.fileIcon} onClick={() => openApp(f.app, f.arg)}>
              <span className={styles.glyph}>{f.ext}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {Object.entries(wins).map(([id, win]) => {
          const App = APP_COMPONENTS[id];
          const [w, h] = WINDOW_SIZE[id];
          return (
            <section
              key={id}
              className={`${styles.window} ${win.max ? styles.windowMax : ""} ${focused === id ? styles.windowFocus : ""}`}
              style={{
                left: win.max ? 0 : win.x,
                top: win.max ? 0 : win.y,
                width: win.max ? "100%" : w,
                height: win.max ? "100%" : h,
                zIndex: win.z,
                display: win.min ? "none" : "flex",
              }}
              onPointerDown={() => focus(id)}
            >
              <div
                className={styles.titlebar}
                onPointerDown={(e) => startDrag(e, id)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onDoubleClick={() => patch(id, { max: !win.max })}
              >
                <div className={styles.lights} onPointerDown={(e) => e.stopPropagation()}>
                  <button type="button" className={styles.close} aria-label="Close" onClick={() => closeApp(id)} />
                  <button type="button" className={styles.minimize} aria-label="Minimize" onClick={() => patch(id, { min: true })} />
                  <button type="button" className={styles.maximize} aria-label="Maximize" onClick={() => patch(id, { max: !win.max })} />
                </div>
                <span className={styles.winTitle}>{APP_META[id].label}</span>
                <span className={styles.lightsSpacer} />
              </div>
              <div className={styles.winBody}>
                <App key={win.arg || "default"} variant="laptop" initialId={win.arg} />
              </div>
            </section>
          );
        })}

        {Object.keys(wins).length === 0 && (
          <div className={styles.hint}>Open an app from the dock to start digging.</div>
        )}
      </main>

      <footer className={styles.dockWrap}>
        <nav className={styles.dock} aria-label="Dock">
          {APP_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              className={styles.dockItem}
              onClick={() => openApp(id)}
              aria-label={APP_META[id].label}
            >
              <span className={styles.tip}>{APP_META[id].label}</span>
              <AppIcon id={id} size={46} />
              {id === "messages" && totalUnread > 0 && (
                <span className={styles.dockBadge}>{totalUnread}</span>
              )}
              {wins[id] && <span className={styles.runDot} />}
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
}

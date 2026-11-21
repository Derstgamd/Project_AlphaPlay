"use client";

import { useState } from "react";
import { MAP_PINS, MAP_ROUTE } from "@/data/deviceData";
import { useCase } from "@/context/CaseContext";
import { PhoneHeader } from "../parts";
import styles from "../Apps.module.css";

export default function MapApp({ variant, onHome }) {
  const phone = variant === "phone";
  const { clues } = useCase();
  const [selectedId, setSelectedId] = useState("sub");

  const found = new Set(clues.map((c) => c.id));
  const isOpen = (pin) => !pin.requires || found.has(pin.requires);
  const byId = Object.fromEntries(MAP_PINS.map((p) => [p.id, p]));
  const selected = byId[selectedId];

  const routePoints = MAP_ROUTE.map((id) => byId[id])
    .filter(isOpen)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  const body = (
    <div className={styles.mapWrap}>
      <svg className={styles.mapSvg} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="#0b1018" />
        {/* city blocks */}
        {[
          [10, 10, 100, 70],
          [140, 10, 70, 70],
          [240, 120, 40, 60],
          [10, 120, 100, 60],
          [140, 170, 100, 50],
          [10, 230, 120, 60],
          [300, 190, 90, 50],
        ].map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="4" fill="#121a27" />
        ))}
        {/* river */}
        <path d="M0 105 C90 120 150 90 230 108 S360 130 400 112" fill="none" stroke="#10304a" strokeWidth="14" opacity="0.7" />
        {/* streets */}
        {["M0 100H400", "M0 150H400", "M0 215H400", "M130 0V300", "M230 0V300", "M290 0V300"].map((d) => (
          <path key={d} d={d} stroke="#2a3446" strokeWidth="5" />
        ))}
        {/* rail line */}
        <path d="M0 262 C140 250 250 195 400 48" fill="none" stroke="#6b7280" strokeWidth="4" />
        <path d="M0 262 C140 250 250 195 400 48" fill="none" stroke="#0b1018" strokeWidth="2" strokeDasharray="5 7" />
        <text x="14" y="290" className={styles.pinLabel}>PINEHOLLOW RAIL LINE</text>

        {routePoints.includes(",") && (
          <polyline
            points={routePoints}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            strokeLinejoin="round"
          />
        )}

        {MAP_PINS.map((pin) => {
          const open = isOpen(pin);
          return (
            <g
              key={pin.id}
              className={styles.pin}
              onClick={() => setSelectedId(pin.id)}
              role="button"
              aria-label={open ? pin.name : "Unknown location"}
            >
              {open && pin.id === selectedId && (
                <circle cx={pin.x} cy={pin.y} r="6" className={styles.pinRing} />
              )}
              <circle
                cx={pin.x}
                cy={pin.y}
                r="6"
                className={
                  !open ? styles.pinLocked : pin.id === selectedId ? `${styles.pinDot} ${styles.pinSel}` : styles.pinDot
                }
              />
              {!open && (
                <text x={pin.x} y={pin.y + 3} textAnchor="middle" fontSize="8" fill="#8b95a7">
                  ?
                </text>
              )}
              <text x={pin.x + 10} y={pin.y + 3} className={styles.pinLabel}>
                {open ? pin.name : "???"}
              </text>
            </g>
          );
        })}
      </svg>

      <aside className={styles.mapPanel}>
        <div className={styles.label}>
          {isOpen(selected) ? selected.time.toUpperCase() : "LOCKED"}
        </div>
        <div className={styles.mapTitle}>
          {isOpen(selected) ? selected.name : "Unknown location"}
        </div>
        <p>{isOpen(selected) ? selected.info : selected.hint}</p>
        <div className={styles.label}>
          {routePoints.includes(",")
            ? "RED DASHES · ADAM'S ROUTE"
            : "Route unknown. Keep digging."}
        </div>
      </aside>
    </div>
  );

  if (phone) {
    return (
      <div className={`${styles.app} ${styles.phone}`}>
        <PhoneHeader title="Map" sub="Pinehollow" onBack={onHome} backLabel="Home" />
        {body}
      </div>
    );
  }
  return <div className={styles.app}>{body}</div>;
}

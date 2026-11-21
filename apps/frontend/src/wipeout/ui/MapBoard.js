"use client";

import { ADJ, EDGES, ZONES, ZONE_IDS } from "../constants";
import { traceActive } from "../engine";
import { cx } from "./common";
import s from "./wipeout.module.css";

/**
 * Stylized Salt Lake grid. `role` decides what is visible:
 *  - father: cleared stamps, his pings, trace lock, van in flight, missed raids, blips
 *  - rohan:  SUV position, connected zones, ghost ping, cleared stamps, missed raids
 */
export default function MapBoard({ g, now, role, selected, onSelect, mode }) {
  const isF = role === "father";
  const trace = isF && traceActive(g, now) ? g.suvZone : null;
  const reachable = !isF ? new Set(ADJ[g.suvZone]) : new Set();

  const latestPing = {};
  if (isF) {
    for (const p of g.pings) {
      if (now - p.at < 14000 && !latestPing[p.zone]) latestPing[p.zone] = p;
    }
  }
  const blips = isF ? g.blips.filter((b) => now - b.at < 3500) : [];

  return (
    <svg className={s.map} viewBox="0 0 100 100" role="img" aria-label="CholoMap">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0V10" fill="none" stroke="currentColor" strokeWidth="0.15" opacity="0.25" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
      {/* Canal + bypass flavour */}
      <path d="M0 22 C30 18 60 28 100 24" className={s.mapCanal} />

      {EDGES.map(([a, b, c]) => {
        const A = ZONES[a];
        const B = ZONES[b];
        const hot = !isF && (a === g.suvZone || b === g.suvZone);
        const d = c ? `M${A.x} ${A.y} Q${c.cx} ${c.cy} ${B.x} ${B.y}` : `M${A.x} ${A.y} L${B.x} ${B.y}`;
        return <path key={a + b} d={d} className={cx(s.mapRoad, hot && s.mapRoadHot)} />;
      })}

      {ZONE_IDS.map((id) => {
        const z = ZONES[id];
        const cleared = g.clearedZones.includes(id);
        const ping = latestPing[id];
        const here = !isF && g.suvZone === id;
        const canGo = !isF && reachable.has(id) && mode === "reroute";
        const ghost = !isF && g.fakePing && now < g.fakePing.expiresAt && g.fakePing.zone === id;
        const vanHere = isF && g.raidInFlight?.zone === id;
        const missed = g.raids.filter((r) => r.zone === id).length > 0;
        return (
          <g
            key={id}
            className={cx(s.zone, cleared && s.zoneCleared, selected === id && s.zoneSel, canGo && s.zoneGo)}
            onClick={() => onSelect?.(id)}
          >
            <circle cx={z.x} cy={z.y} r="9" className={s.zoneHit} />
            {trace === id && <circle cx={z.x} cy={z.y} r="9" className={s.ringTrace} />}
            {ping?.result === "strong" && <circle cx={z.x} cy={z.y} r="8" className={s.ringStrong} />}
            {ping?.result === "weak" && <circle cx={z.x} cy={z.y} r="7.5" className={s.ringWeak} />}
            {ping?.result === "none" && <circle cx={z.x} cy={z.y} r="7" className={s.ringNone} />}
            {blips.some((b) => b.zone === id) && <circle cx={z.x} cy={z.y} r="9" className={s.ringBlip} />}
            {ghost && <circle cx={z.x} cy={z.y} r="8" className={s.ringGhost} />}
            {canGo && <circle cx={z.x} cy={z.y} r="7.5" className={s.ringGo} />}
            <circle cx={z.x} cy={z.y} r="4.6" className={cx(s.node, here && s.nodeHere, trace === id && s.nodeTrace)} />
            {here && (
              <text x={z.x} y={z.y + 1.6} className={s.mapEmoji}>
                🚙
              </text>
            )}
            {vanHere && (
              <text x={z.x + 6} y={z.y - 4} className={s.mapEmoji}>
                🚓
              </text>
            )}
            {ghost && (
              <text x={z.x - 6.5} y={z.y - 4} className={s.mapEmoji}>
                👻
              </text>
            )}
            {missed && (
              <text x={z.x + 5.5} y={z.y + 6.5} className={s.mapMiss}>
                ✕
              </text>
            )}
            <text x={z.x} y={z.y + 9.6} className={s.zoneName}>
              {z.name}
            </text>
            {cleared && (
              <text x={z.x} y={z.y + 1.3} className={s.stamp} transform={`rotate(-14 ${z.x} ${z.y})`}>
                CLEARED
              </text>
            )}
            {ping && !cleared && (
              <text x={z.x} y={z.y - 7} className={cx(s.pingTag, s[`ping_${ping.result}`])}>
                {ping.result === "strong" ? "STRONG" : ping.result === "weak" ? "WEAK" : "NONE"}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

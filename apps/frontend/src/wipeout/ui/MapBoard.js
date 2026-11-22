"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { ADJ, EDGES, ZONES, ZONE_IDS } from "../constants";
import { traceActive } from "../engine";
import { sfx } from "../sfx";
import m from "./MapBoard.module.css";

// Real Kolkata (Bidhannagar / Salt Lake / EM Bypass / VIP Rd) coordinates
export const ZONE_COORDS = {
  ultadanga: [22.5938, 88.3915],
  kestopur: [22.5982, 88.4315],
  saltlake: [22.5878, 88.4142],
  karunamoyee: [22.5782, 88.4192],
  sectorv: [22.5734, 88.4368],
  chingrighata: [22.5638, 88.4072],
};

const MAP_CENTER = [22.5818, 88.4148];

function pinSvgHtml(baseColor, darkShade, highlight) {
  return `
    <svg class="${m.pinSvg}" viewBox="0 0 38 42" width="32" height="36" aria-hidden="true">
      <circle cx="13" cy="35" r="2.1" fill="rgba(0,0,0,0.75)" />
      <path d="M13 35 L27 33 L34 37 L23 40 Z" fill="rgba(0,0,0,0.44)" />
      <ellipse cx="26" cy="36.5" rx="7.5" ry="3.4" fill="rgba(0,0,0,0.4)" />
      <line x1="13" y1="35" x2="18.5" y2="21.5" stroke="#475569" stroke-width="2.3" stroke-linecap="round" />
      <line x1="13.2" y1="34.6" x2="18.2" y2="21.8" stroke="#e2e8f0" stroke-width="1" stroke-linecap="round" />
      <ellipse cx="19.5" cy="20.5" rx="7" ry="3.4" transform="rotate(18 19.5 20.5)" fill="${darkShade}" />
      <path d="M15.2 19.2 L18 11.5 L25.6 14 L23.4 21.8 Z" fill="${baseColor}" />
      <path d="M21 12.6 L25.6 14 L23.4 21.8 L19.8 20.6 Z" fill="${darkShade}" opacity="0.55" />
      <ellipse cx="22" cy="11.2" rx="8.6" ry="4.6" transform="rotate(18 22 11.2)" fill="${darkShade}" />
      <ellipse cx="22.4" cy="9.8" rx="8.4" ry="4.3" transform="rotate(18 22.4 9.8)" fill="${baseColor}" />
      <ellipse cx="20.2" cy="8.4" rx="4" ry="1.6" transform="rotate(14 20.2 8.4)" fill="${highlight}" opacity="0.65" />
      <circle cx="18.2" cy="7.9" r="1" fill="#ffffff" opacity="0.85" />
    </svg>
  `;
}

/**
 * Interactive Kolkata OpenStreetMap with 3D stabbed pushpins, live game markers,
 * last-known-location red yarn trail, and optional player custom notes + yarn.
 */
export default function MapBoard({
  g,
  now,
  role,
  selected,
  onSelect,
  mode,
  compact = false,
  customPins = [],
  customYarns = [],
  pendingNote = null,
  onPlacePendingNote,
  onCancelPendingNote,
  yarnMode = false,
  yarnStartId = null,
  onYarnNodeClick,
  onExitYarnMode,
  onDeleteCustomPin,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const layerRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [openCustomPinId, setOpenCustomPinId] = useState(null);

  // Keep latest callbacks in refs for Leaflet click listeners
  const cbRef = useRef({});
  useEffect(() => {
    cbRef.current = {
      onSelect,
      pendingNote,
      onPlacePendingNote,
      yarnMode,
      onYarnNodeClick,
    };
  }, [onSelect, pendingNote, onPlacePendingNote, yarnMode, onYarnNodeClick]);

  // Initialize Leaflet OSM once
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      leafletRef.current = L;
      const map = L.map(containerRef.current, {
        center: MAP_CENTER,
        zoom: compact ? 12 : 13,
        zoomControl: !compact,
        attributionControl: !compact,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        minZoom: 11,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      if (!compact) {
        map.zoomControl?.setPosition("bottomright");
      }

      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      map.on("click", (e) => {
        if (cbRef.current.pendingNote) {
          cbRef.current.onPlacePendingNote?.({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          });
        }
      });

      setMapReady(true);
    }

    init();

    // Keep Leaflet tiles crisp whenever a macOS window opens, resizes, or maximizes
    let ro = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      ro = new ResizeObserver(() => {
        mapRef.current?.invalidateSize({ animate: false });
      });
      ro.observe(containerRef.current);
    }

    return () => {
      cancelled = true;
      ro?.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
    };
  }, [compact]);

  // Re-sync live game pins, last-known locations, roads, and player yarn/notes
  const isF = role === "father";
  const trace = isF && traceActive(g, now) ? g.suvZone : null;
  const ghostZone =
    !isF && g.fakePing && now < g.fakePing.expiresAt ? g.fakePing.zone : null;
  const recentBlipsKey = isF
    ? g.blips
        .filter((b) => now - b.at < 3500)
        .map((b) => b.zone)
        .join(",")
    : "";
  const activePingsKey = isF
    ? g.pings
        .filter((p) => now - p.at < 14000)
        .map((p) => `${p.zone}:${p.result}`)
        .join(",")
    : "";
  const roadblockKey =
    g.roadblock && now < g.roadblock.expiresAt
      ? `${g.roadblock.a}:${g.roadblock.b}`
      : "";

  useEffect(() => {
    if (!mapReady || !leafletRef.current || !layerRef.current) return;
    const L = leafletRef.current;
    const layer = layerRef.current;
    layer.clearLayers();

    const reachable = !isF && g.suvZone ? new Set(ADJ[g.suvZone] || []) : new Set();
    const [rbA, rbB] = roadblockKey ? roadblockKey.split(":") : [null, null];
    const latestPing = {};
    if (isF && activePingsKey) {
      activePingsKey.split(",").forEach((entry) => {
        const [zone, result] = entry.split(":");
        if (zone && result && !latestPing[zone]) latestPing[zone] = { zone, result };
      });
    }
    const activeBlips = new Set(recentBlipsKey ? recentBlipsKey.split(",") : []);

    // 1. Road corridor edges between the 6 Salt Lake / Kolkata zones
    EDGES.forEach(([a, b]) => {
      const ca = ZONE_COORDS[a];
      const cb = ZONE_COORDS[b];
      if (!ca || !cb) return;
      const isBlocked =
        rbA && rbB && ((a === rbA && b === rbB) || (a === rbB && b === rbA));
      const hot = !isF && !isBlocked && (a === g.suvZone || b === g.suvZone);
      L.polyline([ca, cb], {
        color: isBlocked ? "#ef4444" : hot ? "#22c55e" : "#94a3b8",
        weight: isBlocked ? 4 : hot ? 2.8 : 1.5,
        opacity: isBlocked ? 0.92 : hot ? 0.85 : 0.35,
        dashArray: isBlocked ? "7 6" : hot ? undefined : "5 6",
      }).addTo(layer);

      if (isBlocked) {
        const mid = [(ca[0] + cb[0]) / 2, (ca[1] + cb[1]) / 2];
        const rbIcon = L.divIcon({
          className: m.pinIconWrap,
          html: `<span class="${m.pinStatus} ${m.stStrong}" style="position:static;display:inline-block;">🚧 PCR BARRICADE</span>`,
          iconSize: [110, 20],
          iconAnchor: [55, 10],
        });
        L.marker(mid, { icon: rbIcon, interactive: false }).addTo(layer);
      }
    });

    // 2. Last-known-location red yarn trail (chronological pings with signal for Father)
    if (isF && g.pings.length > 0) {
      const sightingZones = [];
      for (let i = g.pings.length - 1; i >= 0; i -= 1) {
        const p = g.pings[i];
        if (p.result === "strong" || p.result === "weak") {
          if (sightingZones[sightingZones.length - 1] !== p.zone) {
            sightingZones.push(p.zone);
          }
        }
      }
      if (trace && sightingZones[sightingZones.length - 1] !== trace) {
        sightingZones.push(trace);
      }
      if (sightingZones.length >= 2) {
        const pts = sightingZones.map((id) => ZONE_COORDS[id]).filter(Boolean);
        L.polyline(pts, {
          color: "#b91c1c",
          weight: 2.2,
          opacity: 0.78,
          dashArray: "6 5",
        }).addTo(layer);
      }
    }

    // 3. Player-tied custom crimson yarn strings (between zones or custom notes)
    const coordById = { ...ZONE_COORDS };
    customPins.forEach((cp) => {
      coordById[cp.id] = [cp.lat, cp.lng];
    });
    customYarns.forEach((y) => {
      const ca = coordById[y.fromId];
      const cb = coordById[y.toId];
      if (!ca || !cb) return;
      L.polyline([ca, cb], { color: "#000", weight: 4, opacity: 0.42 }).addTo(layer);
      L.polyline([ca, cb], { color: "#b91c1c", weight: 2.3, opacity: 0.92 }).addTo(layer);
    });

    // 4. The 6 live Kolkata Zone 3D pushpins
    ZONE_IDS.forEach((id) => {
      const z = ZONES[id];
      const coords = ZONE_COORDS[id];
      const cleared = g.clearedZones.includes(id);
      const ping = latestPing[id];
      const here = !isF && g.suvZone === id;
      const isBarricadedDest =
        !isF &&
        rbA &&
        rbB &&
        ((rbA === g.suvZone && rbB === id) || (rbB === g.suvZone && rbA === id));
      const canGo = !isF && reachable.has(id) && mode === "reroute" && !isBarricadedDest;
      const isGhost = ghostZone === id;
      const vanHere = isF && g.raidInFlight?.zone === id;
      const missed = g.raids.some((r) => r.zone === id);
      const isTrace = trace === id;
      const isBlip = activeBlips.has(id);
      const isSelected = selected === id || yarnStartId === id;

      // Pin color reflects live status
      let base = "#b91c1c";
      let dark = "#691212";
      let hi = "#fca5a5";
      if (isBarricadedDest) {
        base = "#dc2626";
        dark = "#7f1d1d";
        hi = "#fca5a5";
      } else if (here || canGo) {
        base = "#16a34a";
        dark = "#14532d";
        hi = "#86efac";
      } else if (isGhost) {
        base = "#7c3aed";
        dark = "#4c1d95";
        hi = "#c4b5fd";
      } else if (cleared) {
        base = "#0e7490";
        dark = "#164e63";
        hi = "#67e8f9";
      } else if (ping?.result === "weak") {
        base = "#d97706";
        dark = "#78350f";
        hi = "#fde68a";
      } else if (ping?.result === "none") {
        base = "#475569";
        dark = "#1e293b";
        hi = "#cbd5e1";
      }

      // Status ribbon above pin
      let badgeHtml = "";
      if (isTrace) badgeHtml = `<span class="${m.pinStatus} ${m.stStrong}">🎯 SUV LIVE</span>`;
      else if (isBarricadedDest)
        badgeHtml = `<span class="${m.pinStatus} ${m.stStrong}">🚧 BLOCKED</span>`;
      else if (vanHere) badgeHtml = `<span class="${m.pinStatus} ${m.stVan}">🚓 PCR EN ROUTE</span>`;
      else if (here) badgeHtml = `<span class="${m.pinStatus} ${m.stSuv}">🚙 SUV HERE</span>`;
      else if (isGhost) badgeHtml = `<span class="${m.pinStatus} ${m.stGhost}">👻 GHOST</span>`;
      else if (cleared) badgeHtml = `<span class="${m.pinStatus} ${m.stCleared}">CLEARED</span>`;
      else if (ping?.result === "strong")
        badgeHtml = `<span class="${m.pinStatus} ${m.stStrong}">🔴 STRONG</span>`;
      else if (ping?.result === "weak")
        badgeHtml = `<span class="${m.pinStatus} ${m.stWeak}">🟠 NEARBY</span>`;
      else if (ping?.result === "none")
        badgeHtml = `<span class="${m.pinStatus} ${m.stNone}">NO SIGNAL</span>`;
      else if (missed) badgeHtml = `<span class="${m.pinStatus} ${m.stMiss}">✕ MISSED</span>`;

      let ringHtml = "";
      if (isTrace || ping?.result === "strong" || isBlip) {
        ringHtml = `<span class="${m.signalRing} ${m.ringRed}"></span>`;
      } else if (ping?.result === "weak") {
        ringHtml = `<span class="${m.signalRing} ${m.ringAmber}"></span>`;
      } else if (here || canGo) {
        ringHtml = `<span class="${m.signalRing} ${m.ringGreen}"></span>`;
      } else if (vanHere) {
        ringHtml = `<span class="${m.signalRing} ${m.ringCyan}"></span>`;
      }

      const classes = [
        m.zonePin,
        isSelected ? m.zonePinSel : "",
        canGo ? m.zonePinGo : "",
        isTrace ? m.zonePinTrace : "",
        cleared && !isSelected && !here ? m.zoneCleared : "",
      ]
        .filter(Boolean)
        .join(" ");

      const icon = L.divIcon({
        className: m.pinIconWrap,
        html: `
          <div class="${classes}">
            ${ringHtml}
            ${pinSvgHtml(base, dark, hi)}
            ${badgeHtml}
            <span class="${m.pinLabel}">${z.name}</span>
          </div>
        `,
        iconSize: [32, 36],
        iconAnchor: [12, 32],
      });

      const marker = L.marker(coords, { icon });
      marker.on("click", (ev) => {
        L.DomEvent.stopPropagation(ev);
        if (cbRef.current.yarnMode) {
          cbRef.current.onYarnNodeClick?.(id);
        } else {
          setOpenCustomPinId(null);
          cbRef.current.onSelect?.(id);
        }
      });
      marker.addTo(layer);
    });

    // 5. Player Custom Pinned Notes on the Kolkata Map
    customPins.forEach((cp) => {
      const isSel = openCustomPinId === cp.id || yarnStartId === cp.id;
      const icon = L.divIcon({
        className: m.pinIconWrap,
        html: `
          <div class="${m.zonePin} ${isSel ? m.zonePinSel : ""}">
            ${pinSvgHtml("#d97706", "#78350f", "#fde68a")}
            <span class="${m.pinLabel}">${cp.title}</span>
          </div>
        `,
        iconSize: [32, 36],
        iconAnchor: [12, 32],
      });
      const marker = L.marker([cp.lat, cp.lng], { icon });
      marker.on("click", (ev) => {
        L.DomEvent.stopPropagation(ev);
        if (cbRef.current.yarnMode) {
          cbRef.current.onYarnNodeClick?.(cp.id);
        } else {
          setOpenCustomPinId(cp.id);
        }
      });
      marker.addTo(layer);
    });
  }, [
    mapReady,
    isF,
    g.suvZone,
    g.clearedZones,
    g.pings,
    g.raids,
    g.raidInFlight,
    trace,
    ghostZone,
    recentBlipsKey,
    activePingsKey,
    roadblockKey,
    selected,
    mode,
    customPins,
    customYarns,
    yarnStartId,
    openCustomPinId,
  ]);

  const activeCustomPin = customPins.find((p) => p.id === openCustomPinId) || null;

  return (
    <div className={`${m.wrap} ${compact ? m.compact : ""}`}>
      <h2 className={m.kolkataTitle}>Kolkata</h2>

      {!compact && (
        <div className={m.topRight}>
          {pendingNote && (
            <button type="button" className={m.modePill} onClick={onCancelPendingNote}>
              Click Kolkata map to pin &ldquo;{pendingNote.title}&rdquo; · Cancel
            </button>
          )}
          {yarnMode && !pendingNote && (
            <button type="button" className={m.modePill} onClick={onExitYarnMode}>
              {yarnStartId ? "Click 2nd pin to tie yarn · Done" : "Click 1st pin to tie yarn · Done"}
            </button>
          )}
          <button
            type="button"
            className={m.recenterBtn}
            onClick={() => {
              sfx.radarPing();
              mapRef.current?.setView(MAP_CENTER, 13, { animate: true });
            }}
          >
            Recenter
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className={`${m.canvas} ${pendingNote ? m.crosshair : ""}`}
      />
      <div className={m.folds} aria-hidden="true" />
      <div className={m.vignette} aria-hidden="true" />

      {activeCustomPin && !pendingNote && (
        <aside className={m.noteSlip}>
          <div className={m.slipTop}>
            <span className={m.slipTag}>FIELD NOTE</span>
            <button
              type="button"
              className={m.slipClose}
              onClick={() => setOpenCustomPinId(null)}
              aria-label="Close note"
            >
              ×
            </button>
          </div>
          <h4 className={m.slipTitle}>{activeCustomPin.title}</h4>
          <p className={m.slipBody}>{activeCustomPin.note}</p>
          <div className={m.slipFoot}>
            <span>
              {activeCustomPin.lat.toFixed(4)}° N, {activeCustomPin.lng.toFixed(4)}° E
            </span>
            {onDeleteCustomPin && (
              <button
                type="button"
                className={m.deleteBtn}
                onClick={() => {
                  onDeleteCustomPin(activeCustomPin.id);
                  setOpenCustomPinId(null);
                }}
              >
                Delete note
              </button>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

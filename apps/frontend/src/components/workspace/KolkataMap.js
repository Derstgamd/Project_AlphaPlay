"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import styles from "./KolkataMap.module.css";

const KOLKATA_CENTER = [22.5726, 88.3639];

export function pinColorForTag(tag) {
  if (tag === "Last Seen") return "#b91c1c";
  if (tag === "Sighting") return "#b45309";
  if (tag === "Lead") return "#92400e";
  return "#cbd5e1";
}

export default function KolkataMap({
  pins,
  yarns,
  selectedPinId,
  onSelectPin,
  pendingNote,
  onPlacePendingNote,
  onCancelPendingNote,
  yarnMode,
  yarnStartId,
  onYarnPinClick,
  onExitYarnMode,
  onDeletePin,
  onSound,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersLayerRef = useRef(null);
  const pendingRef = useRef(null);
  const yarnModeRef = useRef(false);
  const onPlaceRef = useRef(onPlacePendingNote);
  const onYarnClickRef = useRef(onYarnPinClick);
  const onSelectRef = useRef(onSelectPin);

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    pendingRef.current = pendingNote;
  }, [pendingNote]);

  useEffect(() => {
    yarnModeRef.current = yarnMode;
  }, [yarnMode]);

  useEffect(() => {
    onPlaceRef.current = onPlacePendingNote;
    onYarnClickRef.current = onYarnPinClick;
    onSelectRef.current = onSelectPin;
  }, [onPlacePendingNote, onYarnPinClick, onSelectPin]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      leafletRef.current = L;
      const map = L.map(containerRef.current, {
        center: KOLKATA_CENTER,
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        minZoom: 11,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      map.on("click", (e) => {
        if (!pendingRef.current) return;
        onPlaceRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      setMapReady(true);
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !leafletRef.current || !markersLayerRef.current) return;
    const L = leafletRef.current;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    const pinById = Object.fromEntries(pins.map((p) => [p.id, p]));

    // Crimson yarn lines between connected pins
    yarns.forEach((y) => {
      const a = pinById[y.fromPinId];
      const b = pinById[y.toPinId];
      if (!a || !b) return;

      L.polyline(
        [
          [a.lat, a.lng],
          [b.lat, b.lng],
        ],
        { color: "#000000", weight: 4.5, opacity: 0.42 }
      ).addTo(layer);

      L.polyline(
        [
          [a.lat, a.lng],
          [b.lat, b.lng],
        ],
        { color: "#b91c1c", weight: 2.3, opacity: 0.92 }
      ).addTo(layer);
    });

    pins.forEach((pin) => {
      const isSelected = pin.id === selectedPinId;
      const isYarnOrigin = pin.id === yarnStartId;
      const baseColor = pin.color || pinColorForTag(pin.tag);
      const darkShade =
        baseColor === "#b45309"
          ? "#78350f"
          : baseColor === "#cbd5e1" || baseColor === "#e5e0d5"
            ? "#78716c"
            : "#691212";
      const highlight =
        baseColor === "#b45309"
          ? "#fcd34d"
          : baseColor === "#cbd5e1" || baseColor === "#e5e0d5"
            ? "#ffffff"
            : "#fca5a5";

      const icon = L.divIcon({
        className: styles.pinIconWrap,
        html: `
          <div class="${styles.pinMarker} ${
            isSelected || isYarnOrigin ? styles.pinMarkerActive : ""
          }">
            <svg class="${styles.pinSvg}" viewBox="0 0 38 42" width="34" height="38" aria-hidden="true">
              <!-- Pinhole shadow directly where steel needle pierces the map -->
              <circle cx="13" cy="35" r="2.2" fill="rgba(0,0,0,0.75)" />
              <!-- Cast shadow of shaft + pushpin head across map paper -->
              <path d="M13 35 L28 33 L35 37 L24 40 Z" fill="rgba(0,0,0,0.45)" />
              <ellipse cx="27" cy="36.5" rx="8" ry="3.8" fill="rgba(0,0,0,0.42)" />
              <!-- Steel needle piercing into map -->
              <line x1="13" y1="35" x2="18.5" y2="21.5" stroke="#475569" stroke-width="2.4" stroke-linecap="round" />
              <line x1="13.2" y1="34.6" x2="18.2" y2="21.8" stroke="#e2e8f0" stroke-width="1.1" stroke-linecap="round" />
              <!-- Lower collar flange -->
              <ellipse cx="19.5" cy="20.5" rx="7.2" ry="3.6" transform="rotate(18 19.5 20.5)" fill="${darkShade}" />
              <!-- Tapered neck -->
              <path d="M15.2 19.2 L18 11.5 L25.6 14 L23.4 21.8 Z" fill="${baseColor}" />
              <path d="M21 12.6 L25.6 14 L23.4 21.8 L19.8 20.6 Z" fill="${darkShade}" opacity="0.55" />
              <!-- Top sculpted domed cap -->
              <ellipse cx="22" cy="11.2" rx="8.8" ry="4.8" transform="rotate(18 22 11.2)" fill="${darkShade}" />
              <ellipse cx="22.4" cy="9.8" rx="8.6" ry="4.5" transform="rotate(18 22.4 9.8)" fill="${baseColor}" />
              <!-- Glossy specular highlight on pin head -->
              <ellipse cx="20.2" cy="8.4" rx="4.2" ry="1.7" transform="rotate(14 20.2 8.4)" fill="${highlight}" opacity="0.65" />
              <circle cx="18.2" cy="7.9" r="1.1" fill="#ffffff" opacity="0.85" />
            </svg>
            <span class="${styles.pinTag}">${pin.title}</span>
          </div>
        `,
        iconSize: [34, 38],
        iconAnchor: [12, 32],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon });
      marker.on("click", (ev) => {
        L.DomEvent.stopPropagation(ev);
        if (yarnModeRef.current) {
          onYarnClickRef.current?.(pin.id);
        } else {
          onSelectRef.current?.(pin.id);
        }
      });
      marker.addTo(layer);
    });
  }, [mapReady, pins, yarns, selectedPinId, yarnStartId]);

  const selectedPin = pins.find((p) => p.id === selectedPinId) || null;

  return (
    <div className={styles.mapSheet}>
      {/* Handwritten crimson "Kolkata" underlined twice directly on the map */}
      <h1 className={styles.kolkataHeading}>Kolkata</h1>

      {/* Floating minimal controls on map top-right */}
      <div className={styles.floatingControls}>
        {pendingNote && (
          <button
            type="button"
            className={styles.modePrompt}
            onClick={onCancelPendingNote}
          >
            Click map to pin &ldquo;{pendingNote.title}&rdquo; · Cancel
          </button>
        )}
        {yarnMode && !pendingNote && (
          <button
            type="button"
            className={styles.modePrompt}
            onClick={onExitYarnMode}
          >
            {yarnStartId
              ? "Click second pin to tie yarn · Done"
              : "Click first pin to start yarn · Done"}
          </button>
        )}
        <button
          type="button"
          className={styles.recenterBtn}
          title="Recenter on Kolkata"
          onClick={() =>
            mapRef.current?.setView(KOLKATA_CENTER, 13, { animate: true })
          }
        >
          Recenter
        </button>
      </div>

      {/* Interactive Leaflet OSM Canvas */}
      <div
        ref={containerRef}
        className={`${styles.mapCanvas} ${pendingNote ? styles.crosshair : ""}`}
      />

      {/* Subtle paper fold creases & edge shadow */}
      <div className={styles.mapFolds} aria-hidden="true" />
      <div className={styles.mapVignette} aria-hidden="true" />

      {/* Pinned Note Slip (all notes can be deleted) */}
      {selectedPin && !pendingNote && (
        <aside className={styles.noteSlip} aria-label="Pinned location note">
          <span
            className={styles.slipPin}
            style={{ background: selectedPin.color || pinColorForTag(selectedPin.tag) }}
          />
          <div className={styles.noteSlipTop}>
            <span className={styles.noteTag}>
              {selectedPin.tag} · {selectedPin.time}
            </span>
            <button
              type="button"
              className={styles.noteClose}
              onClick={() => onSelectPin(null)}
              aria-label="Close note"
            >
              ×
            </button>
          </div>
          <h3 className={styles.noteTitle}>{selectedPin.title}</h3>
          <p className={styles.noteBody}>{selectedPin.note}</p>
          <div className={styles.noteFoot}>
            <span className={styles.noteCoords}>
              {selectedPin.lat.toFixed(4)}° N, {selectedPin.lng.toFixed(4)}° E
            </span>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => {
                onSound?.(280, 0.08);
                onDeletePin(selectedPin.id);
                onSelectPin(null);
              }}
            >
              Delete note
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

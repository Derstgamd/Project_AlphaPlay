"use client";

import { useEffect, useState } from "react";
import { useCase } from "@/context/CaseContext";
import KolkataMap from "./workspace/KolkataMap";
import styles from "./WorkspaceScreen.module.css";

const START_MINUTES = 2 * 60 + 14; // 02:14 AM

function formatGameClock(totalMinutes) {
  const m = totalMinutes % (12 * 60);
  const hh = String(Math.floor(m / 60) || 12).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return { hh, mm };
}

function PinBundleArt() {
  return (
    <svg viewBox="0 0 150 90" className={styles.loosePinsSvg} aria-hidden="true">
      <defs>
        <filter id="tableShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        <radialGradient id="redCap" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="45%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>
        <radialGradient id="amberCap" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
        <radialGradient id="ivoryCap" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#faf7f0" />
          <stop offset="55%" stopColor="#c7bfb0" />
          <stop offset="100%" stopColor="#57534e" />
        </radialGradient>
      </defs>

      {/* Soft cast shadows directly on the bare wood table */}
      <g filter="url(#tableShadow)" opacity="0.72">
        <ellipse cx="42" cy="54" rx="16" ry="7" transform="rotate(-14 42 54)" fill="#000" />
        <ellipse cx="76" cy="46" rx="18" ry="8" transform="rotate(10 76 46)" fill="#000" />
        <ellipse cx="106" cy="60" rx="16" ry="7" transform="rotate(-8 106 60)" fill="#000" />
        <ellipse cx="64" cy="68" rx="14" ry="6" transform="rotate(18 64 68)" fill="#000" />
        <ellipse cx="96" cy="36" rx="14" ry="6" transform="rotate(-20 96 36)" fill="#000" />
      </g>

      {/* Steel needles resting on wood */}
      <line x1="34" y1="44" x2="14" y2="57" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="34" y1="43.5" x2="14" y2="56.5" stroke="#cbd5e1" strokeWidth="0.9" strokeLinecap="round" />

      <line x1="72" y1="36" x2="86" y2="16" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="72" y1="35.5" x2="86" y2="15.5" stroke="#cbd5e1" strokeWidth="0.9" strokeLinecap="round" />

      <line x1="108" y1="52" x2="132" y2="44" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="108" y1="51.5" x2="132" y2="43.5" stroke="#cbd5e1" strokeWidth="0.9" strokeLinecap="round" />

      <line x1="60" y1="62" x2="43" y2="76" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="61.5" x2="43" y2="75.5" stroke="#cbd5e1" strokeWidth="0.8" strokeLinecap="round" />

      <line x1="94" y1="31" x2="115" y2="23" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1="94" y1="30.5" x2="115" y2="22.5" stroke="#cbd5e1" strokeWidth="0.8" strokeLinecap="round" />

      {/* Pushpin 1 (Red, lying left) */}
      <ellipse cx="38" cy="43" rx="9" ry="7.5" transform="rotate(-18 38 43)" fill="url(#redCap)" />
      <ellipse cx="35" cy="40" rx="3" ry="1.6" transform="rotate(-24 35 40)" fill="#fca5a5" opacity="0.55" />

      {/* Pushpin 2 (Amber, upper right) */}
      <ellipse cx="92" cy="31" rx="8.5" ry="7.5" transform="rotate(14 92 31)" fill="url(#amberCap)" />
      <ellipse cx="89" cy="28.5" rx="2.6" ry="1.4" fill="#fde68a" opacity="0.55" />

      {/* Pushpin 3 (Hero Red, center) */}
      <ellipse cx="70" cy="40" rx="10.5" ry="9" transform="rotate(8 70 40)" fill="url(#redCap)" />
      <ellipse cx="66.5" cy="36.5" rx="3.4" ry="1.8" transform="rotate(-15 66.5 36.5)" fill="#fecaca" opacity="0.65" />

      {/* Pushpin 4 (Ivory, lower center) */}
      <ellipse cx="62" cy="60" rx="8" ry="7" transform="rotate(-10 62 60)" fill="url(#ivoryCap)" />
      <ellipse cx="59.5" cy="57.5" rx="2.5" ry="1.4" fill="#ffffff" opacity="0.8" />

      {/* Pushpin 5 (Red, right) */}
      <ellipse cx="104" cy="53" rx="9.5" ry="8.2" transform="rotate(20 104 53)" fill="url(#redCap)" />
      <ellipse cx="101" cy="50" rx="3" ry="1.6" fill="#fca5a5" opacity="0.55" />
    </svg>
  );
}

function YarnBallArt() {
  return (
    <svg viewBox="0 0 116 96" className={styles.looseYarnSvg} aria-hidden="true">
      <defs>
        <filter id="yarnShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
        <radialGradient id="yarnCore" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="55%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#2f0909" />
        </radialGradient>
      </defs>

      {/* Soft cast shadow on bare wooden table */}
      <ellipse cx="56" cy="70" rx="32" ry="14" fill="#000" opacity="0.72" filter="url(#yarnShadow)" />
      {/* Trailing strand shadow */}
      <path
        d="M72 62 Q94 64 98 76 Q100 84 88 86"
        fill="none"
        stroke="rgba(0,0,0,0.6)"
        strokeWidth="3.2"
        strokeLinecap="round"
        filter="url(#yarnShadow)"
      />
      {/* Loose trailing red yarn curling across wood */}
      <path
        d="M72 58 Q94 60 98 72 Q100 80 88 82"
        fill="none"
        stroke="#991b1b"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M72 58 Q94 60 98 72 Q100 80 88 82"
        fill="none"
        stroke="#dc2626"
        strokeWidth="1"
        strokeDasharray="3 4"
        strokeLinecap="round"
      />

      {/* Sculpted wound ball of yarn */}
      <circle cx="52" cy="46" r="28" fill="url(#yarnCore)" />
      <g fill="none" strokeLinecap="round">
        <path d="M28 36 Q52 22 76 38" stroke="#991b1b" strokeWidth="4" />
        <path d="M25 46 Q52 34 79 48" stroke="#b91c1c" strokeWidth="3.4" />
        <path d="M28 57 Q54 47 75 59" stroke="#7f1d1d" strokeWidth="3.8" />
        <path d="M36 22 Q46 46 36 70" stroke="#991b1b" strokeWidth="3.5" />
        <path d="M51 18 Q61 44 50 74" stroke="#b91c1c" strokeWidth="3.2" />
        <path d="M65 23 Q55 46 67 68" stroke="#7f1d1d" strokeWidth="3.4" />
        <path d="M31 30 Q54 52 72 62" stroke="#dc2626" strokeWidth="2.2" opacity="0.65" />
        <path d="M33 61 Q54 42 73 30" stroke="#ef4444" strokeWidth="1.4" opacity="0.35" />
      </g>
      {/* Subtle rim shade */}
      <circle cx="52" cy="46" r="28" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="2" />
    </svg>
  );
}

export default function WorkspaceScreen({ hostDevice }) {
  const {
    setActiveScreen,
    totalUnread,
    mapPins,
    mapYarns,
    addMapPin,
    deleteMapPin,
    addMapYarn,
    undoMapYarn,
  } = useCase();

  const [selectedPinId, setSelectedPinId] = useState(null);
  const [yarnMode, setYarnMode] = useState(false);
  const [yarnStartId, setYarnStartId] = useState(null);
  const [tick, setTick] = useState(0);

  // Field Notebook (write first, then attach to map)
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [pendingNote, setPendingNote] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 6000);
    return () => clearInterval(id);
  }, []);

  const { hh, mm } = formatGameClock(START_MINUTES + tick);
  const { detectedType, setOverrideType } = hostDevice;
  const deviceLabel =
    detectedType === "phone" ? "Adam's Phone" : "Adam's Laptop";

  const openMatchedDevice = () => {
    setOverrideType(null);
    setActiveScreen("device");
  };

  const canAttach = noteTitle.trim().length > 0 || noteBody.trim().length > 0;

  const handleArmAttach = () => {
    if (pendingNote) {
      setPendingNote(null);
      return;
    }
    if (!canAttach) return;
    setYarnMode(false);
    setYarnStartId(null);
    setPendingNote({
      title: noteTitle.trim() || "Field Note",
      note: noteBody.trim() || "Pinned from detective notebook.",
      tag: "Pin",
      color: "#b91c1c",
    });
  };

  const handlePlacePendingNote = ({ lat, lng }) => {
    if (!pendingNote) return;
    const created = addMapPin({
      lat,
      lng,
      title: pendingNote.title,
      note: pendingNote.note,
      tag: pendingNote.tag,
      color: pendingNote.color,
    });
    setPendingNote(null);
    setNoteTitle("");
    setNoteBody("");
    if (created) setSelectedPinId(created.id);
  };

  const handleToggleYarnMode = () => {
    setPendingNote(null);
    setYarnStartId(null);
    setYarnMode((v) => !v);
  };

  const handleYarnPinClick = (pinId) => {
    if (!yarnStartId) {
      setYarnStartId(pinId);
      return;
    }
    if (yarnStartId === pinId) {
      setYarnStartId(null);
      return;
    }
    addMapYarn(yarnStartId, pinId);
    setYarnStartId(null);
  };

  return (
    <div className={styles.tableSurface}>
      <div className={styles.tableVignette} aria-hidden="true" />

      <main className={styles.tableLayout}>
        {/* Folded Kolkata Map lying on the wooden table */}
        <KolkataMap
          pins={mapPins}
          yarns={mapYarns}
          selectedPinId={selectedPinId}
          onSelectPin={setSelectedPinId}
          pendingNote={pendingNote}
          onPlacePendingNote={handlePlacePendingNote}
          onCancelPendingNote={() => setPendingNote(null)}
          yarnMode={yarnMode}
          yarnStartId={yarnStartId}
          onYarnPinClick={handleYarnPinClick}
          onExitYarnMode={() => {
            setYarnMode(false);
            setYarnStartId(null);
          }}
          onDeletePin={deleteMapPin}
        />

        {/* Physical items on the right side of the wooden table */}
        <aside className={styles.tableTools} aria-label="Desk clock, pin and yarn tray, and notebook">
          {/* Small Digital Desk Clock for In-Game Time */}
          <div className={styles.digitalClock} aria-label={`In-game time ${hh}:${mm} AM`}>
            <div className={styles.clockFace}>
              <span className={styles.clockDigits}>
                {hh}
                <span className={styles.clockColon}>:</span>
                {mm}
              </span>
              <div className={styles.clockMeta}>
                <span>AM</span>
                <span>TUE</span>
              </div>
            </div>
          </div>

          {/* Loose Pushpins & Ball of Yarn lying directly on the bare wood table */}
          <div className={styles.loosePropsRow}>
            <button
              type="button"
              className={`${styles.looseObject} ${!yarnMode ? styles.looseObjectHeld : ""}`}
              title="Pushpins — write in the notebook and pin to map"
              aria-label="Pushpins"
              onClick={() => {
                setYarnMode(false);
                setYarnStartId(null);
              }}
            >
              <PinBundleArt />
            </button>

            <div className={styles.yarnSpotWrap}>
              <button
                type="button"
                className={`${styles.looseObject} ${yarnMode ? styles.looseObjectPicked : ""}`}
                title={
                  yarnMode
                    ? "Tying red yarn — click 2 pins on map"
                    : "Ball of red yarn — click to tie two pins"
                }
                aria-label="Ball of red yarn"
                onClick={handleToggleYarnMode}
              >
                <YarnBallArt />
              </button>
              {mapYarns.length > 0 && (
                <button
                  type="button"
                  className={styles.undoYarnBtn}
                  onClick={undoMapYarn}
                >
                  Undo yarn ({mapYarns.length})
                </button>
              )}
            </div>
          </div>

          {/* Physical Spiral Field Notebook lying directly on the wood table */}
          <div className={styles.notebookWrap}>
            <div className={styles.notebookRings} aria-hidden="true">
              {Array.from({ length: 11 }, (_, i) => (
                <span key={i} className={styles.ring} />
              ))}
            </div>

            <div className={styles.notebookPaper}>
              <div className={styles.notebookTop}>
                <span className={styles.notebookPinPreview}>
                  <i style={{ background: "#b91c1c" }} />
                  FIELD NOTE
                </span>
                {canAttach && !pendingNote && (
                  <button
                    type="button"
                    className={styles.clearNoteBtn}
                    onClick={() => {
                      setNoteTitle("");
                      setNoteBody("");
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              <input
                type="text"
                className={styles.notebookTitleInput}
                placeholder="Location / heading..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                disabled={Boolean(pendingNote)}
              />

              <textarea
                className={styles.notebookTextarea}
                placeholder="Write a note here, then pin it onto the Kolkata map..."
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                disabled={Boolean(pendingNote)}
              />

              <div className={styles.notebookFooter}>
                <button
                  type="button"
                  className={`${styles.attachBtn} ${
                    pendingNote ? styles.attachBtnArmed : ""
                  }`}
                  disabled={!canAttach && !pendingNote}
                  onClick={handleArmAttach}
                >
                  {pendingNote
                    ? "Click map to pin · Cancel"
                    : "Pin Note to Map"}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Subtle right-edge chevron to slide over to Adam's Laptop / Phone */}
      <button
        type="button"
        className={styles.deviceChevron}
        onClick={openMatchedDevice}
        aria-label={`Open ${deviceLabel}`}
        title={`Open ${deviceLabel}`}
      >
        {totalUnread > 0 && <span className={styles.chevronDot} />}
        <svg viewBox="0 0 24 48" width="22" height="44" aria-hidden="true">
          <path
            d="M6 8 L18 24 L6 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.chevronTooltip}>{deviceLabel}</span>
      </button>
    </div>
  );
}

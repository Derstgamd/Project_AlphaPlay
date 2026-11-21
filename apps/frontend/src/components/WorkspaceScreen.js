"use client";

import { useEffect, useRef, useState } from "react";
import { CASE_BRIEF } from "@/data/caseData";
import { useCase } from "@/context/CaseContext";
import { useAmbience } from "@/hooks/useAmbience";
import { PortraitArt } from "./BoardArtwork";
import KolkataMap from "./workspace/KolkataMap";
import DetectiveBoard from "./workspace/DetectiveBoard";
import Deskscape from "./workspace/Deskscape";
import { CaseFileModal, InspectModal } from "./workspace/WorkspaceModals";
import styles from "./WorkspaceScreen.module.css";

const START_MINUTES = 2 * 60 + 14; // 02:14 AM

const WALL_POLAROIDS = [
  {
    id: "adam",
    side: "left",
    title: "Adam",
    role: "Missing Person · Case #04",
    details: CASE_BRIEF.summary,
    variant: "adam",
    rot: "-3deg",
    clueId: "clue_ping",
  },
  {
    id: "rohan",
    side: "left",
    title: "Rohan",
    role: "Roommate & Co-Host",
    details:
      "Claimed he stayed home, but his messages on Adam's device tell a different story.",
    variant: "rohan",
    rot: "2.5deg",
    clueId: "clue_rohan_meet",
  },
  {
    id: "unknown",
    side: "right",
    title: "Unknown",
    role: "Burner Contact (404)",
    details:
      "Sent Adam a threat 12 minutes before the North Platform blackout. Identity unconfirmed.",
    variant: "unknown",
    rot: "-2deg",
    clueId: null,
  },
  {
    id: "kabir",
    side: "right",
    title: "Insp. Kabir",
    role: "Case Handler",
    details:
      "Mounted Adam's synced devices to your desk. Waiting for confirmation on the hidden drive.",
    variant: "kabir",
    rot: "3deg",
    clueId: null,
  },
];

function formatGameClock(totalMinutes) {
  const m = totalMinutes % (12 * 60);
  const hh = String(Math.floor(m / 60) || 12).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return { hh, mm };
}

export default function WorkspaceScreen({ hostDevice }) {
  const {
    setActiveScreen,
    clues,
    totalUnread,
    mapPins,
    mapYarns,
    addMapPin,
    deleteMapPin,
    addMapYarn,
    undoMapYarn,
    resetCase,
  } = useCase();

  const ambience = useAmbience();
  const sceneRef = useRef(null);

  const [lampOn, setLampOn] = useState(true);
  const [boardView, setBoardView] = useState("map"); // "map" | "web"
  const [tick, setTick] = useState(0);

  // Map pinning & yarn state
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [yarnMode, setYarnMode] = useState(false);
  const [yarnStartId, setYarnStartId] = useState(null);

  // Write-first Field Notebook state
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [pendingNote, setPendingNote] = useState(null);

  // Modals
  const [inspected, setInspected] = useState(null);
  const [caseOpen, setCaseOpen] = useState(false);

  const { detectedType, setOverrideType } = hostDevice;
  const deviceLabel =
    detectedType === "phone" ? "Adam's Phone" : "Adam's Laptop";
  const foundClues = new Set(clues.map((c) => c.id));
  const clockTime = formatGameClock(START_MINUTES + tick);
  const canAttach = noteTitle.trim().length > 0 || noteBody.trim().length > 0;

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setInspected(null);
        setCaseOpen(false);
        setNotebookOpen(false);
        setPendingNote(null);
        setYarnMode(false);
        setYarnStartId(null);
      }
      const tag = e.target?.tagName;
      if (
        (e.key === "l" || e.key === "L") &&
        tag !== "TEXTAREA" &&
        tag !== "INPUT"
      ) {
        setLampOn((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handlePointerMove = (e) => {
    const el = sceneRef.current;
    if (!el) return;
    el.style.setProperty("--mx", `${e.clientX}px`);
    el.style.setProperty("--my", `${e.clientY}px`);
  };

  const launchDevice = (targetType) => {
    ambience.tick(700, 0.12);
    setOverrideType(targetType === detectedType ? null : targetType);
    setActiveScreen("device");
  };

  const toggleLamp = () => {
    ambience.tick(240, 0.09);
    setLampOn((v) => !v);
  };

  const handleArmAttach = () => {
    if (pendingNote) {
      setPendingNote(null);
      return;
    }
    if (!canAttach) return;
    ambience.tick(580, 0.08);
    setBoardView("map");
    setYarnMode(false);
    setYarnStartId(null);
    setNotebookOpen(false);
    setPendingNote({
      title: noteTitle.trim() || "Field Note",
      note: noteBody.trim() || "Pinned from detective notebook.",
      tag: "Pin",
      color: "#b91c1c",
    });
  };

  const handlePlacePendingNote = ({ lat, lng }) => {
    if (!pendingNote) return;
    ambience.tick(340, 0.09);
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

  const handleToggleYarn = () => {
    ambience.tick(460, 0.08);
    setBoardView("map");
    setPendingNote(null);
    setNotebookOpen(false);
    setYarnStartId(null);
    setYarnMode((v) => !v);
  };

  const handleYarnPinClick = (pinId) => {
    ambience.tick(520, 0.07);
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

  const renderWallPolaroids = (side) =>
    WALL_POLAROIDS.filter((p) => p.side === side).map((p) => (
      <button
        key={p.id}
        type="button"
        className={styles.wallPolaroid}
        style={{ "--rot": p.rot }}
        onClick={() => {
          ambience.tick(620, 0.07);
          setInspected(p);
        }}
      >
        {p.clueId && foundClues.has(p.clueId) && (
          <span className={styles.clueDot} title="Clue verified" />
        )}
        <div className={styles.wallPhoto}>
          <PortraitArt variant={p.variant} />
        </div>
        <span className={styles.wallCaption}>{p.title}</span>
      </button>
    ));

  return (
    <div
      ref={sceneRef}
      className={`${styles.scene} ${lampOn ? styles.lampOn : styles.lampOff}`}
      onPointerMove={handlePointerMove}
    >
      {/* Minimal ambient corner controls */}
      <div className={styles.ambientControls}>
        <span className={styles.ambientTag}>{clues.length}/4 CLUES</span>
        <button type="button" className={styles.ambientBtn} onClick={toggleLamp}>
          Lamp {lampOn ? "on" : "off"} (L)
        </button>
        <button type="button" className={styles.ambientBtn} onClick={ambience.toggle}>
          Rain {ambience.enabled ? "on" : "off"}
        </button>
        <button type="button" className={styles.ambientBtn} onClick={resetCase}>
          Reset
        </button>
      </div>

      {/* Detective Room Wall */}
      <main className={styles.wall}>
        {/* Left Wall: Rainy Window + Pinned Polaroids */}
        <div className={styles.wallLeft}>
          <div className={styles.window} aria-hidden="true">
            <div className={styles.glass}>
              <span className={styles.rain} />
              <span className={`${styles.rain} ${styles.rainFar}`} />
              <span className={styles.lightning} />
            </div>
            <span className={styles.mullionV} />
            <span className={styles.mullionH} />
          </div>
          <div className={styles.polaroidColumn}>{renderWallPolaroids("left")}</div>
        </div>

        {/* Center Wooden-Framed Evidence Board (Kolkata Map by default, flippable to Suspect Web) */}
        <div className={styles.boardCenter}>
          {boardView === "map" ? (
            <div className={styles.mapBoardFrame}>
              <div className={styles.mapBoardInner}>
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
                  onSound={ambience.tick}
                />
              </div>
              <div className={styles.boardTray}>
                <button
                  type="button"
                  className={styles.traySwitch}
                  onClick={() => {
                    ambience.tick(420, 0.08);
                    setBoardView("web");
                  }}
                >
                  switch to suspect web
                </button>
                <span className={styles.chalkPiece} />
                <span className={`${styles.chalkPiece} ${styles.chalkPieceRed}`} />
                <span className={styles.eraser} />
              </div>
            </div>
          ) : (
            <div className={styles.webWrap}>
              <DetectiveBoard onInspect={setInspected} onSound={ambience.tick} />
              <button
                type="button"
                className={styles.backToMapBtn}
                onClick={() => {
                  ambience.tick(420, 0.08);
                  setBoardView("map");
                }}
              >
                ← back to Kolkata map
              </button>
            </div>
          )}
        </div>

        {/* Right Wall: Missing Poster + Pinned Polaroids */}
        <div className={styles.wallRight}>
          <div className={styles.wantedPoster} aria-hidden="true">
            <b>MISSING</b>
            <span>A. REYES</span>
            <small>{CASE_BRIEF.caseId}</small>
          </div>
          <div className={styles.polaroidColumn}>{renderWallPolaroids("right")}</div>
        </div>
      </main>

      {/* Detective's Wooden Desk */}
      <footer>
        <Deskscape
          lampOn={lampOn}
          clockTime={clockTime}
          notebookOpen={notebookOpen}
          hasDraftNote={canAttach}
          yarnMode={yarnMode}
          yarnCount={mapYarns.length}
          onToggleLamp={toggleLamp}
          onToggleNotebook={() => {
            ambience.tick(500, 0.07);
            setNotebookOpen((v) => !v);
          }}
          onSelectPins={() => {
            ambience.tick(520, 0.07);
            setYarnMode(false);
            setYarnStartId(null);
            setNotebookOpen(true);
          }}
          onToggleYarn={handleToggleYarn}
          onUndoYarn={() => {
            ambience.tick(300, 0.07);
            undoMapYarn();
          }}
          onOpenDevice={launchDevice}
          onOpenCase={() => {
            ambience.tick(500, 0.09);
            setCaseOpen(true);
          }}
          onInspect={(item) => {
            ambience.tick(600, 0.07);
            setInspected(item);
          }}
        />
      </footer>

      {/* Slide-up Write-First Field Notebook Sheet */}
      {notebookOpen && (
        <aside className={styles.notebookDrawer} aria-label="Field notebook">
          <div className={styles.notebookRings} aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={styles.ring} />
            ))}
          </div>
          <div className={styles.notebookPaper}>
            <div className={styles.notebookTop}>
              <span className={styles.notebookPinPreview}>
                <i />
                FIELD NOTEBOOK
              </span>
              <div className={styles.notebookTopBtns}>
                {canAttach && (
                  <button
                    type="button"
                    className={styles.nbTextBtn}
                    onClick={() => {
                      setNoteTitle("");
                      setNoteBody("");
                    }}
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  className={styles.nbCloseBtn}
                  onClick={() => setNotebookOpen(false)}
                  aria-label="Close notebook"
                >
                  ×
                </button>
              </div>
            </div>

            <input
              type="text"
              className={styles.notebookTitleInput}
              placeholder="Location / heading..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              autoFocus
            />

            <textarea
              className={styles.notebookTextarea}
              placeholder="Write your note first, then click Pin Note to Map..."
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
            />

            <div className={styles.notebookFooter}>
              <button
                type="button"
                className={styles.attachBtn}
                disabled={!canAttach}
                onClick={handleArmAttach}
              >
                Pin Note to Map
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Subtle right-edge chevron to slide over to host-matched device */}
      <button
        type="button"
        className={styles.deviceChevron}
        onClick={() => launchDevice(detectedType)}
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

      {/* Lamp & Cursor Flashlight Lighting */}
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {inspected && (
        <InspectModal item={inspected} onClose={() => setInspected(null)} />
      )}
      {caseOpen && <CaseFileModal onClose={() => setCaseOpen(false)} />}
    </div>
  );
}

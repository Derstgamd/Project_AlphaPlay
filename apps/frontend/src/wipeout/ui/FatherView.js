"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ZONES } from "../constants";
import { sfx } from "../sfx";
import { TASK_LIMIT_MS } from "../tasks";
import { cx } from "./common";
import f from "./FatherWorkspace.module.css";
import {
  MacCalculatorApp,
  MacCalendarApp,
  MacClockApp,
  MacMailApp,
  MacMusicApp,
  MacTerminalApp,
  MacTextEditApp,
  MacWeatherApp,
} from "./MacAppsExtra";
import {
  MacCholoMapApp,
  MacFaceTimeCallsApp,
  MacFinderApp,
  MacNotesApp,
  MacPhotosApp,
  MacPingMeApp,
  MacSafariApp,
  MacSettingsApp,
  MacVaultApp,
  WALLPAPERS,
} from "./MacCoreApps";
import m from "./MacDesktop.module.css";
import {
  ALL_LAUNCHPAD_APPS,
  AppleLogoSvg,
  BatteryIconSvg,
  ControlCenterIconSvg,
  DOCK_LEFT_APPS,
  MAC_APP_META,
  MacAppIcon,
  SpotlightIconSvg,
  WifiIconSvg,
} from "./MacIcons";
import MapBoard from "./MapBoard";
import s from "./wipeout.module.css";

function LoosePinsArt() {
  return (
    <svg viewBox="0 0 150 90" className={f.loosePinsSvg} aria-hidden="true">
      <defs>
        <filter id="fPinSh" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <radialGradient id="fRedCap" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="45%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>
        <radialGradient id="fAmberCap" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
        <radialGradient id="fIvoryCap" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#faf7f0" />
          <stop offset="55%" stopColor="#c7bfb0" />
          <stop offset="100%" stopColor="#57534e" />
        </radialGradient>
      </defs>
      <g filter="url(#fPinSh)" opacity="0.72">
        <ellipse cx="42" cy="54" rx="16" ry="7" transform="rotate(-14 42 54)" fill="#000" />
        <ellipse cx="76" cy="46" rx="18" ry="8" transform="rotate(10 76 46)" fill="#000" />
        <ellipse cx="106" cy="60" rx="16" ry="7" transform="rotate(-8 106 60)" fill="#000" />
        <ellipse cx="64" cy="68" rx="14" ry="6" transform="rotate(18 64 68)" fill="#000" />
      </g>
      <line x1="34" y1="44" x2="14" y2="57" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="72" y1="36" x2="86" y2="16" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="108" y1="52" x2="132" y2="44" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="60" y1="62" x2="43" y2="76" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="38" cy="43" rx="9" ry="7.5" transform="rotate(-18 38 43)" fill="url(#fRedCap)" />
      <ellipse cx="92" cy="31" rx="8.5" ry="7.5" transform="rotate(14 92 31)" fill="url(#fAmberCap)" />
      <ellipse cx="70" cy="40" rx="10.5" ry="9" transform="rotate(8 70 40)" fill="url(#fRedCap)" />
      <ellipse cx="62" cy="60" rx="8" ry="7" transform="rotate(-10 62 60)" fill="url(#fIvoryCap)" />
      <ellipse cx="104" cy="53" rx="9.5" ry="8.2" transform="rotate(20 104 53)" fill="url(#fRedCap)" />
    </svg>
  );
}

function LooseYarnArt() {
  return (
    <svg viewBox="0 0 116 96" className={f.looseYarnSvg} aria-hidden="true">
      <defs>
        <filter id="fYarnSh" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        <radialGradient id="fYarnCore" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="55%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#2f0909" />
        </radialGradient>
      </defs>
      <ellipse cx="56" cy="70" rx="32" ry="14" fill="#000" opacity="0.72" filter="url(#fYarnSh)" />
      <path d="M72 58 Q94 60 98 72 Q100 80 88 82" fill="none" stroke="#991b1b" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="52" cy="46" r="28" fill="url(#fYarnCore)" />
      <g fill="none" strokeLinecap="round">
        <path d="M28 36 Q52 22 76 38" stroke="#991b1b" strokeWidth="4" />
        <path d="M25 46 Q52 34 79 48" stroke="#b91c1c" strokeWidth="3.4" />
        <path d="M28 57 Q54 47 75 59" stroke="#7f1d1d" strokeWidth="3.8" />
        <path d="M36 22 Q46 46 36 70" stroke="#991b1b" strokeWidth="3.5" />
        <path d="M51 18 Q61 44 50 74" stroke="#b91c1c" strokeWidth="3.2" />
        <path d="M65 23 Q55 46 67 68" stroke="#7f1d1d" strokeWidth="3.4" />
        <path d="M31 30 Q54 52 72 62" stroke="#dc2626" strokeWidth="2.2" opacity="0.65" />
      </g>
    </svg>
  );
}

const DESKTOP_ITEMS = [
  { id: "machd", label: "Macintosh HD", kind: "drive", app: "files", arg: "Recents" },
  { id: "readme", label: "README_FOR_BABA.txt", kind: "doc", app: "textedit", arg: null },
  { id: "downloads", label: "Tender_404_Audit", kind: "folder", app: "files", arg: "Downloads" },
  {
    id: "photo2014",
    label: "IMG_2014.jpg",
    kind: "photo",
    thumb: "/photos/img-2014-suv.jpg",
    app: "gallery",
    arg: 0,
  },
];

export default function FatherView({
  run,
  tasks,
  currentTask,
  dualScores,
  mapGameState,
  onPassTask,
  onFailTask,
  muted,
  onToggleMute,
  onLeave,
}) {
  const { seed, phase, timeLeftMs, score, passedTasks } = run;
  const playing = phase === "playing";
  const taskNum = currentTask.num;

  // Starts cleanly on Riya's MacBook Home Screen (Desktop) with NO app window open!
  const [surface, setSurface] = useState("macbook"); // "macbook" | "workspace"
  const [wins, setWins] = useState({});
  const [focusedId, setFocusedId] = useState(null);
  const zRef = useRef(20);
  const dragRef = useRef(null);

  // macOS Shell UI state
  const [wallpaperId, setWallpaperId] = useState("sequoia");
  const [brightness, setBrightness] = useState(1);
  const [openMenu, setOpenMenu] = useState(null); // null | "apple" | "file" | "view" | "window" | "help" | "wifi" | "battery"
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState("");
  const [showLaunchpad, setShowLaunchpad] = useState(false);
  const [launchpadQuery, setLaunchpadQuery] = useState("");
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotifCenter, setShowNotifCenter] = useState(false);
  const [showAboutMac, setShowAboutMac] = useState(false);
  const [selectedDesktopId, setSelectedDesktopId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // null | { x, y }
  const [bouncingId, setBouncingId] = useState(null);
  const [btOn, setBtOn] = useState(true);
  const [airdropOn, setAirdropOn] = useState(true);

  // Core game state preserved across window opens/closes
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [selectedZone, setSelectedZone] = useState(() => seed.decoyZone || "saltlake");
  const [forwardedLogs, setForwardedLogs] = useState([]);

  // Optional Detective Desk (CholoMap Pinboard) state
  const [customPins, setCustomPins] = useState([]);
  const [customYarns, setCustomYarns] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [pendingNote, setPendingNote] = useState(null);
  const [yarnMode, setYarnMode] = useState(false);
  const [yarnStartId, setYarnStartId] = useState(null);

  const timeSec = (timeLeftMs / 1000).toFixed(1);
  const pctLeft = Math.max(0, Math.min(100, (timeLeftMs / TASK_LIMIT_MS) * 100));
  const timerDanger = playing && timeLeftMs <= 5000;
  const pinRecovered = passedTasks.includes(7);

  const activeWallpaper = WALLPAPERS.find((w) => w.id === wallpaperId) || WALLPAPERS[0];

  function dismissPopovers() {
    setOpenMenu(null);
    setShowControlCenter(false);
    setShowNotifCenter(false);
    setContextMenu(null);
  }

  const openApp = useCallback(
    (id, arg = null) => {
      dismissPopovers();
      setShowSpotlight(false);
      setShowLaunchpad(false);
      setSelectedDesktopId(null);

      if (id === "launchpad") {
        sfx.tap();
        setShowLaunchpad((v) => !v);
        setLaunchpadQuery("");
        return;
      }

      const targetId = id === "trash" ? "files" : id;
      const targetArg = id === "trash" ? "Trash" : arg;
      const meta = MAC_APP_META[targetId];
      if (!meta) return;

      if (targetId === "map") sfx.mapOpen();
      else sfx.appOpen();

      setBouncingId(id);
      setTimeout(() => {
        setBouncingId((cur) => (cur === id ? null : cur));
      }, 460);

      zRef.current += 1;
      const nextZ = zRef.current;
      setFocusedId(targetId);

      setWins((prev) => {
        const existing = prev[targetId];
        if (existing) {
          return {
            ...prev,
            [targetId]: {
              ...existing,
              min: false,
              z: nextZ,
              arg: targetArg !== null ? targetArg : existing.arg,
              argNonce: targetArg !== null ? (existing.argNonce || 0) + 1 : existing.argNonce || 0,
            },
          };
        }

        const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
        const vh = typeof window !== "undefined" ? window.innerHeight : 760;
        const [defW, defH] = meta.defaultSize || [820, 510];
        const safeTop = playing ? 112 : 34;
        const availH = Math.max(340, vh - 28 - safeTop - 88);
        const w = Math.min(defW, vw - 40);
        const h = Math.min(defH, availH);
        const count = Object.keys(prev).length;
        const offset = (count % 5) * 24;
        const x = Math.max(16, Math.round((vw - w) / 2) + offset - 20);
        const y = Math.max(safeTop, Math.round(safeTop + Math.max(0, (availH - h) / 2)) + offset / 2);

        return {
          ...prev,
          [targetId]: {
            x,
            y,
            w,
            h,
            z: nextZ,
            min: false,
            max: false,
            arg: targetArg,
            argNonce: 0,
          },
        };
      });
    },
    [playing]
  );

  const closeApp = useCallback((id) => {
    sfx.appClose();
    setWins((prev) => {
      const next = { ...prev };
      delete next[id];
      const remaining = Object.entries(next)
        .filter(([, w]) => !w.min)
        .sort((a, b) => b[1].z - a[1].z);
      setFocusedId(remaining[0]?.[0] || null);
      return next;
    });
  }, []);

  const patchWin = useCallback((id, change) => {
    setWins((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], ...change } } : prev));
  }, []);

  const focusWin = useCallback((id) => {
    zRef.current += 1;
    const nextZ = zRef.current;
    setFocusedId(id);
    setWins((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], z: nextZ } } : prev));
  }, []);

  const minimizeApp = useCallback((id) => {
    sfx.tap();
    setWins((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev, [id]: { ...prev[id], min: true } };
      const remaining = Object.entries(next)
        .filter(([, w]) => !w.min)
        .sort((a, b) => b[1].z - a[1].z);
      setFocusedId(remaining[0]?.[0] || null);
      return next;
    });
  }, []);

  // Keyboard shortcuts: Cmd/Ctrl+K for Spotlight, Cmd/Ctrl+W to close active window, Esc for overlays
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        sfx.tap();
        setShowSpotlight((v) => !v);
        setSpotlightQuery("");
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "w" && focusedId) {
        e.preventDefault();
        closeApp(focusedId);
      } else if (e.key === "Escape") {
        setShowSpotlight(false);
        setShowLaunchpad(false);
        setShowAboutMac(false);
        dismissPopovers();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusedId, closeApp]);

  // Smooth window dragging
  function startDrag(e, id) {
    if (wins[id]?.max) return;
    focusWin(id);
    dragRef.current = {
      id,
      sx: e.clientX,
      sy: e.clientY,
      ox: wins[id].x,
      oy: wins[id].y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function moveDrag(e) {
    const d = dragRef.current;
    if (!d) return;
    patchWin(d.id, {
      x: d.ox + e.clientX - d.sx,
      y: Math.max(6, d.oy + e.clientY - d.sy),
    });
  }

  function endDrag() {
    dragRef.current = null;
  }

  /* ────────── GAMEPLAY HANDLERS (100% preserved) ────────── */
  function handleForwardChatMessage(fromLabel, text, targetTaskNum) {
    if (!playing) return;
    if (targetTaskNum === taskNum) {
      sfx.forward();
      setForwardedLogs((prev) => [
        ...prev,
        { id: `fwd_${taskNum}_${Date.now()}`, from: fromLabel, text },
      ]);
      if (taskNum === 1) {
        onPassTask("Rohan's back-gate lure forwarded to Lalbazar!");
      } else if (taskNum === 4) {
        onPassTask("Ananya's Bypass Corridor warning forwarded to Lalbazar!");
      }
    } else if (taskNum === 1 || taskNum === 4) {
      onFailTask(
        "wrong",
        taskNum === 1
          ? "Wrong message forwarded — you needed Rohan's back-gate lure!"
          : "Wrong message forwarded — you needed Ananya's Bypass Corridor warning!"
      );
    } else {
      onFailTask(
        "wrong",
        `Wrong action in PingMe — follow your active Task ${taskNum} Lead!`
      );
    }
  }

  function handlePickNotePin(chosen) {
    if (!playing) return;
    if (taskNum === 7 && chosen === seed.vaultPin) {
      sfx.stamp();
      onPassTask(`BangoVault PIN ${seed.vaultPin} copied to your menu bar!`);
    } else if (taskNum === 7) {
      onFailTask(
        "wrong",
        `Wrong PIN logged (${chosen}) — Riya's note clearly listed ${seed.vaultPin}!`
      );
    } else {
      onFailTask("wrong", `Check your active Task ${taskNum} Lead first!`);
    }
  }

  function handleVaultPinSubmit(entered) {
    if (!playing) return;
    if (taskNum !== 9) {
      onFailTask("wrong", `BangoVault isn't active yet — follow Task ${taskNum} first!`);
      return;
    }
    if (entered === seed.vaultPin) {
      sfx.vaultUnlock();
      setVaultUnlocked(true);
    } else {
      onFailTask(
        "wrong",
        `Wrong BangoVault PIN (${entered}) — vault locked down! Correct PIN was ${seed.vaultPin}.`
      );
    }
  }

  function handleVaultTransmit(sendToPolice) {
    if (!playing) return;
    if (taskNum === 9 && sendToPolice) {
      sfx.forward();
      onPassTask(
        "★ MILESTONE 2/3: Tender #404 fraud dossier & Contractor ID sent to Lalbazar Police!"
      );
    } else {
      onFailTask(
        "wrong",
        "Saved locally instead of transmitting fraud info to the authorities!"
      );
    }
  }

  function handleDispatchRescue() {
    if (!playing) return;
    if (taskNum !== 10) {
      onFailTask(
        "wrong",
        `Premature PCR dispatch! Complete Task ${taskNum} (${currentTask.title}) before raiding.`
      );
      return;
    }
    if (selectedZone === seed.suvZone) {
      sfx.siren();
      onPassTask(
        `★ MILESTONE 3/3: PCR rescued Riya at ${ZONES[seed.suvZone].name}! WIPEOUT COMPLETE (3/3)!`
      );
    } else {
      sfx.siren();
      onFailTask(
        "wrong",
        `PCR raided ${ZONES[selectedZone].name} — empty streets! Riya's SUV was at ${ZONES[seed.suvZone].name}!`
      );
    }
  }

  // Optional Detective Desk notebook & yarn helpers
  const canAttach = noteTitle.trim().length > 0 || noteBody.trim().length > 0;

  function handleArmNotebookPin() {
    if (pendingNote) {
      setPendingNote(null);
      return;
    }
    if (!canAttach) return;
    sfx.paperFlip();
    setYarnMode(false);
    setYarnStartId(null);
    setPendingNote({
      title: noteTitle.trim() || "Last Seen",
      note: noteBody.trim() || "Marked on Kolkata map.",
    });
  }

  function handlePlacePin({ lat, lng }) {
    if (!pendingNote) return;
    sfx.pinDrop();
    setCustomPins((prev) => [
      ...prev,
      { id: `cp_${Date.now()}`, lat, lng, title: pendingNote.title, note: pendingNote.note },
    ]);
    setPendingNote(null);
    setNoteTitle("");
    setNoteBody("");
  }

  function handleDeleteCustomPin(id) {
    sfx.paperFlip();
    setCustomPins((prev) => prev.filter((p) => p.id !== id));
    setCustomYarns((prev) => prev.filter((y) => y.fromId !== id && y.toId !== id));
  }

  function handleYarnNodeClick(nodeId) {
    sfx.yarnTie();
    if (!yarnStartId) {
      setYarnStartId(nodeId);
      return;
    }
    if (yarnStartId === nodeId) {
      setYarnStartId(null);
      return;
    }
    setCustomYarns((prev) => {
      const exists = prev.some(
        (y) =>
          (y.fromId === yarnStartId && y.toId === nodeId) ||
          (y.fromId === nodeId && y.toId === yarnStartId)
      );
      if (exists) return prev;
      return [...prev, { id: `cy_${Date.now()}`, fromId: yarnStartId, toId: nodeId }];
    });
    setYarnStartId(null);
  }

  /* ═══════════════════════════════════════════════════════════
     OPTIONAL FULL-SCREEN DETECTIVE DESK (from CholoMap)
     ═══════════════════════════════════════════════════════════ */
  if (surface === "workspace") {
    return (
      <div className={cx(f.deskSurface, timerDanger && s.lastChance)}>
        <div className={f.deskVignette} aria-hidden="true" />

        {playing && (
          <div className={cx(f.taskBanner, currentTask.milestone && f.taskBannerMilestone)}>
            <div className={f.taskTopRow}>
              <div className={f.taskLeft}>
                <span className={f.taskNumPill}>TASK {currentTask.num} / 10</span>
                {currentTask.milestone && (
                  <span className={f.milestonePill}>★ GOAL {currentTask.num - 7} / 3</span>
                )}
                <span className={f.taskTitle}>{currentTask.title}</span>
              </div>
              <div className={f.taskRight}>
                <div className={cx(f.taskTimerBox, timerDanger && f.taskTimerDanger)}>
                  {timeSec}s
                </div>
              </div>
            </div>
            <p className={f.taskLead}>
              <b>LEAD:</b> {currentTask.lead}
            </p>
            <div className={f.taskBarTrack}>
              <span
                className={cx(f.taskBarFill, timerDanger && f.taskBarDanger)}
                style={{ width: `${pctLeft}%` }}
              />
            </div>
          </div>
        )}

        <div className={f.deskGrid}>
          <div className={f.mapColumn}>
            <div className={f.mapFrame}>
              <MapBoard
                g={mapGameState}
                now={0}
                role="father"
                selected={selectedZone}
                onSelect={(z) => {
                  sfx.pinDrop();
                  setSelectedZone(z);
                }}
                customPins={customPins}
                customYarns={customYarns}
                pendingNote={pendingNote}
                onPlacePendingNote={handlePlacePin}
                onCancelPendingNote={() => setPendingNote(null)}
                yarnMode={yarnMode}
                yarnStartId={yarnStartId}
                onYarnNodeClick={handleYarnNodeClick}
                onExitYarnMode={() => {
                  setYarnMode(false);
                  setYarnStartId(null);
                }}
                onDeleteCustomPin={handleDeleteCustomPin}
              />
            </div>

            <div className={f.deskTacticalBar}>
              <div className={f.zoneInfo}>
                <b style={{ fontSize: 16 }}>
                  Selected Zone: {ZONES[selectedZone]?.name}
                  {taskNum === 10 && selectedZone === seed.suvZone ? " · 🎯 LIVE SUV SIGNAL" : ""}
                </b>
                <small style={{ fontSize: 12.5 }}>
                  {ZONES[selectedZone]?.sub} · Click a Kolkata pushpin on the map, then dispatch PCR
                  Rescue!
                </small>
              </div>

              <div className={f.tacticalBtns}>
                <button
                  type="button"
                  className={cx(f.actionBtn, f.actionBtnDanger)}
                  style={{ padding: "11px 18px", fontSize: 15 }}
                  disabled={!playing}
                  onClick={handleDispatchRescue}
                >
                  🚓 DISPATCH PCR RESCUE ({ZONES[selectedZone]?.name.toUpperCase()})
                </button>
              </div>
            </div>
          </div>

          <aside className={f.toolsColumn}>
            <div className={f.clockUnit}>
              <div className={f.clockTopRow}>
                <span className={f.ledTimer}>{timeSec}s</span>
                <div className={f.ledMeta}>
                  <span>WIPEOUT · SUBIR</span>
                  <span>TASK {taskNum} / 10</span>
                </div>
              </div>
              <div className={f.ledStats}>
                <span className={f.ledChip}>SCORE {score}/3</span>
                <span className={f.ledChip}>ROHAN {dualScores.rohanBest}/3</span>
                <span className={f.ledChip}>WB-06-{seed.plateNum}</span>
              </div>
              <div className={f.clockActions}>
                <button
                  type="button"
                  className={f.tinyBtn}
                  onClick={() => {
                    sfx.appOpen();
                    setSurface("macbook");
                  }}
                >
                  ← Back to MacBook
                </button>
                <div style={{ display: "flex", gap: 5 }}>
                  <button type="button" className={f.tinyBtn} onClick={onToggleMute}>
                    {muted ? "🔇" : "🔊"}
                  </button>
                  <button type="button" className={f.tinyBtn} onClick={onLeave}>
                    Exit
                  </button>
                </div>
              </div>
            </div>

            <div className={f.looseRow}>
              <button
                type="button"
                className={f.looseObj}
                title="Pushpins — write in notebook to pin on Kolkata map"
                onClick={() => {
                  sfx.pinDrop();
                  setYarnMode(false);
                  setYarnStartId(null);
                }}
              >
                <LoosePinsArt />
              </button>
              <div className={f.yarnCol}>
                <button
                  type="button"
                  className={cx(f.looseObj, yarnMode && f.loosePicked)}
                  title={yarnMode ? "Click 2 pins on Kolkata map" : "Tie red yarn between pins"}
                  onClick={() => {
                    sfx.yarnTie();
                    setPendingNote(null);
                    setYarnStartId(null);
                    setYarnMode((v) => !v);
                  }}
                >
                  <LooseYarnArt />
                </button>
                {customYarns.length > 0 && (
                  <button
                    type="button"
                    className={f.undoYarn}
                    onClick={() => {
                      sfx.paperFlip();
                      setCustomYarns((prev) => prev.slice(0, -1));
                    }}
                  >
                    Undo ({customYarns.length})
                  </button>
                )}
              </div>
            </div>

            <div className={f.notebookWrap}>
              <div className={f.notebookRings} aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className={f.ring} />
                ))}
              </div>
              <div className={f.notebookPaper}>
                <div className={f.nbHead}>
                  <span>FIELD NOTEBOOK</span>
                  {canAttach && !pendingNote && (
                    <button
                      type="button"
                      className={f.nbClear}
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
                  className={f.nbTitle}
                  placeholder="Location / last seen..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  disabled={!!pendingNote}
                />
                <textarea
                  className={f.nbBody}
                  placeholder="Jot plate, PIN, or sighting, then pin to Kolkata map..."
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  disabled={!!pendingNote}
                />
                <div className={f.nbFoot}>
                  <button
                    type="button"
                    className={f.pinNoteBtn}
                    disabled={!canAttach && !pendingNote}
                    onClick={handleArmNotebookPin}
                  >
                    {pendingNote ? "Click map · Cancel" : "Pin Note to Map"}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     PRIMARY SCREEN — AUTHENTIC RIYA'S MACBOOK AIR (macOS Sequoia)
     ═══════════════════════════════════════════════════════════ */
  const activeMenuAppLabel = focusedId ? MAC_APP_META[focusedId]?.label || "Finder" : "Finder";

  const spotlightMatches = ALL_LAUNCHPAD_APPS.map((id) => MAC_APP_META[id]).filter(
    (app) =>
      !spotlightQuery.trim() ||
      app.label.toLowerCase().includes(spotlightQuery.toLowerCase()) ||
      app.subtitle.toLowerCase().includes(spotlightQuery.toLowerCase())
  );

  const launchpadMatches = ALL_LAUNCHPAD_APPS.map((id) => MAC_APP_META[id]).filter(
    (app) =>
      !launchpadQuery.trim() ||
      app.label.toLowerCase().includes(launchpadQuery.toLowerCase())
  );

  function renderAppBody(id, win) {
    switch (id) {
      case "pingme":
        return (
          <MacPingMeApp
            seed={seed}
            taskNum={taskNum}
            playing={playing}
            passedTasks={passedTasks}
            forwardedLogs={forwardedLogs}
            onForwardMessage={handleForwardChatMessage}
          />
        );
      case "calls":
        return (
          <MacFaceTimeCallsApp
            taskNum={taskNum}
            playing={playing}
            onPassTask={onPassTask}
            onFailTask={onFailTask}
          />
        );
      case "gallery":
        return (
          <MacPhotosApp
            key={`gallery-${win.argNonce || 0}`}
            initialPhotoIdx={typeof win.arg === "number" ? win.arg : 1}
            taskNum={taskNum}
            playing={playing}
            onPassTask={onPassTask}
            onFailTask={onFailTask}
          />
        );
      case "browser":
        return (
          <MacSafariApp
            seed={seed}
            taskNum={taskNum}
            playing={playing}
            onPassTask={onPassTask}
            onFailTask={onFailTask}
          />
        );
      case "files":
        return (
          <MacFinderApp
            key={`files-${win.argNonce || 0}`}
            initialFolder={typeof win.arg === "string" ? win.arg : "Recents"}
            taskNum={taskNum}
            playing={playing}
            onPassTask={onPassTask}
            onFailTask={onFailTask}
          />
        );
      case "notes":
        return (
          <MacNotesApp
            seed={seed}
            pinRecovered={pinRecovered}
            playing={playing}
            onPickPin={handlePickNotePin}
          />
        );
      case "settings":
        return (
          <MacSettingsApp
            taskNum={taskNum}
            playing={playing}
            onPassTask={onPassTask}
            onFailTask={onFailTask}
            wallpaperId={wallpaperId}
            onSelectWallpaper={setWallpaperId}
            brightness={brightness}
            onChangeBrightness={setBrightness}
            muted={muted}
            onToggleMute={onToggleMute}
          />
        );
      case "vault":
        return (
          <MacVaultApp
            playing={playing}
            isFocused={focusedId === "vault"}
            vaultUnlocked={vaultUnlocked}
            passedTasks={passedTasks}
            onSubmitPin={handleVaultPinSubmit}
            onTransmit={handleVaultTransmit}
          />
        );
      case "map":
        return (
          <MacCholoMapApp
            seed={seed}
            taskNum={taskNum}
            playing={playing}
            mapGameState={mapGameState}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            onDispatchRescue={handleDispatchRescue}
            onOpenDeskView={() => {
              sfx.mapOpen();
              setSurface("workspace");
            }}
          />
        );
      case "calculator":
        return <MacCalculatorApp />;
      case "terminal":
        return <MacTerminalApp seed={seed} />;
      case "mail":
        return <MacMailApp seed={seed} />;
      case "calendar":
        return <MacCalendarApp />;
      case "music":
        return <MacMusicApp />;
      case "weather":
        return <MacWeatherApp />;
      case "clock":
        return <MacClockApp />;
      case "textedit":
        return <MacTextEditApp />;
      default:
        return null;
    }
  }

  return (
    <div
      className={cx(m.macScreen, timerDanger && s.lastChance)}
      style={{ filter: brightness !== 1 ? `brightness(${brightness})` : undefined }}
      onPointerDown={() => {
        if (openMenu || contextMenu) {
          setOpenMenu(null);
          setContextMenu(null);
        }
      }}
    >
      {/* Authentic High-Res macOS Wallpaper */}
      <div className={m.macWallpaper} style={{ background: activeWallpaper.css }} aria-hidden="true" />

      {/* ───────────────────── 28px MACOS MENU BAR ───────────────────── */}
      <header
        className={m.menuBar}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className={m.menuLeft}>
          <button
            type="button"
            className={cx(m.menuTrigger, openMenu === "apple" && m.menuTriggerOpen)}
            aria-label="Apple menu"
            onClick={() => {
              sfx.tap();
              setOpenMenu((cur) => (cur === "apple" ? null : "apple"));
              setShowControlCenter(false);
              setShowNotifCenter(false);
            }}
          >
            <AppleLogoSvg size={13} />
          </button>

          <button
            type="button"
            className={cx(m.menuTrigger, m.menuAppName)}
            onClick={() => {
              sfx.tap();
              setOpenMenu((cur) => (cur === "file" ? null : "file"));
            }}
          >
            {activeMenuAppLabel}
          </button>

          {["File", "Edit", "View", "Window", "Help"].map((item) => {
            const key = item.toLowerCase();
            return (
              <button
                key={item}
                type="button"
                className={cx(
                  m.menuTrigger,
                  m.menuItemMuted,
                  openMenu === key && m.menuTriggerOpen
                )}
                onClick={() => {
                  sfx.tap();
                  setOpenMenu((cur) => (cur === key ? null : key));
                  setShowControlCenter(false);
                  setShowNotifCenter(false);
                }}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className={m.menuRight}>
          <span className={m.menuStatusPill} title="Suspect SUV & Score">
            <span>WB-06-{seed.plateNum}</span>
            <span>·</span>
            <span>{score}/3</span>
          </span>

          {pinRecovered && (
            <span className={m.menuPinPill} title="Recovered BangoVault PIN">
              PIN {seed.vaultPin}
            </span>
          )}

          <button
            type="button"
            className={cx(m.menuTrigger, openMenu === "wifi" && m.menuTriggerOpen)}
            title="Wi-Fi: Sen_Home_5G"
            onClick={() => {
              sfx.tap();
              setOpenMenu((cur) => (cur === "wifi" ? null : "wifi"));
              setShowControlCenter(false);
              setShowNotifCenter(false);
            }}
          >
            <WifiIconSvg size={14} />
          </button>

          <button
            type="button"
            className={cx(m.menuTrigger, openMenu === "battery" && m.menuTriggerOpen)}
            title="Battery: 64% (Charging)"
            onClick={() => {
              sfx.tap();
              setOpenMenu((cur) => (cur === "battery" ? null : "battery"));
              setShowControlCenter(false);
              setShowNotifCenter(false);
            }}
          >
            <span className={m.batteryPct}>64%</span>
            <BatteryIconSvg pct={64} charging />
          </button>

          <button
            type="button"
            className={m.menuTrigger}
            title="Spotlight Search (Ctrl+K)"
            aria-label="Spotlight Search"
            onClick={() => {
              sfx.tap();
              dismissPopovers();
              setShowSpotlight((v) => !v);
              setSpotlightQuery("");
            }}
          >
            <SpotlightIconSvg size={13} />
          </button>

          <button
            type="button"
            className={cx(m.menuTrigger, showControlCenter && m.menuTriggerOpen)}
            title="Control Center"
            aria-label="Control Center"
            onClick={() => {
              sfx.tap();
              setOpenMenu(null);
              setShowNotifCenter(false);
              setShowControlCenter((v) => !v);
            }}
          >
            <ControlCenterIconSvg size={14} />
          </button>

          <button
            type="button"
            className={cx(m.menuTrigger, m.menuClock, showNotifCenter && m.menuTriggerOpen)}
            title="Notification Center"
            onClick={() => {
              sfx.tap();
              setOpenMenu(null);
              setShowControlCenter(false);
              setShowNotifCenter((v) => !v);
            }}
          >
            Fri 20 Nov &nbsp;8:15 PM
          </button>
        </div>
      </header>

      {/* Menu Bar Dropdowns */}
      {openMenu === "apple" && (
        <div
          className={m.menuDropdown}
          style={{ left: 8 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              dismissPopovers();
              setShowAboutMac(true);
            }}
          >
            <span>About This Mac</span>
          </button>
          <div className={m.menuDropSep} />
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => openApp("settings")}
          >
            <span>System Settings…</span>
          </button>
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => openApp("launchpad")}
          >
            <span>Launchpad</span>
          </button>
          <div className={m.menuDropSep} />
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              dismissPopovers();
              setShowNotifCenter(true);
            }}
          >
            <span>Wipeout Case Briefing</span>
          </button>
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              dismissPopovers();
              onToggleMute();
            }}
          >
            <span>{muted ? "Unmute Audio" : "Mute Audio"}</span>
          </button>
          <div className={m.menuDropSep} />
          <button type="button" className={m.menuDropItem} onClick={onLeave}>
            <span>Log Out Riya Sen (Exit)</span>
          </button>
        </div>
      )}

      {openMenu === "file" && (
        <div
          className={m.menuDropdown}
          style={{ left: 86 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button type="button" className={m.menuDropItem} onClick={() => openApp("files")}>
            <span>New Finder Window</span>
            <small>⌘N</small>
          </button>
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              dismissPopovers();
              setShowSpotlight(true);
              setSpotlightQuery("");
            }}
          >
            <span>Find in Spotlight…</span>
            <small>⌘K</small>
          </button>
          <div className={m.menuDropSep} />
          <button
            type="button"
            className={m.menuDropItem}
            disabled={!focusedId}
            onClick={() => {
              dismissPopovers();
              if (focusedId) closeApp(focusedId);
            }}
          >
            <span>Close Window</span>
            <small>⌘W</small>
          </button>
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              dismissPopovers();
              sfx.appClose();
              setWins({});
              setFocusedId(null);
            }}
          >
            <span>Close All Windows</span>
          </button>
        </div>
      )}

      {openMenu === "edit" && (
        <div
          className={m.menuDropdown}
          style={{ left: 132 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button type="button" className={m.menuDropItem} onClick={() => openApp("notes")}>
            <span>Open Notes</span>
          </button>
          <button type="button" className={m.menuDropItem} onClick={() => openApp("textedit")}>
            <span>Open TextEdit</span>
          </button>
        </div>
      )}

      {openMenu === "view" && (
        <div
          className={m.menuDropdown}
          style={{ left: 174 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              const idx = WALLPAPERS.findIndex((w) => w.id === wallpaperId);
              setWallpaperId(WALLPAPERS[(idx + 1) % WALLPAPERS.length].id);
              dismissPopovers();
            }}
          >
            <span>Cycle Desktop Wallpaper</span>
          </button>
          <button type="button" className={m.menuDropItem} onClick={() => openApp("settings")}>
            <span>Wallpaper &amp; Display Settings…</span>
          </button>
        </div>
      )}

      {openMenu === "window" && (
        <div
          className={m.menuDropdown}
          style={{ left: 222 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={m.menuDropItem}
            disabled={!focusedId}
            onClick={() => {
              dismissPopovers();
              if (focusedId) minimizeApp(focusedId);
            }}
          >
            <span>Minimize</span>
            <small>⌘M</small>
          </button>
          <button
            type="button"
            className={m.menuDropItem}
            disabled={!focusedId}
            onClick={() => {
              dismissPopovers();
              if (focusedId && wins[focusedId]) {
                patchWin(focusedId, { max: !wins[focusedId].max });
              }
            }}
          >
            <span>Zoom / Full Window</span>
          </button>
          <div className={m.menuDropSep} />
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              dismissPopovers();
              setWins({});
              setFocusedId(null);
            }}
          >
            <span>Show Desktop (Home Screen)</span>
          </button>
        </div>
      )}

      {openMenu === "help" && (
        <div
          className={m.menuDropdown}
          style={{ left: 286 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              dismissPopovers();
              setShowNotifCenter(true);
            }}
          >
            <span>Wipeout 10-Task Rules</span>
          </button>
          <button type="button" className={m.menuDropItem} onClick={() => openApp("terminal")}>
            <span>Open Terminal Diagnostics</span>
          </button>
        </div>
      )}

      {openMenu === "wifi" && (
        <div
          className={m.menuDropdown}
          style={{ right: 170 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className={m.sideSection}>WI-FI · ON</div>
          <div className={m.menuDropItem}>
            <span>✓ Sen_Home_5G</span>
            <small>Connected</small>
          </div>
          <div className={m.menuDropSep} />
          <button type="button" className={m.menuDropItem} onClick={() => openApp("settings")}>
            <span>Wi-Fi Settings…</span>
          </button>
        </div>
      )}

      {openMenu === "battery" && (
        <div
          className={m.menuDropdown}
          style={{ right: 118 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className={m.sideSection}>BATTERY · 64%</div>
          <div className={m.sideRowMuted}>Power Source: Power Adapter</div>
          <div className={m.sideRowMuted}>Condition: Normal</div>
        </div>
      )}

      {/* ───────────────────── LIVE LALBAZAR DISPATCH BANNER (Active Run) ───────────────────── */}
      {playing && (
        <div
          className={cx(m.dispatchBanner, currentTask.milestone && m.dispatchBannerMilestone)}
          role="status"
          aria-live="polite"
        >
          <div className={m.dispatchTop}>
            <div className={m.dispatchLeft}>
              <span className={m.dispatchAppBadge}>TASK {currentTask.num} / 10</span>
              {currentTask.milestone && (
                <span className={m.dispatchGoalBadge}>★ GOAL {currentTask.num - 7} / 3</span>
              )}
              <span className={m.dispatchTitle}>{currentTask.title}</span>
            </div>

            <div className={cx(m.dispatchTimer, timerDanger && m.dispatchTimerDanger)}>
              {timeSec}s
            </div>
          </div>

          <p className={m.dispatchLead}>
            <b>LEAD:</b> {currentTask.lead}
          </p>

          <div className={m.dispatchBars}>
            <div className={m.timerTrack}>
              <span
                className={cx(m.timerFill, timerDanger && m.timerFillDanger)}
                style={{ width: `${pctLeft}%` }}
              />
            </div>
            <div className={m.stepPips} aria-label="10 task progress">
              {tasks.map((t) => {
                const done = passedTasks.includes(t.num);
                const nowStep = t.num === taskNum && phase !== "ended";
                return (
                  <span
                    key={t.num}
                    title={`Task ${t.num}: ${t.title}`}
                    className={cx(
                      m.stepPip,
                      t.milestone && m.stepPipGoal,
                      done && m.stepPipDone,
                      nowStep && m.stepPipNow
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────── MACBOOK HOME SCREEN (DESKTOP STAGE) ───────────────────── */}
      <main
        className={m.desktopStage}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedDesktopId(null);
            setFocusedId(null);
            dismissPopovers();
          }
        }}
        onContextMenu={(e) => {
          if (e.target !== e.currentTarget) return;
          e.preventDefault();
          dismissPopovers();
          setContextMenu({
            x: Math.min(e.clientX, window.innerWidth - 210),
            y: Math.min(e.clientY, window.innerHeight - 190),
          });
        }}
      >
        {/* Left: Authentic macOS Sonoma Desktop Widgets */}
        <section
          className={cx(m.widgetsCol, playing && m.widgetsColShifted)}
          aria-label="Desktop Widgets"
        >
          <button
            type="button"
            className={cx(m.widgetCard, m.wxWidget)}
            onClick={() => openApp("weather")}
          >
            <div className={m.wxWidgetTop}>
              <div>
                <div className={m.wxWidgetCity}>Salt Lake</div>
                <div className={m.wxWidgetTemp}>24°</div>
              </div>
              <span style={{ fontSize: 24 }}>🌙</span>
            </div>
            <div className={m.wxWidgetSub}>
              <span>Clear Night</span>
              <span>H:29° L:19°</span>
            </div>
          </button>

          <button
            type="button"
            className={m.widgetCard}
            onClick={() => openApp("calendar")}
          >
            <div className={m.calWidgetRow}>
              <div className={m.calWidgetDate}>
                <span className={m.calWidgetDay}>FRI</span>
                <span className={m.calWidgetNum}>20</span>
              </div>
              <div className={m.calWidgetEvents}>
                <div className={m.calWidgetEvent}>
                  Walk — Back Gate
                  <small>7:50 PM · Rohan</small>
                </div>
                <div className={m.calWidgetEvent} style={{ borderLeftColor: "#30d158" }}>
                  Dinner w/ Baba
                  <small>9:00 PM · Home</small>
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            className={m.widgetCard}
            onClick={() => openApp("settings")}
          >
            <div className={m.batWidgetRow}>
              <div className={m.batRingCell}>
                <span className={m.batRing}>64%</span>
                <span>MacBook</span>
              </div>
              <div className={m.batRingCell}>
                <span className={m.batRing} style={{ borderColor: "#64d2ff" }}>
                  94%
                </span>
                <span>LocketLink</span>
              </div>
              <div className={m.batRingCell}>
                <span className={m.batRing} style={{ borderColor: "#ff9f0a" }}>
                  {score}/3
                </span>
                <span>Case Goals</span>
              </div>
            </div>
          </button>
        </section>

        {/* Right: Classic macOS Desktop Icons */}
        <section
          className={cx(m.desktopFilesCol, playing && m.desktopFilesColShifted)}
          aria-label="Desktop Files"
        >
          {DESKTOP_ITEMS.map((item) => {
            const isSel = selectedDesktopId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={cx(m.desktopFileBtn, isSel && m.desktopFileSelected)}
                onClick={() => {
                  if (isSel) {
                    openApp(item.app, item.arg);
                  } else {
                    sfx.tap();
                    setSelectedDesktopId(item.id);
                  }
                }}
                onDoubleClick={() => openApp(item.app, item.arg)}
                title="Double-click to open"
              >
                {item.kind === "photo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumb} alt={item.label} className={m.desktopFilePhoto} />
                ) : (
                  <span className={m.desktopFileGlyph}>
                    {item.kind === "drive" ? "💽" : item.kind === "folder" ? "📁" : "📄"}
                  </span>
                )}
                <span className={m.desktopFileLabel}>{item.label}</span>
              </button>
            );
          })}
        </section>

        {/* Multi-Window macOS Application Windows */}
        {Object.entries(wins).map(([id, win]) => {
          const meta = MAC_APP_META[id];
          if (!meta || win.min) return null;
          const isFocused = focusedId === id;
          const maxTop = playing ? 104 : 0;
          const maxHeight = playing ? "calc(100% - 178px)" : "calc(100% - 76px)";

          return (
            <section
              key={id}
              aria-label={meta.label}
              className={cx(
                m.macWindow,
                !isFocused && m.macWindowUnfocused,
                win.max && m.macWindowMax
              )}
              style={{
                left: win.max ? 0 : win.x,
                top: win.max ? maxTop : win.y,
                width: win.max ? "100%" : win.w,
                height: win.max ? maxHeight : win.h,
                zIndex: win.z,
              }}
              onPointerDown={() => focusWin(id)}
            >
              <div
                className={m.winTitlebar}
                onPointerDown={(e) => startDrag(e, id)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onDoubleClick={() => patchWin(id, { max: !win.max })}
              >
                <div className={m.trafficLights} onPointerDown={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={cx(m.tlBtn, m.tlClose)}
                    aria-label={`Close ${meta.label}`}
                    title="Close"
                    onClick={() => closeApp(id)}
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    className={cx(m.tlBtn, m.tlMin)}
                    aria-label={`Minimize ${meta.label}`}
                    title="Minimize"
                    onClick={() => minimizeApp(id)}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className={cx(m.tlBtn, m.tlMax)}
                    aria-label={`Zoom ${meta.label}`}
                    title="Zoom"
                    onClick={() => {
                      sfx.tap();
                      patchWin(id, { max: !win.max });
                    }}
                  >
                    +
                  </button>
                </div>

                <div className={m.winTitleCenter}>
                  <span>{meta.label}</span>
                </div>

                <div className={m.winRightSpacer} />
              </div>

              <div className={m.winBody}>{renderAppBody(id, win)}</div>
            </section>
          );
        })}
      </main>

      {/* ───────────────────── AUTHENTIC MACOS DOCK ───────────────────── */}
      <footer className={m.dockAnchor}>
        <nav className={m.dockGlass} aria-label="MacBook Dock">
          {DOCK_LEFT_APPS.map((id) => {
            const meta = MAC_APP_META[id];
            const isOpen = !!wins[id];
            const hasAlertBadge = playing && currentTask.app === id;
            return (
              <button
                key={id}
                type="button"
                className={cx(m.dockItem, bouncingId === id && m.dockBouncing)}
                aria-label={meta.label}
                onClick={() => openApp(id)}
              >
                <span className={m.dockTooltip}>{meta.label}</span>
                <MacAppIcon id={id} size={46} />
                {hasAlertBadge && <span className={m.dockNotifBadge}>1</span>}
                {isOpen && <span className={m.dockRunningDot} />}
              </button>
            );
          })}

          <span className={m.dockDivider} aria-hidden="true" />

          <button
            type="button"
            className={cx(m.dockItem, bouncingId === "trash" && m.dockBouncing)}
            aria-label="Trash"
            onClick={() => openApp("trash")}
          >
            <span className={m.dockTooltip}>Trash</span>
            <MacAppIcon id="trash" size={46} />
          </button>
        </nav>
      </footer>

      {/* ───────────────────── SPOTLIGHT SEARCH ───────────────────── */}
      {showSpotlight && (
        <div
          className={m.spotlightBackdrop}
          onPointerDown={() => setShowSpotlight(false)}
        >
          <div
            className={m.spotlightModal}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className={m.spotlightInputRow}>
              <SpotlightIconSvg size={20} />
              <input
                className={m.spotlightInput}
                placeholder="Spotlight Search"
                value={spotlightQuery}
                onChange={(e) => setSpotlightQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && spotlightMatches[0]) {
                    openApp(spotlightMatches[0].id);
                  }
                }}
                autoFocus
              />
            </div>
            <div className={m.spotlightResults}>
              {spotlightMatches.slice(0, 7).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={m.spotlightRow}
                  onClick={() => openApp(item.id)}
                >
                  <MacAppIcon id={item.id} size={30} />
                  <div>
                    <b>{item.label}</b>
                    <small>{item.subtitle}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────── LAUNCHPAD OVERLAY ───────────────────── */}
      {showLaunchpad && (
        <div
          className={m.launchpadOverlay}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) setShowLaunchpad(false);
          }}
        >
          <input
            className={m.launchpadSearch}
            placeholder="Search Apps"
            value={launchpadQuery}
            onChange={(e) => setLaunchpadQuery(e.target.value)}
            autoFocus
          />
          <div className={m.launchpadGrid}>
            {launchpadMatches.map((item) => (
              <button
                key={item.id}
                type="button"
                className={m.launchpadItem}
                onClick={() => openApp(item.id)}
              >
                <MacAppIcon id={item.id} size={64} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────── CONTROL CENTER ───────────────────── */}
      {showControlCenter && (
        <aside
          className={m.controlCenter}
          aria-label="Control Center"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className={m.ccGrid}>
            <div className={m.ccCard}>
              <button
                type="button"
                className={m.ccToggleRow}
                onClick={() => openApp("settings")}
              >
                <span className={m.ccCircle}>📶</span>
                <div>
                  <b>Wi-Fi</b>
                  <small>Sen_Home_5G</small>
                </div>
              </button>
              <button
                type="button"
                className={m.ccToggleRow}
                onClick={() => {
                  sfx.tap();
                  setBtOn((v) => !v);
                }}
              >
                <span className={cx(m.ccCircle, !btOn && m.ccCircleOff)}>⌘</span>
                <div>
                  <b>Bluetooth</b>
                  <small>{btOn ? "On" : "Off"}</small>
                </div>
              </button>
              <button
                type="button"
                className={m.ccToggleRow}
                onClick={() => {
                  sfx.tap();
                  setAirdropOn((v) => !v);
                }}
              >
                <span className={cx(m.ccCircle, !airdropOn && m.ccCircleOff)}>◎</span>
                <div>
                  <b>AirDrop</b>
                  <small>{airdropOn ? "Contacts" : "Off"}</small>
                </div>
              </button>
            </div>

            <div className={m.ccCard} style={{ justifyContent: "space-between" }}>
              <button
                type="button"
                className={m.ccToggleRow}
                onClick={onToggleMute}
              >
                <span className={cx(m.ccCircle, muted && m.ccCircleOff)}>
                  {muted ? "🔇" : "🔊"}
                </span>
                <div>
                  <b>Audio</b>
                  <small>{muted ? "Muted" : "Active"}</small>
                </div>
              </button>
              <button
                type="button"
                className={m.ccToggleRow}
                onClick={() => openApp("music")}
              >
                <span className={m.ccCircle} style={{ background: "#fa233b" }}>
                  ♫
                </span>
                <div>
                  <b>Music</b>
                  <small>Kolkata Nights</small>
                </div>
              </button>
              <button
                type="button"
                className={m.ccToggleRow}
                onClick={onLeave}
              >
                <span className={m.ccCircle} style={{ background: "#ff453a" }}>
                  ⏻
                </span>
                <div>
                  <b>Exit Case</b>
                  <small>Lobby</small>
                </div>
              </button>
            </div>
          </div>

          <div className={m.ccCard}>
            <span className={m.ccSliderLabel}>Display ({Math.round(brightness * 100)}%)</span>
            <input
              type="range"
              min={0.45}
              max={1.1}
              step={0.05}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#ffffff" }}
            />
          </div>
        </aside>
      )}

      {/* ───────────────────── NOTIFICATION CENTER / RULES ───────────────────── */}
      {showNotifCenter && (
        <aside
          className={m.notifDrawer}
          aria-label="Notification Center"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className={m.notifDrawerHead}>
            <span>Lalbazar Case Briefing</span>
            <button
              type="button"
              className={m.macBtnSecondary}
              style={{ padding: "3px 8px", fontSize: 11 }}
              onClick={() => setShowNotifCenter(false)}
            >
              Done
            </button>
          </div>
          <div className={m.notifItem}>
            <b>Subir Best: {dualScores.fatherBest}/3 · Rohan Best: {dualScores.rohanBest}/3</b>
            10 sequential leads, 15.0s each. Close finished apps or switch directly via the Dock.
          </div>
          <div className={m.notifItem}>
            <b>Final /3 Milestones</b>
            Task 8: Stop Remote Delete (System Settings) · Task 9: Transmit Dossier (BangoVault) ·
            Task 10: Rescue Riya (CholoMap).
          </div>
          <div className={m.notifItem}>
            <b>Active Vehicle Plate</b>
            White SUV WB-06-{seed.plateNum} sighted leaving Salt Lake CK Block at 8:13 PM.
          </div>
        </aside>
      )}

      {/* ───────────────────── ABOUT THIS MAC MODAL ───────────────────── */}
      {showAboutMac && (
        <div
          className={m.spotlightBackdrop}
          onPointerDown={() => setShowAboutMac(false)}
        >
          <div
            className={m.spotlightModal}
            style={{ width: 340, padding: 22 }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className={m.aboutPane}>
              <div className={m.aboutLaptopGlyph}>💻</div>
              <h3>Riya&apos;s MacBook Air</h3>
              <p className={m.paneSub}>13-inch, M2, 2023</p>
              <div className={m.aboutSpecs}>
                <div>
                  <span>Chip</span>
                  <b>Apple M2</b>
                </div>
                <div>
                  <span>Memory</span>
                  <b>16 GB Unified</b>
                </div>
                <div>
                  <span>macOS</span>
                  <b>Sequoia 15.1</b>
                </div>
                <div>
                  <span>Owner</span>
                  <b>Riya Sen</b>
                </div>
              </div>
              <button
                type="button"
                className={m.macBtnPrimary}
                style={{ marginTop: 12 }}
                onClick={() => setShowAboutMac(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────── RIGHT-CLICK DESKTOP CONTEXT MENU ───────────────────── */}
      {contextMenu && (
        <div
          className={m.contextMenu}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button type="button" className={m.menuDropItem} onClick={() => openApp("launchpad")}>
            <span>Open Launchpad</span>
          </button>
          <button type="button" className={m.menuDropItem} onClick={() => openApp("terminal")}>
            <span>Open Terminal</span>
          </button>
          <div className={m.menuDropSep} />
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              const idx = WALLPAPERS.findIndex((w) => w.id === wallpaperId);
              setWallpaperId(WALLPAPERS[(idx + 1) % WALLPAPERS.length].id);
              dismissPopovers();
            }}
          >
            <span>Change Wallpaper…</span>
          </button>
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              dismissPopovers();
              setWins({});
              setFocusedId(null);
            }}
          >
            <span>Clean Up / Show Desktop</span>
          </button>
          <div className={m.menuDropSep} />
          <button
            type="button"
            className={m.menuDropItem}
            onClick={() => {
              dismissPopovers();
              setShowAboutMac(true);
            }}
          >
            <span>About This Mac</span>
          </button>
        </div>
      )}
    </div>
  );
}

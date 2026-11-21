"use client";

import { useEffect, useRef, useState } from "react";
import { CONTRACTOR_ID, ROHAN_NUMBER, ZONES } from "../constants";
import { sfx } from "../sfx";
import { TASK_LIMIT_MS } from "../tasks";
import { cx } from "./common";
import {
  BrowserApp,
  CallLogsApp,
  FilesApp,
  GalleryApp,
  SettingsApp,
} from "./ExtraLaptopApps";
import { GAME_APP_META, GameAppIcon, NINE_APP_IDS } from "./GameIcons";
import MapBoard from "./MapBoard";
import f from "./FatherWorkspace.module.css";
import s from "./wipeout.module.css";

function VaultKeypad({ playing, onSubmit }) {
  const [pin, setPin] = useState("");
  const pinRef = useRef("");
  const submitRef = useRef(onSubmit);

  useEffect(() => {
    submitRef.current = onSubmit;
  }, [onSubmit]);

  function updatePin(next) {
    pinRef.current = next;
    setPin(next);
  }

  function submitDigit(d) {
    if (!playing) return;
    sfx.keyPress();
    const next = (pinRef.current + d).slice(0, 4);
    updatePin(next);
    if (next.length === 4) {
      setTimeout(() => {
        submitRef.current(next);
        updatePin("");
      }, 120);
    }
  }

  // Allow fast desktop keyboard entry under the 15s cutoff
  useEffect(() => {
    if (!playing) return;
    function onKey(e) {
      if (e.key >= "0" && e.key <= "9") {
        submitDigit(e.key);
      } else if (e.key === "Backspace") {
        sfx.tap();
        updatePin(pinRef.current.slice(0, -1));
      } else if (e.key === "Escape") {
        sfx.tap();
        updatePin("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <div className={s.keypadWrap}>
      <div className={s.vaultBrand}>🔐 BANGOVAULT — TENDER #404 FRAUD DOSSIER</div>
      <div className={s.pinPrompt} style={{ fontSize: 15, color: "#cbd5e1" }}>
        ENTER 4-DIGIT PIN (CLICK OR TYPE ON KEYBOARD)
      </div>
      <div className={s.pinSlots}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cx(s.pinDot, pin[i] && s.pinDotFilled)}>
            {pin[i] || ""}
          </span>
        ))}
      </div>
      <div className={s.keypad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "⌫"].map((k) => (
          <button
            key={k}
            type="button"
            className={s.keyBtn}
            disabled={!playing}
            onClick={() => {
              if (k === "CLR") {
                sfx.tap();
                updatePin("");
              } else if (k === "⌫") {
                sfx.tap();
                updatePin(pinRef.current.slice(0, -1));
              } else {
                submitDigit(k);
              }
            }}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

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

  const [surface, setSurface] = useState("device"); // "device" | "workspace"
  const [app, setApp] = useState("pingme");
  const [chatId, setChatId] = useState("rohan");
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [selectedZone, setSelectedZone] = useState(() => seed.decoyZone || "saltlake");
  const [forwardedLogs, setForwardedLogs] = useState([]);
  const [showGuide, setShowGuide] = useState(false);

  // CholoMap custom marking state
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

  const ananyaUnlocked = taskNum >= 4 || passedTasks.includes(3);
  const gatebotUnlocked = taskNum >= 5 || passedTasks.includes(4);
  const pinRecovered = passedTasks.includes(7);

  function openDockApp(next) {
    if (next === "map") {
      sfx.mapOpen();
      setSurface("workspace");
      return;
    }
    sfx.appOpen();
    if (next === "pingme" && taskNum === 4) {
      setChatId("ananya");
    }
    setApp(next);
    setSurface("device");
  }

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
      onPassTask(`BangoVault PIN ${seed.vaultPin} copied to your case bar!`);
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

  // CholoMap notebook & yarn helpers
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

  const inTargetApp =
    (currentTask.app === "map" && surface === "workspace") ||
    (currentTask.app !== "map" && surface === "device" && app === currentTask.app);

  // Shared prominent 15s Task & Lead Banner (visible in both Laptop OS and CholoMap Workspace)
  const taskLeadBanner = (
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
          {!inTargetApp && playing && (
            <button
              type="button"
              className={f.taskJumpBtn}
              onClick={() => openDockApp(currentTask.app)}
            >
              Open {GAME_APP_META[currentTask.app]?.label} →
            </button>
          )}
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

      <div className={f.stepRow} aria-label="10 task progress">
        {tasks.map((t) => {
          const done = passedTasks.includes(t.num);
          const nowStep = t.num === taskNum && phase !== "ended";
          return (
            <span
              key={t.num}
              title={`Task ${t.num}: ${t.title}`}
              className={cx(
                f.stepDot,
                t.milestone && f.stepDotMilestone,
                done && f.stepDotDone,
                nowStep && f.stepDotNow
              )}
            />
          );
        })}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════
     CHOLOMAP WORKSPACE — Kolkata OpenStreetMap + Desk Tools
     ═══════════════════════════════════════════════════════════ */
  if (surface === "workspace") {
    return (
      <div className={cx(f.deskSurface, timerDanger && s.lastChance)}>
        <div className={f.deskVignette} aria-hidden="true" />
        {taskLeadBanner}

        <div className={f.deskGrid}>
          {/* Left: Folded Live Kolkata OpenStreetMap + PCR Rescue Dispatch Bar */}
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
                  {ZONES[selectedZone]?.sub} · Click a Kolkata pushpin on the map, then dispatch PCR Rescue!
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

          {/* Right: Digital Clock + Loose Pins & Yarn Ball + Spiral Notebook */}
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
                    setSurface("device");
                  }}
                >
                  ← Back to Laptop
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
                  title={yarnMode ? "Click 2 pins on Kolkata map" : "Ball of red yarn — click to tie two pins"}
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

        <button
          type="button"
          className={f.deviceChevron}
          aria-label="Back to Laptop UI"
          onClick={() => {
            sfx.appOpen();
            setSurface("device");
          }}
        >
          {currentTask.app !== "map" && <span className={f.chevronPulse} />}
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
          <span className={f.chevronTip}>Back to Laptop</span>
        </button>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     PRIMARY SCREEN — Riya's 9-App Laptop OS (Inspector Subir Sen)
     ═══════════════════════════════════════════════════════════ */
  const rohanChatMsgs = [
    {
      from: "them",
      time: "7:50 PM",
      text: "Near your block. 10-min walk? Need to clear my head. Meet me at the back garden gate — street lights are out, quieter there.",
      targetTask: 1,
      fromLabel: "Rohan",
    },
    {
      from: "me",
      time: "7:52 PM",
      text: "Ok! Coming down in 5 🙂",
      targetTask: null,
      fromLabel: "Riya",
    },
  ];

  const ananyaChatMsgs = [
    {
      from: "them",
      time: "7:05 PM",
      text: "Are you free for lunch at the canteen tomorrow?",
      targetTask: null,
      fromLabel: "Ananya (Dept)",
    },
    {
      from: "me",
      time: "7:14 PM",
      text: "Maybe after I finish the audit folder — showing Baba after dinner.",
      targetTask: null,
      fromLabel: "Riya",
    },
    {
      from: "them",
      time: "7:20 PM",
      text: "Careful. Someone on our floor tipped off the syndicate. Tender #404 is rigged — they run everything out of the Bypass corridor.",
      targetTask: 4,
      fromLabel: "Ananya (Dept)",
    },
  ];

  return (
    <div className={cx(f.laptopOs, timerDanger && s.lastChance)}>
      <header className={f.menuBar}>
        <div className={f.menuLeft}>
          <strong>WIPEOUT · Inspector Subir Sen</strong>
          <span className={f.menuMono}>WB-06-{seed.plateNum}</span>
          {pinRecovered && (
            <span
              className={f.menuMono}
              style={{ color: "#fde047", fontWeight: 800 }}
            >
              PIN: {seed.vaultPin}
            </span>
          )}
        </div>
        <div className={f.menuRight}>
          <span className={f.menuMono} style={{ color: "#7dd3fc", fontWeight: 800 }}>
            SUBIR: {score}/3 (BEST {dualScores.fatherBest}/3)
          </span>
          <span className={f.menuMono} style={{ color: "#fca5a5" }}>
            ROHAN: {dualScores.rohanBest}/3
          </span>
          <button type="button" className={f.menuBtn} onClick={() => openDockApp("map")}>
            🗺️ CholoMap {currentTask.app === "map" ? "●" : ""}
          </button>
          <button
            type="button"
            className={f.menuBtn}
            onClick={() => {
              sfx.paperFlip();
              setShowGuide((v) => !v);
            }}
          >
            ? Rules
          </button>
          <button type="button" className={f.menuBtn} onClick={onToggleMute}>
            {muted ? "🔇" : "🔊"}
          </button>
          <button type="button" className={f.menuBtn} onClick={onLeave}>
            Exit
          </button>
        </div>
      </header>

      {taskLeadBanner}

      <main className={f.osStage}>
        {app === null ? (
          <div className={f.desktopEmpty}>
            <div className={f.desktopIconGrid}>
              {NINE_APP_IDS.map((id) => {
                const isTarget = currentTask.app === id;
                return (
                  <button
                    key={id}
                    type="button"
                    className={f.desktopShortcut}
                    onClick={() => openDockApp(id)}
                  >
                    <GameAppIcon id={id} size={50} />
                    {isTarget && <span className={f.dockBadge}>!</span>}
                    <span>{GAME_APP_META[id].label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <section className={f.osWindow}>
            <div className={f.winBar}>
              <div className={f.lights}>
                <button
                  type="button"
                  className={f.lightRed}
                  aria-label="Close app"
                  title="Close app"
                  onClick={() => {
                    sfx.appClose();
                    setApp(null);
                  }}
                />
                <span className={f.lightAmber} />
                <span className={f.lightGreen} />
              </div>
              <span className={f.winTitle}>{GAME_APP_META[app]?.label}</span>
              <div className={f.winMeta}>
                <span>TASK {taskNum}/10</span>
                <button
                  type="button"
                  className={f.winCloseBtn}
                  onClick={() => {
                    sfx.appClose();
                    setApp(null);
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className={f.winContent}>
              {/* PINGME (Tasks 1 & 4) */}
              {app === "pingme" && (
                <>
                  <div className={s.chatTabs}>
                    <button
                      type="button"
                      className={cx(s.chatTab, chatId === "rohan" && s.chatTabOn)}
                      onClick={() => {
                        sfx.tabSwitch();
                        setChatId("rohan");
                      }}
                    >
                      Rohan
                      {taskNum === 1 && <i className={s.tabDot} />}
                    </button>
                    {ananyaUnlocked && (
                      <button
                        type="button"
                        className={cx(s.chatTab, chatId === "ananya" && s.chatTabOn)}
                        onClick={() => {
                          sfx.tabSwitch();
                          setChatId("ananya");
                        }}
                      >
                        Ananya (Dept)
                        {taskNum === 4 && <i className={s.tabDot} />}
                      </button>
                    )}
                    {gatebotUnlocked && (
                      <button
                        type="button"
                        className={cx(s.chatTab, chatId === "gatebot" && s.chatTabOn)}
                        onClick={() => {
                          sfx.tabSwitch();
                          setChatId("gatebot");
                        }}
                      >
                        GateBot
                      </button>
                    )}
                    <button
                      type="button"
                      className={cx(s.chatTab, chatId === "dispatch" && s.chatTabOn)}
                      onClick={() => {
                        sfx.tabSwitch();
                        setChatId("dispatch");
                      }}
                    >
                      Lalbazar ({forwardedLogs.length})
                    </button>
                  </div>

                  {chatId === "dispatch" ? (
                    <div className={s.chatBody}>
                      <div className={s.chatInfo}>
                        <b>Lalbazar Dispatch</b>
                        <span>Forwarded evidence trail</span>
                      </div>
                      <div className={s.msgList}>
                        <div className={cx(s.bubble, s.bubbleThem)}>
                          <p>
                            🚨 Remote wipe detected on Riya&apos;s laptop. Follow each 15-second lead
                            and forward key messages here!
                          </p>
                        </div>
                        {forwardedLogs.map((fwd) => (
                          <div key={fwd.id} className={cx(s.bubble, s.bubbleMe)}>
                            <div className={f.forwardedQuote}>↪ Forwarded from {fwd.from}</div>
                            <p>{fwd.text}</p>
                            <span className={s.bubbleTime}>Sent to Lalbazar</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : chatId === "gatebot" && gatebotUnlocked ? (
                    <div className={s.chatBody}>
                      <div className={s.chatInfo}>
                        <b>Salt Lake GateBot</b>
                        <span>Automated Security Camera · 8:13 PM</span>
                      </div>
                      <div className={s.msgList}>
                        <div className={cx(s.bubble, s.bubbleThem, s.bubbleLead)}>
                          <p>
                            ⚠️ BACK LANE CAM: White SUV <b>WB-06-{seed.plateNum}</b> sped out of CK
                            Block Back Gate at 8:13 PM.
                          </p>
                          <button
                            type="button"
                            className={f.forwardBtn}
                            onClick={() => openDockApp("browser")}
                          >
                            <span>🌐 Look up WB-06-{seed.plateNum} in Browser →</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    (() => {
                      const isAnanya = chatId === "ananya" && ananyaUnlocked;
                      const list = isAnanya ? ananyaChatMsgs : rohanChatMsgs;
                      return (
                        <div className={s.chatBody}>
                          <div className={s.chatInfo}>
                            <b>{isAnanya ? "Ananya (Dept)" : "Rohan Chatterjee"}</b>
                            <span>
                              {isAnanya
                                ? "Urban Dev. Dept · Last seen 7:20 PM"
                                : `${ROHAN_NUMBER} · Last seen 7:51 PM`}
                            </span>
                          </div>
                          <div className={s.msgList}>
                            {list.map((m, idx) => {
                              const alreadyPassed =
                                m.targetTask && passedTasks.includes(m.targetTask);
                              return (
                                <div
                                  key={idx}
                                  className={cx(
                                    s.bubble,
                                    m.from === "me" ? s.bubbleMe : s.bubbleThem,
                                    m.targetTask === taskNum && s.bubbleLead,
                                    alreadyPassed && s.bubbleSaved
                                  )}
                                >
                                  <p>{m.text}</p>
                                  <span className={s.bubbleTime}>{m.time}</span>
                                  {alreadyPassed ? (
                                    <div className={s.savedTag}>✅ FORWARDED TO LALBAZAR</div>
                                  ) : (
                                    <button
                                      type="button"
                                      className={f.forwardBtn}
                                      disabled={!playing}
                                      onClick={() =>
                                        handleForwardChatMessage(
                                          m.fromLabel,
                                          m.text,
                                          m.targetTask
                                        )
                                      }
                                    >
                                      <span>↪ Forward to Lalbazar</span>
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()
                  )}
                </>
              )}

              {/* QUICKNOTES (Task 7) */}
              {app === "notes" && (
                <div className={s.notesList}>
                  <div className={s.noteCard}>
                    <div className={s.noteTitle}>Tonight</div>
                    <p>Remind Baba about BP meds. Warm up dal before 9 PM.</p>
                  </div>
                  <div className={cx(s.noteCard, s.notePinCard)}>
                    <div className={s.noteTitle}>BangoVault Backup PIN</div>
                    <div className={s.pinBig}>{seed.vaultPin}</div>
                    <p className={s.pinSub} style={{ fontSize: 15 }}>
                      Click the matching 4-digit PIN below to lock it into your Case Clipboard:
                    </p>
                    {pinRecovered ? (
                      <div className={s.savedTag} style={{ fontSize: 14 }}>
                        ✅ PIN {seed.vaultPin} RECOVERED &amp; SAVED TO TOP BAR
                      </div>
                    ) : (
                      <div className={f.pinChoiceRow}>
                        {seed.pinChoices.map((choice) => (
                          <button
                            key={choice}
                            type="button"
                            className={f.pinChoiceBtn}
                            disabled={!playing}
                            onClick={() => handlePickNotePin(choice)}
                          >
                            {choice}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={s.noteCard}>
                    <div className={s.noteTitle}>Weird (Last Week)</div>
                    <p>
                      Linked my cloud backup to R&apos;s phone (<b>{ROHAN_NUMBER}</b>) &ldquo;for
                      safety&rdquo;?? Must revoke it in System right away.
                    </p>
                  </div>
                </div>
              )}

              {/* BANGOVAULT (Task 9 — ★ MILESTONE 2/3) */}
              {app === "vault" &&
                (!vaultUnlocked ? (
                  <VaultKeypad playing={playing} onSubmit={handleVaultPinSubmit} />
                ) : (
                  <div className={s.dossier}>
                    <div className={s.dossierStamp}>
                      GOVT OF WEST BENGAL — CONFIDENTIAL FRAUD AUDIT
                    </div>
                    <dl className={s.dossierGrid}>
                      <dt>Project</dt>
                      <dd style={{ fontSize: 16 }}>SECTOR V URBAN CORRIDOR // TENDER #404</dd>
                      <dt>Flagged Shell Firm</dt>
                      <dd style={{ fontSize: 16 }}>East-Bypass Infra Holdings (₹80 Cr Fraud)</dd>
                      <dt>Encrypted Contractor ID</dt>
                      <dd className={s.contractorId}>{CONTRACTOR_ID}</dd>
                    </dl>
                    {passedTasks.includes(9) ? (
                      <div className={s.uploadedBox}>
                        <div className={s.savedTag} style={{ fontSize: 14 }}>
                          ✅ MILESTONE 2/3 — FRAUD DOSSIER SENT TO LALBAZAR POLICE
                        </div>
                        <button
                          type="button"
                          className={s.jumpMapBtn}
                          onClick={() => openDockApp("map")}
                        >
                          OPEN CHOLOMAP TO SAVE RIYA →
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <button
                          type="button"
                          className={cx(f.actionBtn, f.actionBtnDanger)}
                          style={{ padding: "13px 16px", fontSize: 16 }}
                          disabled={!playing}
                          onClick={() => handleVaultTransmit(true)}
                        >
                          📡 TRANSMIT ALL FRAUD INFO TO LALBAZAR POLICE
                        </button>
                        <button
                          type="button"
                          className={f.actionBtn}
                          style={{ opacity: 0.85 }}
                          disabled={!playing}
                          onClick={() => handleVaultTransmit(false)}
                        >
                          💾 Save Local Draft Only
                        </button>
                      </div>
                    )}
                  </div>
                ))}

              {/* 5 EXTRA LAPTOP APPS (Tasks 2, 3, 5, 6, 8) */}
              {app === "gallery" && (
                <GalleryApp
                  taskNum={taskNum}
                  playing={playing}
                  onPassTask={onPassTask}
                  onFailTask={onFailTask}
                />
              )}
              {app === "calls" && (
                <CallLogsApp
                  taskNum={taskNum}
                  playing={playing}
                  onPassTask={onPassTask}
                  onFailTask={onFailTask}
                />
              )}
              {app === "browser" && (
                <BrowserApp
                  seed={seed}
                  taskNum={taskNum}
                  playing={playing}
                  onPassTask={onPassTask}
                  onFailTask={onFailTask}
                />
              )}
              {app === "files" && (
                <FilesApp
                  taskNum={taskNum}
                  playing={playing}
                  onPassTask={onPassTask}
                  onFailTask={onFailTask}
                />
              )}
              {app === "settings" && (
                <SettingsApp
                  taskNum={taskNum}
                  playing={playing}
                  onPassTask={onPassTask}
                  onFailTask={onFailTask}
                />
              )}
            </div>
          </section>
        )}
      </main>

      <footer className={f.dockWrap}>
        <nav className={f.dock} aria-label="Laptop Dock">
          {NINE_APP_IDS.map((id) => {
            const isTarget = currentTask.app === id;
            return (
              <button
                key={id}
                type="button"
                className={cx(f.dockItem, isTarget && f.dockItemTarget)}
                onClick={() => openDockApp(id)}
                aria-label={GAME_APP_META[id].label}
              >
                <span className={f.dockTip}>
                  {id === "map" ? "CholoMap (Kolkata Workspace)" : GAME_APP_META[id].label}
                </span>
                <GameAppIcon id={id} size={42} />
                {isTarget && <span className={f.dockBadge}>!</span>}
                {app === id && <span className={f.dockActiveDot} />}
              </button>
            );
          })}
        </nav>
      </footer>

      {showGuide && (
        <aside className={f.guideCard} aria-label="Wipeout rules">
          <div className={f.guideCardHead}>
            <span>WIPEOUT · INSPECTOR SUBIR SEN</span>
            <button type="button" className={f.winCloseBtn} onClick={() => setShowGuide(false)}>
              ✕
            </button>
          </div>
          <ul className={f.guideList}>
            <li>
              <b>10 Tasks, 15s Each:</b> Complete every lead one by one before the 15.0s timer runs
              out.
            </li>
            <li>
              <b>Zero Margin for Error:</b> Any wrong action or timeout restarts from scratch (as
              Subir or Rohan).
            </li>
            <li>
              <b>Final /3 Score:</b> Task 8 stops Remote Delete (1/3), Task 9 sends Fraud Info to
              Police (2/3), Task 10 frees Riya on CholoMap (3/3).
            </li>
          </ul>
        </aside>
      )}
    </div>
  );
}

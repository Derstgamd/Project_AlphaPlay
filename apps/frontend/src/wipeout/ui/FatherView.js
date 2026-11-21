"use client";

import { useEffect, useState } from "react";
import {
  ABORT_TAPS,
  CD,
  CHATS,
  CONTRACTOR_ID,
  HOLD_MS,
  LAST_CHANCE_MS,
  LEADS,
  ZONES,
} from "../constants";
import {
  cdLeft,
  fictionClock,
  inFinal,
  isCyberLocked,
  leadOpen,
  leadsSent,
  raidBlock,
  timeLeftMs,
  traceActive,
  wipePct,
} from "../engine";
import { sfx } from "../sfx";
import { CdButton, cx, HoldButton, mmss, secs } from "./common";
import { GAME_APP_META, GameAppIcon } from "./GameIcons";
import MapBoard from "./MapBoard";
import f from "./FatherWorkspace.module.css";
import s from "./wipeout.module.css";

function AbortPopup({ endsAt, now, onCleared }) {
  const [taps, setTaps] = useState(0);
  const left = Math.max(0, endsAt - now);
  const rem = Math.max(0, ABORT_TAPS - taps);

  function hit() {
    sfx.tap();
    const next = taps + 1;
    setTaps(next);
    if (next >= ABORT_TAPS) {
      sfx.good();
      onCleared();
    }
  }

  return (
    <div className={s.popupOverlay}>
      <div className={cx(s.popupCard, s.popupDanger)}>
        <div className={s.popupIcon}>⚙️</div>
        <h3>FACTORY RESET ACCELERATING…</h3>
        <p>Tap ABORT WIPE {ABORT_TAPS} times fast or lose 5 seconds!</p>
        <div className={s.popupBar}>
          <span style={{ width: `${Math.min(100, (left / 3000) * 100)}%` }} />
        </div>
        <button type="button" className={s.abortBtn} onClick={hit}>
          ABORT WIPE ({rem} LEFT)
        </button>
      </div>
    </div>
  );
}

function FakeCallPopup({ endsAt, now, onDecline }) {
  const left = Math.max(0, endsAt - now);
  return (
    <div className={s.popupOverlay}>
      <div className={cx(s.popupCard, s.popupCall)}>
        <div className={s.callTag}>INCOMING CALL · SPAM RISK</div>
        <div className={s.callNum}>+91 70440-81924</div>
        <div className={s.callSub}>Unknown burner · auto-drops in {secs(left)}</div>
        <button
          type="button"
          className={s.declineBtn}
          onClick={() => {
            sfx.tap();
            onDecline();
          }}
        >
          📵 SWIPE / TAP TO DECLINE
        </button>
      </div>
    </div>
  );
}

function VaultKeypad({ onSubmit }) {
  const [pin, setPin] = useState("");

  function press(d) {
    sfx.tap();
    const next = (pin + d).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      onSubmit(next);
      setTimeout(() => setPin(""), 220);
    }
  }

  return (
    <div className={s.keypadWrap}>
      <div className={s.vaultBrand}>🔐 BANGOVAULT — DEPT AUDIT</div>
      <div className={s.pinPrompt}>ENTER 4-DIGIT DEPT PIN (CHECK QUICKNOTES)</div>
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
            onClick={() => {
              if (k === "CLR") setPin("");
              else if (k === "⌫") setPin((p) => p.slice(0, -1));
              else press(k);
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
  g,
  now,
  dispatch,
  muted,
  onToggleMute,
  onLeave,
}) {
  // Always start on Laptop OS ("device") with Messages open; clicking CholoMap opens Workspace ("workspace")
  const [surface, setSurface] = useState("device"); // "device" | "workspace"
  const [app, setApp] = useState("pingme"); // null | "pingme" | "notes" | "vault"
  const [chatId, setChatId] = useState("rohan"); // "rohan" | "ananya" | "gatebot" | "dispatch"
  const [notesSeen, setNotesSeen] = useState(false);
  const [selectedZone, setSelectedZone] = useState("sectorv");
  const [visibleCountByChat, setVisibleCountByChat] = useState({ rohan: 1, ananya: 0, gatebot: 0 });
  const [forwardedLogs, setForwardedLogs] = useState([]);

  // Kolkata map marking state (custom notes + red yarn strings on the CholoMap Workspace)
  const [customPins, setCustomPins] = useState([]);
  const [customYarns, setCustomYarns] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [pendingNote, setPendingNote] = useState(null);
  const [yarnMode, setYarnMode] = useState(false);
  const [yarnStartId, setYarnStartId] = useState(null);

  const tl = timeLeftMs(g, now);
  const pct = wipePct(g, now);
  const sent = leadsSent(g);
  const final = inFinal(g, now);
  const last10 = tl <= LAST_CHANCE_MS;
  const paused = !!g.popup;

  const activeOw = ["lead1", "lead2"].find((k) => g.leads[k].status === "overwriting");
  const trace = traceActive(g, now);
  const locked = isCyberLocked(g, now);

  // Progressive chat unlock: start with ONLY Rohan, then unlock Ananya -> GateBot one by one
  const lead1Done = g.leads.lead1.status === "saved" || g.leads.lead1.status === "deleted";
  const lead2Done = g.leads.lead2.status === "saved" || g.leads.lead2.status === "deleted";
  const ananyaUnlocked = lead1Done || g.leads.lead2.status === "overwriting";
  const gatebotUnlocked = lead2Done;

  const availableChatIds = [
    "rohan",
    ...(ananyaUnlocked ? ["ananya"] : []),
    ...(gatebotUnlocked ? ["gatebot"] : []),
  ];

  // Drip messages into the active chat one by one so conversations unfold naturally
  useEffect(() => {
    if (chatId === "dispatch" || !CHATS[chatId]) return;
    const total = CHATS[chatId].messages.length;
    const shown = visibleCountByChat[chatId] || 0;
    if (shown >= total) return;
    const t = setTimeout(() => {
      setVisibleCountByChat((prev) => ({
        ...prev,
        [chatId]: Math.min(total, (prev[chatId] || 0) + 1),
      }));
    }, shown === 0 ? 250 : 650);
    return () => clearTimeout(t);
  }, [chatId, visibleCountByChat]);

  function handleForwardLead(leadKey, quoteText) {
    if (g.status !== "playing") return;
    sfx.good();
    dispatch({ type: "sendLead", lead: leadKey });
    setForwardedLogs((prev) => [
      ...prev,
      {
        id: `fwd_${leadKey}_${Date.now()}`,
        from: leadKey === "lead1" ? "Rohan" : "Ananya (Dept)",
        text: quoteText,
        time: fictionClock(g, now),
      },
    ]);
  }

  const chatsOpen = !g.pingmePurged && (leadOpen(g.leads.lead1) || leadOpen(g.leads.lead2));
  const badgePingMe = chatsOpen || !!activeOw;
  const badgeNotes = !chatsOpen && !g.notesPurged && !g.vaultUnlocked && g.leads.lead3.status === "active" && !notesSeen;
  const badgeVault = !chatsOpen && (notesSeen || g.notesPurged) && g.leads.lead3.status === "active";
  const badgeMap = sent >= 1 || trace;
  const deviceNeedsAttention = badgePingMe || badgeNotes || badgeVault;

  const pingCd = cdLeft(g, "ping", now);
  const pingTotal = final ? CD.pingFinal : CD.ping;
  const lockCd = cdLeft(g, "cyberLock", now);
  const rBlock = raidBlock(g, now);

  const mapSelected = trace && g.suvZone ? g.suvZone : selectedZone;
  const selPing = g.pings.find((p) => p.zone === mapSelected);
  const canAttach = noteTitle.trim().length > 0 || noteBody.trim().length > 0;

  // Live dispatch messages feed ("everything comes as a message")
  const dispatchMessages = (g.events || [])
    .filter((e) => e.to === "father" || e.to === "both")
    .slice(-20);

  function openDockApp(next) {
    sfx.tap();
    if (next === "map") {
      setSurface("workspace");
      return;
    }
    if (next === "notes") setNotesSeen(true);
    setApp(next);
    setSurface("device");
  }

  function handleArmNotebookPin() {
    if (pendingNote) {
      setPendingNote(null);
      return;
    }
    if (!canAttach) return;
    sfx.tap();
    setYarnMode(false);
    setYarnStartId(null);
    setPendingNote({
      title: noteTitle.trim() || "Last Seen",
      note: noteBody.trim() || "Marked on Kolkata map.",
    });
  }

  function handlePlacePin({ lat, lng }) {
    if (!pendingNote) return;
    sfx.tap();
    setCustomPins((prev) => [
      ...prev,
      { id: `cp_${Date.now()}`, lat, lng, title: pendingNote.title, note: pendingNote.note },
    ]);
    setPendingNote(null);
    setNoteTitle("");
    setNoteBody("");
  }

  function handleDeleteCustomPin(id) {
    sfx.tap();
    setCustomPins((prev) => prev.filter((p) => p.id !== id));
    setCustomYarns((prev) => prev.filter((y) => y.fromId !== id && y.toId !== id));
  }

  function handleYarnNodeClick(nodeId) {
    sfx.tap();
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

  const urgentBanners = (
    <>
      {activeOw && (
        <button
          type="button"
          className={cx(s.urgentBar, s.urgentRed)}
          onClick={() => {
            sfx.tap();
            setChatId(activeOw === "lead1" ? "rohan" : "ananya");
            openDockApp("pingme");
          }}
        >
          <span>
            ⚠️ OVERWRITING &ldquo;{LEADS[activeOw].title}&rdquo; — {secs(g.leads[activeOw].overwriteEndsAt - now)}
          </span>
          <b>RACE →</b>
        </button>
      )}
      {trace && surface !== "workspace" && (
        <button
          type="button"
          className={cx(s.urgentBar, s.urgentBlue)}
          onClick={() => openDockApp("map")}
        >
          <span>🎯 FULL TRACE LIVE ({secs(g.traceUntil - now)}) — SUV PINPOINTED!</span>
          <b>CHOLOMAP →</b>
        </button>
      )}
      {g.raidInFlight && (
        <div className={cx(s.urgentBar, s.urgentBlue)}>
          <span>
            🚓 PCR VAN EN ROUTE TO {ZONES[g.raidInFlight.zone].name.toUpperCase()} —{" "}
            {secs(g.raidInFlight.arrivesAt - now)}
          </span>
        </div>
      )}
    </>
  );

  const popups = (
    <>
      {g.popup?.kind === "fake_call" && (
        <FakeCallPopup endsAt={g.popup.endsAt} now={now} onDecline={() => dispatch({ type: "declineCall" })} />
      )}
      {g.popup?.kind === "abort_wipe" && (
        <AbortPopup
          key={g.popup.endsAt}
          endsAt={g.popup.endsAt}
          now={now}
          onCleared={() => dispatch({ type: "abortCleared" })}
        />
      )}
    </>
  );

  /* ═══════════════════════════════════════════════════════════
     CHOLOMAP WORKSPACE — Opens when user clicks CholoMap
     ═══════════════════════════════════════════════════════════ */
  if (surface === "workspace") {
    return (
      <div className={cx(f.deskSurface, last10 && s.lastChance)}>
        <div className={f.deskVignette} aria-hidden="true" />
        <div style={{ position: "relative", zIndex: 470 }}>{urgentBanners}</div>

        <div className={f.deskGrid}>
          {/* Left: Folded Live Kolkata OpenStreetMap + Ping/Raid Bar */}
          <div className={f.mapColumn}>
            <div className={f.mapFrame}>
              <MapBoard
                g={g}
                now={now}
                role="father"
                selected={mapSelected}
                onSelect={setSelectedZone}
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
                <b>
                  {ZONES[mapSelected].name}
                  {selPing
                    ? ` · ${
                        selPing.result === "strong"
                          ? "🔴 STRONG"
                          : selPing.result === "weak"
                            ? "🟠 ADJACENT"
                            : "🔵 NO SIGNAL"
                      }`
                    : ""}
                </b>
                <small>
                  {ZONES[mapSelected].sub}
                  {g.clearedZones.includes(mapSelected) ? " · CCTV CLEARED" : ""} ·{" "}
                  {g.pings.length > 0
                    ? `Last ping: ${ZONES[g.pings[0].zone].name} (${secs(now - g.pings[0].at)} ago)`
                    : "Click any Kolkata zone pin to Ping or Raid"}
                </small>
              </div>

              <div className={f.tacticalBtns}>
                <CdButton
                  small
                  icon="📡"
                  label="PING LOCKET"
                  tone="cyan"
                  cdLeft={pingCd}
                  cdTotal={pingTotal}
                  onClick={() => dispatch({ type: "ping", zone: mapSelected })}
                />
                <CdButton
                  small
                  icon="🚓"
                  label={`RAID ${ZONES[mapSelected].name.split(" ")[0].toUpperCase()}`}
                  tone="red"
                  blocked={rBlock}
                  readyText={`${g.raidsRemaining} VAN${g.raidsRemaining === 1 ? "" : "S"}`}
                  onClick={() => dispatch({ type: "raid", zone: mapSelected })}
                />
                <CdButton
                  small
                  icon="🛡️"
                  label={locked ? `LOCK ${secs(g.cyberLockUntil - now)}` : "CYBER LOCK"}
                  tone="blue"
                  cdLeft={lockCd}
                  cdTotal={CD.cyberLock}
                  readyText="5s FREEZE"
                  onClick={() => dispatch({ type: "cyberLock" })}
                />
              </div>
            </div>
          </div>

          {/* Right: Digital Clock + Loose Pins & Yarn Ball + Spiral Notebook */}
          <aside className={f.toolsColumn}>
            <div className={f.clockUnit}>
              <div className={f.clockTopRow}>
                <span className={f.ledTimer}>{mmss(tl)}</span>
                <div className={f.ledMeta}>
                  <span>{fictionClock(g, now)} · FRI</span>
                  <span>WIPE {pct}%</span>
                </div>
              </div>
              <div className={s.wipeTrack}>
                <span className={s.wipeBar} style={{ width: `${pct}%` }} />
                <i className={s.wipeTick} style={{ left: "50%" }} />
                <i className={s.wipeTick} style={{ left: "80%" }} />
              </div>
              <div className={f.ledStats}>
                <span className={f.ledChip}>LEADS {sent}/3</span>
                <span className={f.ledChip}>🚓 {g.raidsRemaining}</span>
                <span className={f.ledChip}>WB-06-{g.plateNum || "----"}</span>
              </div>
              <div className={f.clockActions}>
                <button
                  type="button"
                  className={f.tinyBtn}
                  onClick={() => {
                    sfx.tap();
                    setSurface("device");
                  }}
                >
                  ← Back to Laptop {deviceNeedsAttention ? "●" : ""}
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
                    sfx.tap();
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
                    onClick={() => setCustomYarns((prev) => prev.slice(0, -1))}
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

        {/* Right-edge Chevron back to Laptop UI */}
        <button
          type="button"
          className={f.deviceChevron}
          aria-label="Back to Laptop UI"
          onClick={() => {
            sfx.tap();
            setSurface("device");
          }}
        >
          {deviceNeedsAttention && <span className={f.chevronPulse} />}
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

        {popups}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     PRIMARY SCREEN — Laptop OS (Everything Comes as Messages)
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className={cx(f.laptopOs, last10 && s.lastChance)}>
      <header className={f.menuBar}>
        <div className={f.menuLeft}>
          <strong>Riya&apos;s Laptop · Inspector Subir Sen</strong>
          <span className={f.menuMono}>WB-06-{g.plateNum || "----"}</span>
        </div>
        <div className={f.menuRight}>
          <span className={cx(f.menuMono, final && s.timerRed)}>⏱️ {mmss(tl)}</span>
          <span className={f.menuMono}>LEADS {sent}/3</span>
          <span className={f.menuMono}>WIPE {pct}%</span>
          <span className={f.menuMono}>🚓 {g.raidsRemaining}</span>
          <button type="button" className={f.menuBtn} onClick={() => openDockApp("map")}>
            🗺️ CholoMap {badgeMap ? "●" : ""}
          </button>
          <button type="button" className={f.menuBtn} onClick={onToggleMute}>
            {muted ? "🔇" : "🔊"}
          </button>
          <button type="button" className={f.menuBtn} onClick={onLeave}>
            Exit
          </button>
        </div>
      </header>

      <div style={{ padding: "0 14px 4px", background: "rgba(10,14,22,0.86)" }}>
        <div className={s.wipeTrack}>
          <span className={s.wipeBar} style={{ width: `${pct}%` }} />
          <i className={s.wipeTick} style={{ left: "50%" }} />
          <i className={s.wipeTick} style={{ left: "80%" }} />
        </div>
      </div>

      {urgentBanners}

      <main className={f.osStage}>
        {app === null ? (
          <div className={f.desktopEmpty}>
            <div className={f.desktopIconGrid}>
              {[
                ["pingme", badgePingMe ? "!" : null],
                ["notes", badgeNotes ? "1" : null],
                ["vault", badgeVault ? "1" : null],
                ["map", badgeMap ? "●" : null],
              ].map(([id, badge]) => (
                <button
                  key={id}
                  type="button"
                  className={f.desktopShortcut}
                  onClick={() => openDockApp(id)}
                >
                  <GameAppIcon id={id} size={48} />
                  {badge && <span className={f.dockBadge}>{badge}</span>}
                  <span>{GAME_APP_META[id].label}</span>
                </button>
              ))}
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
                    sfx.tap();
                    setApp(null);
                  }}
                />
                <span className={f.lightAmber} />
                <span className={f.lightGreen} />
              </div>
              <span className={f.winTitle}>{GAME_APP_META[app]?.label}</span>
              <div className={f.winMeta}>
                <span>{fictionClock(g, now)}</span>
                <button
                  type="button"
                  className={f.winCloseBtn}
                  onClick={() => {
                    sfx.tap();
                    setApp(null);
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className={f.winContent}>
              {/* PINGME — Messages (starts with Rohan only, unfolds one by one, Forward to Lalbazar) */}
              {app === "pingme" && (
                <>
                  <div className={s.chatTabs}>
                    {!g.pingmePurged &&
                      availableChatIds.map((id) => {
                        const c = CHATS[id];
                        const L = c.lead ? g.leads[c.lead] : null;
                        const hot = L && leadOpen(L);
                        const ow = L?.status === "overwriting";
                        return (
                          <button
                            key={id}
                            type="button"
                            className={cx(s.chatTab, chatId === id && s.chatTabOn, ow && s.chatTabOw)}
                            onClick={() => {
                              sfx.tap();
                              setChatId(id);
                            }}
                          >
                            {c.name.split(" ")[0]}
                            {hot && <i className={s.tabDot} />}
                          </button>
                        );
                      })}
                    <button
                      type="button"
                      className={cx(s.chatTab, chatId === "dispatch" && s.chatTabOn)}
                      onClick={() => {
                        sfx.tap();
                        setChatId("dispatch");
                      }}
                    >
                      Lalbazar ({forwardedLogs.length + dispatchMessages.length})
                    </button>
                  </div>

                  {chatId === "dispatch" ? (
                    <div className={s.chatBody}>
                      <div className={s.chatInfo}>
                        <b>Lalbazar Dispatch</b>
                        <span>Forwarded evidence &amp; live alerts</span>
                      </div>
                      <div className={s.msgList}>
                        <div className={cx(s.bubble, s.bubbleThem)}>
                          <p>
                            🚨 Remote wipe detected on Riya&apos;s device (03:00 delay). Forward suspicious chats here
                            so we can clear Kolkata zones on <b>CholoMap</b>.
                          </p>
                          <span className={s.bubbleTime}>8:15 PM</span>
                        </div>
                        {forwardedLogs.map((fwd) => (
                          <div key={fwd.id} className={cx(s.bubble, s.bubbleMe)}>
                            <div className={f.forwardedQuote}>↪ Forwarded from {fwd.from}</div>
                            <p>{fwd.text}</p>
                            <span className={s.bubbleTime}>{fwd.time} · Sent to Lalbazar</span>
                          </div>
                        ))}
                        {dispatchMessages.map((ev) => (
                          <div key={ev.id} className={cx(s.bubble, s.bubbleThem)}>
                            <p>{ev.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : g.pingmePurged ? (
                    <div className={s.purgedBox}>
                      <div>🚫</div>
                      <h3>PINGME PURGED (50% WIPE)</h3>
                      <p>Chat history was erased by the remote wipe.</p>
                      <p>
                        GateBot&apos;s vehicle plate <b>WB-06-{g.plateNum || "----"}</b> is still pinned in your bar, and
                        QuickNotes &amp; Lalbazar Dispatch remain available.
                      </p>
                    </div>
                  ) : (
                    (() => {
                      const activeChatKey = availableChatIds.includes(chatId) ? chatId : "rohan";
                      const chat = CHATS[activeChatKey];
                      const visibleMsgs = chat.messages.slice(
                        0,
                        Math.max(1, visibleCountByChat[activeChatKey] || 1)
                      );
                      const stillTyping = visibleMsgs.length < chat.messages.length;

                      return (
                        <div className={s.chatBody}>
                          <div className={s.chatInfo}>
                            <b>{chat.name}</b>
                            <span>{chat.number ? `${chat.number} · ${chat.seen}` : chat.seen}</span>
                          </div>
                          <div className={s.msgList}>
                            {visibleMsgs.map((m, i) => {
                              const text = m.text.replace("{PLATE}", g.plateNum || "----");
                              const L = m.lead ? g.leads[m.lead] : null;
                              const isDeleted = L?.status === "deleted";
                              const isSaved = L?.status === "saved";
                              const isOw = L?.status === "overwriting";
                              return (
                                <div
                                  key={i}
                                  className={cx(
                                    s.bubble,
                                    m.from === "me" ? s.bubbleMe : s.bubbleThem,
                                    m.lead && !isDeleted && !isSaved && s.bubbleLead,
                                    isOw && s.bubbleOw,
                                    isSaved && s.bubbleSaved,
                                    isDeleted && s.bubbleDeleted
                                  )}
                                >
                                  {isDeleted ? (
                                    <div className={s.deletedMsg}>🚫 Restored from older backup (wiped remotely)</div>
                                  ) : (
                                    <>
                                      <p>{text}</p>
                                      <span className={s.bubbleTime}>{m.time}</span>
                                    </>
                                  )}
                                  {m.lead && isOw && (
                                    <div className={s.owWarn}>
                                      ⚠️ OVERWRITING IN {secs(L.overwriteEndsAt - now)} — FORWARD NOW!
                                    </div>
                                  )}
                                  {m.lead && leadOpen(L) && (
                                    <button
                                      type="button"
                                      className={cx(f.forwardBtn, isOw && f.forwardBtnUrgent)}
                                      onClick={() => handleForwardLead(m.lead, text)}
                                    >
                                      <span>↪ Forward to Lalbazar</span>
                                      <small>{LEADS[m.lead].via} · clears 2 zones</small>
                                    </button>
                                  )}
                                  {m.lead && isSaved && (
                                    <div className={s.savedTag}>✅ FORWARDED TO LALBAZAR — 2 zones cleared</div>
                                  )}
                                </div>
                              );
                            })}
                            {stillTyping && (
                              <div className={cx(s.bubble, s.bubbleThem)}>
                                <p>…</p>
                              </div>
                            )}

                            {/* Guided nudge to next incoming chat once current lead is forwarded */}
                            {activeChatKey === "rohan" && ananyaUnlocked && (
                              <div className={f.nextChatHint}>
                                <span>📩 New chat recovered: <b>Ananya (Dept)</b></span>
                                <button
                                  type="button"
                                  className={f.nextChatBtn}
                                  onClick={() => {
                                    sfx.tap();
                                    setChatId("ananya");
                                  }}
                                >
                                  Open Chat →
                                </button>
                              </div>
                            )}
                            {activeChatKey === "ananya" && gatebotUnlocked && (
                              <div className={f.nextChatHint}>
                                <span>📩 New alert recovered: <b>Salt Lake GateBot</b></span>
                                <button
                                  type="button"
                                  className={f.nextChatBtn}
                                  onClick={() => {
                                    sfx.tap();
                                    setChatId("gatebot");
                                  }}
                                >
                                  Open Alert →
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  )}
                </>
              )}

              {/* QUICKNOTES */}
              {app === "notes" &&
                (g.notesPurged ? (
                  <div className={s.purgedBox}>
                    <div>🚫</div>
                    <h3>QUICKNOTES PURGED (80% WIPE)</h3>
                    <p>All notes have been wiped. Hope you remembered the BangoVault PIN!</p>
                  </div>
                ) : (
                  <div className={s.notesList}>
                    <div className={s.noteCard}>
                      <div className={s.noteTitle}>Tonight</div>
                      <p>Remind Baba about BP meds. Warm up dal before 9 PM.</p>
                    </div>
                    <div className={cx(s.noteCard, s.notePinCard, now < g.notesCorruptUntil && s.noteCorrupt)}>
                      <div className={s.noteTitle}>BangoVault Backup PIN</div>
                      {now < g.notesCorruptUntil ? (
                        <>
                          <div className={s.pinBigGlitch}>#@!%</div>
                          <p className={s.corruptSub}>
                            Sync corrupted by remote device · auto-restores in {secs(g.notesCorruptUntil - now)}
                          </p>
                          <HoldButton
                            key={`restore-${g.notesCorruptUntil}`}
                            ms={HOLD_MS.restore}
                            paused={paused}
                            tone="cyan"
                            label="HOLD 1s: RESTORE NOTE"
                            onDone={() => dispatch({ type: "restoreNote" })}
                          />
                        </>
                      ) : (
                        <>
                          <div className={s.pinBig}>{g.vaultPin || "----"}</div>
                          <p className={s.pinSub}>Temporary Dept Passcode — enter in BangoVault</p>
                        </>
                      )}
                    </div>
                    <div className={s.noteCard}>
                      <div className={s.noteTitle}>Weird (Last Week)</div>
                      <p>
                        Linked my cloud backup to R&apos;s phone (<b>…44102</b>) &ldquo;for safety&rdquo;?? Should
                        unlink it soon.
                      </p>
                    </div>
                  </div>
                ))}

              {/* BANGOVAULT */}
              {app === "vault" &&
                (!g.vaultUnlocked && g.leads.lead3.status !== "saved" ? (
                  <VaultKeypad
                    key={g.vaultRelockUsed ? "relocked" : "fresh"}
                    onSubmit={(pin) => dispatch({ type: "enterPin", pin })}
                  />
                ) : (
                  <div className={s.dossier}>
                    <div className={s.dossierStamp}>GOVT OF WEST BENGAL — CONFIDENTIAL AUDIT</div>
                    <dl className={s.dossierGrid}>
                      <dt>Project</dt>
                      <dd>SECTOR V URBAN CORRIDOR // TENDER #404</dd>
                      <dt>Flagged Shell Firm</dt>
                      <dd>East-Bypass Infra Holdings</dd>
                      <dt>Encrypted Contractor ID</dt>
                      <dd className={s.contractorId}>{CONTRACTOR_ID}</dd>
                      <dt>Liaison Desk</dt>
                      <dd>Urban Dev. Dept, 4th Floor</dd>
                    </dl>
                    {g.leads.lead3.status === "active" ? (
                      <button
                        type="button"
                        className={f.forwardBtn}
                        onClick={() =>
                          handleForwardLead(
                            "lead3",
                            `Tender #404 Audit — Contractor ID ${CONTRACTOR_ID} (East-Bypass Infra Holdings)`
                          )
                        }
                      >
                        <span>↪ Forward Audit to Lalbazar Cyber Cell</span>
                        <small>Triggers 4s exact SUV trace</small>
                      </button>
                    ) : (
                      <div className={s.uploadedBox}>
                        <div className={s.savedTag}>✅ FORWARDED TO LALBAZAR CYBER CELL</div>
                        <button type="button" className={s.jumpMapBtn} onClick={() => openDockApp("map")}>
                          OPEN CHOLOMAP WORKSPACE →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>

      <footer className={f.dockWrap}>
        <nav className={f.dock} aria-label="Laptop Dock">
          {[
            ["pingme", badgePingMe ? "!" : null],
            ["notes", badgeNotes ? "1" : null],
            ["vault", badgeVault ? "1" : null],
            ["map", badgeMap ? "●" : null],
          ].map(([id, badge]) => (
            <button
              key={id}
              type="button"
              className={f.dockItem}
              onClick={() => openDockApp(id)}
              aria-label={GAME_APP_META[id].label}
            >
              <span className={f.dockTip}>
                {id === "map" ? "CholoMap (Kolkata Workspace)" : GAME_APP_META[id].label}
              </span>
              <GameAppIcon id={id} size={46} />
              {badge && <span className={f.dockBadge}>{badge}</span>}
              {app === id && <span className={f.dockActiveDot} />}
            </button>
          ))}
        </nav>

        <div style={{ width: 210 }}>
          <CdButton
            small
            icon="🛡️"
            label={locked ? `CYBER LOCK (${secs(g.cyberLockUntil - now)})` : "CYBER LOCK"}
            tone="blue"
            cdLeft={lockCd}
            cdTotal={CD.cyberLock}
            readyText="5s FREEZE"
            onClick={() => dispatch({ type: "cyberLock" })}
          />
        </div>
      </footer>

      {popups}
    </div>
  );
}

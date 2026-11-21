"use client";

import { useState } from "react";
import {
  ABORT_TAPS,
  CD,
  CHATS,
  CONTRACTOR_ID,
  HOLD_MS,
  LAST_CHANCE_MS,
  LEADS,
  ZONES,
  ZONE_IDS,
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
  localToast,
  muted,
  onToggleMute,
  onLeave,
  deviceMode = "phone",
  onToggleDeviceMode,
}) {
  const isLaptop = deviceMode === "laptop";

  // Desktop toggles between "map" (Kolkata Desk Home) and "device" (Riya's Laptop OS)
  const [surface, setSurface] = useState("map");
  const [app, setApp] = useState(isLaptop ? "pingme" : null); // null | pingme | notes | vault | map
  const [chatId, setChatId] = useState("rohan");
  const [notesSeen, setNotesSeen] = useState(false);
  const [selectedZone, setSelectedZone] = useState("sectorv");

  // Player Kolkata map marking (custom notes + red yarn strings)
  const [customPins, setCustomPins] = useState([]);
  const [customYarns, setCustomYarns] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [pendingNote, setPendingNote] = useState(null);
  const [yarnMode, setYarnMode] = useState(false);
  const [yarnStartId, setYarnStartId] = useState(null);
  const [phonePinDraft, setPhonePinDraft] = useState("");

  const tl = timeLeftMs(g, now);
  const pct = wipePct(g, now);
  const sent = leadsSent(g);
  const final = inFinal(g, now);
  const last10 = tl <= LAST_CHANCE_MS;
  const paused = !!g.popup;

  const activeOw = ["lead1", "lead2"].find((k) => g.leads[k].status === "overwriting");
  const trace = traceActive(g, now);
  const locked = isCyberLocked(g, now);

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

  function openApp(next) {
    sfx.tap();
    if (next === "notes") setNotesSeen(true);
    setApp(next);
    if (isLaptop) setSurface("device");
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
    setPhonePinDraft("");
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

  // Shared inner app screens (PingMe, QuickNotes, BangoVault, CholoMap)
  const renderAppContent = (activeApp) => {
    if (activeApp === "pingme") {
      return g.pingmePurged ? (
        <div className={s.purgedBox}>
          <div>🚫</div>
          <h3>PINGME PURGED (50% WIPE)</h3>
          <p>Chat history was erased by the remote wipe.</p>
          <p>
            GateBot&apos;s vehicle plate <b>WB-06-{g.plateNum}</b> is still pinned in your HUD, and QuickNotes still has
            backup details.
          </p>
        </div>
      ) : (
        <>
          <div className={s.chatTabs}>
            {Object.entries(CHATS).map(([id, c]) => {
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
          </div>
          {(() => {
            const chat = CHATS[chatId];
            return (
              <div className={s.chatBody}>
                <div className={s.chatInfo}>
                  <b>{chat.name}</b>
                  <span>{chat.number ? `${chat.number} · ${chat.seen}` : chat.seen}</span>
                </div>
                <div className={s.msgList}>
                  {chat.messages.map((m, i) => {
                    const text = m.text.replace("{PLATE}", g.plateNum);
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
                            ⚠️ OVERWRITING IN {secs(L.overwriteEndsAt - now)} — HOLD NOW!
                          </div>
                        )}
                        {m.lead && leadOpen(L) && (
                          <HoldButton
                            key={`${m.lead}-${g.round}`}
                            ms={HOLD_MS[m.lead]}
                            paused={paused}
                            tone={isOw ? "red" : "amber"}
                            label="HOLD 2s: SEND TO LALBAZAR"
                            sub={`${LEADS[m.lead].via} · clears 2 zones`}
                            onDone={() => dispatch({ type: "sendLead", lead: m.lead })}
                          />
                        )}
                        {m.lead && isSaved && (
                          <div className={s.savedTag}>✅ SENT TO LALBAZAR — 2 zones cleared</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </>
      );
    }

    if (activeApp === "notes") {
      return g.notesPurged ? (
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
                <div className={s.pinBig}>{g.vaultPin}</div>
                <p className={s.pinSub}>Temporary Dept Passcode — enter in BangoVault</p>
              </>
            )}
          </div>
          <div className={s.noteCard}>
            <div className={s.noteTitle}>Weird (Last Week)</div>
            <p>
              Linked my cloud backup to R&apos;s phone (<b>…44102</b>) &ldquo;for safety&rdquo;?? Should unlink it soon.
            </p>
          </div>
        </div>
      );
    }

    if (activeApp === "vault") {
      return !g.vaultUnlocked && g.leads.lead3.status !== "saved" ? (
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
            <HoldButton
              key={`lead3-${g.round}-${g.vaultRelockUsed}`}
              ms={HOLD_MS.lead3}
              paused={paused}
              tone="amber"
              label="HOLD 3s: UPLOAD TO LALBAZAR CYBER CELL"
              sub="Triggers a 4-second exact SUV trace on CholoMap"
              onDone={() => dispatch({ type: "sendLead", lead: "lead3" })}
            />
          ) : (
            <div className={s.uploadedBox}>
              <div className={s.savedTag}>✅ UPLOADED TO LALBAZAR CYBER CELL</div>
              <button
                type="button"
                className={s.jumpMapBtn}
                onClick={() => {
                  sfx.tap();
                  if (isLaptop) setSurface("map");
                  else setApp("map");
                }}
              >
                OPEN KOLKATA MAP TO RAID →
              </button>
            </div>
          )}
        </div>
      );
    }

    // CholoMap (Full Kolkata OSM)
    return (
      <>
        {!isLaptop && (
          <form
            className={f.phoneQuickNoteBar}
            onSubmit={(e) => {
              e.preventDefault();
              if (!phonePinDraft.trim()) return;
              setPendingNote({ title: phonePinDraft.trim(), note: "Marked on Kolkata map." });
            }}
          >
            <input
              className={f.phoneNoteInput}
              placeholder="Mark a note on Kolkata map..."
              value={phonePinDraft}
              onChange={(e) => setPhonePinDraft(e.target.value)}
            />
            <button type="submit" className={f.phonePinBtn}>
              {pendingNote ? "TAP MAP" : "PIN"}
            </button>
          </form>
        )}
        <div className={s.mapWrap} style={{ minHeight: isLaptop ? 360 : 250 }}>
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
        <div className={s.zoneBar}>
          <div>
            <b>{ZONES[mapSelected].name}</b>
            <small>
              {ZONES[mapSelected].sub}
              {g.clearedZones.includes(mapSelected) ? " · CCTV CLEARED" : ""}
            </small>
          </div>
          {selPing && (
            <span className={cx(s.pingChip, s[`ping_${selPing.result}`])}>
              {selPing.result === "strong"
                ? "🔴 STRONG"
                : selPing.result === "weak"
                  ? "🟠 NEXT DOOR"
                  : "🔵 NO SIGNAL"}
            </span>
          )}
        </div>
        <div className={s.mapControls}>
          <CdButton
            icon="📡"
            label="PING LOCKET"
            tone="cyan"
            cdLeft={pingCd}
            cdTotal={pingTotal}
            onClick={() => dispatch({ type: "ping", zone: mapSelected })}
          />
          <CdButton
            icon="🚓"
            label={`RAID ${ZONES[mapSelected].name.split(" ")[0].toUpperCase()}`}
            tone="red"
            blocked={rBlock}
            readyText={`${g.raidsRemaining} VAN${g.raidsRemaining === 1 ? "" : "S"}`}
            onClick={() => dispatch({ type: "raid", zone: mapSelected })}
          />
        </div>
      </>
    );
  };

  // Urgent cross-screen banners
  const urgentBanners = (
    <>
      {activeOw && (
        <button
          type="button"
          className={cx(s.urgentBar, s.urgentRed)}
          onClick={() => {
            sfx.tap();
            setChatId(activeOw === "lead1" ? "rohan" : "ananya");
            openApp("pingme");
          }}
        >
          <span>
            ⚠️ OVERWRITING &ldquo;{LEADS[activeOw].title}&rdquo; — {secs(g.leads[activeOw].overwriteEndsAt - now)}
          </span>
          <b>RACE →</b>
        </button>
      )}
      {trace && (isLaptop ? surface !== "map" : app !== "map") && (
        <button
          type="button"
          className={cx(s.urgentBar, s.urgentBlue)}
          onClick={() => {
            sfx.tap();
            if (isLaptop) setSurface("map");
            else setApp("map");
          }}
        >
          <span>🎯 FULL TRACE LIVE ({secs(g.traceUntil - now)}) — SUV PINPOINTED!</span>
          <b>MAP →</b>
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

  // Sabotage popups
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
     DESKTOP / LAPTOP MODE — Detective Desk Home + Riya's Laptop
     ═══════════════════════════════════════════════════════════ */
  if (isLaptop) {
    if (surface === "map") {
      return (
        <div className={cx(f.deskSurface, last10 && s.lastChance)}>
          <div className={f.deskVignette} aria-hidden="true" />
          <div style={{ position: "relative", zIndex: 470 }}>{urgentBanners}</div>

          <div className={f.deskGrid}>
            {/* Left: Live Kolkata OpenStreetMap with Last Known Locations + Ping/Raid */}
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

            {/* Right: Digital Clock + Loose Pushpins & Yarn Ball + Spiral Notebook */}
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
                    onClick={() => openApp(badgePingMe ? "pingme" : badgeVault ? "vault" : "notes")}
                  >
                    Riya&apos;s Device {deviceNeedsAttention ? "●" : "→"}
                  </button>
                  <div style={{ display: "flex", gap: 5 }}>
                    {onToggleDeviceMode && (
                      <button type="button" className={f.tinyBtn} onClick={onToggleDeviceMode}>
                        Phone UI
                      </button>
                    )}
                    <button type="button" className={f.tinyBtn} onClick={onToggleMute}>
                      {muted ? "🔇" : "🔊"}
                    </button>
                    <button type="button" className={f.tinyBtn} onClick={onLeave}>
                      Exit
                    </button>
                  </div>
                </div>
              </div>

              {/* Loose pushpins & red yarn ball lying directly on wood */}
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

              {/* Spiral Field Notebook */}
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

          {/* Right-edge Chevron to slide into Riya's Laptop OS */}
          <button
            type="button"
            className={f.deviceChevron}
            aria-label="Open Riya's Device"
            onClick={() => {
              sfx.tap();
              if (!app) setApp("pingme");
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
            <span className={f.chevronTip}>Riya&apos;s Device</span>
          </button>

          {popups}
        </div>
      );
    }

    // Laptop OS Surface (Riya's Device)
    const activeApp = app || "pingme";
    return (
      <div className={cx(f.laptopOs, last10 && s.lastChance)}>
        <header className={f.menuBar}>
          <div className={f.menuLeft}>
            <button
              type="button"
              className={f.menuBtn}
              onClick={() => {
                sfx.tap();
                setSurface("map");
              }}
            >
              ← Kolkata Map Desk
            </button>
            <strong>Riya&apos;s Device</strong>
            <span className={f.menuMono}>WB-06-{g.plateNum || "----"}</span>
          </div>
          <div className={f.menuRight}>
            <span className={cx(f.menuMono, final && s.timerRed)}>⏱️ {mmss(tl)}</span>
            <span className={f.menuMono}>LEADS {sent}/3</span>
            <span className={f.menuMono}>WIPE {pct}%</span>
            <span className={f.menuMono}>🚓 {g.raidsRemaining}</span>
            {onToggleDeviceMode && (
              <button type="button" className={f.menuBtn} onClick={onToggleDeviceMode}>
                Phone UI
              </button>
            )}
            <button type="button" className={f.menuBtn} onClick={onToggleMute}>
              {muted ? "🔇" : "🔊"}
            </button>
            <button type="button" className={f.menuBtn} onClick={onLeave}>
              Exit
            </button>
          </div>
        </header>

        {urgentBanners}

        <main className={f.osStage}>
          <section className={f.osWindow}>
            <div className={f.winBar}>
              <div className={f.lights}>
                <button
                  type="button"
                  className={f.lightRed}
                  aria-label="Back to desk"
                  onClick={() => setSurface("map")}
                />
                <span className={f.lightAmber} />
                <span className={f.lightGreen} />
              </div>
              <span className={f.winTitle}>{GAME_APP_META[activeApp]?.label}</span>
              <span className={f.winMeta}>{fictionClock(g, now)}</span>
            </div>
            <div className={f.winContent}>{renderAppContent(activeApp)}</div>
          </section>
        </main>

        <footer className={f.dockWrap}>
          <nav className={f.dock} aria-label="Device Dock">
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
                onClick={() => openApp(id)}
                aria-label={GAME_APP_META[id].label}
              >
                <span className={f.dockTip}>{GAME_APP_META[id].label}</span>
                <GameAppIcon id={id} size={44} />
                {badge && <span className={f.dockBadge}>{badge}</span>}
                {activeApp === id && <span className={f.dockActiveDot} />}
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

  /* ═══════════════════════════════════════════════════════════
     PHONE MODE — Proper Smartphone OS + Kolkata Map on Home
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className={cx(s.screen, s.fatherShell, final && s.finalStretch, last10 && s.lastChance)}>
      <div className={s.statusBar}>
        <span>{fictionClock(g, now)}</span>
        <span className={s.statusRight}>
          <button
            type="button"
            className={s.fakeSignalBtn}
            onClick={() =>
              localToast(
                "The reset command is already on the device. Going offline won't stop it, but it WILL cut LocketLink & Dispatch!",
                "bad"
              )
            }
          >
            📶 5G · ✈️
          </button>
          {onToggleDeviceMode && (
            <button type="button" className={s.fakeSignalBtn} onClick={onToggleDeviceMode}>
              💻 Desk
            </button>
          )}
          <button type="button" className={s.iconMini} onClick={onToggleMute} aria-label="Toggle sound">
            {muted ? "🔇" : "🔊"}
          </button>
        </span>
      </div>

      <div className={s.hud}>
        <div className={s.hudRow}>
          <span className={cx(s.timer, final && s.timerRed)}>⏱️ {mmss(tl)}</span>
          <span className={s.hudChip}>LEADS {sent}/3</span>
          <span className={s.hudChip}>WIPE {pct}%</span>
          <span className={s.hudChip}>🚓 {g.raidsRemaining}</span>
        </div>
        <div className={s.wipeTrack}>
          <span className={s.wipeBar} style={{ width: `${pct}%` }} />
          <i className={s.wipeTick} style={{ left: "50%" }} />
          <i className={s.wipeTick} style={{ left: "80%" }} />
        </div>
        <div className={s.hudSub}>
          <span className={s.suvPill}>🚙 White SUV · WB-06-{g.plateNum || "----"}</span>
          <span className={s.onlineTag}>📡 LOCKETLINK + DISPATCH</span>
        </div>
      </div>

      {urgentBanners}

      <div className={s.body}>
        {app === null ? (
          <div className={f.phoneHome}>
            {/* Live Kolkata Map widget right on the phone Home Screen showing Last Known Locations */}
            <div className={f.phoneMapCard}>
              <MapBoard
                g={g}
                now={now}
                role="father"
                selected={mapSelected}
                onSelect={(id) => {
                  setSelectedZone(id);
                  openApp("map");
                }}
                compact
                customPins={customPins}
                customYarns={customYarns}
              />
              <button type="button" className={f.phoneMapFooter} onClick={() => openApp("map")}>
                <span>
                  {g.pings.length > 0
                    ? `Last signal: ${ZONES[g.pings[0].zone].name}`
                    : "Kolkata · Last Known Locations"}
                </span>
                <b>OPEN MAP →</b>
              </button>
            </div>

            <div className={f.phoneGuide}>
              {sent === 0
                ? "Step 1: Open PingMe and hold leads to send to Lalbazar."
                : g.leads.lead3.status === "active"
                  ? "Step 2: Check QuickNotes for the BangoVault PIN, or raid on CholoMap."
                  : "Final Step: Track the locket on Kolkata CholoMap and dispatch a PCR Raid!"}
            </div>

            <div className={f.phoneAppGrid}>
              {[
                ["pingme", badgePingMe ? "!" : null],
                ["notes", badgeNotes ? "1" : null],
                ["vault", badgeVault ? "1" : null],
                ["map", badgeMap ? "●" : null],
              ].map(([id, badge]) => (
                <button key={id} type="button" className={f.phoneAppTile} onClick={() => openApp(id)}>
                  {badge && <span className={f.phoneTileBadge}>{badge}</span>}
                  <GameAppIcon id={id} size={52} />
                  <span>{GAME_APP_META[id].label}</span>
                </button>
              ))}
            </div>

            <button type="button" className={s.subtleExit} onClick={onLeave}>
              Exit match
            </button>
          </div>
        ) : (
          <div className={s.appView}>
            <div className={s.appHead}>
              <button type="button" className={s.backBtn} onClick={() => setApp(null)}>
                ◀ Home
              </button>
              <strong>{GAME_APP_META[app]?.label}</strong>
              <span className={s.appHeadMeta}>
                {app === "pingme" && (g.pingmePurged ? "PURGED" : "Purges 50%")}
                {app === "notes" && (g.notesPurged ? "PURGED" : "Purges 80%")}
                {app === "vault" && (g.leads.lead3.status === "saved" ? "UPLOADED" : g.vaultUnlocked ? "UNLOCKED" : "LOCKED")}
                {app === "map" && `${ZONE_IDS.length - g.clearedZones.length} zones`}
              </span>
            </div>
            {renderAppContent(app)}
          </div>
        )}
      </div>

      <div className={s.bottomDock}>
        <button
          type="button"
          className={cx(s.dockHome, app === null && s.dockHomeActive)}
          onClick={() => {
            sfx.tap();
            setApp(null);
          }}
        >
          ⌂ HOME
        </button>
        <CdButton
          small
          icon="🛡️"
          label={locked ? `CYBER LOCK (${secs(g.cyberLockUntil - now)})` : "CYBER LOCK (5s FREEZE)"}
          tone="blue"
          cdLeft={lockCd}
          cdTotal={CD.cyberLock}
          readyText="LOCK + RAID"
          onClick={() => dispatch({ type: "cyberLock" })}
        />
      </div>

      {popups}
    </div>
  );
}

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
import MapBoard from "./MapBoard";
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

export default function FatherView({ g, now, dispatch, localToast, muted, onToggleMute, onLeave }) {
  const [app, setApp] = useState(null); // null | pingme | notes | vault | map
  const [chatId, setChatId] = useState("rohan");
  const [notesSeen, setNotesSeen] = useState(false);
  const [selectedZone, setSelectedZone] = useState("sectorv");

  const tl = timeLeftMs(g, now);
  const pct = wipePct(g, now);
  const sent = leadsSent(g);
  const final = inFinal(g, now);
  const last10 = tl <= LAST_CHANCE_MS;
  const paused = !!g.popup;

  // Check if Rohan is actively overwriting a chat right now
  const activeOw = ["lead1", "lead2"].find((k) => g.leads[k].status === "overwriting");
  const trace = traceActive(g, now);
  const locked = isCyberLocked(g, now);

  // Guided notification badges (Section 6 of spec)
  const chatsOpen = !g.pingmePurged && (leadOpen(g.leads.lead1) || leadOpen(g.leads.lead2));
  const badgePingMe = chatsOpen || !!activeOw;
  const badgeNotes = !chatsOpen && !g.notesPurged && !g.vaultUnlocked && g.leads.lead3.status === "active" && !notesSeen;
  const badgeVault = !chatsOpen && (notesSeen || g.notesPurged) && g.leads.lead3.status === "active";
  const badgeMap = sent >= 1 || trace;

  const pingCd = cdLeft(g, "ping", now);
  const pingTotal = final ? CD.pingFinal : CD.ping;
  const lockCd = cdLeft(g, "cyberLock", now);
  const rBlock = raidBlock(g, now);

  // Pick a sensible selected zone if trace is active
  const mapSelected = trace ? g.suvZone : selectedZone;
  const selPing = g.pings.find((p) => p.zone === mapSelected);

  function openApp(next) {
    sfx.tap();
    if (next === "notes") setNotesSeen(true);
    setApp(next);
  }

  return (
    <div className={cx(s.screen, s.fatherShell, final && s.finalStretch, last10 && s.lastChance)}>
      {/* Fake phone status bar */}
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
          <span>🔋 64% ⚡</span>
          <button type="button" className={s.iconMini} onClick={onToggleMute} aria-label="Toggle sound">
            {muted ? "🔇" : "🔊"}
          </button>
        </span>
      </div>

      {/* Persistent HUD */}
      <div className={s.hud}>
        <div className={s.hudRow}>
          <span className={cx(s.timer, final && s.timerRed)}>⏱️ {mmss(tl)}</span>
          <span className={s.hudChip}>LEADS {sent}/3</span>
          <span className={s.hudChip}>WIPE {pct}%</span>
          <span className={s.hudChip}>🚓 {g.raidsRemaining}</span>
        </div>
        <div className={s.wipeTrack}>
          <span className={s.wipeBar} style={{ width: `${pct}%` }} />
          <i className={s.wipeTick} style={{ left: "50%" }} title="PingMe purge" />
          <i className={s.wipeTick} style={{ left: "80%" }} title="QuickNotes purge" />
        </div>
        <div className={s.hudSub}>
          <span className={s.suvPill}>🚙 White SUV · WB-06-{g.plateNum}</span>
          <span className={s.onlineTag}>📡 LOCKETLINK + DISPATCH</span>
        </div>
      </div>

      {/* Urgent cross-app banners */}
      {activeOw && (
        <button
          type="button"
          className={cx(s.urgentBar, s.urgentRed)}
          onClick={() => {
            sfx.tap();
            setChatId(activeOw === "lead1" ? "rohan" : "ananya");
            setApp("pingme");
          }}
        >
          <span>
            ⚠️ OVERWRITING &ldquo;{LEADS[activeOw].title}&rdquo; — {secs(g.leads[activeOw].overwriteEndsAt - now)}
          </span>
          <b>RACE →</b>
        </button>
      )}
      {trace && app !== "map" && (
        <button type="button" className={cx(s.urgentBar, s.urgentBlue)} onClick={() => openApp("map")}>
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

      {/* Main phone viewport */}
      <div className={s.body}>
        {app === null && (
          <div className={s.homeWrap}>
            <div className={s.homeGreeting}>
              <div className={s.homeSub}>RIYA&apos;S PHONE · INSPECTOR SUBIR SEN</div>
              <div className={s.homeGuide}>
                {sent === 0
                  ? "Step 1: Open PingMe and hold leads to send to Lalbazar."
                  : g.leads.lead3.status === "active"
                    ? "Step 2: Check QuickNotes for the BangoVault PIN, or raid on CholoMap."
                    : "Final Step: Track the locket on CholoMap and dispatch a PCR Raid!"}
              </div>
            </div>

            <div className={s.appGrid}>
              <button type="button" className={s.appTile} onClick={() => openApp("pingme")}>
                {badgePingMe && <span className={s.badge}>!</span>}
                <span className={cx(s.appIcon, s.icGreen)}>💬</span>
                <b>PingMe</b>
                <small>{g.pingmePurged ? "Purged" : "Messages"}</small>
              </button>

              <button type="button" className={s.appTile} onClick={() => openApp("notes")}>
                {badgeNotes && <span className={s.badge}>1</span>}
                <span className={cx(s.appIcon, s.icAmber)}>📝</span>
                <b>QuickNotes</b>
                <small>{g.notesPurged ? "Purged" : "Notepad"}</small>
              </button>

              <button type="button" className={s.appTile} onClick={() => openApp("vault")}>
                {badgeVault && <span className={s.badge}>1</span>}
                <span className={cx(s.appIcon, s.icIndigo)}>🔐</span>
                <b>BangoVault</b>
                <small>{g.leads.lead3.status === "saved" ? "Uploaded" : "Govt Audit"}</small>
              </button>

              <button type="button" className={s.appTile} onClick={() => openApp("map")}>
                {badgeMap && <span className={s.badge}>●</span>}
                <span className={cx(s.appIcon, s.icCyan)}>🗺️</span>
                <b>CholoMap</b>
                <small>Tracker &amp; Raid</small>
              </button>

              <button
                type="button"
                className={cx(s.appTile, s.appLocked)}
                onClick={() =>
                  localToast("Reset in progress: Settings & Accounts locked by Dept security policy.", "bad")
                }
              >
                <span className={cx(s.appIcon, s.icGrey)}>⚙️</span>
                <b>Settings</b>
                <small>Locked</small>
              </button>
            </div>

            <button type="button" className={s.subtleExit} onClick={onLeave}>
              Exit match
            </button>
          </div>
        )}

        {/* APP 1: PINGME */}
        {app === "pingme" && (
          <div className={s.appView}>
            <div className={s.appHead}>
              <button type="button" className={s.backBtn} onClick={() => setApp(null)}>
                ◀ Home
              </button>
              <strong>💬 PingMe</strong>
              <span className={s.appHeadMeta}>{g.pingmePurged ? "PURGED" : "Purges at 50%"}</span>
            </div>

            {g.pingmePurged ? (
              <div className={s.purgedBox}>
                <div>🚫</div>
                <h3>PINGME PURGED (50% WIPE)</h3>
                <p>Chat history was erased by the remote wipe.</p>
                <p>
                  GateBot&apos;s vehicle plate <b>WB-06-{g.plateNum}</b> is still pinned in your HUD, and QuickNotes
                  still has backup details.
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
            )}
          </div>
        )}

        {/* APP 2: QUICKNOTES */}
        {app === "notes" && (
          <div className={s.appView}>
            <div className={s.appHead}>
              <button type="button" className={s.backBtn} onClick={() => setApp(null)}>
                ◀ Home
              </button>
              <strong>📝 QuickNotes</strong>
              <span className={s.appHeadMeta}>{g.notesPurged ? "PURGED" : "Purges at 80%"}</span>
            </div>

            {g.notesPurged ? (
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
                    Linked my cloud backup to R&apos;s phone (<b>…44102</b>) &ldquo;for safety&rdquo;?? Should unlink it
                    soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* APP 3: BANGOVAULT */}
        {app === "vault" && (
          <div className={s.appView}>
            <div className={s.appHead}>
              <button type="button" className={s.backBtn} onClick={() => setApp(null)}>
                ◀ Home
              </button>
              <strong>🔐 BangoVault</strong>
              <span className={s.appHeadMeta}>
                {g.leads.lead3.status === "saved" ? "UPLOADED" : g.vaultUnlocked ? "UNLOCKED" : "LOCKED"}
              </span>
            </div>

            {!g.vaultUnlocked && g.leads.lead3.status !== "saved" ? (
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
                    <button type="button" className={s.jumpMapBtn} onClick={() => openApp("map")}>
                      OPEN CHOLOMAP TO RAID →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* APP 4: CHOLOMAP */}
        {app === "map" && (
          <div className={s.appView}>
            <div className={s.appHead}>
              <button type="button" className={s.backBtn} onClick={() => setApp(null)}>
                ◀ Home
              </button>
              <strong>🗺️ CholoMap</strong>
              <span className={s.appHeadMeta}>
                {final ? "FINAL STRETCH (5s PING)" : `${ZONE_IDS.length - g.clearedZones.length} zones open`}
              </span>
            </div>

            <div className={s.mapWrap}>
              <MapBoard g={g} now={now} role="father" selected={mapSelected} onSelect={setSelectedZone} />
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

            {g.pings.length > 0 && (
              <div className={s.pingLog}>
                Last ping: <b>{ZONES[g.pings[0].zone].name}</b> —{" "}
                {g.pings[0].result === "strong"
                  ? "🔴 STRONG SIGNAL — SUV IS HERE!"
                  : g.pings[0].result === "weak"
                    ? "🟠 WEAK — ADJACENT ZONE"
                    : "🔵 NO SIGNAL"}{" "}
                ({secs(now - g.pings[0].at)} ago)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Persistent bottom dock: Home + Cyber Lock combo button */}
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

      {/* Full-screen blocking sabotage popups */}
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
    </div>
  );
}

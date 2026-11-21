"use client";

import { useState } from "react";
import { ADJ, CD, LAST_CHANCE_MS, LEADS, TAUNTS, ZONES } from "../constants";
import {
  cdLeft,
  fictionClock,
  handshakeLeftMs,
  inFinal,
  inHandshake,
  isCyberLocked,
  leadsSent,
  timeLeftMs,
  traceActive,
  wipePct,
} from "../engine";
import { sfx } from "../sfx";
import { CdButton, cx, mmss, secs } from "./common";
import MapBoard from "./MapBoard";
import s from "./wipeout.module.css";

export default function RohanView({ g, now, dispatch, localToast, muted, onToggleMute, onLeave }) {
  const [tab, setTab] = useState("route"); // route | attack
  const [mapMode, setMapMode] = useState("reroute"); // reroute | spoof

  const tl = timeLeftMs(g, now);
  const pct = wipePct(g, now);
  const sent = leadsSent(g);
  const final = inFinal(g, now);
  const last10 = tl <= LAST_CHANCE_MS;
  const hs = inHandshake(g, now);
  const locked = isCyberLocked(g, now);
  const trace = traceActive(g, now);

  const rerouteCd = cdLeft(g, "reroute", now);
  const rerouteTotal = final ? CD.rerouteFinal : CD.reroute;
  const spooferCd = cdLeft(g, "spoofer", now);
  const sabCd = cdLeft(g, "sabotage", now);
  const tauntCd = cdLeft(g, "taunt", now);

  const cloudBlocked = locked ? "LOCKED" : hs ? `LINK ${secs(handshakeLeftMs(g, now))}` : null;
  const owBusy = g.leads.lead1.status === "overwriting" || g.leads.lead2.status === "overwriting";
  const vaultAlert = g.vaultUnlocked && !g.vaultRelockUsed && g.leads.lead3.status === "active";

  function handleZoneTap(zoneId) {
    if (locked) {
      localToast("Controls frozen by Lalbazar Cyber Cell!", "bad");
      return;
    }
    if (mapMode === "reroute") {
      if (zoneId === g.suvZone) return;
      if (!ADJ[g.suvZone].includes(zoneId)) {
        localToast("Tap a green connected zone next to the SUV", "info");
        return;
      }
      if (rerouteCd > 0) {
        localToast(`Driver reroute ready in ${secs(rerouteCd)}`, "info");
        return;
      }
      sfx.tap();
      dispatch({ type: "reroute", zone: zoneId });
    } else {
      if (zoneId === g.suvZone) {
        localToast("Pick a DIFFERENT zone to plant a ghost ping", "info");
        return;
      }
      if (spooferCd > 0) {
        localToast(`GPS Spoofer ready in ${secs(spooferCd)}`, "info");
        return;
      }
      sfx.good();
      dispatch({ type: "spoof", zone: zoneId });
      setMapMode("reroute");
    }
  }

  return (
    <div className={cx(s.screen, s.rohanShell, final && s.finalStretch, last10 && s.lastChance)}>
      {/* Top tactical header */}
      <div className={s.rohanTop}>
        <span>● ROHAN · BACK SEAT SUV</span>
        <span className={s.statusRight}>
          <span>{fictionClock(g, now)}</span>
          <button type="button" className={s.iconMini} onClick={onToggleMute} aria-label="Toggle sound">
            {muted ? "🔇" : "🔊"}
          </button>
          <button type="button" className={s.iconMini} onClick={onLeave} aria-label="Exit match">
            ✕
          </button>
        </span>
      </div>

      {/* Persistent HUD */}
      <div className={cx(s.hud, s.hudDark)}>
        <div className={s.hudRow}>
          <span className={cx(s.timer, final && s.timerRed)}>⏱️ {mmss(tl)}</span>
          <span className={s.hudChip}>WIPE {pct}%</span>
          <span className={s.hudChip}>LEADS {sent}/3</span>
          <span className={s.hudChip}>🚓 {g.raidsRemaining}</span>
        </div>
        <div className={s.wipeTrack}>
          <span className={cx(s.wipeBar, s.wipeBarGreen)} style={{ width: `${pct}%` }} />
          <i className={s.wipeTick} style={{ left: "50%" }} />
          <i className={s.wipeTick} style={{ left: "80%" }} />
        </div>
      </div>

      {/* Contextual urgent banners */}
      {hs && (
        <div className={cx(s.urgentBar, s.urgentAmber)}>
          <span>☁️ CLOUD HANDSHAKE ({secs(handshakeLeftMs(g, now))}) — Reroute &amp; Spoof ready now!</span>
        </div>
      )}
      {g.raidInFlight && (
        <button type="button" className={cx(s.urgentBar, s.urgentRed)} onClick={() => setTab("route")}>
          <span>🚨 SIRENS CONVERGING ({secs(g.raidInFlight.arrivesAt - now)}) — STAY OR MOVE?</span>
          {tab !== "route" && <b>MAP →</b>}
        </button>
      )}
      {trace && (
        <button type="button" className={cx(s.urgentBar, s.urgentRed)} onClick={() => setTab("route")}>
          <span>🎯 FULL TRACE ON YOU ({secs(g.traceUntil - now)}) — REROUTE NOW!</span>
          {tab !== "route" && <b>MAP →</b>}
        </button>
      )}
      {vaultAlert && tab !== "attack" && (
        <button type="button" className={cx(s.urgentBar, s.urgentAmber)} onClick={() => setTab("attack")}>
          <span>🔓 INSPECTOR UNLOCKED BANGOVAULT!</span>
          <b>RE-LOCK →</b>
        </button>
      )}

      {/* Main content */}
      <div className={s.body}>
        {tab === "route" && (
          <div className={s.rohanPanel}>
            <div className={s.suvBanner}>
              <div>
                <small>SUV LOCATION</small>
                <b>🚙 {ZONES[g.suvZone].name}</b>
              </div>
              {g.fakePing && now < g.fakePing.expiresAt ? (
                <span className={s.ghostBadge}>
                  👻 Ghost at {ZONES[g.fakePing.zone].name} ({secs(g.fakePing.expiresAt - now)})
                </span>
              ) : (
                <span className={s.routeHint}>
                  {mapMode === "reroute"
                    ? rerouteCd > 0
                      ? `Next turn in ${secs(rerouteCd)}`
                      : "Tap a glowing connected zone"
                    : "Tap any OTHER zone for ghost ping"}
                </span>
              )}
            </div>

            <div className={s.mapWrap}>
              <MapBoard g={g} now={now} role="rohan" mode={mapMode} onSelect={handleZoneTap} />
            </div>

            <div className={s.mapControls}>
              <button
                type="button"
                className={cx(s.modeBtn, mapMode === "reroute" && s.modeBtnOn)}
                onClick={() => {
                  sfx.tap();
                  setMapMode("reroute");
                }}
              >
                {rerouteCd > 0 && (
                  <span
                    className={s.cdSweep}
                    style={{ transform: `scaleX(${Math.min(1, rerouteCd / rerouteTotal)})` }}
                  />
                )}
                <span className={s.cdLabel}>
                  <span>🚙 REROUTE DRIVER</span>
                  <small>
                    {locked ? "LOCKED" : rerouteCd > 0 ? secs(rerouteCd) : final ? "READY (6s)" : "READY (10s)"}
                  </small>
                </span>
              </button>

              <button
                type="button"
                className={cx(
                  s.modeBtn,
                  s.modeGhost,
                  mapMode === "spoof" && s.modeBtnOn,
                  (spooferCd > 0 || locked) && s.disabled
                )}
                onClick={() => {
                  if (spooferCd > 0 || locked) return;
                  sfx.tap();
                  setMapMode((m) => (m === "spoof" ? "reroute" : "spoof"));
                }}
              >
                {spooferCd > 0 && (
                  <span
                    className={s.cdSweep}
                    style={{ transform: `scaleX(${Math.min(1, spooferCd / CD.spoofer)})` }}
                  />
                )}
                <span className={s.cdLabel}>
                  <span>👻 GPS SPOOFER</span>
                  <small>{locked ? "LOCKED" : spooferCd > 0 ? secs(spooferCd) : "10s FAKE PING"}</small>
                </span>
              </button>
            </div>

            <div className={s.rohanTip}>
              Tip: Entering a blue <b>CLEARED</b> zone lifts its stamp and alerts Inspector Sen.
            </div>
          </div>
        )}

        {tab === "attack" && (
          <div className={s.attackPanel}>
            {/* Cloud Overwrites */}
            <div className={s.attackGroup}>
              <div className={s.groupHead}>
                <span>☁️ CLOUD OVERWRITE (PINGME)</span>
                <small>{g.pingmePurged ? "PURGED AT 50%" : "4s race vs. Inspector"}</small>
              </div>
              <div className={s.owGrid}>
                {["lead1", "lead2"].map((k) => {
                  const L = g.leads[k];
                  const isOw = L.status === "overwriting";
                  const statusText =
                    L.status === "saved"
                      ? "❌ SENT BY INSPECTOR"
                      : L.status === "deleted"
                        ? "✅ WIPED"
                        : L.status === "purged" || g.pingmePurged
                          ? "PURGED"
                          : isOw
                            ? `OVERWRITING ${secs(L.overwriteEndsAt - now)}`
                            : cloudBlocked || (owBusy ? "WAIT…" : "TAP TO WIPE (4s)");
                  const canTap = !cloudBlocked && !g.pingmePurged && L.status === "active" && !owBusy;
                  return (
                    <button
                      key={k}
                      type="button"
                      className={cx(
                        s.owBtn,
                        isOw && s.owBtnActive,
                        L.status === "deleted" && s.owBtnDone,
                        !canTap && !isOw && s.disabled
                      )}
                      onClick={() => {
                        if (!canTap) return;
                        sfx.tap();
                        dispatch({ type: "overwrite", lead: k });
                      }}
                    >
                      <b>{LEADS[k].title}</b>
                      <small>{statusText}</small>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vault counter */}
            <div className={s.attackGroup}>
              <div className={s.groupHead}>
                <span>🔐 BANGOVAULT COUNTER</span>
                <small>1 use per round</small>
              </div>
              <CdButton
                small
                icon="🔒"
                label="RE-LOCK BANGOVAULT"
                tone={vaultAlert ? "amber" : "red"}
                blocked={
                  cloudBlocked ||
                  (g.vaultRelockUsed
                    ? "USED"
                    : g.leads.lead3.status === "saved"
                      ? "ALREADY UPLOADED"
                      : !g.vaultUnlocked
                        ? "STILL LOCKED"
                        : null)
                }
                readyText="KICK TO KEYPAD!"
                onClick={() => dispatch({ type: "relockVault" })}
              />
            </div>

            {/* Shared Sabotage Deck */}
            <div className={s.attackGroup}>
              <div className={s.groupHead}>
                <span>⚡ REMOTE SABOTAGE POPUPS</span>
                <small>{sabCd > 0 ? `Shared CD: ${secs(sabCd)}` : "Shared 18s CD"}</small>
              </div>
              <div className={s.sabGrid}>
                <CdButton
                  small
                  icon="📞"
                  label="FAKE CALL"
                  tone="red"
                  cdLeft={sabCd}
                  cdTotal={CD.sabotage}
                  blocked={cloudBlocked || (g.popup ? "ACTIVE" : null)}
                  readyText="4s BLOCK"
                  onClick={() => dispatch({ type: "fakeCall" })}
                />
                <CdButton
                  small
                  icon="⚙️"
                  label="ACCEL RESET"
                  tone="red"
                  cdLeft={sabCd}
                  cdTotal={CD.sabotage}
                  blocked={cloudBlocked || (g.popup ? "ACTIVE" : null)}
                  readyText="−5s PENALTY"
                  onClick={() => dispatch({ type: "abortWipe" })}
                />
                <CdButton
                  small
                  icon="📝"
                  label="CORRUPT PIN"
                  tone="amber"
                  cdLeft={sabCd}
                  cdTotal={CD.sabotage}
                  blocked={cloudBlocked || (g.notesPurged ? "PURGED" : null)}
                  readyText="8s GLITCH"
                  onClick={() => dispatch({ type: "corruptNote" })}
                />
              </div>
            </div>

            {/* Taunts */}
            <div className={s.attackGroup}>
              <div className={s.groupHead}>
                <span>💬 TAUNTS</span>
                <small>{tauntCd > 0 ? secs(tauntCd) : "10s CD"}</small>
              </div>
              <div className={s.tauntList}>
                {TAUNTS.map((txt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={cx(s.tauntBtn, tauntCd > 0 && s.disabled)}
                    disabled={tauntCd > 0}
                    onClick={() => {
                      sfx.tap();
                      dispatch({ type: "taunt", idx });
                    }}
                  >
                    “{txt}”
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom 2-tab switch */}
      <div className={s.rohanTabs}>
        <button
          type="button"
          className={cx(s.rTab, tab === "route" && s.rTabOn)}
          onClick={() => {
            sfx.tap();
            setTab("route");
          }}
        >
          {(g.raidInFlight || trace) && <i className={s.tabDot} />}
          🗺️ GETAWAY SUV
        </button>
        <button
          type="button"
          className={cx(s.rTab, tab === "attack" && s.rTabOn)}
          onClick={() => {
            sfx.tap();
            setTab("attack");
          }}
        >
          {vaultAlert && <i className={s.tabDot} />}
          ☁️ REMOTE ATTACK
        </button>
      </div>

      {/* Cyber Lock full freeze overlay */}
      {locked && (
        <div className={s.cyberOverlay}>
          <div className={s.cyberCard}>
            <div className={s.cyberSeal}>🚨</div>
            <h3>SESSION TRACED BY LALBAZAR CYBER CELL</h3>
            <div className={s.cyberCount}>VPN REROUTING… {secs(g.cyberLockUntil - now)}</div>
            <p>All remote &amp; routing controls frozen</p>
          </div>
        </div>
      )}
    </div>
  );
}

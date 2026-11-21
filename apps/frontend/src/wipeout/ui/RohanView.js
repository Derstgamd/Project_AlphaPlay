"use client";

import { useState } from "react";
import { ZONES } from "../constants";
import { sfx } from "../sfx";
import { TASK_LIMIT_MS } from "../tasks";
import { cx } from "./common";
import MapBoard from "./MapBoard";
import r from "./RohanConsole.module.css";
import s from "./wipeout.module.css";

export default function RohanView({
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
  const [showGuide, setShowGuide] = useState(false);

  const { seed, phase, timeLeftMs, score, passedTasks, slips } = run;
  const playing = phase === "playing";
  const taskNum = currentTask.num;
  const isCritical = taskNum >= 8;

  const timeSec = (timeLeftMs / 1000).toFixed(1);
  const pctLeft = Math.max(0, Math.min(100, (timeLeftMs / TASK_LIMIT_MS) * 100));
  const timerDanger = playing && timeLeftMs <= 5000;

  const suvName = ZONES[seed.suvZone]?.name || "Sector V";
  const escapeName = ZONES[seed.escapeZone]?.name || "Chingrighata";
  const blockedName = ZONES[seed.blockedNeighbor]?.name || "Kestopur";

  const slipTaskNums = new Set(slips.map((sl) => sl.taskNum));

  function handleOptionClick(opt) {
    if (!playing) return;
    if (opt.correct) {
      if (taskNum === 8) sfx.revoke();
      else sfx.forward();
      onPassTask(
        currentTask.milestone
          ? `★ ${currentTask.milestoneLabel}!`
          : `✅ Task ${taskNum} executed: ${opt.label}`
      );
    } else {
      onFailTask("wrong", `Wrong countermeasure ("${opt.label}") on Task ${taskNum}!`);
    }
  }

  function handleMapZoneTap(zoneId) {
    if (!playing) return;
    if (currentTask.kind === "map_spoof") {
      if (zoneId !== seed.suvZone) {
        sfx.radarPing();
        onPassTask(`Ghost ping planted at ${ZONES[zoneId]?.name}!`, {
          spoofZone: zoneId,
        });
      } else {
        onFailTask(
          "wrong",
          `Dropped the decoy ping on your own SUV (${suvName})!`
        );
      }
      return;
    }

    if (currentTask.kind === "map_escape") {
      if (zoneId === seed.escapeZone) {
        sfx.pinDrop();
        onPassTask(
          `★ MILESTONE 3/3: White SUV hit the ${escapeName} highway ramp and escaped Kolkata! (3/3)`
        );
      } else if (zoneId === seed.blockedNeighbor) {
        sfx.siren();
        onFailTask(
          "wrong",
          `Drove straight into the PCR Barricade at ${blockedName}!`
        );
      } else {
        sfx.siren();
        onFailTask(
          "wrong",
          `Wrong exit (${ZONES[zoneId]?.name}) — PCR boxed in the SUV! Open ramp was ${escapeName}.`
        );
      }
      return;
    }

    sfx.pinDrop();
  }

  const mapMode = currentTask.kind === "map_spoof" ? "spoof" : "reroute";

  return (
    <div className={cx(r.laptop, timerDanger && s.lastChance)}>
      <header className={r.topBar}>
        <div className={r.topLeft}>
          <span className={r.greenTag}>● WIPEOUT · ROHAN CHATTERJEE</span>
          <span className={r.topChip}>TASK {taskNum} / 10</span>
          <span className={r.topChip} style={{ color: "#86efac", fontWeight: 800 }}>
            ROHAN: {score}/3 (BEST {dualScores.rohanBest}/3)
          </span>
          <span className={r.topChip} style={{ color: "#7dd3fc" }}>
            SUBIR BEST: {dualScores.fatherBest}/3
          </span>
          <span className={r.topChip}>SLIPS (1–7): {slips.length}</span>
        </div>
        <div className={r.topRight}>
          <button
            type="button"
            className={r.topBtn}
            onClick={() => {
              sfx.paperFlip();
              setShowGuide((v) => !v);
            }}
          >
            ? Rules
          </button>
          <button type="button" className={r.topBtn} onClick={onToggleMute}>
            {muted ? "🔇" : "🔊"}
          </button>
          <button type="button" className={r.topBtn} onClick={onLeave}>
            Exit
          </button>
        </div>
      </header>

      {/* Big, crystal-clear Task & Lead Banner */}
      <div className={cx(r.taskBanner, isCritical && r.taskBannerCritical)}>
        <div className={r.taskTopRow}>
          <div className={r.taskMetaLeft}>
            <span className={r.taskPill}>TASK {taskNum} / 10</span>
            {isCritical ? (
              <span className={r.dangerPill}>
                ★ SUDDEN DEATH · GOAL {taskNum - 7} / 3 (FAIL ENDS RUN)
              </span>
            ) : (
              <span className={r.safePill}>
                TASKS 1–7 · SLIPS CONTINUE (FAIL STARTS AT TASK 8)
              </span>
            )}
            <span className={r.taskTitle}>{currentTask.title}</span>
          </div>
          <div className={cx(r.timerBox, timerDanger && r.timerBoxDanger)}>
            {timeSec}s
          </div>
        </div>

        <p className={r.taskLead}>
          <b style={{ color: isCritical ? "#fca5a5" : "#4ade80" }}>LEAD:</b>{" "}
          {currentTask.lead}
        </p>

        <div className={r.timerTrack}>
          <span
            className={cx(r.timerFill, (timerDanger || isCritical) && r.timerFillDanger)}
            style={{ width: `${pctLeft}%` }}
          />
        </div>
      </div>

      <main className={r.splitGrid}>
        {/* Left Window: Live Kolkata OpenStreetMap */}
        <section className={r.window}>
          <div className={r.winBar}>
            <span className={r.dots}>
              <i style={{ background: "#ef4444" }} />
              <i style={{ background: "#f59e0b" }} />
              <i style={{ background: "#22c55e" }} />
            </span>
            <span>GETAWAY SUV · KOLKATA MAP</span>
            <span>SUV AT {suvName.toUpperCase()}</span>
          </div>

          <div className={r.mapBody}>
            <div className={s.suvBanner}>
              <div>
                <small>WHITE SUV WB-06-{seed.plateNum}</small>
                <b style={{ fontSize: 16 }}>🚙 {suvName}</b>
              </div>
              <span className={s.routeHint} style={{ fontSize: 13 }}>
                {currentTask.kind === "map_spoof"
                  ? `Click ANY zone OTHER than ${suvName} to drop a fake ping!`
                  : currentTask.kind === "map_escape"
                    ? `🚧 ${blockedName} BARRICADED — Click ${escapeName} to escape!`
                    : "Execute the active countermeasure on the right console →"}
              </span>
            </div>

            <div className={s.mapWrap} style={{ flex: 1, minHeight: 240 }}>
              <MapBoard
                g={mapGameState}
                now={0}
                role="rohan"
                mode={mapMode}
                onSelect={handleMapZoneTap}
              />
            </div>
          </div>
        </section>

        {/* Right Window: Clean Focused Current Task Console */}
        <section className={r.window}>
          <div className={r.winBar}>
            <span className={r.dots}>
              <i style={{ background: "#ef4444" }} />
              <i style={{ background: "#f59e0b" }} />
              <i style={{ background: "#22c55e" }} />
            </span>
            <span>REMOTE COMMAND CONSOLE</span>
            <span>{isCritical ? "🔴 SUDDEN DEATH" : "🟢 ACTIVE"}</span>
          </div>

          {/* 10-Step Progress Strip */}
          <div className={r.stepStrip} aria-label="10 tasks progress">
            {tasks.map((t) => {
              const done = passedTasks.includes(t.num);
              const slipped = slipTaskNums.has(t.num);
              const active = t.num === taskNum && phase !== "ended";
              return (
                <span
                  key={t.num}
                  title={`Task ${t.num}: ${t.title}`}
                  className={cx(
                    r.stepNode,
                    t.milestone && r.stepNodeMilestone,
                    done && r.stepNodeDone,
                    slipped && r.stepNodeSlip,
                    active && r.stepNodeNow
                  )}
                >
                  {t.milestone ? `★${t.num}` : t.num}
                </span>
              );
            })}
          </div>

          <div className={r.consoleBody}>
            {currentTask.kind === "choice" ? (
              <div className={r.cardGroup}>
                <div className={r.cardTitle}>
                  <span>
                    {isCritical
                      ? `🚨 CRITICAL END-GOAL (${taskNum - 7}/3) — PICK EXACT COMMAND`
                      : `⚡ TASK ${taskNum} COUNTERMEASURE — PICK 1 OF 3`}
                  </span>
                  <small>{timeSec}s LEFT</small>
                </div>

                <div className={r.optionStack}>
                  {currentTask.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={cx(r.optBtn, isCritical && r.optBtnCritical)}
                      disabled={!playing}
                      onClick={() => handleOptionClick(opt)}
                    >
                      <span className={r.optLabel}>{opt.label}</span>
                      <span className={r.optSub}>{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : currentTask.kind === "map_spoof" ? (
              <div className={r.mapCallout}>
                <strong>← ACT ON THE KOLKATA MAP</strong>
                <p style={{ margin: 0 }}>
                  Click any Kolkata pushpin <b>OTHER THAN {suvName}</b> on the left map to plant a
                  ghost GPS signal and mislead Inspector Sen.
                </p>
              </div>
            ) : (
              <div className={cx(r.mapCallout, r.mapCalloutDanger)}>
                <strong>← FINAL ESCAPE ON KOLKATA MAP (3/3)</strong>
                <p style={{ margin: 0 }}>
                  Bidhannagar PCR barricaded the road to <b>{blockedName}</b>! Click{" "}
                  <b>{escapeName}</b> on the Kolkata Map on the left to break out onto the highway
                  ramp before the 15s cutoff!
                </p>
              </div>
            )}

            {slips.length > 0 && (
              <div className={r.slipList}>
                <strong>SLIPS LOGGED IN TASKS 1–7 ({slips.length}):</strong>
                {slips.slice(-3).map((sl) => (
                  <span key={sl.taskNum}>
                    • Task {sl.taskNum}: {sl.reason}
                  </span>
                ))}
              </div>
            )}

            <div className={r.playbookCard}>
              <strong>ROHAN&apos;S END-GOAL MILESTONES (/3)</strong>
              <div>
                • <b>Task 8 (1/3):</b> Lock Remote Delete so Subir cannot revoke access.
              </div>
              <div>
                • <b>Task 9 (2/3):</b> Sever the Lalbazar Police Uplink before Tender #404 uploads.
              </div>
              <div>
                • <b>Task 10 (3/3):</b> Hit the open Kolkata highway ramp around the PCR barricade.
              </div>
            </div>
          </div>
        </section>
      </main>

      {showGuide && (
        <aside className={r.guideModal} aria-label="How to play as Rohan">
          <div className={r.guideModalHead}>
            <span>WIPEOUT · ROHAN CHATTERJEE</span>
            <button type="button" className={r.topBtn} onClick={() => setShowGuide(false)}>
              ✕
            </button>
          </div>
          <ul>
            <li>
              <b>10 Sequential Tasks (15s Each):</b> Complementary to Inspector Subir Sen&apos;s
              10-step hunt.
            </li>
            <li>
              <b>Tasks 1–7 Forgiveness:</b> Missing or timing out Tasks 1–7 logs a slip and keeps
              you moving forward.
            </li>
            <li>
              <b>Tasks 8–10 Sudden Death (/3):</b> Starting at Task 8, any wrong call or timeout
              immediately ends your run!
            </li>
          </ul>
        </aside>
      )}
    </div>
  );
}

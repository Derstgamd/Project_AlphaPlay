"use client";

import { useEffect, useState } from "react";
import { sfx } from "../sfx";
import { cx } from "./common";
import n from "./DeviceNotifications.module.css";

/**
 * Windows-style bottom-right notification box for launching Task 1 (15s cutoff).
 */
export function LockNotification({
  role,
  dualScores,
  onStart,
  onSwitchRole,
  onLeave,
}) {
  const isF = role === "father";

  useEffect(() => {
    sfx.notif();
  }, [role]);

  return (
    <div className={n.notifAnchor} role="alert">
      <div className={cx(n.card, isF ? n.cardWin : n.cardWarn)}>
        <div className={n.headRow}>
          <span className={n.appMeta}>
            <span className={isF ? n.dotCyan : n.dotAmber} />
            WIPEOUT · {isF ? "INSPECTOR SUBIR SEN" : "ROHAN CHATTERJEE"}
          </span>
          <span className={n.timeStamp}>15s / TASK</span>
        </div>

        {isF ? (
          <>
            <h3 className={n.title}>🚨 10 Sequential Tasks — Save Riya &amp; The Evidence</h3>
            <p className={n.body}>
              Follow each lead one by one with a strict <b>15-second cutoff</b>. Any wrong move or
              timeout restarts from scratch.
            </p>
            <div className={n.missionLine}>
              <b>Final /3 Goals:</b> Task 8 Stop Remote Delete → Task 9 Send Fraud Info to Police →
              Task 10 Free Riya on CholoMap.
            </div>
          </>
        ) : (
          <>
            <h3 className={n.title}>⚠️ 10 Complementary Tasks — Complete The Wipeout</h3>
            <p className={n.body}>
              Each task has a <b>15-second cutoff</b>. Slips in <b>Tasks 1–7</b> keep you rolling —
              but <b>Tasks 8, 9 &amp; 10</b> end your run if failed!
            </p>
            <div className={cx(n.missionLine, n.missionLineRohan)}>
              <b>Final /3 Goals:</b> Task 8 Lock Remote Delete → Task 9 Cut Police Uplink → Task 10
              Escape Kolkata.
            </div>
          </>
        )}

        <div className={n.statsRow} style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className={n.statCell}>
            <span>Subir Best</span>
            <b>{dualScores.fatherBest} / 3</b>
          </div>
          <div className={n.statCell}>
            <span>Rohan Best</span>
            <b>{dualScores.rohanBest} / 3</b>
          </div>
        </div>

        <div className={n.actions}>
          <button
            type="button"
            className={cx(n.primaryBtn, isF ? n.btnFather : n.btnRohan)}
            onClick={() => {
              sfx.unlock();
              sfx.stamp();
              onStart();
            }}
          >
            START TASK 1 (15s)
          </button>
          <button
            type="button"
            className={n.secondaryBtn}
            onClick={() => {
              sfx.paperFlip();
              onSwitchRole(isF ? "rohan" : "father");
            }}
          >
            {isF ? "Rohan POV" : "Subir POV"}
          </button>
          <button type="button" className={n.secondaryBtn} onClick={onLeave}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Windows-style bottom-right result notification box showing /3 scores from
 * both ends and allowing instant restart in either the same POV or the other POV.
 */
export function EndingNotification({
  run,
  dualScores,
  onRestartSame,
  onRestartOther,
  onLeave,
}) {
  const [minimized, setMinimized] = useState(false);

  const isF = run.role === "father";
  const won = run.endReason === "victory";
  const otherLabel = isF ? "Rohan" : "Subir";
  const sameLabel = isF ? "Subir" : "Rohan";

  const headline = won
    ? isF
      ? "WIPEOUT STOPPED — RIYA IS FREE! (3/3)"
      : "WIPEOUT COMPLETE — ESCAPED KOLKATA! (3/3)"
    : `FAILED AT TASK ${run.failedAtTask || "?"} — SCORE ${run.score}/3`;

  const bodyText = won
    ? isF
      ? "Remote delete revoked, Tender #404 transmitted to Lalbazar Police, and PCR freed Riya safely."
      : "Remote delete stayed locked, the police uplink was severed, and the White SUV broke out of Kolkata."
    : run.failDetail || "Task failed before the 15-second cutoff.";

  if (minimized) {
    return (
      <div className={n.notifAnchor}>
        <button
          type="button"
          className={cx(n.miniBar, !won && n.miniBarLoss)}
          onClick={() => {
            sfx.paperFlip();
            setMinimized(false);
          }}
        >
          <span>
            <strong>{won ? "3/3 VICTORY" : `${run.score}/3 FAILED`}</strong> · {headline}
          </span>
          <span>Expand ▾</span>
        </button>
      </div>
    );
  }

  return (
    <div className={n.notifAnchor} role="dialog" aria-label="Wipeout result">
      <div className={cx(n.card, won ? n.cardWin : n.cardDanger)}>
        <div className={n.headRow}>
          <span className={n.appMeta}>
            <span className={won ? n.dotCyan : n.dotRed} />
            WIPEOUT · {isF ? "SUBIR POV" : "ROHAN POV"}
          </span>
          <div className={n.headRight}>
            <button
              type="button"
              className={n.peekBtn}
              onClick={() => {
                sfx.paperFlip();
                setMinimized(true);
              }}
            >
              Peek ▴
            </button>
          </div>
        </div>

        <h3 className={n.title}>{headline}</h3>
        <p className={n.body}>{bodyText}</p>

        {!isF && run.slips.length > 0 && (
          <div className={cx(n.missionLine, n.missionLineRohan)}>
            Logged <b>{run.slips.length}</b> non-fatal slip{run.slips.length === 1 ? "" : "s"} in
            Tasks 1–7.
          </div>
        )}

        <div className={n.statsRow}>
          <div className={n.statCell}>
            <span>This Run</span>
            <b>{run.score} / 3</b>
          </div>
          <div className={n.statCell}>
            <span>Subir Best</span>
            <b>{dualScores.fatherBest} / 3</b>
          </div>
          <div className={n.statCell}>
            <span>Rohan Best</span>
            <b>{dualScores.rohanBest} / 3</b>
          </div>
        </div>

        <div className={n.actions}>
          <button
            type="button"
            className={cx(n.primaryBtn, isF ? n.btnFather : n.btnRohan)}
            onClick={() => {
              sfx.unlock();
              sfx.stamp();
              onRestartSame();
            }}
          >
            Restart ({sameLabel})
          </button>
          <button
            type="button"
            className={cx(n.primaryBtn, n.btnRematch)}
            onClick={() => {
              sfx.unlock();
              sfx.stamp();
              onRestartOther();
            }}
          >
            Play {otherLabel}
          </button>
          <button type="button" className={n.secondaryBtn} onClick={onLeave}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export const LockScreen = LockNotification;
export const EndingScreen = EndingNotification;

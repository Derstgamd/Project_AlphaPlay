"use client";

import { useState } from "react";
import { ZONES } from "../constants";
import { fictionClock, leadsSent } from "../engine";
import { sfx } from "../sfx";
import { cx, mmss } from "./common";
import n from "./DeviceNotifications.module.css";

/**
 * Diegetic OS-style notification banner for unlocking Riya's phone / launching
 * Rohan's remote wipe + 3-2-1 countdown right inside the live workspace UI.
 */
export function LockNotification({ g, role, now, dispatch, onLeave, inPhone }) {
  const isF = role === "father";
  const myReady = g.ready[role];
  const countdown = g.status === "countdown";
  const cdNum = Math.max(1, Math.ceil((g.countdownEndsAt - now) / 1000));

  return (
    <div className={cx(n.notifAnchor, inPhone && n.notifAnchorPhone)} role="alert">
      <div className={cx(n.card, isF ? n.cardDanger : n.cardWarn)}>
        <div className={n.headRow}>
          <span className={n.appMeta}>
            <span className={isF ? n.dotRed : n.dotAmber} />
            {isF ? "RIYA'S PHONE · SECURITY ALERT" : "BACK SEAT CONSOLE · ALERT"}
          </span>
          <span className={n.timeStamp}>8:15 PM</span>
        </div>

        {isF ? (
          <>
            <h3 className={n.title}>🚨 Remote Factory Reset Triggered (03:00 Delay)</h3>
            <p className={n.body}>
              Unknown linked device initiated a wipe. <b>LocketLink:</b> Riya&apos;s locket is <b>MOVING</b> — she&apos;s
              not in the garden.
            </p>
            <div className={n.missionLine}>
              Send <b>3 Leads</b> to Lalbazar from Riya&apos;s device, track her on the <b>Kolkata Map</b>, and{" "}
              <b>RAID</b> the SUV with your <b>2 PCR vans</b>.
            </div>
          </>
        ) : (
          <>
            <h3 className={n.title}>⚠️ She Left Her Phone at Home!</h3>
            <p className={n.body}>
              Your reset tripped her alarm and <b>Inspector Sen</b> is unlocking it. Scanner detects a{" "}
              <b>tracker in the SUV</b>.
            </p>
            <div className={cx(n.missionLine, n.missionLineRohan)}>
              Overwrite evidence before he sends it, guide the driver around his <b>2 PCR raids</b>, and hold out until{" "}
              <b>100% wipe</b>.
            </div>
          </>
        )}

        {countdown ? (
          <div className={n.countdownStrip}>
            <span>SYNCING BOTH DEVICES · 03:00 DELAY STARTING</span>
            <b className={n.countdownBig}>{cdNum}</b>
          </div>
        ) : (
          <div className={n.actions}>
            <button
              type="button"
              className={cx(
                n.primaryBtn,
                isF ? n.btnFather : n.btnRohan,
                myReady && n.btnWaiting
              )}
              disabled={myReady}
              onClick={() => {
                sfx.unlock();
                sfx.tap();
                dispatch({ type: "ready" });
              }}
            >
              {myReady
                ? isF
                  ? "WAITING FOR OTHER PHONE…"
                  : "WAITING FOR INSPECTOR…"
                : isF
                  ? "UNLOCK RIYA'S PHONE"
                  : "LAUNCH REMOTE WIPE"}
            </button>
            <button type="button" className={n.secondaryBtn} onClick={onLeave}>
              Leave
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Diegetic Dispatch / System result notification floating over the same live
 * Kolkata map & device UI, with a toggle to minimize and inspect the final board.
 */
export function EndingNotification({ g, role, now, dispatch, onLeave, inPhone }) {
  const [minimized, setMinimized] = useState(false);

  const sent = leadsSent(g);
  const fatherWon = g.winner === "father";
  const iWon = (role === "father" && fatherWon) || (role === "rohan" && !fatherWon);
  const zoneName = g.interceptZone ? ZONES[g.interceptZone]?.name : "Salt Lake";

  let headline = "";
  let leadLine = "";
  let detailLine = "";

  if (g.winner === "father") {
    headline = `INTERCEPTED AT ${zoneName.toUpperCase()} — ${fictionClock(g, now)}`;
    leadLine = `Bidhannagar PCR boxed in White SUV WB-06-${g.plateNum} before the highway ramp. Riya is safe.`;
    detailLine =
      sent >= 3
        ? "RC-44102 is on record at Lalbazar. Tender #404 is going to court."
        : "With Rohan in custody, his phone holds the trail.";
  } else if (g.winner === "rohan_wipe") {
    headline = `FACTORY RESET COMPLETE — ${fictionClock(g, now, true)}`;
    leadLine = "The white SUV hit the highway ramp, out of PCR range.";
    detailLine =
      sent === 0
        ? "Riya's phone is blank. Every trace of Tender #404 is gone."
        : sent < 3
          ? "Lalbazar has only a partial trail — not enough to stop the SUV tonight."
          : "Lalbazar has the full audit and Rohan's name is flagged, but Riya is gone.";
  } else {
    headline = "BOTH PCR VANS MISDIRECTED";
    leadLine = "Both vans reached empty streets; the SUV took the highway ramp.";
    detailLine = "Outside Salt Lake, the locket's eSIM dropped off LocketLink.";
  }

  if (minimized) {
    return (
      <div className={cx(n.notifAnchor, inPhone && n.notifAnchorPhone)}>
        <button
          type="button"
          className={cx(n.miniBar, !iWon && n.miniBarLoss)}
          onClick={() => setMinimized(false)}
        >
          <span>
            <strong>{iWon ? "VICTORY" : "DEFEAT"}</strong> · {headline}
          </span>
          <span>Expand ▾</span>
        </button>
      </div>
    );
  }

  return (
    <div className={cx(n.notifAnchor, inPhone && n.notifAnchorPhone)} role="dialog" aria-label="Match result">
      <div className={cx(n.card, iWon ? n.cardWin : n.cardDanger)}>
        <div className={n.headRow}>
          <span className={n.appMeta}>
            <span className={iWon ? n.dotCyan : n.dotRed} />
            {iWon ? "LALBAZAR DISPATCH · VICTORY" : "SYSTEM ALERT · DEFEAT"}
          </span>
          <div className={n.headRight}>
            <button type="button" className={n.peekBtn} onClick={() => setMinimized(true)}>
              Peek Map ▴
            </button>
          </div>
        </div>

        <h3 className={n.title}>{headline}</h3>
        <p className={n.body}>{leadLine}</p>
        <p className={n.body}>{detailLine}</p>

        <div className={n.statsRow}>
          {g.winner === "father" ? (
            <>
              <div className={n.statCell}>
                <span>Time Left</span>
                <b>{mmss(g.endTimeLeftMs)}</b>
              </div>
              <div className={n.statCell}>
                <span>Leads</span>
                <b>{sent}/3</b>
              </div>
              <div className={n.statCell}>
                <span>Pings</span>
                <b>{g.stats.pings}</b>
              </div>
            </>
          ) : g.winner === "rohan_wipe" ? (
            <>
              <div className={n.statCell}>
                <span>Wipe</span>
                <b>100%</b>
              </div>
              <div className={n.statCell}>
                <span>Leads</span>
                <b>{sent}/3</b>
              </div>
              <div className={n.statCell}>
                <span>Dodged</span>
                <b>{g.stats.raidsDodged}</b>
              </div>
            </>
          ) : (
            <>
              <div className={n.statCell}>
                <span>Leads</span>
                <b>{sent}/3</b>
              </div>
              <div className={n.statCell}>
                <span>Raids</span>
                <b>2/2</b>
              </div>
              <div className={n.statCell}>
                <span>Time Left</span>
                <b>{mmss(g.endTimeLeftMs)}</b>
              </div>
            </>
          )}
        </div>

        <div className={n.actions}>
          <button
            type="button"
            className={cx(n.primaryBtn, n.btnRematch)}
            onClick={() => {
              sfx.unlock();
              sfx.tap();
              dispatch({ type: "rematch" });
            }}
          >
            SWAP ROLES &amp; PLAY AGAIN
          </button>
          <button type="button" className={n.secondaryBtn} onClick={onLeave}>
            Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}

// Keep backwards-compatible exports just in case anything references them
export const LockScreen = LockNotification;
export const EndingScreen = EndingNotification;

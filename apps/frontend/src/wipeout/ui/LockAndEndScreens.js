"use client";

import { ZONES } from "../constants";
import { fictionClock, leadsSent } from "../engine";
import { sfx } from "../sfx";
import { cx, mmss } from "./common";
import s from "./wipeout.module.css";

export function LockScreen({ g, role, now, dispatch, onLeave }) {
  const isF = role === "father";
  const myReady = g.ready[role];
  const countdown = g.status === "countdown";
  const cdNum = Math.max(1, Math.ceil((g.countdownEndsAt - now) / 1000));

  return (
    <div className={cx(s.screen, isF ? s.lockFather : s.lockRohan)}>
      {isF ? (
        <>
          <div className={s.statusBar}>
            <span>8:15 PM</span>
            <span className={s.statusRight}>
              <span>📶 5G</span>
              <span>🔋 64% ⚡</span>
            </span>
          </div>
          <div className={s.onlinePill}>📡 STAY ONLINE: LOCKETLINK + DISPATCH</div>
          <div className={s.lockClock}>
            <div className={s.lockTime}>8:15</div>
            <div className={s.lockDate}>Friday, 20 November · Salt Lake</div>
          </div>
          <div className={s.lockCardDanger}>
            <div className={s.lockCardHead}>🚨 REMOTE FACTORY RESET — SECURITY DELAY 03:00</div>
            <p>
              Triggered by: <b>Unknown linked device</b>
            </p>
            <p>
              LocketLink: <b>Riya&apos;s locket is MOVING. She&apos;s not in the garden.</b>
            </p>
          </div>
          <div className={s.missionBox}>
            <div className={s.missionLabel}>YOUR MISSION — INSPECTOR SUBIR SEN</div>
            <p>
              Find out who took her. Send <b>3 Leads</b> to Lalbazar, track her locket on <b>CholoMap</b>, and{" "}
              <b>RAID</b> the SUV with your <b>2 PCR vans</b>.
            </p>
          </div>
          <button
            type="button"
            className={cx(s.lockCta, s.ctaFather, myReady && s.ctaWaiting)}
            disabled={myReady || countdown}
            onClick={() => {
              sfx.unlock();
              sfx.tap();
              dispatch({ type: "ready" });
            }}
          >
            {myReady ? "WAITING FOR OTHER PHONE…" : "UNLOCK RIYA'S PHONE"}
          </button>
        </>
      ) : (
        <>
          <div className={s.rohanLockBar}>
            <span>● BACK SEAT CONSOLE</span>
            <span>DRIVER AT WHEEL · RAMP IN 03:00</span>
          </div>
          <div className={s.lockCardWarn}>
            <div className={s.lockCardHead}>⚠️ SHE LEFT HER PHONE AT HOME!</div>
            <p>
              Your reset tripped her phone&apos;s alarm, and her dad (<b>Inspector Sen</b>) is unlocking it.
            </p>
            <p>
              Your scanner also says there&apos;s a <b>tracker somewhere in this car</b>.
            </p>
          </div>
          <div className={s.missionBoxDark}>
            <div className={s.missionLabel}>YOUR MISSION — ROHAN CHATTERJEE</div>
            <p>
              Overwrite the evidence before he sends it to Lalbazar, guide the driver around his <b>2 PCR raids</b>,
              and hold out until the wipe hits <b>100%</b>.
            </p>
          </div>
          <div className={s.rohanHintRow}>
            <span>☁️ Cloud handshake takes 10s at start — Reroute &amp; Spoofer work immediately.</span>
          </div>
          <button
            type="button"
            className={cx(s.lockCta, s.ctaRohan, myReady && s.ctaWaiting)}
            disabled={myReady || countdown}
            onClick={() => {
              sfx.unlock();
              sfx.tap();
              dispatch({ type: "ready" });
            }}
          >
            {myReady ? "WAITING FOR INSPECTOR…" : "LAUNCH REMOTE WIPE"}
          </button>
        </>
      )}

      <button type="button" className={s.lockExit} onClick={onLeave}>
        Leave room
      </button>

      {countdown && (
        <div className={s.countdownOverlay}>
          <div className={s.countdownLabel}>SYNCING BOTH DEVICES</div>
          <div className={s.countdownNum}>{cdNum}</div>
          <div className={s.countdownSub}>03:00 SECURITY DELAY STARTING…</div>
        </div>
      )}
    </div>
  );
}

export function EndingScreen({ g, role, now, dispatch, onLeave }) {
  const sent = leadsSent(g);
  const fatherWon = g.winner === "father";
  const iWon = (role === "father" && fatherWon) || (role === "rohan" && !fatherWon);
  const zoneName = g.interceptZone ? ZONES[g.interceptZone]?.name : "Salt Lake";

  let theme = s.endWipe;
  if (g.winner === "father") theme = s.endStrobe;
  else if (g.winner === "rohan_raids") theme = role === "father" ? s.endStatic : s.endEscape;

  return (
    <div className={cx(s.screen, s.ending, theme)}>
      <div className={s.endBanner}>{iWon ? "VICTORY" : "DEFEAT"}</div>

      {g.winner === "father" && (
        <div className={s.endCard}>
          <div className={s.endIcon}>🚔</div>
          <h2>
            INTERCEPTED AT {zoneName.toUpperCase()} — {fictionClock(g, now)}
          </h2>
          <p className={s.endLead}>
            Bidhannagar PCR boxed in White SUV <b>WB-06-{g.plateNum}</b> before the highway ramp.
          </p>
          <p>Riya is safe. Rohan Chatterjee and the driver are in custody.</p>
          <p className={s.endDynamic}>
            {sent >= 3
              ? "RC-44102 is on record at Lalbazar. Tender #404 is going to court."
              : "The full audit never reached Lalbazar, but with Rohan in custody, his phone holds the trail."}
          </p>
          <div className={s.statsGrid}>
            <div>
              <span>Time Left</span>
              <b>{mmss(g.endTimeLeftMs)}</b>
            </div>
            <div>
              <span>Leads</span>
              <b>{sent}/3</b>
            </div>
            <div>
              <span>Pings</span>
              <b>{g.stats.pings}</b>
            </div>
          </div>
        </div>
      )}

      {g.winner === "rohan_wipe" && (
        <div className={s.endCard}>
          <div className={cx(s.endIcon, s.spinSlow)}>☠️</div>
          <h2>FACTORY RESET COMPLETE — {fictionClock(g, now, true)}</h2>
          <p className={s.endLead}>The white SUV hit the highway ramp, out of PCR range.</p>
          <p className={s.endDynamic}>
            {sent === 0
              ? "Riya's phone is blank. Every trace of Tender #404 is gone."
              : sent < 3
                ? "Lalbazar has a partial trail and a phone number. It's not enough to stop the SUV tonight."
                : "Lalbazar has the full audit and Rohan's name is on every police screen in the state. But Riya is gone."}
          </p>
          <div className={s.statsGrid}>
            <div>
              <span>Wipe</span>
              <b>100%</b>
            </div>
            <div>
              <span>Leads Sent</span>
              <b>{sent}/3</b>
            </div>
            <div>
              <span>Raids Dodged</span>
              <b>{g.stats.raidsDodged}</b>
            </div>
          </div>
        </div>
      )}

      {g.winner === "rohan_raids" && (
        <div className={s.endCard}>
          <div className={s.endIcon}>🚫</div>
          <h2>BOTH PCR VANS MISDIRECTED — {fictionClock(g, now)}</h2>
          <p className={s.endLead}>Both vans reached empty streets.</p>
          <p className={s.endDynamic}>
            With no vans left in range, the SUV took the highway ramp. Outside Salt Lake, the locket&apos;s eSIM dropped
            off LocketLink.
          </p>
          <div className={s.statsGrid}>
            <div>
              <span>Leads</span>
              <b>{sent}/3</b>
            </div>
            <div>
              <span>Raids Missed</span>
              <b>2/2</b>
            </div>
            <div>
              <span>Time Left</span>
              <b>{mmss(g.endTimeLeftMs)}</b>
            </div>
          </div>
        </div>
      )}

      <div className={s.endActions}>
        <button
          type="button"
          className={s.rematchBtn}
          onClick={() => {
            sfx.unlock();
            sfx.tap();
            dispatch({ type: "rematch" });
          }}
        >
          SWAP ROLES &amp; PLAY AGAIN
        </button>
        <button type="button" className={s.ghostBtn} onClick={onLeave}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { sfx } from "../sfx";
import { cx } from "./common";
import s from "./wipeout.module.css";

export function LandingScreen({ ctl }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  function submitJoin(e) {
    e.preventDefault();
    const clean = code.replace(/\D/g, "").slice(0, 4);
    if (clean.length !== 4) {
      setErr("Enter the 4-digit room code");
      sfx.bad();
      return;
    }
    sfx.unlock();
    sfx.tap();
    ctl.join(clean);
  }

  return (
    <div className={cx(s.screen, s.landing)}>
      <div className={s.landingHero}>
        <div className={s.kicker}>KOLKATA · 20 NOV 2026 · 03:00 ROUND</div>
        <h1 className={s.title}>
          <span className={s.titleTime}>8:15 PM</span>
          <span className={s.titleSlash}>{"//"}</span>
          <span className={s.titleWipe}>WIPEOUT</span>
        </h1>
        <p className={s.story}>
          Riya stepped out for a quick walk and left her phone on the table. Suddenly, it starts wiping itself.
        </p>
      </div>

      <div className={s.roleSection}>
        <div className={s.sectionLabel}>HOST A 2-PHONE MATCH</div>
        <button
          type="button"
          className={cx(s.roleCard, s.roleFather)}
          onClick={() => {
            sfx.unlock();
            sfx.tap();
            ctl.hostOnline("father");
          }}
        >
          <span className={s.roleBadge}>PLAYER 1 · GOOD</span>
          <strong>PLAY AS FATHER</strong>
          <span>Inspector Subir Sen — Riya&apos;s Phone</span>
        </button>

        <button
          type="button"
          className={cx(s.roleCard, s.roleRohan)}
          onClick={() => {
            sfx.unlock();
            sfx.tap();
            ctl.hostOnline("rohan");
          }}
        >
          <span className={s.roleBadge}>PLAYER 2 · TRAITOR</span>
          <strong>PLAY AS ROHAN</strong>
          <span>Back Seat of Getaway SUV — Remote Attack</span>
        </button>
      </div>

      <form className={s.joinBox} onSubmit={submitJoin}>
        <div className={s.sectionLabel}>JOIN ON A SECOND PHONE</div>
        <div className={s.joinRow}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            placeholder="4829"
            aria-label="4-digit room code"
            className={s.codeInput}
            value={code}
            onChange={(e) => {
              setErr("");
              setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
            }}
          />
          <button type="submit" className={s.joinBtn}>
            JOIN ROOM
          </button>
        </div>
        {err && <div className={s.inlineErr}>{err}</div>}
      </form>

      <div className={s.soloBox}>
        <div className={s.sectionLabel}>SOLO / JUDGE TESTING</div>
        <div className={s.soloRow}>
          <button
            type="button"
            className={s.ghostBtn}
            onClick={() => {
              sfx.unlock();
              sfx.tap();
              ctl.playBot("father");
            }}
          >
            Father vs. Bot
          </button>
          <button
            type="button"
            className={s.ghostBtn}
            onClick={() => {
              sfx.unlock();
              sfx.tap();
              ctl.playBot("rohan");
            }}
          >
            Rohan vs. Bot
          </button>
        </div>
      </div>

      <footer className={s.landingFoot}>2-Player Asymmetric Thriller · Zero Sign-Up</footer>
    </div>
  );
}

export function PairingScreen({ ctl, snap }) {
  const { roomCode, game, link } = snap;
  const hostRole = game?.roles.host || "father";
  const [lanInfo, setLanInfo] = useState({ ips: [], port: "" });
  const [ipIdx, setIpIdx] = useState(0);
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  useEffect(() => {
    if (!isLocal) return;
    let active = true;
    fetch("/api/lan")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.ips?.length) setLanInfo(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isLocal]);

  const base =
    isLocal && lanInfo.ips.length
      ? `${window.location.protocol}//${lanInfo.ips[ipIdx % lanInfo.ips.length]}${lanInfo.port ? ":" + lanInfo.port : ""}`
      : origin;
  const joinLink = base ? `${base}/?room=${roomCode}` : "";

  useEffect(() => {
    if (!joinLink) return;
    let active = true;
    QRCode.toDataURL(joinLink, {
      width: 220,
      margin: 2,
      color: { dark: "#0b1120", light: "#f8fafc" },
    })
      .then((url) => {
        if (active) setQrUrl(url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [joinLink]);

  function copyLink() {
    if (!joinLink) return;
    navigator.clipboard?.writeText(joinLink).catch(() => {});
    setCopied(true);
    sfx.tap();
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={cx(s.screen, s.pairing)}>
      <div className={s.topNav}>
        <button type="button" className={s.textBtn} onClick={ctl.leave}>
          ← Back
        </button>
        <span className={s.pillMuted}>
          {link.kind === "supabase" ? "Supabase Realtime" : "Local Live Relay"} ·{" "}
          {link.status === "open" ? "LIVE" : link.status.toUpperCase()}
        </span>
      </div>

      <div className={s.pairCard}>
        <div className={s.kicker}>
          YOU ARE {hostRole === "father" ? "INSPECTOR SUBIR SEN (FATHER)" : "ROHAN CHATTERJEE (TRAITOR)"}
        </div>
        <div className={s.pairCodeLabel}>ROOM CODE</div>
        <div className={s.pairCode}>{roomCode}</div>

        <div className={s.qrWrap}>
          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrUrl} alt={`QR code to join room ${roomCode}`} className={s.qrImg} />
          ) : (
            <div className={s.qrPlaceholder}>Generating QR…</div>
          )}
        </div>

        <p className={s.pairHint}>
          Scan on a second phone or enter <b>{roomCode}</b>. No sign-up required.
        </p>

        {joinLink && (
          <div className={s.pairActions}>
            <button type="button" className={s.ghostBtn} onClick={copyLink}>
              {copied ? "✓ Link Copied" : "Copy Join Link"}
            </button>
            {isLocal && lanInfo.ips.length > 1 && (
              <button
                type="button"
                className={s.ghostBtn}
                onClick={() => setIpIdx((i) => (i + 1) % lanInfo.ips.length)}
              >
                LAN IP ({lanInfo.ips[ipIdx % lanInfo.ips.length]})
              </button>
            )}
          </div>
        )}

        <div className={s.waitPulse}>
          <span className={s.dotPulse} /> Waiting for Player 2 ({hostRole === "father" ? "Rohan" : "Father"}) to join…
        </div>
        {link.error && <div className={s.inlineErr}>{link.error}</div>}
      </div>

      <div className={s.botFallback}>
        <span>Testing solo?</span>
        <button
          type="button"
          className={s.botBtn}
          onClick={() => {
            sfx.unlock();
            sfx.tap();
            ctl.playBot(hostRole);
          }}
        >
          PLAY VS. BOT
        </button>
      </div>
    </div>
  );
}

export function JoiningScreen({ ctl, snap }) {
  return (
    <div className={cx(s.screen, s.joining)}>
      <div className={s.topNav}>
        <button type="button" className={s.textBtn} onClick={ctl.leave}>
          ← Cancel
        </button>
      </div>
      <div className={s.pairCard}>
        <div className={s.pairCodeLabel}>CONNECTING TO ROOM</div>
        <div className={s.pairCode}>{snap.roomCode}</div>
        <div className={s.waitPulse}>
          <span className={s.dotPulse} /> Syncing with host device…
        </div>
        {snap.link.error && <div className={s.inlineErr}>{snap.link.error}</div>}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { sfx } from "../sfx";
import c from "./ClipboardLobby.module.css";

function ClipboardFrame({ pageKey, children }) {
  return (
    <div className={c.clipboard}>
      {/* Brushed-steel spring clip */}
      <div className={c.metalClip} aria-hidden="true">
        <span className={c.clipLoop} />
        <div className={c.clipBar}>
          <span className={c.rivet} />
          <span className={c.rivet} />
        </div>
      </div>

      {/* Stacked paper sheets underneath */}
      <div className={c.paperStack}>
        <div className={c.underSheetB} aria-hidden="true" />
        <div className={c.underSheetA} aria-hidden="true" />
        <div key={pageKey} className={c.sheet}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function LandingScreen({ ctl }) {
  const [page, setPage] = useState("roles"); // "roles" (Page 1) | "join" (Page 2)
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

  if (page === "join") {
    return (
      <ClipboardFrame pageKey="landing-page-2">
        <div className={c.sheetTop}>
          <button
            type="button"
            className={c.flipBackBtn}
            onClick={() => {
              sfx.tap();
              setPage("roles");
            }}
          >
            ← Page 1: Roles
          </button>
          <span className={c.pageNum}>SHEET 02 / 02</span>
        </div>

        <div className={c.heroBlock}>
          <div className={c.titleRow}>
            <h1 className={c.title}>
              JOIN <span className={c.titleWipe}>DISPATCH</span>
            </h1>
            <span className={c.rubberStamp}>2ND DEVICE</span>
          </div>
          <p className={c.storyNote}>
            Enter the 4-digit room code from the host clipboard, or run a solo test match against the bot.
          </p>
        </div>

        <form className={c.paperBlock} onSubmit={submitJoin}>
          <div className={c.inkSection}>JOIN ON A SECOND PHONE</div>
          <div className={c.joinRow}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="4829"
              aria-label="4-digit room code"
              className={c.codeInput}
              value={code}
              onChange={(e) => {
                setErr("");
                setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
              }}
            />
            <button type="submit" className={c.stampSubmitBtn}>
              JOIN ROOM
            </button>
          </div>
          {err && <div className={c.inlineErr}>{err}</div>}
        </form>

        <div className={c.paperBlock}>
          <div className={c.inkSection}>SOLO / JUDGE TESTING</div>
          <div className={c.soloRow}>
            <button
              type="button"
              className={c.inkBtn}
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
              className={c.inkBtn}
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

        <div className={c.flipBar}>
          <span className={c.footCaption}>ZERO SIGN-UP · LIVE RELAY</span>
          <button
            type="button"
            className={c.nextPageBtn}
            onClick={() => {
              sfx.tap();
              setPage("roles");
            }}
          >
            ← Back to Roles
          </button>
        </div>
      </ClipboardFrame>
    );
  }

  return (
    <ClipboardFrame pageKey="landing-page-1">
      <div className={c.sheetTop}>
        <span className={c.formStamp}>KOLKATA · 20 NOV 2026</span>
        <span className={c.pageNum}>SHEET 01 / 02</span>
      </div>

      <div className={c.heroBlock}>
        <div className={c.titleRow}>
          <h1 className={c.title}>
            8:15 PM <span className={c.titleWipe}>{"//"} WIPEOUT</span>
          </h1>
          <span className={c.rubberStamp}>03:00 ROUND</span>
        </div>
        <p className={c.storyNote}>
          Riya stepped out for a quick walk and left her phone on the table. Suddenly, it starts wiping itself.
        </p>
      </div>

      <div className={c.roleList}>
        <div className={c.inkSection}>HOST A 2-PHONE MATCH — CHECK ASSIGNMENT</div>

        <button
          type="button"
          className={`${c.rolePaperBtn} ${c.rolePaperFather}`}
          onClick={() => {
            sfx.unlock();
            sfx.tap();
            ctl.hostOnline("father");
          }}
        >
          <span className={c.checkbox} aria-hidden="true">✓</span>
          <span className={c.roleCopy}>
            <span className={c.roleTagFather}>PLAYER 1 · GOOD</span>
            <span className={c.roleTitle}>Play as Father</span>
            <span className={c.roleSub}>Inspector Subir Sen — Riya&apos;s Phone</span>
          </span>
        </button>

        <button
          type="button"
          className={`${c.rolePaperBtn} ${c.rolePaperRohan}`}
          onClick={() => {
            sfx.unlock();
            sfx.tap();
            ctl.hostOnline("rohan");
          }}
        >
          <span className={c.checkbox} aria-hidden="true">✓</span>
          <span className={c.roleCopy}>
            <span className={c.roleTagRohan}>PLAYER 2 · TRAITOR</span>
            <span className={c.roleTitle}>Play as Rohan</span>
            <span className={c.roleSub}>Back Seat of Getaway SUV — Remote Attack</span>
          </span>
        </button>
      </div>

      <div className={c.quickFoot}>
        <span>Have a room code or testing solo?</span>
      </div>

      <div className={c.flipBar}>
        <span className={c.footCaption}>2-PLAYER ASYMMETRIC THRILLER</span>
        <button
          type="button"
          className={c.nextPageBtn}
          onClick={() => {
            sfx.tap();
            setPage("join");
          }}
        >
          Join / Solo · Next Page →
        </button>
      </div>
    </ClipboardFrame>
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
      color: { dark: "#1c1917", light: "#fafaf7" },
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
    <ClipboardFrame pageKey={`pairing-${roomCode}`}>
      <div className={c.sheetTop}>
        <button type="button" className={c.flipBackBtn} onClick={ctl.leave}>
          ← Flip back
        </button>
        <span className={c.relayPill}>
          {link.kind === "supabase" ? "SUPABASE" : "LOCAL RELAY"} ·{" "}
          {link.status === "open" ? "LIVE" : link.status.toUpperCase()}
        </span>
      </div>

      <div className={c.pairCenter}>
        <div className={c.roleBanner}>
          YOU ARE {hostRole === "father" ? "INSPECTOR SUBIR SEN (FATHER)" : "ROHAN CHATTERJEE (TRAITOR)"}
        </div>

        <div className={c.codeStampBox}>
          <span className={c.codeStampLabel}>ROOM CODE</span>
          <span className={c.codeStampNum}>{roomCode}</span>
        </div>

        <div className={c.tapedQr}>
          <span className={c.tapeStrip} aria-hidden="true" />
          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrUrl} alt={`QR code to join room ${roomCode}`} className={c.qrImg} />
          ) : (
            <div className={c.qrPlaceholder}>Generating QR…</div>
          )}
        </div>

        <p className={c.pairHint}>
          Scan on a second phone or enter <b>{roomCode}</b>. No sign-up required.
        </p>

        {joinLink && (
          <div className={c.pairActions}>
            <button type="button" className={c.inkBtn} onClick={copyLink}>
              {copied ? "✓ Link Copied" : "Copy Join Link"}
            </button>
            {isLocal && lanInfo.ips.length > 1 && (
              <button
                type="button"
                className={c.inkBtn}
                onClick={() => setIpIdx((i) => (i + 1) % lanInfo.ips.length)}
              >
                LAN IP ({lanInfo.ips[ipIdx % lanInfo.ips.length]})
              </button>
            )}
          </div>
        )}

        <div className={c.waitRow}>
          <span className={c.waitDot} /> Waiting for Player 2 ({hostRole === "father" ? "Rohan" : "Father"}) to join…
        </div>
        {link.error && <div className={c.inlineErr}>{link.error}</div>}
      </div>

      <div className={c.botFootRow}>
        <span>Testing solo?</span>
        <button
          type="button"
          className={c.botStampBtn}
          onClick={() => {
            sfx.unlock();
            sfx.tap();
            ctl.playBot(hostRole);
          }}
        >
          PLAY VS. BOT
        </button>
      </div>
    </ClipboardFrame>
  );
}

export function JoiningScreen({ ctl, snap }) {
  return (
    <ClipboardFrame pageKey={`joining-${snap.roomCode}`}>
      <div className={c.sheetTop}>
        <button type="button" className={c.flipBackBtn} onClick={ctl.leave}>
          ← Cancel
        </button>
        <span className={c.pageNum}>SHEET 02 · SYNC</span>
      </div>

      <div className={c.pairCenter} style={{ margin: "auto 0" }}>
        <div className={c.codeStampBox}>
          <span className={c.codeStampLabel}>CONNECTING TO ROOM</span>
          <span className={c.codeStampNum}>{snap.roomCode}</span>
        </div>
        <div className={c.waitRow}>
          <span className={c.waitDot} /> Syncing with host device…
        </div>
        {snap.link.error && <div className={c.inlineErr}>{snap.link.error}</div>}
      </div>
    </ClipboardFrame>
  );
}

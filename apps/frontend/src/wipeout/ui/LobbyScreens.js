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

export function LandingScreen({ ctl, dualScores, muted, onToggleMute, onStartSolo }) {
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
    sfx.stamp();
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
              sfx.unlock();
              sfx.paperFlip();
              setPage("roles");
            }}
          >
            ← Page 1: Wipeout POVs
          </button>
          <div className={c.sheetTopRight}>
            <button type="button" className={c.audioStampBtn} onClick={onToggleMute}>
              {muted ? "🔇 MUTED" : "🔊 AUDIO"}
            </button>
            <span className={c.pageNum}>SHEET 02 / 02</span>
          </div>
        </div>

        <div className={c.heroBlock}>
          <div className={c.titleRow}>
            <h1 className={c.title}>
              WIPEOUT <span className={c.titleWipe}>2-DEVICE</span>
            </h1>
            <span className={c.rubberStamp}>OPTIONAL SYNC</span>
          </div>
          <p className={c.storyNote}>
            Pair two devices to play Subir &amp; Rohan side-by-side, or join an existing 4-digit
            dispatch room.
          </p>
        </div>

        <form className={c.paperBlock} onSubmit={submitJoin}>
          <div className={c.inkSection}>JOIN WITH 4-DIGIT ROOM CODE</div>
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
                sfx.keyPress();
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
          <div className={c.inkSection}>HOST A 2-DEVICE ROOM</div>
          <div className={c.soloRow}>
            <button
              type="button"
              className={c.inkBtn}
              onClick={() => {
                sfx.unlock();
                sfx.stamp();
                ctl.hostOnline("father");
              }}
            >
              Host as Subir
            </button>
            <button
              type="button"
              className={c.inkBtn}
              onClick={() => {
                sfx.unlock();
                sfx.stamp();
                ctl.hostOnline("rohan");
              }}
            >
              Host as Rohan
            </button>
          </div>
        </div>

        <div className={c.flipBar}>
          <span className={c.footCaption}>ZERO SIGN-UP · LIVE RELAY</span>
          <button
            type="button"
            className={c.nextPageBtn}
            onClick={() => {
              sfx.unlock();
              sfx.paperFlip();
              setPage("roles");
            }}
          >
            ← Back to POVs
          </button>
        </div>
      </ClipboardFrame>
    );
  }

  return (
    <ClipboardFrame pageKey="landing-page-1">
      <div className={c.sheetTop}>
        <span className={c.formStamp}>KOLKATA CASE FILE · TENDER #404</span>
        <div className={c.sheetTopRight}>
          <button type="button" className={c.audioStampBtn} onClick={onToggleMute}>
            {muted ? "🔇 MUTED" : "🔊 AUDIO"}
          </button>
          <span className={c.pageNum}>SHEET 01 / 02</span>
        </div>
      </div>

      <div className={c.heroBlock}>
        <div className={c.titleRow}>
          <h1 className={c.title}>
            <span className={c.titleWipe}>WIPEOUT</span>
          </h1>
          <span className={c.rubberStamp}>10 TASKS · 15s EACH</span>
        </div>
        <p className={c.storyNote}>
          Riya&apos;s laptop is wiping Tender #404. Beat all 10 rapid-fire tasks one by one from
          both perspectives to score 3/3 on each end!
        </p>
      </div>

      <div className={c.dualScoreBar} aria-label="Dual POV scores">
        <div className={`${c.dualScoreCell} ${c.dualScoreFather}`}>
          <span>SUBIR POV</span>
          <b>{dualScores.fatherBest} / 3</b>
        </div>
        <div className={`${c.dualScoreCell} ${c.dualScoreRohan}`}>
          <span>ROHAN POV</span>
          <b>{dualScores.rohanBest} / 3</b>
        </div>
      </div>

      <div className={c.roleList}>
        <div className={c.inkSection}>CHOOSE YOUR PERSPECTIVE — START IMMEDIATELY</div>

        <button
          type="button"
          className={`${c.rolePaperBtn} ${c.rolePaperFather}`}
          onClick={() => {
            sfx.unlock();
            sfx.stamp();
            onStartSolo("father");
          }}
        >
          <span className={c.checkbox} aria-hidden="true">✓</span>
          <span className={c.roleCopy}>
            <span className={c.roleTagFather}>SUBIR POV · 15s STRICT CUTOFF</span>
            <span className={c.roleTitle}>Play as Subir (Father)</span>
            <span className={c.roleSub}>
              10 tasks on Riya&apos;s laptop &amp; CholoMap — Stop Delete → Send Fraud Info → Free
              Riya
            </span>
          </span>
        </button>

        <button
          type="button"
          className={`${c.rolePaperBtn} ${c.rolePaperRohan}`}
          onClick={() => {
            sfx.unlock();
            sfx.stamp();
            onStartSolo("rohan");
          }}
        >
          <span className={c.checkbox} aria-hidden="true">✓</span>
          <span className={c.roleCopy}>
            <span className={c.roleTagRohan}>ROHAN POV · FAIL STARTS AT TASK 8</span>
            <span className={c.roleTitle}>Play as Rohan</span>
            <span className={c.roleSub}>
              10 complementary tasks — Lock Delete → Cut Police Uplink → Escape Kolkata
            </span>
          </span>
        </button>
      </div>

      <div className={c.quickFoot}>
        <span>Playing on two devices or have a room code?</span>
      </div>

      <div className={c.flipBar}>
        <span className={c.footCaption}>DUAL POV SCORE: {dualScores.fatherBest + dualScores.rohanBest} / 6</span>
        <button
          type="button"
          className={c.nextPageBtn}
          onClick={() => {
            sfx.unlock();
            sfx.paperFlip();
            setPage("join");
          }}
        >
          2-Device / Join →
        </button>
      </div>
    </ClipboardFrame>
  );
}

export function PairingScreen({ ctl, snap, muted, onToggleMute, onStartSolo }) {
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
        <button
          type="button"
          className={c.flipBackBtn}
          onClick={() => {
            sfx.paperFlip();
            ctl.leave();
          }}
        >
          ← Flip back
        </button>
        <div className={c.sheetTopRight}>
          <button type="button" className={c.audioStampBtn} onClick={onToggleMute}>
            {muted ? "🔇 MUTED" : "🔊 AUDIO"}
          </button>
          <span className={c.relayPill}>
            {link.kind === "supabase" ? "SUPABASE" : "LOCAL RELAY"} ·{" "}
            {link.status === "open" ? "LIVE" : link.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className={c.pairCenter}>
        <div className={c.roleBanner}>
          WIPEOUT · {hostRole === "father" ? "INSPECTOR SUBIR SEN" : "ROHAN CHATTERJEE"}
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
          Scan on a second device or enter <b>{roomCode}</b>.
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
          <span className={c.waitDot} /> Waiting for Player 2 ({hostRole === "father" ? "Rohan" : "Subir"})…
        </div>
        {link.error && <div className={c.inlineErr}>{link.error}</div>}
      </div>

      <div className={c.botFootRow}>
        <span>Don&apos;t want to wait?</span>
        <button
          type="button"
          className={c.botStampBtn}
          onClick={() => {
            sfx.unlock();
            sfx.stamp();
            ctl.leave();
            onStartSolo(hostRole);
          }}
        >
          PLAY NOW
        </button>
      </div>
    </ClipboardFrame>
  );
}

export function JoiningScreen({ ctl, snap, muted, onToggleMute }) {
  return (
    <ClipboardFrame pageKey={`joining-${snap.roomCode}`}>
      <div className={c.sheetTop}>
        <button
          type="button"
          className={c.flipBackBtn}
          onClick={() => {
            sfx.paperFlip();
            ctl.leave();
          }}
        >
          ← Cancel
        </button>
        <div className={c.sheetTopRight}>
          <button type="button" className={c.audioStampBtn} onClick={onToggleMute}>
            {muted ? "🔇 MUTED" : "🔊 AUDIO"}
          </button>
          <span className={c.pageNum}>SHEET 02 · SYNC</span>
        </div>
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

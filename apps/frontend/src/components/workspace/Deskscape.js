"use client";

import { useCase } from "@/context/CaseContext";
import styles from "./Deskscape.module.css";

function Prop({ label, className = "", style, onClick, children }) {
  return (
    <button
      type="button"
      className={`${styles.prop} ${className}`}
      style={style}
      onClick={onClick}
      aria-label={label}
    >
      <span className={styles.propLabel}>{label}</span>
      {children}
    </button>
  );
}

function LaptopArt({ unread }) {
  return (
    <svg viewBox="0 0 240 150" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="dsScreen" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.92" />
          <stop offset="55%" stopColor="#4f86c6" stopOpacity="0.84" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="dsSpill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dsBounce" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform="rotate(6 120 82)">
        <ellipse cx="120" cy="88" rx="116" ry="56" fill="url(#dsSpill)" className={styles.pulse} />
        <polygon points="46,72 196,72 214,134 28,134" fill="rgba(0,0,0,0.6)" />
        <polygon points="52,18 188,18 194,68 46,68" fill="#12161d" stroke="#363f4f" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="57,23 183,23 188,63 52,63" fill="url(#dsScreen)" className={styles.pulse} />
        <polygon points="62,28 92,28 94,58 58,58" fill="#0f172a" opacity="0.34" />
        <polygon points="98,28 176,28 179,48 99,48" fill="#e0f2fe" opacity="0.24" />
        <polygon points="99,52 150,52 151,58 99,58" fill="#bae6fd" opacity="0.28" />
        <rect x="64" y="66" width="112" height="4" rx="1.5" fill="#0d1016" />
        <polygon points="46,69 194,69 208,124 32,124" fill="#2a303c" stroke="#3e4759" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="46,69 194,69 203,104 37,104" fill="url(#dsBounce)" />
        <polygon points="55,75 185,75 192,101 48,101" fill="#171b23" />
        <line x1="56" y1="81" x2="184" y2="81" stroke="#2c3340" strokeWidth="2.5" strokeDasharray="8 3" />
        <line x1="54" y1="87" x2="186" y2="87" stroke="#2c3340" strokeWidth="2.5" strokeDasharray="9 3" />
        <line x1="52" y1="93" x2="188" y2="93" stroke="#2c3340" strokeWidth="2.5" strokeDasharray="7 3" />
        <polygon points="96,105 144,105 147,119 93,119" fill="#222833" stroke="#343c4c" strokeWidth="1" />
        <polygon points="32,124 208,124 206,129 34,129" fill="#181d26" />
        {unread > 0 && <circle cx="186" cy="24" r="9" fill="#ef4444" stroke="#12161d" strokeWidth="2" />}
        {unread > 0 && (
          <text x="186" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
            {unread}
          </text>
        )}
      </g>
    </svg>
  );
}

function PhoneArt({ unread }) {
  return (
    <svg viewBox="0 0 80 110" width="100%" height="100%" aria-hidden="true">
      <g transform="rotate(16 40 55)">
        <rect x="18" y="14" width="46" height="84" rx="8" fill="rgba(0,0,0,0.55)" />
        <rect x="14" y="10" width="46" height="84" rx="8" fill="#14171d" stroke="#cc4844" strokeWidth="3.5" />
        <rect
          x="19"
          y="18"
          width="36"
          height="68"
          rx="3"
          fill={unread > 0 ? "#2b4a7a" : "#1e2736"}
          className={unread > 0 ? styles.pulse : undefined}
        />
        {unread > 0 && (
          <>
            <rect x="22" y="24" width="30" height="9" rx="2" fill="#e0f2fe" opacity="0.85" />
            <rect x="22" y="36" width="30" height="9" rx="2" fill="#e0f2fe" opacity="0.6" />
            <rect x="22" y="48" width="20" height="5" rx="2" fill="#e0f2fe" opacity="0.4" />
          </>
        )}
        <line x1="32" y1="14" x2="42" y2="14" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function LampArt({ on }) {
  return (
    <svg viewBox="0 0 120 170" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id="dsBulb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3b0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="38" cy="160" rx="30" ry="7" fill="rgba(0,0,0,0.55)" />
      <ellipse cx="38" cy="154" rx="26" ry="8" fill="#23272f" stroke="#3a404c" strokeWidth="1.5" />
      <path d="M38 150 L52 84 L88 40" fill="none" stroke="#2f343e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 150 L52 84 L88 40" fill="none" stroke="#4a5262" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="52" cy="84" r="5" fill="#3a404c" />
      <polygon points="70,34 112,52 100,78 58,58" fill={on ? "#3f5a3a" : "#26331f"} stroke="#1b2217" strokeWidth="2" />
      <polygon points="70,34 112,52 108,60 66,42" fill={on ? "#5d8456" : "#2d3b27"} />
      {on && <ellipse cx="86" cy="68" rx="30" ry="20" fill="url(#dsBulb)" className={styles.pulse} />}
      {on && <circle cx="86" cy="64" r="5" fill="#fff6c4" />}
    </svg>
  );
}

export default function Deskscape({
  lampOn,
  onToggleLamp,
  onOpenDevice,
  onOpenCase,
  onOpenNotes,
  onInspect,
}) {
  const { totalUnread } = useCase();

  return (
    <div className={styles.desk}>
      <div className={`${styles.lampPool} ${lampOn ? styles.lampPoolOn : ""}`} aria-hidden="true" />

      <div className={styles.inner}>
        <Prop
          label="Notes & scratchpad"
          className={styles.sticky}
          style={{ left: "3%" }}
          onClick={onOpenNotes}
        >
          <span className={styles.pencils} aria-hidden="true">
            <i style={{ background: "#2563eb" }} />
            <i style={{ background: "#eab308" }} />
            <i style={{ background: "#16a34a" }} />
            <i style={{ background: "#e5e7eb" }} />
          </span>
          <span className={styles.stickyText}>
            <strong>Don&apos;t forget</strong>
            Check Locker #19
            <br />
            PIN: ????
          </span>
        </Prop>

        <Prop label="Case file CASE-04" className={styles.folder} style={{ left: "14%" }} onClick={onOpenCase}>
          <span className={styles.folderTab}>CASE-04</span>
          <span className={styles.folderBody}>
            <span className={styles.stamp}>OPEN</span>
            <span className={styles.folderLine} />
            <span className={styles.folderLine} />
            <span className={styles.folderLine} style={{ width: "55%" }} />
          </span>
        </Prop>

        <Prop
          label="Open Adam's Laptop"
          className={styles.laptop}
          style={{ left: "28%" }}
          onClick={() => onOpenDevice("laptop")}
        >
          <LaptopArt unread={totalUnread} />
        </Prop>

        <div className={styles.mug} aria-hidden="true">
          <span className={styles.steam} />
          <span className={`${styles.steam} ${styles.steam2}`} />
          <span className={styles.mugBody} />
        </div>

        <Prop
          label="Evidence bag: silver keycard"
          className={styles.bag}
          style={{ left: "58%" }}
          onClick={() =>
            onInspect({
              title: "Silver Keycard",
              role: "Evidence Bag #3",
              details:
                "A silver Pinehollow Transit keycard found at Substation B. Tara saw Adam with someone carrying one. Adam's note warns not to trust whoever holds it.",
            })
          }
        >
          <span className={styles.bagCard}>
            <i />
            <b>PH-TRANSIT</b>
          </span>
        </Prop>

        <Prop
          label={lampOn ? "Turn lamp off" : "Turn lamp on"}
          className={styles.lamp}
          style={{ left: "70%" }}
          onClick={onToggleLamp}
        >
          <LampArt on={lampOn} />
        </Prop>

        <Prop
          label={totalUnread > 0 ? `Open Adam's Phone (${totalUnread} new)` : "Open Adam's Phone"}
          className={`${styles.phone} ${totalUnread > 0 ? styles.buzz : ""}`}
          style={{ left: "86%" }}
          onClick={() => onOpenDevice("phone")}
        >
          <PhoneArt unread={totalUnread} />
        </Prop>
      </div>
    </div>
  );
}

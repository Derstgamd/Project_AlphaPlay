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

function PinBundleArt() {
  return (
    <svg viewBox="0 0 110 72" width="100%" height="100%" aria-hidden="true">
      <defs>
        <filter id="deskPinSh" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <radialGradient id="dRedCap" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="45%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>
        <radialGradient id="dAmberCap" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
        <radialGradient id="dIvoryCap" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#faf7f0" />
          <stop offset="55%" stopColor="#c7bfb0" />
          <stop offset="100%" stopColor="#57534e" />
        </radialGradient>
      </defs>
      <g filter="url(#deskPinSh)" opacity="0.72">
        <ellipse cx="32" cy="44" rx="13" ry="6" transform="rotate(-14 32 44)" fill="#000" />
        <ellipse cx="56" cy="36" rx="14" ry="7" transform="rotate(10 56 36)" fill="#000" />
        <ellipse cx="78" cy="48" rx="13" ry="6" transform="rotate(-8 78 48)" fill="#000" />
        <ellipse cx="48" cy="54" rx="11" ry="5" transform="rotate(18 48 54)" fill="#000" />
      </g>
      <line x1="26" y1="35" x2="10" y2="46" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="34.5" x2="10" y2="45.5" stroke="#cbd5e1" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="54" y1="28" x2="66" y2="12" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="27.5" x2="66" y2="11.5" stroke="#cbd5e1" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="80" y1="42" x2="98" y2="35" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1="80" y1="41.5" x2="98" y2="34.5" stroke="#cbd5e1" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="44" y1="50" x2="31" y2="62" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="30" cy="34" rx="7.5" ry="6.2" transform="rotate(-18 30 34)" fill="url(#dRedCap)" />
      <ellipse cx="70" cy="24" rx="7" ry="6" transform="rotate(14 70 24)" fill="url(#dAmberCap)" />
      <ellipse cx="52" cy="31" rx="8.8" ry="7.4" transform="rotate(8 52 31)" fill="url(#dRedCap)" />
      <ellipse cx="49" cy="28" rx="2.8" ry="1.4" fill="#fecaca" opacity="0.65" />
      <ellipse cx="46" cy="48" rx="6.6" ry="5.8" transform="rotate(-10 46 48)" fill="url(#dIvoryCap)" />
      <ellipse cx="77" cy="43" rx="8" ry="6.8" transform="rotate(20 77 43)" fill="url(#dRedCap)" />
    </svg>
  );
}

function YarnBallArt() {
  return (
    <svg viewBox="0 0 96 82" width="100%" height="100%" aria-hidden="true">
      <defs>
        <filter id="deskYarnSh" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.8" />
        </filter>
        <radialGradient id="dYarnCore" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="55%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#2f0909" />
        </radialGradient>
      </defs>
      <ellipse cx="46" cy="60" rx="27" ry="11" fill="#000" opacity="0.72" filter="url(#deskYarnSh)" />
      <path
        d="M60 50 Q80 52 84 62 Q86 69 75 71"
        fill="none"
        stroke="#991b1b"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="43" cy="38" r="23" fill="url(#dYarnCore)" />
      <g fill="none" strokeLinecap="round">
        <path d="M23 30 Q43 18 63 32" stroke="#991b1b" strokeWidth="3.4" />
        <path d="M21 38 Q43 28 65 40" stroke="#b91c1c" strokeWidth="2.9" />
        <path d="M24 47 Q45 39 62 49" stroke="#7f1d1d" strokeWidth="3.2" />
        <path d="M30 18 Q38 38 30 58" stroke="#991b1b" strokeWidth="3" />
        <path d="M43 15 Q51 37 42 61" stroke="#b91c1c" strokeWidth="2.7" />
        <path d="M54 19 Q46 38 56 56" stroke="#7f1d1d" strokeWidth="2.8" />
        <path d="M26 25 Q45 43 60 51" stroke="#dc2626" strokeWidth="1.9" opacity="0.65" />
      </g>
      <circle cx="43" cy="38" r="23" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.8" />
    </svg>
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
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dsBounce" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform="rotate(4 120 82)">
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
      <g transform="rotate(14 40 55)">
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
  clockTime,
  notebookOpen,
  hasDraftNote,
  yarnMode,
  yarnCount,
  onToggleLamp,
  onToggleNotebook,
  onSelectPins,
  onToggleYarn,
  onUndoYarn,
  onOpenDevice,
  onOpenCase,
  onInspect,
}) {
  const { totalUnread } = useCase();

  return (
    <div className={styles.desk}>
      <div className={`${styles.lampPool} ${lampOn ? styles.lampPoolOn : ""}`} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Spiral Field Notebook on the desk */}
        <Prop
          label={notebookOpen ? "Close field notebook" : "Write note to pin on map"}
          className={`${styles.notebookProp} ${notebookOpen ? styles.notebookActive : ""}`}
          style={{ left: "1.5%" }}
          onClick={onToggleNotebook}
        >
          <span className={styles.nbRings} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className={styles.nbPaper}>
            <strong>Field Notes</strong>
            <span>{hasDraftNote ? "Draft ready..." : "Write & pin"}</span>
            <span className={styles.nbRule} />
            <span className={styles.nbRule} />
          </span>
        </Prop>

        {/* Loose Pushpins lying directly on wood */}
        <Prop
          label="Pushpins (write in notebook to pin)"
          className={styles.pinsProp}
          style={{ left: "12.5%" }}
          onClick={onSelectPins}
        >
          <PinBundleArt />
        </Prop>

        {/* Ball of Red Yarn lying directly on wood */}
        <div className={styles.yarnAnchor} style={{ left: "21.5%" }}>
          <Prop
            label={yarnMode ? "Tying red yarn (click 2 pins on map)" : "Red yarn — click to tie two pins"}
            className={`${styles.yarnProp} ${yarnMode ? styles.yarnPicked : ""}`}
            onClick={onToggleYarn}
          >
            <YarnBallArt />
          </Prop>
          {yarnCount > 0 && (
            <button type="button" className={styles.undoYarn} onClick={onUndoYarn}>
              undo ({yarnCount})
            </button>
          )}
        </div>

        {/* Manila Case Folder */}
        <Prop
          label="Case file CASE-04"
          className={styles.folder}
          style={{ left: "30.5%" }}
          onClick={onOpenCase}
        >
          <span className={styles.folderTab}>CASE-04</span>
          <span className={styles.folderBody}>
            <span className={styles.stamp}>OPEN</span>
            <span className={styles.folderLine} />
            <span className={styles.folderLine} />
          </span>
        </Prop>

        {/* Adam's Open Glowing Laptop */}
        <Prop
          label="Open Adam's Laptop"
          className={styles.laptop}
          style={{ left: "41%" }}
          onClick={() => onOpenDevice("laptop")}
        >
          <LaptopArt unread={totalUnread} />
        </Prop>

        {/* Steaming Mug */}
        <div className={styles.mug} style={{ left: "58.5%" }} aria-hidden="true">
          <span className={styles.steam} />
          <span className={`${styles.steam} ${styles.steam2}`} />
          <span className={styles.mugBody} />
        </div>

        {/* Evidence Bag: Silver Keycard */}
        <Prop
          label="Evidence bag: silver keycard"
          className={styles.bag}
          style={{ left: "64%" }}
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

        {/* Green Banker's Desk Lamp */}
        <Prop
          label={lampOn ? "Turn lamp off (L)" : "Turn lamp on (L)"}
          className={styles.lamp}
          style={{ left: "71.5%" }}
          onClick={onToggleLamp}
        >
          <LampArt on={lampOn} />
        </Prop>

        {/* Small Matte Digital Desk Clock */}
        <div
          className={styles.digitalClock}
          style={{ left: "80%" }}
          aria-label={`In-game time ${clockTime.hh}:${clockTime.mm} AM`}
        >
          <div className={styles.clockFace}>
            <span className={styles.clockDigits}>
              {clockTime.hh}
              <span className={styles.clockColon}>:</span>
              {clockTime.mm}
            </span>
            <span className={styles.clockAm}>AM</span>
          </div>
        </div>

        {/* Adam's Vibrating Red Phone */}
        <Prop
          label={
            totalUnread > 0
              ? `Open Adam's Phone (${totalUnread} new)`
              : "Open Adam's Phone"
          }
          className={`${styles.phone} ${totalUnread > 0 ? styles.buzz : ""}`}
          style={{ left: "90%" }}
          onClick={() => onOpenDevice("phone")}
        >
          <PhoneArt unread={totalUnread} />
        </Prop>
      </div>
    </div>
  );
}

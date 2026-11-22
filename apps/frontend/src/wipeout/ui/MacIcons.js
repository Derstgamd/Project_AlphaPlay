"use client";

/**
 * Authentic macOS Sonoma / Sequoia squircle app icons & menu bar system icons
 * for Riya Sen's MacBook Air.
 */

export const MAC_APP_META = {
  files: {
    id: "files",
    label: "Finder",
    subtitle: "Files & Downloads",
    category: "Core",
    inDock: true,
    defaultSize: [860, 520],
  },
  launchpad: {
    id: "launchpad",
    label: "Launchpad",
    subtitle: "All Applications",
    category: "System",
    inDock: true,
    isOverlay: true,
  },
  browser: {
    id: "browser",
    label: "Safari",
    subtitle: "Web Browser",
    category: "Core",
    inDock: true,
    defaultSize: [900, 540],
  },
  pingme: {
    id: "pingme",
    label: "PingMe",
    subtitle: "Messages",
    category: "Core",
    inDock: true,
    defaultSize: [840, 520],
  },
  mail: {
    id: "mail",
    label: "Mail",
    subtitle: "riya.sen@wb.gov.in",
    category: "Productivity",
    inDock: true,
    defaultSize: [860, 520],
  },
  calls: {
    id: "calls",
    label: "FaceTime (Calls)",
    subtitle: "Call Logs & Continuity",
    category: "Core",
    inDock: true,
    defaultSize: [780, 500],
  },
  map: {
    id: "map",
    label: "CholoMap",
    subtitle: "Kolkata Maps & LocketLink",
    category: "Core",
    inDock: true,
    defaultSize: [940, 560],
  },
  gallery: {
    id: "gallery",
    label: "Photos",
    subtitle: "Camera Roll",
    category: "Core",
    inDock: true,
    defaultSize: [860, 540],
  },
  notes: {
    id: "notes",
    label: "Notes",
    subtitle: "QuickNotes",
    category: "Core",
    inDock: true,
    defaultSize: [820, 510],
  },
  vault: {
    id: "vault",
    label: "BangoVault",
    subtitle: "Encrypted Audit Vault",
    category: "Core",
    inDock: true,
    defaultSize: [680, 520],
  },
  calendar: {
    id: "calendar",
    label: "Calendar",
    subtitle: "November 2026",
    category: "Productivity",
    inDock: true,
    defaultSize: [820, 520],
  },
  music: {
    id: "music",
    label: "Music",
    subtitle: "Kolkata Nights",
    category: "Media",
    inDock: true,
    defaultSize: [760, 490],
  },
  calculator: {
    id: "calculator",
    label: "Calculator",
    subtitle: "Utilities",
    category: "Utilities",
    inDock: true,
    defaultSize: [272, 412],
  },
  terminal: {
    id: "terminal",
    label: "Terminal",
    subtitle: "zsh — Riya's MacBook Air",
    category: "Utilities",
    inDock: true,
    defaultSize: [700, 440],
  },
  settings: {
    id: "settings",
    label: "System Settings",
    subtitle: "Security & Preferences",
    category: "Core",
    inDock: true,
    defaultSize: [840, 540],
  },
  weather: {
    id: "weather",
    label: "Weather",
    subtitle: "Salt Lake, Kolkata",
    category: "Utilities",
    inDock: false,
    defaultSize: [720, 500],
  },
  clock: {
    id: "clock",
    label: "Clock",
    subtitle: "World Clock & Stopwatch",
    category: "Utilities",
    inDock: false,
    defaultSize: [640, 440],
  },
  textedit: {
    id: "textedit",
    label: "TextEdit",
    subtitle: "Plain Text Editor",
    category: "Productivity",
    inDock: false,
    defaultSize: [620, 430],
  },
  trash: {
    id: "trash",
    label: "Trash",
    subtitle: "Deleted Items",
    category: "System",
    inDock: false,
    defaultSize: [820, 490],
  },
};

export const DOCK_LEFT_APPS = [
  "files",
  "launchpad",
  "browser",
  "pingme",
  "mail",
  "calls",
  "map",
  "gallery",
  "notes",
  "vault",
  "calendar",
  "music",
  "calculator",
  "terminal",
  "settings",
];

export const ALL_LAUNCHPAD_APPS = [
  "files",
  "browser",
  "pingme",
  "mail",
  "calls",
  "map",
  "gallery",
  "notes",
  "vault",
  "calendar",
  "music",
  "calculator",
  "terminal",
  "weather",
  "clock",
  "textedit",
  "settings",
];

export function AppleLogoSvg({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor" aria-hidden="true">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.13-1.9-14.34-6.08-3.69-3.03-7.61-7.82-11.77-14.37-5.93-9.26-10.72-19.99-14.38-32.19-3.66-12.2-5.49-23.51-5.49-33.91 0-12.66 3.18-23.43 9.53-32.3 6.35-8.87 14.33-13.43 23.94-13.68 4.69 0 10.22 1.43 16.59 4.28 6.37 2.85 10.46 4.3 12.27 4.3 1.45 0 5.98-1.69 13.59-5.06 7.61-3.37 13.99-4.78 19.14-4.23 14.13 1.14 24.75 6.71 31.86 16.71-12.64 7.66-18.85 18.41-18.63 32.25.22 10.76 4.14 19.72 11.76 26.86 5.44 5.14 11.83 8.17 19.17 9.09-1.54 4.5-3.19 8.8-4.96 12.91zM119.22 31.01c0 8.42-3.07 16.29-9.2 23.6-7.38 8.63-16.32 13.61-26.03 12.82-.13-1.02-.2-2.09-.2-3.22 0-8.08 3.52-16.73 10.56-24.69 3.38-3.88 7.68-7.11 12.89-9.69 5.21-2.57 10.14-4 14.79-4.25.13 1.85.19 3.66.19 5.43z" />
    </svg>
  );
}

export function WifiIconSvg({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="19.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BatteryIconSvg({ pct = 64, charging = true }) {
  const fillW = Math.max(2, Math.round((pct / 100) * 16));
  return (
    <svg width="24" height="12" viewBox="0 0 26 13" fill="none" aria-hidden="true">
      <rect x="0.75" y="1" width="21.5" height="11" rx="2.8" stroke="currentColor" strokeWidth="1.2" opacity="0.88" />
      <rect x="2.6" y="2.8" width={fillW} height="7.4" rx="1.4" fill={charging ? "#30D158" : "currentColor"} />
      <path d="M23.5 4.3v4.4a1.2 1.2 0 0 0 1.2-1.2V5.5a1.2 1.2 0 0 0-1.2-1.2z" fill="currentColor" opacity="0.72" />
      {charging && (
        <path d="M12.2 2.2L9.4 7h2.4l-.8 3.8L14 5.9h-2.3l.5-3.7z" fill="#0B0B0D" stroke="#fff" strokeWidth="0.4" />
      )}
    </svg>
  );
}

export function SpotlightIconSvg({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.8" />
      <path d="M15.8 15.8L21 21" />
    </svg>
  );
}

export function ControlCenterIconSvg({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4.5" width="20" height="6.2" rx="3.1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.2" cy="7.6" r="2.2" fill="currentColor" />
      <rect x="2" y="13.3" width="20" height="6.2" rx="3.1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.8" cy="16.4" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function MacAppIcon({ id, size = 48 }) {
  const s = size;
  const rx = 22.5; // squircle approximation in 100x100 viewBox

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{
        display: "block",
        flexShrink: 0,
        filter: "drop-shadow(0 5px 10px rgba(0, 0, 0, 0.42))",
      }}
    >
      <defs>
        <clipPath id={`sq-${id}-${s}`}>
          <rect x="4" y="4" width="92" height="92" rx={rx} ry={rx} />
        </clipPath>
        <linearGradient id={`gloss-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      {id === "files" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#E8F3FF" />
          <path d="M4 4 H54 C46 32 45 55 53 60 H47 C43 74 44 86 49 96 H4 Z" fill="#2CA3FA" />
          <path d="M4 4 H54 C46 32 45 55 53 60 H47 C43 74 44 86 49 96 H4 Z" fill="url(#gloss-files)" />
          <path d="M54 4 C46 32 45 55 53 60 H47 C43 74 44 86 49 96" fill="none" stroke="#186CC2" strokeWidth="2.4" opacity="0.55" />
          {/* Eyes */}
          <rect x="29" y="33" width="5.2" height="11" rx="2.6" fill="#0F2942" />
          <rect x="67" y="33" width="5.2" height="11" rx="2.6" fill="#0F2942" />
          {/* Iconic Finder Smile */}
          <path d="M25 65 Q50 84 75 65" fill="none" stroke="#0F2942" strokeWidth="4.6" strokeLinecap="round" />
        </g>
      )}

      {id === "launchpad" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#E5E7EB" />
          <rect x="4" y="4" width="92" height="92" fill="url(#gloss-launchpad)" />
          {[
            ["#FF5F57", 17, 17],
            ["#FF9F0A", 42, 17],
            ["#30D158", 67, 17],
            ["#64D2FF", 17, 42],
            ["#0A84FF", 42, 42],
            ["#5E5CE6", 67, 42],
            ["#BF5AF2", 17, 67],
            ["#FF375F", 42, 67],
            ["#8E8E93", 67, 67],
          ].map(([fill, x, y], idx) => (
            <rect key={idx} x={x} y={y} width="17" height="17" rx="4.5" fill={fill} />
          ))}
        </g>
      )}

      {id === "browser" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#F8FAFC" />
          <defs>
            <radialGradient id="safariDial" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#58D0FF" />
              <stop offset="55%" stopColor="#1A90FF" />
              <stop offset="100%" stopColor="#0B5ED7" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="37" fill="url(#safariDial)" />
          {/* Compass ticks */}
          {Array.from({ length: 24 }, (_, i) => {
            const ang = (i * 15 * Math.PI) / 180;
            const r1 = i % 2 === 0 ? 29.5 : 32;
            const r2 = 34.8;
            return (
              <line
                key={i}
                x1={50 + r1 * Math.cos(ang)}
                y1={50 + r1 * Math.sin(ang)}
                x2={50 + r2 * Math.cos(ang)}
                y2={50 + r2 * Math.sin(ang)}
                stroke="#ffffff"
                strokeOpacity="0.82"
                strokeWidth={i % 2 === 0 ? "1.6" : "1"}
              />
            );
          })}
          {/* Needle */}
          <polygon points="50,50 44,44 71,29" fill="#FF3B30" />
          <polygon points="50,50 56,56 71,29" fill="#D72A20" />
          <polygon points="50,50 44,44 29,71" fill="#FFFFFF" />
          <polygon points="50,50 56,56 29,71" fill="#D8E2EC" />
          <circle cx="50" cy="50" r="3" fill="#E2E8F0" />
        </g>
      )}

      {id === "pingme" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <defs>
            <linearGradient id="msgBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#65F77B" />
              <stop offset="100%" stopColor="#1DB935" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="92" height="92" fill="url(#msgBg)" />
          <path
            d="M50 22 C30.5 22 17 34.2 17 49.5 C17 58.3 22 66.2 29.8 71.2 C29.2 75.8 25.8 80.5 22.8 82.6 C29.5 82.8 36.8 80.4 41.8 76.2 C44.5 76.7 47.2 77 50 77 C69.5 77 83 64.8 83 49.5 C83 34.2 69.5 22 50 22 Z"
            fill="#FFFFFF"
          />
        </g>
      )}

      {id === "mail" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <defs>
            <linearGradient id="mailBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4CC3FF" />
              <stop offset="100%" stopColor="#0A66FF" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="92" height="92" fill="url(#mailBg)" />
          <rect x="17" y="28" width="66" height="44" rx="6" fill="#FFFFFF" />
          <path d="M19 31 L50 54 L81 31" fill="none" stroke="#1884FF" strokeWidth="3.2" strokeLinejoin="round" />
          <path d="M19 69 L40 50 M81 69 L60 50" stroke="#A7D4FF" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )}

      {id === "calls" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <defs>
            <linearGradient id="ftBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5CF474" />
              <stop offset="100%" stopColor="#16B532" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="92" height="92" fill="url(#ftBg)" />
          <rect x="19" y="31" width="44" height="38" rx="9" fill="#FFFFFF" />
          <path d="M64 43 L80 33 C82 31.8 84 33 84 35.3 V64.7 C84 67 82 68.2 80 67 L64 57 Z" fill="#FFFFFF" />
        </g>
      )}

      {id === "map" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#F2EFE9" />
          {/* Park green */}
          <rect x="4" y="4" width="44" height="46" fill="#B5E58F" />
          {/* River / Salt Lake water */}
          <path d="M52 4 H96 V38 C78 36 66 44 52 50 Z" fill="#6EC6FF" />
          {/* Yellow arterial road */}
          <path d="M4 58 L96 42" stroke="#FBBF24" strokeWidth="11" />
          <path d="M48 4 L42 96" stroke="#FFFFFF" strokeWidth="9" />
          {/* Blue navigation highway */}
          <path d="M18 96 L58 54 L96 76" fill="none" stroke="#0A84FF" strokeWidth="8.5" strokeLinejoin="round" />
          {/* Red pin */}
          <circle cx="67" cy="30" r="14" fill="#FF3B30" stroke="#fff" strokeWidth="3" />
          <circle cx="67" cy="30" r="5" fill="#fff" />
        </g>
      )}

      {id === "gallery" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#FFFFFF" />
          {[
            { rot: 0, fill: "#FF9F0A" },
            { rot: 45, fill: "#FFD60A" },
            { rot: 90, fill: "#30D158" },
            { rot: 135, fill: "#32ADE6" },
            { rot: 180, fill: "#0A84FF" },
            { rot: 225, fill: "#5E5CE6" },
            { rot: 270, fill: "#BF5AF2" },
            { rot: 315, fill: "#FF375F" },
          ].map((p, idx) => (
            <rect
              key={idx}
              x="42"
              y="15"
              width="16"
              height="31"
              rx="8"
              fill={p.fill}
              fillOpacity="0.82"
              transform={`rotate(${p.rot} 50 50)`}
            />
          ))}
        </g>
      )}

      {id === "notes" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#FCFBF7" />
          <defs>
            <linearGradient id="notesTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="92" height="27" fill="url(#notesTop)" />
          <line x1="4" y1="33" x2="96" y2="33" stroke="#D4D4D8" strokeWidth="1.6" strokeDasharray="3 3" />
          <line x1="14" y1="49" x2="86" y2="49" stroke="#E4E4E7" strokeWidth="2" />
          <line x1="14" y1="64" x2="86" y2="64" stroke="#E4E4E7" strokeWidth="2" />
          <line x1="14" y1="79" x2="86" y2="79" stroke="#E4E4E7" strokeWidth="2" />
        </g>
      )}

      {id === "vault" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <defs>
            <linearGradient id="vaultBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#312E81" />
              <stop offset="50%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="92" height="92" fill="url(#vaultBg)" />
          <circle cx="50" cy="52" r="28" fill="none" stroke="#818CF8" strokeWidth="3.5" opacity="0.55" />
          <rect x="31" y="47" width="38" height="29" rx="7" fill="#F59E0B" />
          <path d="M38 47 V37 A12 12 0 0 1 62 37 V47" fill="none" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="59" r="4" fill="#1E1B4B" />
          <rect x="48.5" y="61" width="3" height="7" rx="1.5" fill="#1E1B4B" />
        </g>
      )}

      {id === "calendar" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#FFFFFF" />
          <rect x="4" y="4" width="92" height="28" fill="#FF3B30" />
          <text
            x="50"
            y="24"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="15"
            fontWeight="700"
            fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
            letterSpacing="1.2"
          >
            NOV
          </text>
          <text
            x="50"
            y="77"
            textAnchor="middle"
            fill="#1C1C1E"
            fontSize="44"
            fontWeight="700"
            fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
          >
            20
          </text>
        </g>
      )}

      {id === "music" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <defs>
            <linearGradient id="musicBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FC5C7D" />
              <stop offset="100%" stopColor="#FA233B" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="92" height="92" fill="url(#musicBg)" />
          <path
            d="M40 67 V31 L72 24 V60"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M40 39 L72 32" stroke="#FFFFFF" strokeWidth="6" />
          <ellipse cx="33" cy="69" rx="9" ry="7" fill="#FFFFFF" />
          <ellipse cx="65" cy="62" rx="9" ry="7" fill="#FFFFFF" />
        </g>
      )}

      {id === "calculator" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#2C2C2E" />
          <rect x="13" y="13" width="74" height="21" rx="5" fill="#1C1C1E" />
          <text x="81" y="29" textAnchor="end" fill="#FFFFFF" fontSize="14" fontWeight="500" fontFamily="monospace">
            404
          </text>
          {[
            ["#636366", 19, 45],
            ["#636366", 39, 45],
            ["#636366", 59, 45],
            ["#FF9F0A", 79, 45],
            ["#48484A", 19, 63],
            ["#48484A", 39, 63],
            ["#48484A", 59, 63],
            ["#FF9F0A", 79, 63],
            ["#48484A", 19, 81],
            ["#48484A", 39, 81],
            ["#48484A", 59, 81],
            ["#FF9F0A", 79, 81],
          ].map(([fill, cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="7.2" fill={fill} />
          ))}
        </g>
      )}

      {id === "terminal" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#D1D5DB" />
          <rect x="10" y="10" width="80" height="80" rx="16" fill="#18181B" />
          <path d="M25 36 L41 47 L25 58" fill="none" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="47" y1="60" x2="67" y2="60" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
        </g>
      )}

      {id === "settings" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <defs>
            <linearGradient id="setBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E5E7EB" />
              <stop offset="100%" stopColor="#9CA3AF" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="92" height="92" fill="url(#setBg)" />
          <circle cx="50" cy="50" r="29" fill="none" stroke="#374151" strokeWidth="9" strokeDasharray="7.5 4.8" />
          <circle cx="50" cy="50" r="21" fill="#6B7280" stroke="#1F2937" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="10" fill="#D1D5DB" stroke="#374151" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="4.2" fill="#1F2937" />
        </g>
      )}

      {id === "weather" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <defs>
            <linearGradient id="wxBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="92" height="92" fill="url(#wxBg)" />
          <circle cx="62" cy="34" r="14" fill="#FDE047" />
          <path
            d="M27 69 H71 A13 13 0 0 0 71 43 A17 17 0 0 0 39 40 A14 14 0 0 0 27 69 Z"
            fill="#F8FAFC"
            fillOpacity="0.94"
          />
        </g>
      )}

      {id === "clock" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#1C1C1E" />
          <circle cx="50" cy="50" r="36" fill="#FFFFFF" />
          {Array.from({ length: 12 }, (_, i) => {
            const ang = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={50 + 27 * Math.cos(ang)}
                y1={50 + 27 * Math.sin(ang)}
                x2={50 + 32 * Math.cos(ang)}
                y2={50 + 32 * Math.sin(ang)}
                stroke="#1C1C1E"
                strokeWidth={i % 3 === 0 ? "2.6" : "1.5"}
                strokeLinecap="round"
              />
            );
          })}
          {/* 8:15 hands */}
          <line x1="50" y1="50" x2="34" y2="60" stroke="#1C1C1E" strokeWidth="3.6" strokeLinecap="round" />
          <line x1="50" y1="50" x2="73" y2="50" stroke="#1C1C1E" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="50" y1="50" x2="50" y2="23" stroke="#FF9F0A" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="50" cy="50" r="3.2" fill="#FF9F0A" />
        </g>
      )}

      {id === "textedit" && (
        <g clipPath={`url(#sq-${id}-${s})`}>
          <rect x="4" y="4" width="92" height="92" fill="#F8F5EE" />
          <line x1="16" y1="28" x2="74" y2="28" stroke="#D6D3D1" strokeWidth="2.5" />
          <line x1="16" y1="43" x2="80" y2="43" stroke="#D6D3D1" strokeWidth="2.5" />
          <line x1="16" y1="58" x2="72" y2="58" stroke="#D6D3D1" strokeWidth="2.5" />
          <line x1="16" y1="73" x2="62" y2="73" stroke="#D6D3D1" strokeWidth="2.5" />
          <path d="M55 68 L80 28 L87 33 L62 73 L52 76 Z" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="1.8" />
        </g>
      )}

      {id === "trash" && (
        <g>
          <defs>
            <linearGradient id="trashMetal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.88" />
              <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0.88" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="86" rx="22" ry="6" fill="rgba(0,0,0,0.45)" />
          <path d="M22 22 L29 82 C29 86 71 86 71 82 L78 22 Z" fill="url(#trashMetal)" stroke="#CBD5E1" strokeWidth="2" />
          <ellipse cx="50" cy="22" rx="28" ry="6.5" fill="#CBD5E1" stroke="#F8FAFC" strokeWidth="1.6" />
          <ellipse cx="50" cy="22" rx="22" ry="4" fill="#475569" opacity="0.6" />
          <line x1="36" y1="30" x2="39" y2="78" stroke="#64748B" strokeWidth="2" opacity="0.55" />
          <line x1="50" y1="30" x2="50" y2="79" stroke="#64748B" strokeWidth="2" opacity="0.55" />
          <line x1="64" y1="30" x2="61" y2="78" stroke="#64748B" strokeWidth="2" opacity="0.55" />
        </g>
      )}

      {/* Subtle Apple glass rim highlight for squircle apps */}
      {id !== "trash" && (
        <rect
          x="4.6"
          y="4.6"
          width="90.8"
          height="90.8"
          rx={rx}
          ry={rx}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.22"
          strokeWidth="1.2"
        />
      )}
    </svg>
  );
}

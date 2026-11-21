"use client";

export const GAME_APP_META = {
  pingme: {
    label: "PingMe",
    color: "linear-gradient(135deg,#22c55e,#15803d)",
  },
  notes: {
    label: "QuickNotes",
    color: "linear-gradient(135deg,#f59e0b,#b45309)",
  },
  vault: {
    label: "BangoVault",
    color: "linear-gradient(135deg,#6366f1,#3730a3)",
  },
  map: {
    label: "CholoMap",
    color: "linear-gradient(135deg,#14b8a6,#0f766e)",
  },
  settings: {
    label: "Settings",
    color: "linear-gradient(135deg,#475569,#1e293b)",
  },
};

const GLYPHS = {
  pingme: <path d="M4 5h16v11H9l-5 4z" />,
  notes: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 11h7M9 15h7" />
    </>
  ),
  vault: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </>
  ),
  map: (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" />
    </>
  ),
};

export function GameAppIcon({ id, size = 44 }) {
  const meta = GAME_APP_META[id] || GAME_APP_META.settings;
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        background: meta.color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 4px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.24)",
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size * 0.56}
        height={size * 0.56}
        fill="none"
        stroke="#fff"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {GLYPHS[id] || GLYPHS.settings}
      </svg>
    </span>
  );
}

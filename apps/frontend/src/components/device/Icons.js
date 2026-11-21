"use client";

export const APP_META = {
  messages: { label: "Messages", color: "linear-gradient(135deg,#34d399,#059669)" },
  photos: { label: "Photos", color: "linear-gradient(135deg,#fb923c,#db2777)" },
  notes: { label: "Notes", color: "linear-gradient(135deg,#fde047,#ca8a04)" },
  files: { label: "Files", color: "linear-gradient(135deg,#60a5fa,#2563eb)" },
  map: { label: "Map", color: "linear-gradient(135deg,#2dd4bf,#0f766e)" },
  browser: { label: "Browser", color: "linear-gradient(135deg,#818cf8,#4338ca)" },
  terminal: { label: "Terminal", color: "linear-gradient(135deg,#374151,#0b0f14)" },
};

const GLYPHS = {
  messages: <path d="M4 5h16v11H9l-5 4z" />,
  photos: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="M3 17l5-5 4 4 3-3 6 6" />
    </>
  ),
  notes: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 11h7M9 15h7" />
    </>
  ),
  files: <path d="M3 7h6l2 2h10v10H3z" />,
  map: (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  browser: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  terminal: <path d="M4 6l6 6-6 6M12 19h8" />,
};

export function AppIcon({ id, size = 44 }) {
  const meta = APP_META[id];
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: meta.color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size * 0.58}
        height={size * 0.58}
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {GLYPHS[id]}
      </svg>
    </span>
  );
}

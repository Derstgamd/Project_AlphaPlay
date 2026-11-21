"use client";

export function PortraitArt({ variant }) {
  if (variant === "adam") {
    return (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <rect width="120" height="120" fill="#2a1618" />
        <ellipse cx="60" cy="48" rx="28" ry="30" fill="#b4532a" />
        <path d="M30 120 C32 88, 88 88, 90 120 Z" fill="#9d5c63" />
        <rect x="52" y="72" width="16" height="18" rx="6" fill="#f1c5a4" />
        <ellipse cx="60" cy="52" rx="19" ry="23" fill="#f5ccb0" />
        <path d="M40 48 C42 25, 78 24, 80 48 C76 34, 48 32, 40 48 Z" fill="#c2592c" />
        <circle cx="52" cy="51" r="2.2" fill="#2b211c" />
        <circle cx="68" cy="51" r="2.2" fill="#2b211c" />
        <path d="M55 63 Q60 66 65 63" stroke="#9e5a49" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "crew") {
    return (
      <svg viewBox="0 0 130 95" width="100%" height="100%" aria-hidden="true">
        <rect width="130" height="95" fill="#e6e4de" />
        {/* Person 1 */}
        <path d="M12 95 C14 66, 38 66, 40 95 Z" fill="#52414c" />
        <circle cx="26" cy="46" r="11" fill="#f2c4a2" />
        <path d="M15 44 C17 30, 35 30, 37 44 Z" fill="#c2592c" />
        {/* Person 2 */}
        <path d="M36 95 C38 56, 68 56, 70 95 Z" fill="#253447" />
        <circle cx="53" cy="34" r="12" fill="#ecc09e" />
        <path d="M41 31 C44 19, 62 19, 65 31 Z" fill="#3a281d" />
        {/* Person 3 */}
        <path d="M64 95 C66 62, 92 62, 94 95 Z" fill="#6b3054" />
        <circle cx="79" cy="42" r="11" fill="#f4cbb0" />
        <path d="M68 41 C69 27, 89 27, 90 42 Z" fill="#5c3621" />
        {/* Person 4 */}
        <path d="M88 95 C90 58, 118 58, 120 95 Z" fill="#232830" />
        <circle cx="104" cy="36" r="11" fill="#e8ba97" />
        <path d="M93 33 C95 21, 113 21, 115 33 Z" fill="#2b1e17" />
      </svg>
    );
  }

  if (variant === "maya") {
    return (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <rect width="120" height="120" fill="#efeae4" />
        <path d="M24 120 C28 88, 92 88, 96 120 Z" fill="#8b6b6e" />
        <path d="M28 74 C26 24, 94 24, 92 74 C86 86, 34 86, 28 74 Z" fill="#462b22" />
        <ellipse cx="60" cy="54" rx="19" ry="22" fill="#f5d1be" />
        <path d="M38 44 C46 28, 74 28, 82 44 C70 38, 50 38, 38 44 Z" fill="#462b22" />
        <rect x="44" y="47" width="13" height="9" rx="2" fill="none" stroke="#1f242c" strokeWidth="2.2" />
        <rect x="63" y="47" width="13" height="9" rx="2" fill="none" stroke="#1f242c" strokeWidth="2.2" />
        <line x1="57" y1="51" x2="63" y2="51" stroke="#1f242c" strokeWidth="2" />
        <circle cx="50.5" cy="51.5" r="1.8" fill="#1f242c" />
        <circle cx="69.5" cy="51.5" r="1.8" fill="#1f242c" />
        <path d="M55 66 Q60 69 65 66" stroke="#b35e5a" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  if (variant === "rohan") {
    return (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <rect width="120" height="120" fill="#dbeff7" />
        <path d="M18 120 C24 88, 94 88, 102 120 Z" fill="#293445" />
        <path d="M46 92 L60 112 L74 92 Z" fill="#eef2f6" />
        <rect x="52" y="72" width="16" height="20" rx="6" fill="#e9b896" />
        <ellipse cx="62" cy="52" rx="20" ry="23" fill="#f0c1a0" />
        <path d="M38 50 C36 22, 82 18, 85 40 C70 30, 52 34, 46 56 Z" fill="#4d2e1b" />
        <circle cx="57" cy="51" r="2.2" fill="#231812" />
        <circle cx="72" cy="51" r="2.2" fill="#231812" />
        <path d="M58 64 Q64 67 70 64" stroke="#9e5a44" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  if (variant === "tara") {
    return (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <rect width="120" height="120" fill="#1b1429" />
        <path d="M24 120 C30 88, 90 88, 96 120 Z" fill="#d97b84" />
        <path d="M24 118 C22 30, 96 22, 98 118 Z" fill="#f0d57a" />
        <ellipse cx="58" cy="55" rx="19" ry="23" fill="#fbd8c5" />
        <circle cx="51" cy="53" r="2" fill="#261c1a" />
        <circle cx="66" cy="53" r="2" fill="#261c1a" />
        <path d="M53 66 Q58 70 64 66" stroke="#cc3f4c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "kabir") {
    return (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <rect width="120" height="120" fill="#4f4844" />
        <path d="M22 120 C28 88, 92 88, 98 120 Z" fill="#1e2229" />
        <rect x="52" y="72" width="16" height="20" rx="6" fill="#dfb08e" />
        <ellipse cx="60" cy="52" rx="19" ry="23" fill="#e6b998" />
        <path d="M40 46 C40 22, 82 22, 80 46 C74 34, 48 34, 40 46 Z" fill="#17191e" />
        <circle cx="53" cy="51" r="2.2" fill="#17191e" />
        <circle cx="68" cy="51" r="2.2" fill="#17191e" />
        <path d="M56 64 L65 64" stroke="#8c543e" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "vikram") {
    return (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <rect width="120" height="120" fill="#e7e4de" />
        <path d="M18 120 C24 84, 96 84, 102 120 Z" fill="#20232a" />
        <rect x="52" y="72" width="16" height="18" rx="6" fill="#e9bc9a" />
        <ellipse cx="60" cy="52" rx="19" ry="23" fill="#efc3a1" />
        <path d="M38 48 C40 20, 84 20, 82 48 C72 32, 48 34, 38 48 Z" fill="#c79e6b" />
        <circle cx="53" cy="52" r="2" fill="#2b211a" />
        <circle cx="67" cy="52" r="2" fill="#2b211a" />
        <path d="M54 64 Q60 69 66 64" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "map") {
    return (
      <svg viewBox="0 0 120 100" width="100%" height="100%" aria-hidden="true">
        <rect width="120" height="100" fill="#6f632e" />
        <path d="M0 24 L120 12 M0 55 L120 48 M0 82 L120 90 M28 0 L18 100 M62 0 L74 100 M96 0 L86 100" stroke="#e4dcb8" strokeWidth="3.5" opacity="0.85" />
        <path d="M24 68 L54 44 L72 22 L92 48" stroke="#c92a2a" strokeWidth="3" fill="none" strokeDasharray="4 2" />
        <circle cx="72" cy="22" r="4.5" fill="#c92a2a" />
        <circle cx="24" cy="68" r="4" fill="#c92a2a" />
        <rect x="28" y="60" width="34" height="18" fill="#463d1b" opacity="0.85" />
      </svg>
    );
  }

  // unknown
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
      <rect width="120" height="120" fill="#101216" />
      <path d="M22 120 C26 84, 94 84, 98 120 Z" fill="#25282f" />
      <circle cx="60" cy="50" r="22" fill="#25282f" />
      <text
        x="60"
        y="65"
        textAnchor="middle"
        fill="#f1f5f9"
        fontSize="44"
        fontWeight="700"
        fontFamily="sans-serif"
      >
        ?
      </text>
      <ellipse
        cx="60"
        cy="62"
        rx="44"
        ry="42"
        fill="none"
        stroke="#b91c1c"
        strokeWidth="3"
        transform="rotate(-8 60 62)"
      />
      <ellipse
        cx="61"
        cy="60"
        rx="48"
        ry="44"
        fill="none"
        stroke="#991b1b"
        strokeWidth="2"
        transform="rotate(6 61 60)"
      />
    </svg>
  );
}

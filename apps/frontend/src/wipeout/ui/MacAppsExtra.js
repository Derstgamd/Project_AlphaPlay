"use client";

import { useEffect, useRef, useState } from "react";
import { CONTRACTOR_ID, ROHAN_NUMBER, ZONES } from "../constants";
import { sfx } from "../sfx";
import m from "./MacDesktop.module.css";

/* ═══════════════════════════════════════════════════════════════
   1. CALCULATOR — Pixel-faithful macOS Calculator
   ═══════════════════════════════════════════════════════════════ */
export function MacCalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);

  function inputDigit(d) {
    sfx.tap();
    if (fresh) {
      setDisplay(d === "." ? "0." : d);
      setFresh(false);
    } else {
      if (d === "." && display.includes(".")) return;
      if (display.length >= 12) return;
      setDisplay(display === "0" && d !== "." ? d : display + d);
    }
  }

  function compute(a, b, operator) {
    if (operator === "+") return a + b;
    if (operator === "−") return a - b;
    if (operator === "×") return a * b;
    if (operator === "÷") return b === 0 ? NaN : a / b;
    return b;
  }

  function formatNum(n) {
    if (!Number.isFinite(n)) return "Error";
    const s = String(Number(n.toPrecision(10)));
    return s.length > 12 ? n.toExponential(4) : s;
  }

  function chooseOp(nextOp) {
    sfx.tap();
    const cur = parseFloat(display);
    if (stored !== null && op && !fresh) {
      const res = compute(stored, cur, op);
      setDisplay(formatNum(res));
      setStored(Number.isFinite(res) ? res : null);
    } else {
      setStored(cur);
    }
    setOp(nextOp);
    setFresh(true);
  }

  function evaluate() {
    sfx.tap();
    if (stored === null || !op) return;
    const cur = parseFloat(display);
    const res = compute(stored, cur, op);
    setDisplay(formatNum(res));
    setStored(null);
    setOp(null);
    setFresh(true);
  }

  function clearAll() {
    sfx.tap();
    setDisplay("0");
    setStored(null);
    setOp(null);
    setFresh(true);
  }

  function toggleSign() {
    sfx.tap();
    const v = parseFloat(display);
    if (!Number.isFinite(v) || v === 0) return;
    setDisplay(formatNum(-v));
  }

  function percent() {
    sfx.tap();
    const v = parseFloat(display);
    if (!Number.isFinite(v)) return;
    setDisplay(formatNum(v / 100));
  }

  const keys = [
    { label: stored || display !== "0" ? "C" : "AC", cls: m.calcFn, fn: clearAll },
    { label: "+/−", cls: m.calcFn, fn: toggleSign },
    { label: "%", cls: m.calcFn, fn: percent },
    { label: "÷", cls: op === "÷" && fresh ? m.calcOpActive : m.calcOp, fn: () => chooseOp("÷") },
    { label: "7", cls: m.calcNum, fn: () => inputDigit("7") },
    { label: "8", cls: m.calcNum, fn: () => inputDigit("8") },
    { label: "9", cls: m.calcNum, fn: () => inputDigit("9") },
    { label: "×", cls: op === "×" && fresh ? m.calcOpActive : m.calcOp, fn: () => chooseOp("×") },
    { label: "4", cls: m.calcNum, fn: () => inputDigit("4") },
    { label: "5", cls: m.calcNum, fn: () => inputDigit("5") },
    { label: "6", cls: m.calcNum, fn: () => inputDigit("6") },
    { label: "−", cls: op === "−" && fresh ? m.calcOpActive : m.calcOp, fn: () => chooseOp("−") },
    { label: "1", cls: m.calcNum, fn: () => inputDigit("1") },
    { label: "2", cls: m.calcNum, fn: () => inputDigit("2") },
    { label: "3", cls: m.calcNum, fn: () => inputDigit("3") },
    { label: "+", cls: op === "+" && fresh ? m.calcOpActive : m.calcOp, fn: () => chooseOp("+") },
    { label: "0", cls: `${m.calcNum} ${m.calcZero}`, fn: () => inputDigit("0") },
    { label: ".", cls: m.calcNum, fn: () => inputDigit(".") },
    { label: "=", cls: m.calcOp, fn: evaluate },
  ];

  return (
    <div className={m.calcWrap}>
      <div className={m.calcScreen}>
        <div className={m.calcExpr}>{stored !== null && op ? `${stored} ${op}` : ""}</div>
        <div className={m.calcVal} style={{ fontSize: display.length > 8 ? 30 : 44 }}>
          {display}
        </div>
      </div>
      <div className={m.calcGrid}>
        {keys.map((k, idx) => (
          <button key={idx} type="button" className={`${m.calcBtn} ${k.cls}`} onClick={k.fn}>
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. TERMINAL — Interactive macOS zsh shell
   ═══════════════════════════════════════════════════════════════ */
export function MacTerminalApp({ seed }) {
  const [lines, setLines] = useState([
    { type: "muted", text: "Last login: Fri Nov 20 19:48:12 on ttys001" },
    { type: "muted", text: "Type 'help', 'ls', 'neofetch', 'ps aux', or 'locket --status'." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    sfx.keyPress();
    setHistory((h) => [cmd, ...h.slice(0, 29)]);
    setHistIdx(-1);

    const out = [{ type: "cmd", text: `riya@Riyas-MacBook-Air ~ % ${cmd}` }];
    const lower = cmd.toLowerCase();

    if (lower === "clear") {
      setLines([]);
      return;
    } else if (lower === "help") {
      out.push({
        type: "out",
        text: [
          "Available commands:",
          "  ls / ls -la             List home directory files",
          "  cat README_FOR_BABA.txt Read desktop note",
          "  neofetch                Display MacBook Air M2 specs",
          "  ps aux                  Inspect active system daemons",
          "  locket --status         Check LocketLink eSIM telemetry",
          "  whoami | date | pwd     Standard shell utilities",
          "  clear                   Clear terminal buffer",
        ].join("\n"),
      });
    } else if (lower === "whoami") {
      out.push({ type: "out", text: "riya (Riya Sen — Junior Analyst, WB Urban Dev. Dept)" });
    } else if (lower === "pwd") {
      out.push({ type: "out", text: "/Users/riya" });
    } else if (lower === "hostname") {
      out.push({ type: "out", text: "Riyas-MacBook-Air.local" });
    } else if (lower === "date") {
      out.push({ type: "out", text: "Fri Nov 20 20:15:42 IST 2026" });
    } else if (lower === "uname -a" || lower === "uname") {
      out.push({
        type: "out",
        text: "Darwin Riyas-MacBook-Air.local 24.1.0 Darwin Kernel Version 24.1.0 ARM64_T8112 arm64",
      });
    } else if (lower === "ls" || lower === "ls -la") {
      out.push({
        type: "out",
        text:
          lower === "ls -la"
            ? [
                "drwxr-xr-x  12 riya  staff   384 Nov 20 19:52 Desktop",
                "drwxr-xr-x   8 riya  staff   256 Nov 20 19:15 Documents",
                "drwxr-xr-x   6 riya  staff   192 Nov 20 19:18 Downloads",
                "-rw-r--r--   1 riya  staff   214 Nov 20 19:45 README_FOR_BABA.txt",
                "-rw-------   1 riya  staff  1408 Nov 20 19:16 tender_404_summary.txt",
                "drwx------   4 riya  staff   128 Nov 20 19:15 .bangovault",
              ].join("\n")
            : "Desktop   Documents   Downloads   Pictures   README_FOR_BABA.txt   tender_404_summary.txt",
      });
    } else if (lower.startsWith("cat ")) {
      const target = lower.slice(4).trim();
      if (target.includes("readme")) {
        out.push({
          type: "out",
          text: "Baba, if anything looks off tonight:\nCheck my PingMe messages, Safari plate lookup, and Tender #404 audit inside Downloads & BangoVault.",
        });
      } else if (target.includes("tender")) {
        out.push({
          type: "out",
          text: `CONFIDENTIAL AUDIT BRIEF\nProject: Sector V Urban Corridor\nSuspected Shell: East-Bypass Infra Holdings\nContractor ID (${CONTRACTOR_ID}) sealed inside BangoVault.`,
        });
      } else {
        out.push({ type: "err", text: `cat: ${cmd.slice(4)}: No such file or directory` });
      }
    } else if (lower === "ps aux" || lower === "ps") {
      out.push({
        type: "warn",
        text: [
          "USER   PID  %CPU COMMAND",
          "root   102   0.4 /System/Library/CoreServices/WindowServer",
          "riya   404  12.8 /usr/libexec/wb-dept-remote-wipe-d --origin=" + ROHAN_NUMBER,
          "riya   512   1.1 /Applications/LocketLink.app/Contents/MacOS/locketd --esim=ACTIVE",
          "riya   618   0.6 /Applications/BangoVault.app/Contents/MacOS/BangoVault",
        ].join("\n"),
      });
    } else if (lower.startsWith("locket")) {
      out.push({
        type: "good",
        text: [
          "LocketLink eSIM Daemon v3.4 — ONLINE",
          "Paired Device : Riya's Silver Pendant (ID: LL-KOL-8812)",
          "State         : IN MOTION (Bidhannagar / Salt Lake cell towers)",
          `Last Tower    : ${ZONES[seed?.blockedNeighbor]?.name || "Salt Lake"} relay`,
          "Tip           : Open CholoMap to monitor live coordinates.",
        ].join("\n"),
      });
    } else if (lower === "neofetch") {
      out.push({
        type: "good",
        text: [
          "        .:'         riya@Riyas-MacBook-Air",
          "     __ :'__        ----------------------",
          "  .'`__`-'__``.     OS: macOS Sequoia 15.1 (24B83) arm64",
          " :__________.-'     Host: MacBook Air (M2, 13-inch)",
          " :_________:        Kernel: Darwin 24.1.0",
          "  :_________`-;     Shell: zsh 5.9",
          "   `.__.-.__.'      Memory: 16 GB Unified LPDDR5",
          "                    Disk: Macintosh HD (248 GB / 512 GB)",
        ].join("\n"),
      });
    } else {
      out.push({ type: "err", text: `zsh: command not found: ${cmd.split(" ")[0]}` });
    }

    setLines((prev) => [...prev, ...out]);
  }

  return (
    <div className={m.termWrap}>
      <div className={m.termQuickBar}>
        {["neofetch", "ls -la", "ps aux", "locket --status", "cat README_FOR_BABA.txt"].map((q) => (
          <button key={q} type="button" className={m.termChip} onClick={() => runCommand(q)}>
            {q}
          </button>
        ))}
      </div>
      <div className={m.termBody}>
        {lines.map((l, i) => (
          <pre
            key={i}
            className={`${m.termLine} ${
              l.type === "cmd"
                ? m.termCmd
                : l.type === "err"
                  ? m.termErr
                  : l.type === "warn"
                    ? m.termWarn
                    : l.type === "good"
                      ? m.termGood
                      : m.termMuted
            }`}
          >
            {l.text}
          </pre>
        ))}
        <form
          className={m.termInputRow}
          onSubmit={(e) => {
            e.preventDefault();
            runCommand(input);
            setInput("");
          }}
        >
          <span className={m.termPrompt}>riya@Riyas-MacBook-Air ~ %</span>
          <input
            className={m.termInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && history.length) {
                e.preventDefault();
                const ni = Math.min(history.length - 1, histIdx + 1);
                setHistIdx(ni);
                setInput(history[ni]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const ni = histIdx - 1;
                if (ni < 0) {
                  setHistIdx(-1);
                  setInput("");
                } else {
                  setHistIdx(ni);
                  setInput(history[ni]);
                }
              }
            }}
            placeholder="Type a command..."
            autoFocus
            spellCheck={false}
          />
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. MAIL — Authentic macOS 3-pane Mail inbox
   ═══════════════════════════════════════════════════════════════ */
export function MacMailApp({ seed }) {
  const initialMails = [
    {
      id: "m1",
      from: "WB Dept IT Security",
      email: "security-noreply@wb.gov.in",
      subject: "ALERT: Cloud Recovery Device Linked (+91 98300-44102)",
      time: "8:15 PM",
      unread: true,
      flagged: true,
      body: `Automated Security Notice for riya.sen@wb.gov.in\n\nA Remote Factory Reset signal was initiated from linked recovery device R's Phone (${ROHAN_NUMBER}) using Dept Token ${CONTRACTOR_ID}.\n\nIf you did not authorize this action, immediately open System Settings → Security & Remote Wipe and REVOKE the linked cloud device.`,
    },
    {
      id: "m2",
      from: "Ananya Chatterjee",
      email: "ananya.c@wb.gov.in",
      subject: "Re: Tender #404 Sector V Discrepancies",
      time: "7:18 PM",
      unread: true,
      flagged: false,
      body: "Riya,\n\nI just pulled the Q3 invoice trail. East-Bypass Infra Holdings has zero registered offices in Salt Lake — it's a shell company billing ₹80 Cr on Tender #404.\n\nKeep the audit summary inside BangoVault and lock it down tonight. Don't trust anyone on the 4th floor.\n\n— Ananya",
    },
    {
      id: "m3",
      from: "Baba (Subir Sen)",
      email: "inspector.sen@lalbazar.wb.gov.in",
      subject: "Dinner at 9 — don't stay up auditing",
      time: "6:40 PM",
      unread: false,
      flagged: false,
      body: "Riya ma,\n\nI'll be in the study wrapping up a cyber-cell briefing until 8:15. Warm up the dal if you're hungry, we'll go through your Urban Dev folder after dinner.\n\nAnd keep your silver locket on if you step outside!\n— Baba",
    },
    {
      id: "m4",
      from: "LocketLink Cloud",
      email: "alerts@locketlink.in",
      subject: "Pendant eSIM Active — Movement Outside Home Zone",
      time: "8:12 PM",
      unread: true,
      flagged: true,
      body: `LocketLink Safety Alert:\n\nDevice: Riya Sen's Pendant (LL-KOL-8812)\nStatus: MOVING RAPIDLY\nVehicle sighting logged near CK Block Back Gate (Plate WB-06-${seed?.plateNum || "4829"}).\n\nOpen CholoMap on your Mac to inspect live Salt Lake / Bidhannagar cell pings.`,
    },
    {
      id: "m5",
      from: "Swiggy Kolkata",
      email: "orders@swiggy.in",
      subject: "Your order from Balaram Mullick & Radharaman Mullick",
      time: "Yesterday",
      unread: false,
      flagged: false,
      body: "Thanks for ordering! 4× Baked Rosogolla & 2× Sandesh delivered to CK Block, Salt Lake Sector II.\nOrder Total: ₹260.",
    },
  ];

  const [mails, setMails] = useState(initialMails);
  const [selectedId, setSelectedId] = useState("m1");
  const [replyText, setReplyText] = useState("");
  const [sentReply, setSentReply] = useState(false);

  const cur = mails.find((x) => x.id === selectedId) || mails[0];

  function selectMail(id) {
    sfx.tabSwitch();
    setSelectedId(id);
    setSentReply(false);
    setReplyText("");
    setMails((prev) => prev.map((x) => (x.id === id ? { ...x, unread: false } : x)));
  }

  return (
    <div className={m.splitApp}>
      <aside className={m.appSidebar} style={{ width: 170 }}>
        <div className={m.sideSection}>MAILBOXES</div>
        <div className={`${m.sideRow} ${m.sideRowOn}`}>
          <span>📥 All Inboxes</span>
          <span className={m.sideCount}>{mails.filter((x) => x.unread).length}</span>
        </div>
        <div className={m.sideRow}>
          <span>🚩 Flagged</span>
          <span className={m.sideCount}>{mails.filter((x) => x.flagged).length}</span>
        </div>
        <div className={m.sideRow}>
          <span>📤 Sent</span>
        </div>
        <div className={m.sideRow}>
          <span>🗑️ Trash</span>
        </div>
        <div className={m.sideSection} style={{ marginTop: 14 }}>
          ACCOUNT
        </div>
        <div className={m.sideRowMuted}>riya.sen@wb.gov.in</div>
      </aside>

      <div className={m.mailListCol}>
        {mails.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${m.mailRow} ${selectedId === item.id ? m.mailRowOn : ""}`}
            onClick={() => selectMail(item.id)}
          >
            <div className={m.mailRowTop}>
              <span className={m.mailFrom}>
                {item.unread && <i className={m.unreadBlueDot} />}
                {item.from}
              </span>
              <span className={m.mailTime}>{item.time}</span>
            </div>
            <div className={m.mailSubj}>{item.subject}</div>
            <div className={m.mailSnippet}>{item.body.slice(0, 68)}…</div>
          </button>
        ))}
      </div>

      <div className={m.mailReader}>
        <div className={m.mailReaderHead}>
          <h3>{cur.subject}</h3>
          <div className={m.mailMetaRow}>
            <span>
              <b>{cur.from}</b> &lt;{cur.email}&gt;
            </span>
            <span>{cur.time}</span>
          </div>
        </div>
        <pre className={m.mailBody}>{cur.body}</pre>
        <div className={m.mailReplyBox}>
          {sentReply ? (
            <div className={m.mailSentTag}>✓ Draft queued to Outbox</div>
          ) : (
            <form
              style={{ display: "flex", gap: 8 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (!replyText.trim()) return;
                sfx.tap();
                setSentReply(true);
                setReplyText("");
              }}
            >
              <input
                className={m.macInput}
                placeholder={`Reply to ${cur.from}…`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button type="submit" className={m.macBtnPrimary}>
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. CALENDAR — Authentic macOS Calendar (November 2026)
   ═══════════════════════════════════════════════════════════════ */
const NOV_2026_EVENTS = {
  14: [{ time: "11:00 AM", title: "Cloud Backup Setup w/ Rohan", color: "#F59E0B" }],
  18: [{ time: "3:00 PM", title: "Sector V Corridor Site Visit", color: "#38BDF8" }],
  19: [{ time: "4:30 PM", title: "Audit Spreadsheet Export", color: "#A855F7" }],
  20: [
    { time: "10:00 AM", title: "Tender #404 Audit Review", color: "#38BDF8" },
    { time: "2:30 PM", title: "4th Floor Briefing w/ Ananya", color: "#A855F7" },
    { time: "7:50 PM", title: "10-min Walk — Back Gate (Rohan)", color: "#EF4444" },
    { time: "9:00 PM", title: "Dinner & Audit Review w/ Baba", color: "#22C55E" },
  ],
  21: [{ time: "1:00 PM", title: "Canteen Lunch w/ Ananya", color: "#22C55E" }],
};

export function MacCalendarApp() {
  const [selectedDay, setSelectedDay] = useState(20);
  // Nov 1, 2026 is a Sunday (day index 0), 30 days in November
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const events = NOV_2026_EVENTS[selectedDay] || [];

  return (
    <div className={m.splitApp}>
      <div className={m.calMain}>
        <div className={m.calHeader}>
          <h3>November 2026</h3>
          <span className={m.calBadge}>Today: Fri, Nov 20</span>
        </div>
        <div className={m.calWeekRow}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className={m.calGrid}>
          {days.map((day) => {
            const evs = NOV_2026_EVENTS[day] || [];
            const isToday = day === 20;
            const isSel = day === selectedDay;
            return (
              <button
                key={day}
                type="button"
                className={`${m.calCell} ${isSel ? m.calCellSel : ""}`}
                onClick={() => {
                  sfx.tabSwitch();
                  setSelectedDay(day);
                }}
              >
                <span className={`${m.calDayNum} ${isToday ? m.calTodayPill : ""}`}>{day}</span>
                <div className={m.calDots}>
                  {evs.slice(0, 3).map((e, idx) => (
                    <span key={idx} className={m.calDot} style={{ background: e.color }} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <aside className={m.calSide}>
        <div className={m.sideSection}>NOV {selectedDay}, 2026</div>
        {events.length === 0 ? (
          <p className={m.calEmpty}>No scheduled events.</p>
        ) : (
          <div className={m.calEventList}>
            {events.map((ev, i) => (
              <div key={i} className={m.calEventCard} style={{ borderLeftColor: ev.color }}>
                <span className={m.calEventTime}>{ev.time}</span>
                <b>{ev.title}</b>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. MUSIC — Riya's Kolkata Evening Playlist
   ═══════════════════════════════════════════════════════════════ */
const RIYA_TRACKS = [
  {
    id: 1,
    title: "Monsoon Over Salt Lake",
    artist: "Calcutta Lo-Fi Collective",
    album: "Bidhannagar Dusk",
    dur: 214,
    art: "linear-gradient(135deg, #312e81, #be185d)",
  },
  {
    id: 2,
    title: "Rabindra Sangeet (Acoustic)",
    artist: "Anirban & Strings",
    album: "Evening Tea Sessions",
    dur: 248,
    art: "linear-gradient(135deg, #b45309, #7c2d12)",
  },
  {
    id: 3,
    title: "Midnight on EM Bypass",
    artist: "Neon Hooghly",
    album: "Kolkata Synthwave",
    dur: 196,
    art: "linear-gradient(135deg, #0f766e, #1d4ed8)",
  },
  {
    id: 4,
    title: "Park Street Rain",
    artist: "Tram 25",
    album: "November Mist",
    dur: 229,
    art: "linear-gradient(135deg, #4c1d95, #0f172a)",
  },
];

export function MacMusicApp() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playingTrack, setPlayingTrack] = useState(false);
  const [sec, setSec] = useState(42);

  const cur = RIYA_TRACKS[trackIdx];

  useEffect(() => {
    if (!playingTrack) return;
    const id = setInterval(() => {
      setSec((s) => (s + 1 >= cur.dur ? 0 : s + 1));
    }, 1000);
    return () => clearInterval(id);
  }, [playingTrack, cur.dur]);

  const fmt = (n) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;

  return (
    <div className={m.splitApp}>
      <aside className={m.appSidebar} style={{ width: 185 }}>
        <div className={m.sideSection}>APPLE MUSIC</div>
        <div className={`${m.sideRow} ${m.sideRowOn}`}>🎧 Listen Now</div>
        <div className={m.sideRow}>📻 Radio</div>
        <div className={m.sideSection} style={{ marginTop: 14 }}>
          PLAYLISTS
        </div>
        <div className={m.sideRow}>🌧️ Kolkata Nights</div>
        <div className={m.sideRow}>☕ Study &amp; Audit</div>
        <div className={m.sideRow}>🚗 Bypass Drive</div>
      </aside>

      <div className={m.musicMain}>
        <div className={m.musicHero}>
          <div className={m.albumArt} style={{ background: cur.art }}>
            <span>♫</span>
          </div>
          <div className={m.musicMeta}>
            <span className={m.musicKicker}>RIYA&apos;S PLAYLIST · KOLKATA NIGHTS</span>
            <h3>{cur.title}</h3>
            <p>
              {cur.artist} — {cur.album}
            </p>
            <div className={m.musicControls}>
              <button
                type="button"
                className={m.macIconBtn}
                onClick={() => {
                  sfx.tap();
                  setTrackIdx((i) => (i - 1 + RIYA_TRACKS.length) % RIYA_TRACKS.length);
                  setSec(0);
                }}
              >
                ⏮
              </button>
              <button
                type="button"
                className={m.musicPlayBtn}
                onClick={() => {
                  sfx.tap();
                  setPlayingTrack((v) => !v);
                }}
              >
                {playingTrack ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                type="button"
                className={m.macIconBtn}
                onClick={() => {
                  sfx.tap();
                  setTrackIdx((i) => (i + 1) % RIYA_TRACKS.length);
                  setSec(0);
                }}
              >
                ⏭
              </button>
            </div>
            <div className={m.musicProgress}>
              <span>{fmt(sec)}</span>
              <input
                type="range"
                min={0}
                max={cur.dur}
                value={sec}
                onChange={(e) => setSec(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#FA233B" }}
              />
              <span>{fmt(cur.dur)}</span>
            </div>
          </div>
        </div>

        <div className={m.trackList}>
          {RIYA_TRACKS.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              className={`${m.trackRow} ${idx === trackIdx ? m.trackRowOn : ""}`}
              onClick={() => {
                sfx.tabSwitch();
                setTrackIdx(idx);
                setSec(0);
                setPlayingTrack(true);
              }}
            >
              <span className={m.trackNum}>{idx === trackIdx && playingTrack ? "🔊" : idx + 1}</span>
              <span className={m.trackInfo}>
                <b>{t.title}</b>
                <small>{t.artist}</small>
              </span>
              <span className={m.trackDur}>{fmt(t.dur)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. WEATHER — Authentic macOS Weather (Salt Lake, Kolkata)
   ═══════════════════════════════════════════════════════════════ */
export function MacWeatherApp() {
  const hourly = [
    ["Now", "🌙", "24°"],
    ["9 PM", "🌙", "23°"],
    ["10 PM", "☁️", "22°"],
    ["11 PM", "🌙", "22°"],
    ["12 AM", "🌙", "21°"],
    ["1 AM", "🌫️", "20°"],
    ["2 AM", "🌫️", "20°"],
  ];

  const weekly = [
    ["Today", "🌙", 19, 29],
    ["Sat", "☀️", 18, 29],
    ["Sun", "🌤️", 19, 30],
    ["Mon", "☀️", 18, 28],
    ["Tue", "⛅", 17, 27],
  ];

  return (
    <div className={m.wxWrap}>
      <div className={m.wxHero}>
        <div className={m.wxCity}>Salt Lake, Kolkata</div>
        <div className={m.wxTemp}>24°</div>
        <div className={m.wxCond}>Clear Night · Misty along EM Bypass</div>
        <div className={m.wxHL}>H: 29° &nbsp; L: 19°</div>
      </div>

      <div className={m.wxCard}>
        <div className={m.wxCardTitle}>HOURLY FORECAST</div>
        <div className={m.wxHourlyRow}>
          {hourly.map(([t, ic, deg]) => (
            <div key={t} className={m.wxHourCell}>
              <span>{t}</span>
              <span style={{ fontSize: 20 }}>{ic}</span>
              <b>{deg}</b>
            </div>
          ))}
        </div>
      </div>

      <div className={m.wxGrid}>
        <div className={m.wxCard}>
          <div className={m.wxCardTitle}>5-DAY FORECAST</div>
          {weekly.map(([day, ic, lo, hi]) => (
            <div key={day} className={m.wxWeekRow}>
              <span style={{ width: 48 }}>{day}</span>
              <span>{ic}</span>
              <span className={m.wxMuted}>{lo}°</span>
              <div className={m.wxBarTrack}>
                <span className={m.wxBarFill} />
              </div>
              <b>{hi}°</b>
            </div>
          ))}
        </div>

        <div className={m.wxMetrics}>
          <div className={m.wxMiniCard}>
            <span>HUMIDITY</span>
            <b>68%</b>
            <small>Dew point 18°C</small>
          </div>
          <div className={m.wxMiniCard}>
            <span>WIND</span>
            <b>8 km/h</b>
            <small>NE Light Breeze</small>
          </div>
          <div className={m.wxMiniCard}>
            <span>AIR QUALITY</span>
            <b>112</b>
            <small>Moderate · Bidhannagar</small>
          </div>
          <div className={m.wxMiniCard}>
            <span>VISIBILITY</span>
            <b>6 km</b>
            <small>Evening haze</small>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. CLOCK — World Clock + Working Stopwatch
   ═══════════════════════════════════════════════════════════════ */
export function MacClockApp() {
  const [tab, setTab] = useState("world");
  const [swMs, setSwMs] = useState(0);
  const [swRun, setSwRun] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    if (!swRun) return;
    const t0 = Date.now() - swMs;
    const id = setInterval(() => {
      setSwMs(Date.now() - t0);
    }, 37);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swRun]);

  const fmtSw = (ms) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  };

  const cities = [
    { name: "Kolkata", tz: "IST · Today, +0 HRS", time: "8:15 PM" },
    { name: "London", tz: "GMT · Today, −5.5 HRS", time: "2:45 PM" },
    { name: "New York", tz: "EST · Today, −10.5 HRS", time: "9:45 AM" },
    { name: "Tokyo", tz: "JST · Today, +3.5 HRS", time: "11:45 PM" },
  ];

  return (
    <div className={m.clockWrap}>
      <div className={m.segmentedWrap}>
        {[
          ["world", "World Clock"],
          ["stopwatch", "Stopwatch"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`${m.segBtn} ${tab === id ? m.segBtnOn : ""}`}
            onClick={() => {
              sfx.tabSwitch();
              setTab(id);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "world" ? (
        <div className={m.worldList}>
          {cities.map((c) => (
            <div key={c.name} className={m.worldRow}>
              <div>
                <b>{c.name}</b>
                <small>{c.tz}</small>
              </div>
              <span className={m.worldTime}>{c.time}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={m.swPanel}>
          <div className={m.swDisplay}>{fmtSw(swMs)}</div>
          <div className={m.swBtns}>
            <button
              type="button"
              className={m.macBtnSecondary}
              onClick={() => {
                sfx.tap();
                if (swRun) setLaps((l) => [fmtSw(swMs), ...l]);
                else {
                  setSwMs(0);
                  setLaps([]);
                }
              }}
            >
              {swRun ? "Lap" : "Reset"}
            </button>
            <button
              type="button"
              className={swRun ? m.macBtnDanger : m.macBtnGreen}
              onClick={() => {
                sfx.tap();
                setSwRun((v) => !v);
              }}
            >
              {swRun ? "Stop" : "Start"}
            </button>
          </div>
          {laps.length > 0 && (
            <div className={m.lapList}>
              {laps.map((lp, idx) => (
                <div key={idx} className={m.lapRow}>
                  <span>Lap {laps.length - idx}</span>
                  <span>{lp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. TEXTEDIT — Real plain-text scratchpad
   ═══════════════════════════════════════════════════════════════ */
export function MacTextEditApp({ initialText }) {
  const [text, setText] = useState(
    initialText ||
      "README_FOR_BABA.txt\n\nBaba, if anything looks off tonight:\nCheck my PingMe messages, Safari WB Plate Lookup, and Tender #404 audit inside Downloads & BangoVault.\n\n— Riya (7:45 PM)"
  );
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className={m.textEditWrap}>
      <div className={m.textEditBar}>
        <span>SF Mono · 13pt</span>
        <span>
          {words} words · {text.length} chars
        </span>
      </div>
      <textarea
        className={m.textEditArea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}

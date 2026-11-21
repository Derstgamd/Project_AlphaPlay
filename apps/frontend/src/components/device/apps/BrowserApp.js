"use client";

import { useState } from "react";
import {
  BROWSER_BOOKMARKS,
  BROWSER_HISTORY,
  GAZETTE_ARTICLE,
  GRID_STATUS,
  TRANSIT_LOOKUP,
} from "@/data/deviceData";
import { PhoneHeader } from "../parts";
import styles from "../Apps.module.css";

function NewTab({ onGo }) {
  return (
    <div className={`${styles.page} ${styles.pageDark}`}>
      <h2>Adam&apos;s bookmarks</h2>
      <div className={styles.marks}>
        {BROWSER_BOOKMARKS.map((b) => (
          <button key={b.url} type="button" className={styles.mark} onClick={() => onGo(b.url)}>
            <strong>{b.title}</strong>
            <div className={styles.label}>{b.url}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function History({ onGo }) {
  return (
    <div className={`${styles.page} ${styles.pageDark}`}>
      <h2>Browsing history</h2>
      <div className={styles.marks} style={{ gridTemplateColumns: "1fr" }}>
        {BROWSER_HISTORY.map((h) => (
          <button key={h.time} type="button" className={styles.mark} onClick={() => onGo(h.url)}>
            <div className={styles.label}>{h.time}</div>
            <strong>{h.title}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function Gazette() {
  return (
    <div className={styles.page}>
      <div className={styles.byline}>PINEHOLLOW GAZETTE</div>
      <h2>{GAZETTE_ARTICLE.headline}</h2>
      <div className={styles.byline}>{GAZETTE_ARTICLE.byline}</div>
      {GAZETTE_ARTICLE.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

function Grid() {
  return (
    <div className={styles.page}>
      <h2>Pinehollow Grid Status</h2>
      <div className={styles.byline}>live feed · frozen at last sync</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Node</th>
            <th>Load</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {GRID_STATUS.map((r) => (
            <tr key={r.node}>
              <td>{r.node}</td>
              <td>{r.load}</td>
              <td>{r.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Transit() {
  const [ticket, setTicket] = useState("");
  const [result, setResult] = useState(null);

  const search = (e) => {
    e.preventDefault();
    const clean = ticket.trim().replace("#", "");
    setResult(TRANSIT_LOOKUP[clean] || { none: true });
  };

  return (
    <div className={styles.page}>
      <h2>Pinehollow Transit · Locker Lookup</h2>
      <div className={styles.byline}>Enter the 4-digit ticket number</div>
      <form className={styles.lookup} onSubmit={search}>
        <input
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
          placeholder="e.g. 0000"
          maxLength={5}
          aria-label="Ticket number"
        />
        <button type="submit">Look up</button>
      </form>
      {result && (
        <div className={styles.result}>
          {result.none ? (
            "No record found for that ticket."
          ) : (
            <>
              <strong>
                Locker {result.locker} · {result.bay}
              </strong>
              <div>Status: {result.status}</div>
              <div>Opened: {result.opened}</div>
              <div>Access: {result.access}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function renderPage(url, onGo) {
  switch (url) {
    case "about:newtab":
      return <NewTab onGo={onGo} />;
    case "about:history":
      return <History onGo={onGo} />;
    case "gazette.ph/blackout":
      return <Gazette />;
    case "grid.ph/status":
      return <Grid />;
    case "transit.ph/lockers":
      return <Transit />;
    default:
      return (
        <div className={styles.page}>
          <h2>Page not found</h2>
          <p>Nothing lives at &quot;{url}&quot;. Try a bookmark.</p>
        </div>
      );
  }
}

const clean = (u) =>
  u.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");

export default function BrowserApp({ variant, onHome }) {
  const phone = variant === "phone";
  const [history, setHistory] = useState(["about:newtab"]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("about:newtab");

  const go = (raw) => {
    const url = clean(raw) || "about:newtab";
    const next = [...history.slice(0, idx + 1), url];
    setHistory(next);
    setIdx(next.length - 1);
    setInput(url);
  };

  const move = (delta) => {
    const next = idx + delta;
    if (next < 0 || next >= history.length) return;
    setIdx(next);
    setInput(history[next]);
  };

  const current = history[idx];

  const chrome = (
    <>
      <form
        className={styles.bar}
        onSubmit={(e) => {
          e.preventDefault();
          go(input);
        }}
      >
        <button type="button" className={styles.navBtn} onClick={() => move(-1)} disabled={idx === 0} aria-label="Back">
          ‹
        </button>
        <button type="button" className={styles.navBtn} onClick={() => move(1)} disabled={idx >= history.length - 1} aria-label="Forward">
          ›
        </button>
        <button type="button" className={styles.navBtn} onClick={() => go("about:newtab")} aria-label="Home">
          ⌂
        </button>
        <input
          className={styles.url}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Address bar"
          spellCheck={false}
        />
      </form>
      {renderPage(current, go)}
    </>
  );

  return (
    <div className={`${styles.app} ${styles.browser} ${phone ? styles.phone : ""}`}>
      {phone && <PhoneHeader title="Browser" onBack={onHome} backLabel="Home" />}
      {chrome}
    </div>
  );
}

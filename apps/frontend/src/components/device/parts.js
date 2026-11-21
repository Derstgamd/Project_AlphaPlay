"use client";

import { useState } from "react";
import styles from "./Apps.module.css";

export function PhoneHeader({ title, sub, onBack, backLabel = "Back" }) {
  return (
    <div className={styles.phoneHeader}>
      <button type="button" className={styles.back} onClick={onBack}>
        ‹ {backLabel}
      </button>
      <div className={styles.phoneHeaderTitle}>
        <span>{title}</span>
        {sub && <small>{sub}</small>}
      </div>
      <span className={styles.phoneHeaderSpacer} />
    </div>
  );
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];

export function PinPad({ onSubmit, hint }) {
  const [digits, setDigits] = useState("");
  const [err, setErr] = useState("");

  const press = (key) => {
    if (key === "C") {
      setDigits("");
      return;
    }
    if (key === "⌫") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (digits.length >= 4) return;
    const next = digits + key;
    setDigits(next);
    setErr("");
    if (next.length === 4 && !onSubmit(next)) {
      setErr(`Wrong PIN. ${hint}`);
      setDigits("");
    }
  };

  return (
    <div
      className={styles.pad}
      tabIndex={0}
      onKeyDown={(e) => {
        if (/^\d$/.test(e.key)) press(e.key);
        else if (e.key === "Backspace") press("⌫");
      }}
    >
      <div className={styles.padTitle}>🔒 Enter 4-digit passcode</div>
      <div className={styles.padDisplay}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i < digits.length ? styles.dotOn : styles.dot} />
        ))}
      </div>
      {err && <div className={styles.err}>{err}</div>}
      <div className={styles.padKeys}>
        {KEYS.map((k) => (
          <button key={k} type="button" className={styles.padKey} onClick={() => press(k)}>
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

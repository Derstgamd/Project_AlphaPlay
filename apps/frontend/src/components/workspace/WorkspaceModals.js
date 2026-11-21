"use client";

import { useState } from "react";
import { CASE_BRIEF, SUSPECTS } from "@/data/caseData";
import { useCase } from "@/context/CaseContext";
import styles from "./WorkspaceModals.module.css";

function Shell({ onClose, children, wide }) {
  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`${styles.card} ${wide ? styles.cardWide : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.x} onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export function InspectModal({ item, onClose }) {
  return (
    <Shell onClose={onClose}>
      <div className={styles.eyebrow}>{item.role}</div>
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.body}>{item.details}</p>
      {item.lines && (
        <div className={styles.paper}>
          {item.lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      )}
    </Shell>
  );
}

export function NotesModal({ onClose }) {
  const { scratchpad, setScratchpad } = useCase();
  return (
    <Shell onClose={onClose}>
      <div className={styles.eyebrow}>DESK STICKY NOTE</div>
      <h3 className={styles.title}>Investigator Scratchpad</h3>
      <textarea
        className={styles.textarea}
        value={scratchpad}
        onChange={(e) => setScratchpad(e.target.value)}
        aria-label="Investigator scratchpad"
      />
    </Shell>
  );
}

export function CaseFileModal({ onClose }) {
  const { clues } = useCase();
  const [tab, setTab] = useState("brief");

  return (
    <Shell onClose={onClose} wide>
      <div className={styles.eyebrow}>
        {CASE_BRIEF.caseId} · CONFIDENTIAL
      </div>
      <h3 className={styles.title}>{CASE_BRIEF.title}</h3>

      <div className={styles.tabs}>
        {[
          ["brief", "Brief"],
          ["people", "People"],
          ["evidence", `Evidence (${clues.length}/4)`],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`${styles.tab} ${tab === id ? styles.tabOn : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.pane}>
        {tab === "brief" && (
          <>
            <p className={styles.body}>{CASE_BRIEF.summary}</p>
            <p className={styles.mono}>LAST SIGNAL · {CASE_BRIEF.lastSeen}</p>
            <p className={styles.mono}>SOURCE · {CASE_BRIEF.subtitle}</p>
          </>
        )}

        {tab === "people" &&
          SUSPECTS.map((p) => (
            <article key={p.id} className={styles.entry}>
              <div className={styles.entryTop}>
                <strong>{p.name}</strong>
                <span className={styles.chip}>{p.status}</span>
              </div>
              <div className={styles.mono}>{p.role}</div>
              <p className={styles.body}>{p.note}</p>
            </article>
          ))}

        {tab === "evidence" &&
          clues.map((c) => (
            <article key={c.id} className={styles.entry}>
              <div className={styles.mono}>{c.source}</div>
              <strong>{c.title}</strong>
              <p className={styles.body}>{c.detail}</p>
            </article>
          ))}
      </div>
    </Shell>
  );
}

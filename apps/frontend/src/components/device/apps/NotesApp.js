"use client";

import { useState } from "react";
import { CASE_BRIEF, NOTES } from "@/data/caseData";
import { useCase } from "@/context/CaseContext";
import { PhoneHeader, PinPad } from "../parts";
import styles from "../Apps.module.css";

function NoteView({ note, unlocked, onUnlock }) {
  if (note.locked && !unlocked) {
    return <PinPad onSubmit={onUnlock} hint={CASE_BRIEF.pinHint} />;
  }
  return <div className={styles.body}>{note.body}</div>;
}

export default function NotesApp({ variant, onHome }) {
  const phone = variant === "phone";
  const { notesUnlocked, tryUnlockNotes } = useCase();
  const [activeId, setActiveId] = useState(phone ? null : NOTES[1].id);
  const note = NOTES.find((n) => n.id === activeId);

  const list = (
    <div className={styles.side}>
      {NOTES.map((n) => (
        <button
          key={n.id}
          type="button"
          className={`${styles.row} ${activeId === n.id ? styles.rowActive : ""}`}
          onClick={() => setActiveId(n.id)}
        >
          <div>
            <div className={styles.rowTitle}>
              {n.locked && !notesUnlocked ? "🔒 " : ""}
              {n.title}
            </div>
            <div className={styles.rowSub}>{n.updated}</div>
          </div>
        </button>
      ))}
    </div>
  );

  if (phone) {
    return (
      <div className={`${styles.app} ${styles.phone}`}>
        <PhoneHeader
          title={note ? note.title : "Notes"}
          onBack={note ? () => setActiveId(null) : onHome}
          backLabel={note ? "Notes" : "Home"}
        />
        {note ? (
          <div className={styles.main}>
            <NoteView note={note} unlocked={notesUnlocked} onUnlock={tryUnlockNotes} />
          </div>
        ) : (
          list
        )}
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {list}
      <div className={styles.main}>
        {note && (
          <>
            <div className={styles.head}>
              <span>{note.title}</span>
              <span className={styles.sub}>{note.updated}</span>
            </div>
            <NoteView note={note} unlocked={notesUnlocked} onUnlock={tryUnlockNotes} />
          </>
        )}
      </div>
    </div>
  );
}

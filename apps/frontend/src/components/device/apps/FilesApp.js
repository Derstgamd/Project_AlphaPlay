"use client";

import { useState } from "react";
import { FILES } from "@/data/caseData";
import { PhoneHeader } from "../parts";
import styles from "../Apps.module.css";

const BARS = Array.from({ length: 28 }, (_, i) => ({
  h: `${8 + ((i * 37) % 26)}px`,
  d: `${(i % 7) * 0.09}s`,
}));

function FileView({ file }) {
  const [playing, setPlaying] = useState(false);
  const isAudio = file.name.endsWith(".m4a");

  return (
    <div className={styles.detail}>
      <div className={styles.label}>
        {file.folder.toUpperCase()} · {file.size} · {file.modified}
      </div>
      {isAudio && (
        <>
          <div className={`${styles.wave} ${playing ? styles.wavePlaying : ""}`} aria-hidden="true">
            {BARS.map((b, i) => (
              <i key={i} style={{ "--h": b.h, "--d": b.d }} />
            ))}
          </div>
          <button type="button" className={styles.playBtn} onClick={() => setPlaying((p) => !p)}>
            {playing ? "❚❚ Pause" : "▶ Play voicemail"}
          </button>
        </>
      )}
      <div className={styles.card} style={{ whiteSpace: "pre-wrap" }}>
        {file.preview}
      </div>
    </div>
  );
}

export default function FilesApp({ variant, onHome, initialId }) {
  const phone = variant === "phone";
  const [activeId, setActiveId] = useState(initialId || null);
  const file = FILES.find((f) => f.id === activeId);

  const list = (
    <div className={styles.side}>
      {FILES.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`${styles.row} ${activeId === f.id ? styles.rowActive : ""}`}
          onClick={() => setActiveId(f.id)}
        >
          <div>
            <div className={styles.rowTitle}>{f.name}</div>
            <div className={styles.rowSub}>
              {f.folder} · {f.size}
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  if (phone) {
    return (
      <div className={`${styles.app} ${styles.phone}`}>
        <PhoneHeader
          title={file ? file.name : "Voicemail & Files"}
          onBack={file ? () => setActiveId(null) : onHome}
          backLabel={file ? "Files" : "Home"}
        />
        {file ? <FileView file={file} /> : list}
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {list}
      <div className={styles.main}>
        {file ? (
          <>
            <div className={styles.head}>
              <span>{file.name}</span>
            </div>
            <FileView key={file.id} file={file} />
          </>
        ) : (
          <div className={styles.empty}>Select a file</div>
        )}
      </div>
    </div>
  );
}

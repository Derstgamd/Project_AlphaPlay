"use client";

import { useState } from "react";
import { PHOTOS } from "@/data/caseData";
import { useCase } from "@/context/CaseContext";
import { PhoneHeader } from "../parts";
import styles from "../Apps.module.css";

function PhotoDetail({ photo }) {
  return (
    <div className={styles.detail}>
      <div
        className={styles.preview}
        style={{ background: `linear-gradient(135deg, ${photo.accent}55, #0b0f16)` }}
      >
        <div className={styles.label}>{photo.filename}</div>
        <div>
          <strong>{photo.title}</strong>
          <div>{photo.caption}</div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>EXIF METADATA</div>
        <div>Captured: {photo.timestamp}</div>
        <div>Location: {photo.location}</div>
        <div>Device: {photo.device}</div>
      </div>
    </div>
  );
}

export default function PhotosApp({ variant, onHome, initialId }) {
  const phone = variant === "phone";
  const { unlockClue } = useCase();
  const [activeId, setActiveId] = useState(initialId || null);
  const photo = PHOTOS.find((p) => p.id === activeId);

  const pick = (p) => {
    setActiveId(p.id);
    if (p.unlockClue) unlockClue(p.unlockClue);
  };

  const grid = (
    <div className={styles.grid}>
      {PHOTOS.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`${styles.tile} ${activeId === p.id ? styles.tileOn : ""}`}
          style={{ background: `linear-gradient(145deg, ${p.accent}, #0b0f16)` }}
          onClick={() => pick(p)}
        >
          <strong>{p.title}</strong>
          <small>{p.timestamp}</small>
        </button>
      ))}
    </div>
  );

  if (phone) {
    return (
      <div className={`${styles.app} ${styles.phone}`}>
        <PhoneHeader
          title={photo ? photo.filename : "Photos"}
          onBack={photo ? () => setActiveId(null) : onHome}
          backLabel={photo ? "Library" : "Home"}
        />
        {photo ? <PhotoDetail photo={photo} /> : grid}
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.main} style={{ flex: "0 0 52%" }}>
        {grid}
      </div>
      <div className={styles.main} style={{ borderLeft: "1px solid #232b3a" }}>
        {photo ? <PhotoDetail photo={photo} /> : <div className={styles.empty}>Select a photo to inspect its metadata</div>}
      </div>
    </div>
  );
}

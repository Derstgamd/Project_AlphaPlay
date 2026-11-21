"use client";

import { useRef, useState } from "react";
import { useCase } from "@/context/CaseContext";
import { PortraitArt } from "../BoardArtwork";
import {
  ANNOTATIONS,
  BOARD_NODES,
  CLUE_SLOTS,
  STRINGS,
} from "./boardData";
import styles from "./DetectiveBoard.module.css";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const initialPositions = () =>
  Object.fromEntries(BOARD_NODES.map((n) => [n.id, { x: n.x, y: n.y }]));

function NodeBody({ node, hasClue }) {
  if (node.kind === "tape") {
    return <div className={styles.tape}>{node.title}</div>;
  }

  if (node.kind === "emblem") {
    return (
      <svg className={styles.emblem} viewBox="0 0 80 70" aria-hidden="true">
        <path
          d="M36 10 L14 54 L60 54 Z"
          fill="none"
          stroke="#b92525"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M36 18 L24 48 M36 18 L48 48 M28 38 L44 38"
          stroke="#b92525"
          strokeWidth="2.5"
        />
        <text x="54" y="26" fill="#d1d5db" fontSize="11" fontFamily="cursive">
          vault04
        </text>
      </svg>
    );
  }

  if (node.kind === "scrap") {
    return (
      <div className={`${styles.scrap} ${node.tan ? styles.scrapTan : ""}`}>
        {node.lines.map((line, i) => (
          <div key={line} className={i === 0 ? styles.scrapHead : undefined}>
            {line}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${styles.polaroid} ${node.hero ? styles.polaroidHero : ""}`}>
      {hasClue && <span className={styles.clueDot} title="Clue verified" />}
      <div className={`${styles.photo} ${node.wide ? styles.photoWide : ""}`}>
        <PortraitArt variant={node.variant} />
        {node.hero && (
          <>
            <span className={styles.photoRed}>
              missing
              <br />
              tue night
            </span>
            <span className={styles.photoTime}>01:47 am</span>
          </>
        )}
      </div>
      <span className={styles.caption}>{node.title}</span>
      {node.subCaption && (
        <span className={styles.subCaption}>{node.subCaption}</span>
      )}
    </div>
  );
}

export default function DetectiveBoard({ onInspect, onSound }) {
  const { clues } = useCase();
  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const [pos, setPos] = useState(initialPositions);
  const [draggingId, setDraggingId] = useState(null);

  const found = new Set(clues.map((c) => c.id));
  const newClues = clues.filter((c) => c.id !== "clue_ping").slice(0, CLUE_SLOTS.length);

  const handleDown = (e, id) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (!boardRef.current) return;
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origin: pos[id],
      rect: boardRef.current.getBoundingClientRect(),
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 5) return;
      d.moved = true;
      setDraggingId(d.id);
      onSound?.(380);
    }
    const x = clamp(d.origin.x + (dx / d.rect.width) * 100, 5, 95);
    const y = clamp(d.origin.y + (dy / d.rect.height) * 100, 6, 95);
    setPos((p) => ({ ...p, [d.id]: { x, y } }));
  };

  const handleUp = (node) => {
    const d = dragRef.current;
    dragRef.current = null;
    setDraggingId(null);
    if (d && !d.moved) {
      onSound?.(620);
      onInspect(node);
    } else if (d) {
      onSound?.(300);
    }
  };

  const handleKey = (e, node) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onInspect(node);
    }
  };

  const resetBoard = () => setPos(initialPositions());

  return (
    <div className={styles.frame}>
      <div className={styles.board} ref={boardRef}>
        <div className={styles.dust} aria-hidden="true" />

        <svg
          className={styles.strings}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {STRINGS.map((s) => {
            const a = pos[s.from];
            const b = pos[s.to];
            const verified = !s.requires || found.has(s.requires);
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const sag = 2 + Math.hypot(a.x - b.x, a.y - b.y) * 0.1;
            const d = `M ${a.x} ${a.y} Q ${mx} ${my + sag} ${b.x} ${b.y}`;
            return (
              <g key={`${s.from}-${s.to}`}>
                <path
                  d={d}
                  transform="translate(0.4 0.8)"
                  fill="none"
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={d}
                  fill="none"
                  className={verified ? styles.yarn : styles.yarnDormant}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}
        </svg>

        {ANNOTATIONS.map((a) => (
          <span
            key={a.text}
            className={`${styles.chalk} ${a.red ? styles.chalkRed : ""}`}
            style={{ left: `${a.x}%`, top: `${a.y}%`, "--rot": `${a.rot}deg` }}
          >
            {a.text}
          </span>
        ))}

        {BOARD_NODES.map((node) => {
          const p = pos[node.id];
          const hasClue = node.clueId && found.has(node.clueId);
          return (
            <div
              key={node.id}
              role="button"
              tabIndex={0}
              aria-label={`${node.title} — ${node.role}`}
              className={`${styles.item} ${
                draggingId === node.id ? styles.itemDragging : ""
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, "--rot": `${node.rot}deg` }}
              onPointerDown={(e) => handleDown(e, node.id)}
              onPointerMove={handleMove}
              onPointerUp={() => handleUp(node)}
              onPointerCancel={() => handleUp(node)}
              onKeyDown={(e) => handleKey(e, node)}
            >
              <NodeBody node={node} hasClue={hasClue} />
            </div>
          );
        })}

        {newClues.map((clue, i) => {
          const slot = CLUE_SLOTS[i];
          return (
            <div
              key={clue.id}
              role="button"
              tabIndex={0}
              className={styles.clueNote}
              style={{ left: `${slot.x}%`, top: `${slot.y}%`, "--rot": `${slot.rot}deg` }}
              onClick={() =>
                onInspect({ title: clue.title, role: clue.source, details: clue.detail })
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                onInspect({ title: clue.title, role: clue.source, details: clue.detail })
              }
            >
              <span className={styles.newTag}>NEW LEAD</span>
              <strong>{clue.title}</strong>
              <span>{clue.source}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.tray}>
        <span className={styles.chalkPiece} />
        <span className={`${styles.chalkPiece} ${styles.chalkPieceShort}`} />
        <button type="button" className={styles.trayBtn} onClick={resetBoard}>
          tidy board
        </button>
        <span className={styles.eraser} />
      </div>
    </div>
  );
}

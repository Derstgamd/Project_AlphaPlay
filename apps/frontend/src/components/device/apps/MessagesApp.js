"use client";

import { useEffect, useRef, useState } from "react";
import { useCase } from "@/context/CaseContext";
import { PhoneHeader } from "../parts";
import styles from "../Apps.module.css";

function Conversation({ thread, typing, clueIds, onReply, phone, onBack }) {
  const feedRef = useRef(null);

  useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.messages.length, typing]);

  const choices = thread.choices.filter(
    (c) => !c.requiresClue || clueIds.has(c.requiresClue)
  );

  return (
    <div className={styles.main}>
      {phone ? (
        <PhoneHeader title={thread.name} sub={thread.status} onBack={onBack} backLabel="Chats" />
      ) : (
        <div className={styles.head}>
          <span>{thread.name}</span>
          <span className={styles.sub}>{thread.status}</span>
        </div>
      )}
      <div className={styles.feed} ref={feedRef}>
        {thread.messages.map((m) => (
          <div key={m.id} className={m.sender === "me" ? styles.bubbleMe : styles.bubbleThem}>
            {m.text}
            <span className={styles.time}>{m.time}</span>
          </div>
        ))}
        {typing && (
          <div className={styles.typing}>
            <i />
            <i />
            <i />
          </div>
        )}
      </div>
      {choices.length > 0 && (
        <div className={styles.choices}>
          {choices.map((c) => (
            <button key={c.id} type="button" className={styles.choiceBtn} onClick={() => onReply(c)}>
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MessagesApp({ variant, onHome }) {
  const phone = variant === "phone";
  const { chats, clues, typingThreadId, sendReply, markThreadRead } = useCase();
  const [activeId, setActiveId] = useState(null);

  const clueIds = new Set(clues.map((c) => c.id));
  const thread = activeId ? chats[activeId] : null;

  const open = (id) => {
    setActiveId(id);
    markThreadRead(id);
  };

  const list = (
    <div className={styles.side}>
      {Object.values(chats).map((t) => (
        <button
          key={t.id}
          type="button"
          className={`${styles.row} ${activeId === t.id ? styles.rowActive : ""}`}
          onClick={() => open(t.id)}
        >
          <div>
            <div className={styles.rowTitle}>{t.name}</div>
            <div className={styles.rowSub}>{t.messages[t.messages.length - 1]?.text}</div>
          </div>
          {t.unread > 0 && <span className={styles.badge}>{t.unread}</span>}
        </button>
      ))}
    </div>
  );

  const convo = thread && (
    <Conversation
      thread={thread}
      typing={typingThreadId === thread.id}
      clueIds={clueIds}
      onReply={(choice) => sendReply(thread.id, choice)}
      phone={phone}
      onBack={() => setActiveId(null)}
    />
  );

  if (phone) {
    return (
      <div className={`${styles.app} ${styles.phone}`}>
        {convo || (
          <>
            <PhoneHeader title="Messages" onBack={onHome} backLabel="Home" />
            {list}
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {list}
      {convo || <div className={styles.empty}>Select a conversation</div>}
    </div>
  );
}

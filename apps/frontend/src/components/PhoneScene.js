"use client";

import { useState } from "react";
import { useCase } from "@/context/CaseContext";
import { APP_META, AppIcon } from "./device/Icons";
import { APP_COMPONENTS, APP_ORDER } from "./device/registry";
import styles from "./PhoneScene.module.css";

const DOCK = ["messages", "browser", "notes", "terminal"];

export default function PhoneScene({ hostDevice }) {
  const { setActiveScreen, totalUnread, clues } = useCase();
  const [activeApp, setActiveApp] = useState(null);

  const goHome = () => setActiveApp(null);
  const App = activeApp ? APP_COMPONENTS[activeApp] : null;

  const tile = (id, small) => (
    <button
      key={id}
      type="button"
      className={small ? styles.dockTile : styles.tile}
      onClick={() => setActiveApp(id)}
      aria-label={APP_META[id].label}
    >
      <AppIcon id={id} size={small ? 50 : 54} />
      {!small && <span>{APP_META[id].label}</span>}
      {id === "messages" && totalUnread > 0 && (
        <span className={styles.badge}>{totalUnread}</span>
      )}
    </button>
  );

  return (
    <div className={styles.backdrop}>
      <div className={styles.topControls}>
        <button type="button" className={styles.ctrlBtn} onClick={() => setActiveScreen("workspace")}>
          ← Desk
        </button>
        <span className={styles.hostTag}>Adam&apos;s Phone</span>
        <button type="button" className={styles.ctrlBtn} onClick={() => hostDevice.setOverrideType("laptop")}>
          Laptop UI
        </button>
      </div>

      <div className={styles.frame}>
        <div className={styles.statusBar}>
          <span>02:14</span>
          <span className={styles.notch} />
          <span className={styles.statusRight}>No Service · 14%</span>
        </div>

        {App ? (
          <div className={styles.appHost}>
            <App key={activeApp} variant="phone" onHome={goHome} />
          </div>
        ) : (
          <div className={styles.home}>
            <div>
              <div className={styles.widget}>
                <div className={styles.widgetTime}>02:14</div>
                <div className={styles.widgetSub}>Tuesday · {clues.length}/4 clues recovered</div>
              </div>
              <div className={styles.grid}>{APP_ORDER.map((id) => tile(id, false))}</div>
            </div>
            <div className={styles.dock}>{DOCK.map((id) => tile(id, true))}</div>
          </div>
        )}

        <div className={styles.homeBarWrap}>
          <button type="button" className={styles.homeBar} aria-label="Home" onClick={goHome} />
        </div>
      </div>
    </div>
  );
}

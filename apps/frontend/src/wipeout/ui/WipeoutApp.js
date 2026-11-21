"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { WipeoutController } from "../controller";
import { isMuted, music, setMuted, sfx } from "../sfx";
import { loadDualScores } from "../tasks";
import { useTaskRun } from "../useTaskRun";
import { Toasts } from "./common";
import FatherView from "./FatherView";
import { JoiningScreen, LandingScreen, PairingScreen } from "./LobbyScreens";
import { EndingNotification, LockNotification } from "./LockAndEndScreens";
import RohanView from "./RohanView";
import c from "./ClipboardLobby.module.css";

function TaskRunSession({ initialRole, muted, onToggleMute, onExit, onScoresUpdated }) {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((text, kind = "info") => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.filter((x) => x.text !== text), { key: id, kind, text }].slice(-3));
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.key !== id));
    }, 3600);
  }, []);

  const {
    run,
    tasks,
    currentTask,
    dualScores,
    mapGameState,
    beginRun,
    restart,
    passTask,
    failTask,
  } = useTaskRun(initialRole, pushToast);

  useEffect(() => {
    onScoresUpdated?.(dualScores);
  }, [dualScores, onScoresUpdated]);

  // Adaptive suspense soundtrack per phase, milestone & final-5s panic
  const isCritical =
    run.phase === "playing" && (currentTask.num >= 8 || run.timeLeftMs <= 5000);
  const musicScene =
    run.phase === "ready"
      ? "briefing"
      : run.phase === "playing"
        ? isCritical
          ? "critical"
          : "playing"
        : run.endReason === "victory"
          ? "victory"
          : "defeat";

  useEffect(() => {
    music.setScene(musicScene);
  }, [musicScene]);

  const otherRole = run.role === "father" ? "rohan" : "father";

  return (
    <main style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
      <Toasts toasts={toasts} />

      {run.phase === "ready" && (
        <LockNotification
          role={run.role}
          dualScores={dualScores}
          onStart={beginRun}
          onSwitchRole={(nextRole) => restart(nextRole, false)}
          onLeave={onExit}
        />
      )}

      {run.phase === "ended" && (
        <EndingNotification
          run={run}
          dualScores={dualScores}
          onRestartSame={() => restart(run.role, false)}
          onRestartOther={() => restart(otherRole, false)}
          onLeave={onExit}
        />
      )}

      {run.role === "father" ? (
        <FatherView
          key={`father-${run.runId}`}
          run={run}
          tasks={tasks}
          currentTask={currentTask}
          dualScores={dualScores}
          mapGameState={mapGameState}
          onPassTask={passTask}
          onFailTask={failTask}
          muted={muted}
          onToggleMute={onToggleMute}
          onLeave={onExit}
        />
      ) : (
        <RohanView
          key={`rohan-${run.runId}`}
          run={run}
          tasks={tasks}
          currentTask={currentTask}
          dualScores={dualScores}
          mapGameState={mapGameState}
          onPassTask={passTask}
          onFailTask={failTask}
          muted={muted}
          onToggleMute={onToggleMute}
          onLeave={onExit}
        />
      )}
    </main>
  );
}

export default function WipeoutApp() {
  const [ctl] = useState(() => new WipeoutController());
  const snap = useSyncExternalStore(ctl.subscribe, ctl.getSnapshot, ctl.getSnapshot);
  const [muted, setMutedState] = useState(() => isMuted());
  const [soloRole, setSoloRole] = useState(null); // null | "father" | "rohan"
  const [dualScores, setDualScores] = useState({
    fatherBest: 0,
    rohanBest: 0,
    fatherLast: null,
    rohanLast: null,
  });

  // Hydrate /3 scores client-side without sync setState-in-effect
  useEffect(() => {
    const t = setTimeout(() => {
      setDualScores(loadDualScores());
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Auto-join when opened via QR code link `/?room=4829`
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    if (room && /^\d{4}$/.test(room)) {
      window.history.replaceState({}, "", window.location.pathname);
      ctl.join(room);
    }
    return () => ctl.leave();
  }, [ctl]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) {
      sfx.unlock();
      sfx.tap();
    }
  }

  function handleExit() {
    sfx.paperFlip();
    setSoloRole(null);
    ctl.leave();
    setDualScores(loadDualScores());
  }

  const pairedRole =
    snap.screen === "game" && snap.game && snap.side ? snap.game.roles[snap.side] : null;
  const activeRole = soloRole || pairedRole;

  // Play moody nocturnal suspense score on Lobby screens too
  useEffect(() => {
    if (!activeRole) {
      music.setScene("lobby");
    }
  }, [activeRole]);

  useEffect(() => {
    return () => music.setScene("off");
  }, []);

  if (activeRole) {
    return (
      <TaskRunSession
        key={`session-${activeRole}`}
        initialRole={activeRole}
        muted={muted}
        onToggleMute={toggleMute}
        onExit={handleExit}
        onScoresUpdated={setDualScores}
      />
    );
  }

  let lobbyView = null;
  if (snap.screen === "pairing") {
    lobbyView = (
      <PairingScreen
        ctl={ctl}
        snap={snap}
        muted={muted}
        onToggleMute={toggleMute}
        onStartSolo={setSoloRole}
      />
    );
  } else if (snap.screen === "joining") {
    lobbyView = (
      <JoiningScreen ctl={ctl} snap={snap} muted={muted} onToggleMute={toggleMute} />
    );
  } else {
    lobbyView = (
      <LandingScreen
        ctl={ctl}
        dualScores={dualScores}
        muted={muted}
        onToggleMute={toggleMute}
        onStartSolo={setSoloRole}
      />
    );
  }

  return <main className={c.deskStage}>{lobbyView}</main>;
}

"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useHostDevice } from "@/hooks/useHostDevice";
import { LAST_CHANCE_MS } from "../constants";
import { WipeoutController } from "../controller";
import { timeLeftMs } from "../engine";
import { isMuted, setMuted, sfx } from "../sfx";
import { PeerAway, Toasts, useNow, useToasts } from "./common";
import FatherView from "./FatherView";
import { JoiningScreen, LandingScreen, PairingScreen } from "./LobbyScreens";
import { EndingNotification, LockNotification } from "./LockAndEndScreens";
import RohanView from "./RohanView";
import c from "./ClipboardLobby.module.css";
import s from "./wipeout.module.css";

export default function WipeoutApp() {
  const [ctl] = useState(() => new WipeoutController());
  const snap = useSyncExternalStore(ctl.subscribe, ctl.getSnapshot, ctl.getSnapshot);
  const now = useNow(ctl, 100);
  const [muted, setMutedState] = useState(() => isMuted());
  const hostDevice = useHostDevice();
  const deviceMode = hostDevice.activeDeviceType;
  const toggleDeviceMode = () =>
    hostDevice.setOverrideType(deviceMode === "laptop" ? "phone" : "laptop");

  const g = snap.game;
  const role = g && snap.side ? g.roles[snap.side] : null;
  const { toasts, local } = useToasts(g, role, now);

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

  // Countdown ticks, GO chime, final-10s heartbeat ticks, siren, and victory/defeat fanfare
  const prevStatus = useRef(null);
  const lastSec = useRef(null);
  const lastRaid = useRef(null);

  const status = g?.status || null;
  const winner = g?.winner || null;
  const raidAt = g?.raidInFlight?.arrivesAt || null;
  const cdSec = status === "countdown" ? Math.ceil((g.countdownEndsAt - now) / 1000) : null;
  const tlSec = status === "playing" ? Math.ceil(timeLeftMs(g, now) / 1000) : null;
  const inLast10 = status === "playing" && timeLeftMs(g, now) <= LAST_CHANCE_MS;

  useEffect(() => {
    if (prevStatus.current === "countdown" && status === "playing") sfx.go();
    if (prevStatus.current !== "over" && status === "over" && role) {
      const won = (role === "father" && winner === "father") || (role === "rohan" && winner !== "father");
      if (won) sfx.win();
      else sfx.lose();
    }
    prevStatus.current = status;
  }, [status, winner, role]);

  useEffect(() => {
    if (cdSec !== null && cdSec > 0 && lastSec.current !== `cd${cdSec}`) {
      lastSec.current = `cd${cdSec}`;
      sfx.tick();
    } else if (inLast10 && tlSec !== null && tlSec > 0 && lastSec.current !== `tl${tlSec}`) {
      lastSec.current = `tl${tlSec}`;
      sfx.tick();
    }
  }, [cdSec, tlSec, inLast10]);

  useEffect(() => {
    if (raidAt && lastRaid.current !== raidAt) {
      lastRaid.current = raidAt;
      sfx.siren();
    }
  }, [raidAt]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  }

  const isLobby =
    snap.screen === "landing" || snap.screen === "pairing" || snap.screen === "joining";

  let view = null;
  if (snap.screen === "landing") view = <LandingScreen ctl={ctl} />;
  else if (snap.screen === "pairing") view = <PairingScreen ctl={ctl} snap={snap} />;
  else if (snap.screen === "joining") view = <JoiningScreen ctl={ctl} snap={snap} />;
  else if (g && role) {
    // Keep the Kolkata board / Laptop / Phone UI mounted across lock, countdown, playing, and over
    if (role === "father") {
      view = (
        <FatherView
          g={g}
          now={now}
          dispatch={ctl.dispatch}
          localToast={local}
          muted={muted}
          onToggleMute={toggleMute}
          onLeave={ctl.leave}
          deviceMode={deviceMode}
          onToggleDeviceMode={toggleDeviceMode}
        />
      );
    } else {
      view = (
        <RohanView
          g={g}
          now={now}
          dispatch={ctl.dispatch}
          localToast={local}
          muted={muted}
          onToggleMute={toggleMute}
          onLeave={ctl.leave}
          deviceMode={deviceMode}
          onToggleDeviceMode={toggleDeviceMode}
        />
      );
    }
  }

  if (isLobby) {
    return (
      <main className={c.deskStage}>
        <Toasts toasts={toasts} />
        {view}
      </main>
    );
  }

  const isDesktopMatch = deviceMode === "laptop" && g && role;
  const phaseNotification =
    g && role ? (
      g.status === "lock" || g.status === "countdown" ? (
        <LockNotification
          g={g}
          role={role}
          now={now}
          dispatch={ctl.dispatch}
          onLeave={ctl.leave}
          inPhone={!isDesktopMatch}
        />
      ) : g.status === "over" ? (
        <EndingNotification
          g={g}
          role={role}
          now={now}
          dispatch={ctl.dispatch}
          onLeave={ctl.leave}
          inPhone={!isDesktopMatch}
        />
      ) : null
    ) : null;

  if (isDesktopMatch) {
    return (
      <main style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
        <PeerAway link={snap.link} mode={snap.mode} />
        <Toasts toasts={toasts} />
        {phaseNotification}
        {view}
      </main>
    );
  }

  return (
    <main className={s.stage}>
      <div className={s.phoneFrame}>
        <PeerAway link={snap.link} mode={snap.mode} />
        <Toasts toasts={toasts} />
        {phaseNotification}
        {view}
      </div>
    </main>
  );
}

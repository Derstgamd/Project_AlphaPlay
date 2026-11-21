// Pure, host-authoritative game engine. No React, no network.
// All timestamps are HOST epoch milliseconds.

import {
  ABORT_PENALTY_MS,
  ABORT_WINDOW_MS,
  ADJ,
  CD,
  COUNTDOWN_MS,
  CYBER_LOCK_MS,
  FAKE_CALL_MS,
  FINAL_MS,
  HANDSHAKE_MS,
  LAST_CHANCE_MS,
  LEADS,
  NOTE_CORRUPT_MS,
  OVERWRITE_MS,
  RAID_TRAVEL_MS,
  ROUND_MS,
  SPOOF_MS,
  TAUNTS,
  TRACE_MS,
  VAN_REGROUP_MS,
  WIPE20_MS,
  WIPE50_MS,
  ZONES,
  ZONE_IDS,
} from "./constants";

const rnd = (n) => Math.floor(Math.random() * n);
export const pick = (arr) => arr[rnd(arr.length)];
export function shuffle(arr) {
  const b = [...arr];
  for (let i = b.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
export const otherRole = (r) => (r === "father" ? "rohan" : "father");

// ───────────────────────── derived helpers (used by UI + bots) ─────────────────────────

export function timeLeftMs(g, now) {
  if (!g) return ROUND_MS;
  if (g.status === "over") return g.endTimeLeftMs;
  if (g.status !== "playing") return ROUND_MS;
  return Math.max(0, ROUND_MS - (now - g.startAt) - g.penaltyMs);
}
export const elapsedMs = (g, now) => ROUND_MS - timeLeftMs(g, now);
export const wipePct = (g, now) =>
  Math.min(100, Math.floor((elapsedMs(g, now) / ROUND_MS) * 100));
export const inHandshake = (g, now) => g.status === "playing" && now - g.startAt < HANDSHAKE_MS;
export const handshakeLeftMs = (g, now) => Math.max(0, HANDSHAKE_MS - (now - g.startAt));
export const inFinal = (g, now) => g.status === "playing" && timeLeftMs(g, now) <= FINAL_MS;
export const isCyberLocked = (g, now) => now < g.cyberLockUntil;
export const traceActive = (g, now) => now < g.traceUntil;
export const cdLeft = (g, key, now) => Math.max(0, (g.cooldowns[key] || 0) - now);
export const leadsSent = (g) => Object.values(g.leads).filter((l) => l.status === "saved").length;
export const leadOpen = (l) => l.status === "active" || l.status === "overwriting";

export function raidBlock(g, now) {
  if (g.status !== "playing") return "Not live";
  if (leadsSent(g) < 1) return "Send 1 lead first";
  if (g.raidsRemaining <= 0) return "No vans left";
  if (g.raidInFlight) return "Van en route";
  if (now < g.secondVanReadyAt) return `Regrouping ${Math.ceil((g.secondVanReadyAt - now) / 1000)}s`;
  return null;
}

/** In-fiction clock: 8:15 PM + elapsed round time. */
export function fictionClock(g, now, withSeconds = false) {
  const live = g && (g.status === "playing" || g.status === "over");
  const t = (20 * 3600 + 15 * 60) * 1000 + (live ? elapsedMs(g, now) : 0);
  const total = Math.floor(t / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor(total / 60) % 60;
  const s = total % 60;
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")}${withSeconds ? ":" + String(s).padStart(2, "0") : ""} PM`;
}

// ───────────────────────── state construction ─────────────────────────

function freshRound() {
  return {
    ready: { father: false, rohan: false },
    countdownEndsAt: 0,
    startAt: 0,
    penaltyMs: 0,
    vaultPin: "",
    plateNum: "",
    startZone: null,
    suvZone: null,
    leads: {
      lead1: { status: "active", overwriteEndsAt: 0 },
      lead2: { status: "active", overwriteEndsAt: 0 },
      lead3: { status: "active", overwriteEndsAt: 0 },
    },
    vaultUnlocked: false,
    vaultRelockUsed: false,
    notesCorruptUntil: 0,
    pingmePurged: false,
    notesPurged: false,
    clearedZones: [],
    blips: [],
    fakePing: null,
    traceUntil: 0,
    raidsRemaining: 2,
    raidInFlight: null,
    secondVanReadyAt: 0,
    raids: [],
    cooldowns: { ping: 0, reroute: 0, spoofer: 0, sabotage: 0, taunt: 0, cyberLock: 0 },
    cyberLockUntil: 0,
    popup: null,
    pings: [],
    flags: { handshake: false, w20: false, w50: false, w80: false, w10: false },
    winner: null,
    endTimeLeftMs: 0,
    interceptZone: null,
    stats: { raidsDodged: 0, chatsWiped: 0, pings: 0, penalties: 0, reroutes: 0 },
  };
}

export function createRoom(hostRole) {
  return {
    v: 1,
    round: 0,
    status: "lobby", // lobby | lock | countdown | playing | over
    roles: { host: hostRole, guest: otherRole(hostRole) },
    events: [],
    nextEventId: 1,
    ...freshRound(),
  };
}

/** Returns a NEW state with a fresh randomized round (optionally swapping roles). */
export function startRound(state, now, swap = false) {
  const g = structuredClone(state);
  if (swap) g.roles = { host: g.roles.guest, guest: g.roles.host };
  Object.assign(g, freshRound());
  g.round += 1;
  g.status = "lock";
  g.vaultPin = String(1000 + rnd(9000));
  g.plateNum = String(1000 + rnd(9000));
  g.startZone = pick(ADJ.saltlake); // SUV left CK Block ~2 min ago → one hop out
  g.suvZone = g.startZone;
  g.v += 1;
  pushEvent(g, "both", "info", `Round ${g.round} ready — tap your lockscreen`, now);
  return g;
}

function pushEvent(g, to, kind, text, now) {
  g.events.push({ id: g.nextEventId++, to, kind, text, at: now });
  if (g.events.length > 30) g.events.splice(0, g.events.length - 30);
}

function endGame(g, now, winner, extra = {}) {
  g.endTimeLeftMs = timeLeftMs(g, now);
  g.status = "over";
  g.winner = winner;
  g.popup = null;
  g.raidInFlight = null;
  Object.assign(g, extra);
}

// ───────────────────────── guards ─────────────────────────

function guardFather(g, a) {
  if (g.status !== "playing") return "not_playing";
  if (a.role !== "father") return "wrong_role";
  return null;
}
function guardRohanRoute(g, a, now) {
  if (g.status !== "playing") return "not_playing";
  if (a.role !== "rohan") return "wrong_role";
  if (isCyberLocked(g, now)) return "cyber_locked";
  return null;
}
function guardRohanCloud(g, a, now) {
  const r = guardRohanRoute(g, a, now);
  if (r) return r;
  if (inHandshake(g, now)) return "handshake";
  return null;
}

// ───────────────────────── action handlers ─────────────────────────
// Each mutates the (cloned) state and returns true, or returns a reason string.

const H = {
  ready(g, a, now) {
    if (g.status !== "lock") return "not_lock";
    if (a.role !== "father" && a.role !== "rohan") return "wrong_role";
    g.ready[a.role] = true;
    if (g.ready.father && g.ready.rohan) {
      g.status = "countdown";
      g.countdownEndsAt = now + COUNTDOWN_MS;
    }
    return true;
  },

  rematch(g, a, now) {
    if (g.status !== "over") return "not_over";
    Object.assign(g, startRound(g, now, true));
    return true;
  },

  // ── Father ──
  enterPin(g, a, now) {
    const e = guardFather(g, a);
    if (e) return e;
    if (g.vaultUnlocked || g.leads.lead3.status === "saved") return "already";
    if (String(a.pin) === g.vaultPin) {
      g.vaultUnlocked = true;
      pushEvent(g, "father", "good", "🔓 BangoVault unlocked", now);
      pushEvent(g, "rohan", "alert", "⚠️ Inspector cracked BangoVault — re-lock it!", now);
    } else {
      pushEvent(g, "father", "bad", "❌ Wrong Dept PIN", now);
    }
    return true;
  },

  sendLead(g, a, now) {
    const e = guardFather(g, a);
    if (e) return e;
    const L = g.leads[a.lead];
    if (!L) return "bad_lead";
    if (!leadOpen(L)) return "unavailable";
    if (a.lead === "lead3") {
      if (!g.vaultUnlocked) return "vault_locked";
    } else if (g.pingmePurged) return "purged";
    const raced = L.status === "overwriting";
    if (raced && now > L.overwriteEndsAt) return "too_late";

    const before = leadsSent(g);
    L.status = "saved";
    L.overwriteEndsAt = 0;

    if (a.lead === "lead3") {
      g.traceUntil = now + TRACE_MS;
      pushEvent(g, "father", "good", "🎯 FULL TRACE LOCKED — SUV visible on CholoMap for 4s!", now);
      pushEvent(g, "rohan", "alert", "🚨 LALBAZAR FULL TRACE ON YOU — 4 SECONDS! MOVE!", now);
    } else {
      const cand = ZONE_IDS.filter((z) => z !== g.suvZone && !g.clearedZones.includes(z));
      const picked = shuffle(cand).slice(0, 2);
      g.clearedZones.push(...picked);
      const names = picked.map((z) => ZONES[z].name).join(" & ");
      pushEvent(g, "father", "good", `📡 ${LEADS[a.lead].via}: ${names || "no new zones"} cleared`, now);
      pushEvent(g, "rohan", "alert", `Inspector sent “${LEADS[a.lead].title}” to Lalbazar`, now);
    }
    if (raced) {
      pushEvent(g, "father", "good", "💾 Saved before the overwrite finished!", now);
      pushEvent(g, "rohan", "bad", "Too slow — Inspector saved it mid-overwrite", now);
    }
    if (before === 0) pushEvent(g, "father", "info", "🚓 PCR raids unlocked — open CholoMap", now);
    return true;
  },

  ping(g, a, now) {
    const e = guardFather(g, a);
    if (e) return e;
    if (!ZONES[a.zone]) return "bad_zone";
    if (now < g.cooldowns.ping) return "cooldown";
    const ghost = g.fakePing && now < g.fakePing.expiresAt && g.fakePing.zone === a.zone;
    let result = "none";
    if (ghost || a.zone === g.suvZone) result = "strong";
    else if (ADJ[g.suvZone].includes(a.zone)) result = "weak";
    g.pings.unshift({ zone: a.zone, result, at: now });
    g.pings = g.pings.slice(0, 8);
    g.cooldowns.ping = now + (inFinal(g, now) ? CD.pingFinal : CD.ping);
    g.stats.pings += 1;
    return true;
  },

  raid(g, a, now) {
    const e = guardFather(g, a);
    if (e) return e;
    if (!ZONES[a.zone]) return "bad_zone";
    const block = raidBlock(g, now);
    if (block) return block;
    g.raidInFlight = { zone: a.zone, arrivesAt: now + RAID_TRAVEL_MS };
    pushEvent(g, "father", "info", `🚓 PCR van en route to ${ZONES[a.zone].name}…`, now);
    pushEvent(g, "rohan", "alert", "🚨 SIRENS CONVERGING — STAY OR MOVE?", now);
    return true;
  },

  cyberLock(g, a, now) {
    const e = guardFather(g, a);
    if (e) return e;
    if (now < g.cooldowns.cyberLock) return "cooldown";
    g.cyberLockUntil = now + CYBER_LOCK_MS;
    g.cooldowns.cyberLock = now + CD.cyberLock;
    pushEvent(g, "father", "good", "🛡️ Cyber Lock engaged — Rohan frozen for 5s", now);
    return true;
  },

  restoreNote(g, a) {
    const e = guardFather(g, a);
    if (e) return e;
    if (!g.notesCorruptUntil) return "clean";
    g.notesCorruptUntil = 0;
    return true;
  },

  declineCall(g, a) {
    const e = guardFather(g, a);
    if (e) return e;
    if (g.popup?.kind !== "fake_call") return "no_call";
    g.popup = null;
    return true;
  },

  abortCleared(g, a, now) {
    const e = guardFather(g, a);
    if (e) return e;
    if (g.popup?.kind !== "abort_wipe") return "no_popup";
    if (now > g.popup.endsAt + 400) return "too_late";
    g.popup = null;
    pushEvent(g, "rohan", "bad", "Inspector aborted the reset acceleration", now);
    return true;
  },

  // ── Rohan ──
  overwrite(g, a, now) {
    const e = guardRohanCloud(g, a, now);
    if (e) return e;
    if (a.lead !== "lead1" && a.lead !== "lead2") return "bad_lead";
    if (g.pingmePurged) return "purged";
    const L = g.leads[a.lead];
    if (L.status !== "active") return "unavailable";
    if (g.leads.lead1.status === "overwriting" || g.leads.lead2.status === "overwriting") return "busy";
    L.status = "overwriting";
    L.overwriteEndsAt = now + OVERWRITE_MS;
    return true;
  },

  corruptNote(g, a, now) {
    const e = guardRohanCloud(g, a, now);
    if (e) return e;
    if (g.notesPurged) return "purged";
    if (now < g.cooldowns.sabotage) return "cooldown";
    g.notesCorruptUntil = now + NOTE_CORRUPT_MS;
    g.cooldowns.sabotage = now + CD.sabotage;
    pushEvent(g, "father", "bad", "⚠️ QuickNotes sync corrupted!", now);
    return true;
  },

  fakeCall(g, a, now) {
    const e = guardRohanCloud(g, a, now);
    if (e) return e;
    if (now < g.cooldowns.sabotage) return "cooldown";
    if (g.popup) return "busy";
    g.popup = { kind: "fake_call", endsAt: now + FAKE_CALL_MS };
    g.cooldowns.sabotage = now + CD.sabotage;
    return true;
  },

  abortWipe(g, a, now) {
    const e = guardRohanCloud(g, a, now);
    if (e) return e;
    if (now < g.cooldowns.sabotage) return "cooldown";
    if (g.popup) return "busy";
    g.popup = { kind: "abort_wipe", endsAt: now + ABORT_WINDOW_MS };
    g.cooldowns.sabotage = now + CD.sabotage;
    return true;
  },

  relockVault(g, a, now) {
    const e = guardRohanCloud(g, a, now);
    if (e) return e;
    if (g.vaultRelockUsed) return "used";
    if (!g.vaultUnlocked || g.leads.lead3.status === "saved") return "nothing_to_lock";
    g.vaultUnlocked = false;
    g.vaultRelockUsed = true;
    pushEvent(g, "father", "bad", "🔒 BangoVault RE-LOCKED remotely!", now);
    return true;
  },

  taunt(g, a, now) {
    if (g.status !== "playing") return "not_playing";
    if (a.role !== "rohan") return "wrong_role";
    if (now < g.cooldowns.taunt) return "cooldown";
    const text = TAUNTS[a.idx] ?? TAUNTS[0];
    g.cooldowns.taunt = now + CD.taunt;
    pushEvent(g, "father", "taunt", `Rohan: “${text}”`, now);
    return true;
  },

  reroute(g, a, now) {
    const e = guardRohanRoute(g, a, now);
    if (e) return e;
    if (now < g.cooldowns.reroute) return "cooldown";
    if (!ADJ[g.suvZone].includes(a.zone)) return "not_connected";
    g.suvZone = a.zone;
    g.cooldowns.reroute = now + (inFinal(g, now) ? CD.rerouteFinal : CD.reroute);
    g.stats.reroutes += 1;
    const idx = g.clearedZones.indexOf(a.zone);
    if (idx >= 0) {
      g.clearedZones.splice(idx, 1);
      g.blips.push({ zone: a.zone, at: now });
      g.blips = g.blips.slice(-4);
      pushEvent(g, "father", "alert", `📍 Motion blip in ${ZONES[a.zone].name} — CCTV stamp lifted!`, now);
      pushEvent(g, "rohan", "bad", "You entered a cleared zone — CCTV caught your motion!", now);
    }
    return true;
  },

  spoof(g, a, now) {
    const e = guardRohanRoute(g, a, now);
    if (e) return e;
    if (!ZONES[a.zone] || a.zone === g.suvZone) return "bad_zone";
    if (now < g.cooldowns.spoofer) return "cooldown";
    g.fakePing = { zone: a.zone, expiresAt: now + SPOOF_MS };
    g.cooldowns.spoofer = now + CD.spoofer;
    return true;
  },
};

export function applyAction(state, action, now) {
  const handler = H[action?.type];
  if (!handler) return { state, ok: false, reason: "unknown" };
  const g = structuredClone(state);
  const r = handler(g, action, now);
  if (r !== true) return { state, ok: false, reason: r };
  g.v = state.v + 1;
  return { state: g, ok: true };
}

// ───────────────────────── time-driven updates ─────────────────────────

export function tick(state, now) {
  if (state.status !== "countdown" && state.status !== "playing") return state;
  const g = structuredClone(state);
  let dirty = false;

  if (g.status === "countdown") {
    if (now < g.countdownEndsAt) return state;
    g.status = "playing";
    g.startAt = now;
    dirty = true;
  }

  const tl = timeLeftMs(g, now);

  if (!g.flags.handshake && now - g.startAt >= HANDSHAKE_MS) {
    g.flags.handshake = true;
    pushEvent(g, "rohan", "good", "☁️ Cloud handshake complete — overwrite & sabotage ONLINE", now);
    pushEvent(g, "father", "alert", "⚠️ Rohan's device just connected to Riya's cloud", now);
    dirty = true;
  }
  if (!g.flags.w20 && tl <= WIPE20_MS) {
    g.flags.w20 = true;
    pushEvent(g, "both", "milestone", "WIPE 20% — Gallery & Call Logs erased. PingMe purges at 50%!", now);
    dirty = true;
  }
  if (!g.flags.w50 && tl <= WIPE50_MS) {
    g.flags.w50 = true;
    g.pingmePurged = true;
    for (const k of ["lead1", "lead2"]) {
      if (g.leads[k].status !== "saved" && g.leads[k].status !== "deleted") {
        g.leads[k].status = "purged";
        g.leads[k].overwriteEndsAt = 0;
      }
    }
    pushEvent(g, "both", "milestone", "WIPE 50% — PingMe PURGED. Unsent chat leads are gone.", now);
    dirty = true;
  }
  if (!g.flags.w80 && tl <= FINAL_MS) {
    g.flags.w80 = true;
    g.notesPurged = true;
    g.notesCorruptUntil = 0;
    pushEvent(g, "both", "milestone", "⚠️ WIPE 80% — QuickNotes purged. FINAL STRETCH: cooldowns faster!", now);
    dirty = true;
  }
  if (!g.flags.w10 && tl <= LAST_CHANCE_MS) {
    g.flags.w10 = true;
    pushEvent(g, "both", "milestone", "⏱️ LAST 10 SECONDS!", now);
    dirty = true;
  }

  for (const k of ["lead1", "lead2"]) {
    const L = g.leads[k];
    if (L.status === "overwriting" && now >= L.overwriteEndsAt) {
      L.status = "deleted";
      L.overwriteEndsAt = 0;
      g.stats.chatsWiped += 1;
      pushEvent(g, "father", "bad", "🚫 ROHAN JUST WIPED A CHAT!", now);
      pushEvent(g, "rohan", "good", `Overwrite complete — “${LEADS[k].title}” is gone`, now);
      dirty = true;
    }
  }

  if (g.popup && now >= g.popup.endsAt) {
    if (g.popup.kind === "abort_wipe") {
      g.penaltyMs += ABORT_PENALTY_MS;
      g.stats.penalties += 1;
      pushEvent(g, "father", "bad", "⏩ −5s! Factory reset accelerated", now);
      pushEvent(g, "rohan", "good", "Reset accelerated — Inspector lost 5 seconds", now);
    }
    g.popup = null;
    dirty = true;
  }

  if (g.fakePing && now >= g.fakePing.expiresAt) {
    g.fakePing = null;
    dirty = true;
  }

  if (g.raidInFlight && now >= g.raidInFlight.arrivesAt) {
    const z = g.raidInFlight.zone;
    g.raidInFlight = null;
    dirty = true;
    if (z === g.suvZone) {
      endGame(g, now, "father", { interceptZone: z });
    } else {
      g.raidsRemaining -= 1;
      g.stats.raidsDodged += 1;
      g.raids.push({ zone: z, at: now });
      if (g.raidsRemaining <= 0) {
        endGame(g, now, "rohan_raids");
      } else {
        g.secondVanReadyAt = now + VAN_REGROUP_MS;
        pushEvent(g, "father", "bad", `❌ EMPTY ROAD at ${ZONES[z].name} — 1 PCR van left (regrouping 10s)`, now);
        pushEvent(g, "rohan", "good", "😏 Police raided empty air! Tell the driver to keep moving!", now);
      }
    }
  }

  if (g.status === "playing" && timeLeftMs(g, now) <= 0) {
    endGame(g, now, "rohan_wipe");
    dirty = true;
  }

  if (!dirty) return state;
  g.v = state.v + 1;
  return g;
}

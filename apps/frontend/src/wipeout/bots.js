// Solo-mode opponents. Each bot gets (state, now, memory) every host tick and
// returns at most one action. Bots only use information their role could see,
// except Father-Bot reading the PIN once it has "opened" QuickNotes.

import { ADJ, TAUNTS, ZONE_IDS } from "./constants";
import { inHandshake, isCyberLocked, raidBlock, timeLeftMs, traceActive } from "./engine";

const between = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function prep(g, m) {
  if (m.round !== g.round) {
    for (const k of Object.keys(m)) delete m[k];
    m.round = g.round;
  }
}

// ───────────────────────── Rohan-Bot ─────────────────────────

function rerouteChoice(g, now) {
  const recentNone = new Set(
    g.pings.filter((p) => p.result === "none" && now - p.at < 15000).map((p) => p.zone)
  );
  const scored = ADJ[g.suvZone].map((z) => ({
    z,
    s: Math.random() * 3 + (g.clearedZones.includes(z) ? -8 : 0) + (recentNone.has(z) ? 3 : 0),
  }));
  scored.sort((a, b) => b.s - a.s);
  return { type: "reroute", zone: scored[0].z };
}

function spoofChoice(g) {
  const cand = ZONE_IDS.filter((z) => z !== g.suvZone && !g.clearedZones.includes(z));
  if (!cand.length) return null;
  const far = cand.filter((z) => !ADJ[g.suvZone].includes(z));
  return pick(far.length ? far : cand);
}

export function rohanBot(g, now, m) {
  prep(g, m);
  if (g.status === "lock") {
    if (!g.ready.rohan) {
      m.readyAt ??= now + between(500, 1200);
      if (now >= m.readyAt) return { type: "ready" };
    }
    return null;
  }
  if (g.status !== "playing") return null;

  const locked = isCyberLocked(g, now);
  const hs = inHandshake(g, now);
  const canMove = !locked && now >= g.cooldowns.reroute;

  // React to sirens (zone unknown) — 50% dodge, per spec.
  if (g.raidInFlight && m.raidSeen !== g.raidInFlight.arrivesAt) {
    m.raidSeen = g.raidInFlight.arrivesAt;
    if (Math.random() < 0.5) m.dodgeAt = now + between(500, 1800);
  }
  if (traceActive(g, now) && m.traceSeen !== g.traceUntil) {
    m.traceSeen = g.traceUntil;
    if (Math.random() < 0.7) m.dodgeAt = now + between(700, 2000);
  }
  if (m.dodgeAt && now >= m.dodgeAt) {
    m.dodgeAt = 0;
    if (canMove) return rerouteChoice(g, now);
  }

  if (!hs && !locked) {
    if (g.vaultUnlocked && !g.vaultRelockUsed && g.leads.lead3.status === "active") {
      m.relockAt ??= now + between(1500, 4000);
      if (now >= m.relockAt) {
        m.relockAt = undefined;
        return { type: "relockVault" };
      }
    }
    const busy = g.leads.lead1.status === "overwriting" || g.leads.lead2.status === "overwriting";
    const targets = ["lead1", "lead2"].filter((k) => g.leads[k].status === "active");
    if (!g.pingmePurged && !busy && targets.length) {
      m.owAt ??= now + between(3000, 9000);
      if (now >= m.owAt) {
        m.owAt = now + between(17000, 23000);
        return { type: "overwrite", lead: pick(targets) };
      }
    }
    if (now >= g.cooldowns.sabotage && !g.popup) {
      m.sabAt ??= now + between(2000, 9000);
      if (now >= m.sabAt) {
        m.sabAt = undefined;
        const opts = ["fakeCall", "abortWipe"];
        if (!g.notesPurged && !g.vaultUnlocked && g.leads.lead3.status === "active") {
          opts.push("corruptNote", "corruptNote");
        }
        return { type: pick(opts) };
      }
    }
  }

  if (canMove) {
    m.moveAt ??= now + between(1500, 4500);
    if (now >= m.moveAt) {
      m.moveAt = undefined;
      return rerouteChoice(g, now);
    }
  }
  if (!locked && now >= g.cooldowns.spoofer) {
    m.spoofAt ??= now + between(3000, 9000);
    if (now >= m.spoofAt) {
      m.spoofAt = undefined;
      const z = spoofChoice(g);
      if (z) return { type: "spoof", zone: z };
    }
  }
  if (now >= g.cooldowns.taunt) {
    m.tauntAt ??= now + between(7000, 16000);
    if (now >= m.tauntAt) {
      m.tauntAt = undefined;
      return { type: "taunt", idx: Math.floor(Math.random() * TAUNTS.length) };
    }
  }
  return null;
}

// ───────────────────────── Father-Bot ─────────────────────────

function pingChoice(g, now) {
  const open = ZONE_IDS.filter((z) => !g.clearedZones.includes(z));
  const recent = new Set(g.pings.filter((p) => now - p.at < 9000).map((p) => p.zone));
  const weak = g.pings.find((p) => p.result === "weak" && now - p.at < 10000);
  if (weak) {
    const near = ADJ[weak.zone].filter((z) => open.includes(z) && !recent.has(z));
    if (near.length) return pick(near);
  }
  const fresh = open.filter((z) => !recent.has(z));
  return pick(fresh.length ? fresh : open.length ? open : ZONE_IDS);
}

export function fatherBot(g, now, m) {
  prep(g, m);
  if (g.status === "lock") {
    if (!g.ready.father) {
      m.readyAt ??= now + between(700, 1400);
      if (now >= m.readyAt) return { type: "ready" };
    }
    return null;
  }
  if (g.status !== "playing") return null;
  const since = now - g.startAt;

  // Popups block everything (like a real thumb on glass).
  if (g.popup) {
    if (m.popSeen !== g.popup.endsAt) {
      m.popSeen = g.popup.endsAt;
      m.popAt = now + between(800, 2200);
      m.popOk = g.popup.kind === "fake_call" || Math.random() < 0.7;
    }
    if (now >= m.popAt && m.popOk) {
      m.popOk = false;
      return { type: g.popup.kind === "fake_call" ? "declineCall" : "abortCleared" };
    }
    return null;
  }

  // Overwrite races.
  for (const k of ["lead1", "lead2"]) {
    const L = g.leads[k];
    if (L.status !== "overwriting") continue;
    if (m[`race_${k}`] !== L.overwriteEndsAt) {
      m[`race_${k}`] = L.overwriteEndsAt;
      m[`raceAt_${k}`] = now + between(1200, 4800);
    }
    if (now >= m[`raceAt_${k}`]) {
      m[`raceAt_${k}`] = Infinity;
      if (now < L.overwriteEndsAt) return { type: "sendLead", lead: k };
    }
  }

  // Planned chat leads (human-paced reading + 2s hold).
  if (!g.pingmePurged) {
    m.l1At ??= now + between(6000, 10500);
    if (g.leads.lead1.status === "active" && now >= m.l1At) return { type: "sendLead", lead: "lead1" };
    if (g.leads.lead1.status !== "active") {
      m.l2At ??= now + between(8000, 14000);
      if (g.leads.lead2.status === "active" && now >= m.l2At) return { type: "sendLead", lead: "lead2" };
    }
  }

  // Vault path.
  const chatsDone =
    g.pingmePurged ||
    (!["active", "overwriting"].includes(g.leads.lead1.status) &&
      !["active", "overwriting"].includes(g.leads.lead2.status));
  if (!m.knowPin && !g.notesPurged && (chatsDone || since > 60000)) {
    if (now < g.notesCorruptUntil) {
      m.restoreAt ??= now + between(1600, 3400);
      if (now >= m.restoreAt) {
        m.restoreAt = undefined;
        return { type: "restoreNote" };
      }
    } else {
      m.readAt ??= now + between(5000, 9000);
      if (now >= m.readAt) m.knowPin = true;
    }
  }
  if (m.knowPin && g.leads.lead3.status === "active") {
    if (!g.vaultUnlocked) {
      m.upAt = undefined;
      m.pinAt ??= now + between(5000, 9000);
      if (now >= m.pinAt) {
        m.pinAt = undefined;
        return { type: "enterPin", pin: g.vaultPin };
      }
    } else {
      m.upAt ??= now + between(5500, 9000);
      if (now >= m.upAt) {
        m.upAt = undefined;
        return { type: "sendLead", lead: "lead3" };
      }
    }
  }

  // Map play (human reaction times so Rohan vs. Bot feels tense and fair).
  const rb = raidBlock(g, now);
  if (traceActive(g, now) && m.traceSeen !== g.traceUntil) {
    m.traceSeen = g.traceUntil;
    if (!rb) m.comboAt = now + between(1500, 2700);
  }
  const last = g.pings[0];
  if (last && last.result === "strong" && now - last.at < 4500 && m.strongSeen !== last.at) {
    m.strongSeen = last.at;
    if (!rb && Math.random() < 0.5) {
      m.comboZone = last.zone;
      m.comboAt = now + between(1300, 2500);
    }
  }
  if (m.comboAt && now >= m.comboAt) {
    m.comboAt = 0;
    if (traceActive(g, now)) m.comboZone = g.suvZone;
    if (!raidBlock(g, now) && m.comboZone) {
      if (now >= g.cooldowns.cyberLock && Math.random() < 0.35) {
        m.raidNextAt = now + 700;
        return { type: "cyberLock" };
      }
      return { type: "raid", zone: m.comboZone };
    }
  }
  if (m.raidNextAt && now >= m.raidNextAt) {
    m.raidNextAt = 0;
    if (!raidBlock(g, now)) return { type: "raid", zone: m.comboZone };
  }
  if (!rb && timeLeftMs(g, now) < 20000 && !m.desperate) {
    m.desperate = true;
    const open = ZONE_IDS.filter((z) => !g.clearedZones.includes(z));
    return { type: "raid", zone: pick(open.length ? open : ZONE_IDS) };
  }
  if (now >= g.cooldowns.ping) {
    m.pingAt ??= now + between(2500, 5500);
    if (now >= m.pingAt) {
      m.pingAt = undefined;
      return { type: "ping", zone: pingChoice(g, now) };
    }
  }
  return null;
}

// WIPEOUT — 10-Task Sequential Thriller Specification (15s per task, Dual POVs, /3 Score)

import { ADJ, CONTRACTOR_ID, ROHAN_NUMBER, ZONES, ZONE_IDS } from "./constants";

export const TASK_LIMIT_MS = 15_000;
export const TOTAL_TASKS = 10;

const SCORES_KEY = "wipeout_dual_scores_v1";

export function loadDualScores() {
  if (typeof window === "undefined") {
    return { fatherBest: 0, rohanBest: 0, fatherLast: null, rohanLast: null };
  }
  try {
    const raw = window.localStorage.getItem(SCORES_KEY);
    if (!raw) return { fatherBest: 0, rohanBest: 0, fatherLast: null, rohanLast: null };
    const p = JSON.parse(raw);
    return {
      fatherBest: Math.min(3, Math.max(0, Number(p.fatherBest) || 0)),
      rohanBest: Math.min(3, Math.max(0, Number(p.rohanBest) || 0)),
      fatherLast: typeof p.fatherLast === "number" ? p.fatherLast : null,
      rohanLast: typeof p.rohanLast === "number" ? p.rohanLast : null,
    };
  } catch {
    return { fatherBest: 0, rohanBest: 0, fatherLast: null, rohanLast: null };
  }
}

export function saveDualScore(role, score) {
  const cur = loadDualScores();
  const clamped = Math.min(3, Math.max(0, score));
  if (role === "father") {
    cur.fatherLast = clamped;
    cur.fatherBest = Math.max(cur.fatherBest, clamped);
  } else {
    cur.rohanLast = clamped;
    cur.rohanBest = Math.max(cur.rohanBest, clamped);
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SCORES_KEY, JSON.stringify(cur));
    } catch {
      /* ignore */
    }
  }
  return cur;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rndDigits = () => String(1000 + Math.floor(Math.random() * 9000));

/** Generates randomized per-run clues so every restart feels fresh. */
export function createRunSeed() {
  const suvZone = pick(ZONE_IDS.filter((z) => z !== "saltlake"));
  const neighbors = ADJ[suvZone] || ["saltlake"];
  const escapeZone = pick(neighbors);
  const blockedNeighbor = neighbors.find((z) => z !== escapeZone) || neighbors[0];
  const thirdNeighbor =
    neighbors.find((z) => z !== escapeZone && z !== blockedNeighbor) || neighbors[0];
  const decoyZone = pick(ZONE_IDS.filter((z) => z !== suvZone && z !== escapeZone));

  const vaultPin = rndDigits();
  let wrongPin = rndDigits();
  while (wrongPin === vaultPin) wrongPin = rndDigits();
  let wrongPin2 = rndDigits();
  while (wrongPin2 === vaultPin || wrongPin2 === wrongPin) wrongPin2 = rndDigits();

  const pinChoices = [vaultPin, wrongPin, wrongPin2].sort(() => Math.random() - 0.5);

  return {
    vaultPin,
    plateNum: rndDigits(),
    wrongPin,
    wrongPin2,
    pinChoices,
    suvZone,
    escapeZone,
    blockedNeighbor,
    thirdNeighbor,
    decoyZone,
    contractorId: CONTRACTOR_ID,
    rohanPhone: ROHAN_NUMBER,
  };
}

/**
 * Inspector Subir Sen (Father) — 10 sequential tasks (15s each).
 * Failing any task ends the run and prompts restart (same role or switch to Rohan).
 * Tasks 8, 9, 10 are the 3 end-goal milestones (score /3).
 */
export function getFatherTasks(seed) {
  const suvName = ZONES[seed.suvZone]?.name || "Sector V";
  return [
    {
      num: 1,
      app: "pingme",
      title: "Forward Rohan's Back-Gate Lure",
      lead: "Open PingMe → Rohan's chat and forward his lure message to Lalbazar.",
      milestone: false,
    },
    {
      num: 2,
      app: "calls",
      title: "Flag the Unknown Burner Call",
      lead: "Open Call Logs and flag the suspicious Unknown Burner (+91 70440-81924).",
      milestone: false,
    },
    {
      num: 3,
      app: "gallery",
      title: "Tag the White SUV Sighting Photo",
      lead: "Open Gallery and tag the CK Block Back Gate photo (IMG_2014.jpg) as evidence.",
      milestone: false,
    },
    {
      num: 4,
      app: "pingme",
      title: "Forward Ananya's Tender #404 Leak",
      lead: "Open PingMe → Ananya (Dept) and forward her Bypass Corridor warning to Lalbazar.",
      milestone: false,
    },
    {
      num: 5,
      app: "browser",
      title: "Verify the Getaway SUV Registration",
      lead: `Open Browser → WB Plate Lookup and verify White SUV WB-06-${seed.plateNum}.`,
      milestone: false,
    },
    {
      num: 6,
      app: "files",
      title: "Secure the Tender #404 Audit File",
      lead: "Open Files and quarantine tender_404_summary.txt before cloud sync wipes it.",
      milestone: false,
    },
    {
      num: 7,
      app: "notes",
      title: "Recover Riya's BangoVault PIN",
      lead: "Open QuickNotes and copy the 4-digit BangoVault Backup PIN before corruption.",
      milestone: false,
    },
    {
      num: 8,
      app: "settings",
      title: "STOP REMOTE DELETE — Revoke Access",
      lead: "Open System and REVOKE Rohan's linked cloud device (…44102) to save the fraud files!",
      milestone: true,
      milestoneLabel: "1/3 · Remote Delete Stopped",
    },
    {
      num: 9,
      app: "vault",
      title: "SEND FRAUD INFO TO AUTHORITIES",
      lead: `Open BangoVault, unlock with PIN ${seed.vaultPin}, and transmit Contractor ID ${seed.contractorId} to Lalbazar Police!`,
      milestone: true,
      milestoneLabel: "2/3 · Fraud Dossier Sent to Police",
    },
    {
      num: 10,
      app: "map",
      title: "SAVE RIYA — Dispatch PCR Rescue",
      lead: `Open CholoMap (Kolkata Map), click ${suvName}, and dispatch the PCR Rescue Team to free Riya!`,
      milestone: true,
      milestoneLabel: "3/3 · Riya Freed!",
    },
  ];
}

/**
 * Rohan Chatterjee — 10 complementary sequential tasks (15s each).
 * Tasks 1–7: failing/timing out does NOT end the game (logs a slip and continues).
 * Tasks 8–10: failing/timing out ENDS Rohan's run (the 3 critical end-goal milestones, score /3).
 */
export function getRohanTasks(seed) {
  const suvName = ZONES[seed.suvZone]?.name || "Sector V";
  const escapeName = ZONES[seed.escapeZone]?.name || "Chingrighata";
  const blockedName = ZONES[seed.blockedNeighbor]?.name || "Kestopur";
  return [
    {
      num: 1,
      kind: "choice",
      title: "Overwrite the Back-Gate Chat",
      lead: "Subir is opening PingMe! Pick the exact lure chat to overwrite before he sees it.",
      options: [
        { id: "backgate", label: "Wipe: Rohan — Back Gate Lure", sub: "Target PingMe thread", correct: true },
        { id: "dad", label: "Wipe: Baba — Dinner Reminder", sub: "Low-priority thread", correct: false },
        { id: "spam", label: "Wipe: Telecom Promo SMS", sub: "Irrelevant message", correct: false },
      ],
      milestone: false,
    },
    {
      num: 2,
      kind: "choice",
      title: "Mask Your Burner Number",
      lead: "Subir is checking Call Logs! Spoof and scrub the active getaway burner number.",
      options: [
        { id: "ananya", label: "Scrub Ext. 404 (Dept Desk)", sub: "Office landline", correct: false },
        { id: "burner", label: "Scrub +91 70440-81924 (Burner)", sub: "Direct link to SUV driver", correct: true },
        { id: "home", label: "Scrub Home Landline", sub: "No trace value", correct: false },
      ],
      milestone: false,
    },
    {
      num: 3,
      kind: "choice",
      title: "Corrupt the Gate Photo Backup",
      lead: "A camera-roll photo shows our White SUV at CK Block. Corrupt the exact file.",
      options: [
        { id: "tea", label: "Corrupt IMG_1982.jpg (Tea Stall)", sub: "Yesterday evening", correct: false },
        { id: "gate", label: "Corrupt IMG_2014.jpg (CK Block Gate)", sub: "Shows White SUV in lane", correct: true },
        { id: "desk", label: "Corrupt IMG_1998.jpg (Folder Cover)", sub: "Blurry desk snap", correct: false },
      ],
      milestone: false,
    },
    {
      num: 4,
      kind: "choice",
      title: "Delete Ananya's Syndicate Warning",
      lead: "Ananya tipped Riya off about Tender #404. Pick the right PingMe lead to purge.",
      options: [
        { id: "bypass", label: "Purge: Bypass Corridor Leak", sub: "Ananya's warning message", correct: true },
        { id: "gatebot", label: "Purge: GateBot Weather Alert", sub: "Automated broadcast", correct: false },
        { id: "notes", label: "Purge: Grocery Checklist", sub: "Personal note", correct: false },
      ],
      milestone: false,
    },
    {
      num: 5,
      kind: "map_spoof",
      title: "Plant a Ghost Ping on Kolkata Map",
      lead: `Subir checked WB-06-${seed.plateNum}! Click ANY Kolkata zone OTHER than ${suvName} to drop a fake GPS signal.`,
      milestone: false,
    },
    {
      num: 6,
      kind: "choice",
      title: "Glitch Riya's QuickNotes PIN",
      lead: "Subir is hunting for the BangoVault PIN. Push the cloud corruption packet now.",
      options: [
        { id: "clock", label: "Delay Device Clock (+2 min)", sub: "Cosmetic only", correct: false },
        { id: "corrupt", label: "Inject QuickNotes Sync Glitch", sub: "Scrambles 4-digit PIN", correct: true },
        { id: "wall", label: "Dim Screen Brightness", sub: "Won't hide the PIN", correct: false },
      ],
      milestone: false,
    },
    {
      num: 7,
      kind: "choice",
      title: "Send a Bait Taunt to Stall Subir",
      lead: "Buy time for the driver! Push a decoy spam popup onto Riya's laptop.",
      options: [
        { id: "call", label: "Trigger Fake Burner Call Popup", sub: "Freezes his screen for 4s", correct: true },
        { id: "mute", label: "Toggle Notification Bell", sub: "No delay caused", correct: false },
        { id: "ping", label: "Refresh Own GPS", sub: "Does not stall Subir", correct: false },
      ],
      milestone: false,
    },
    {
      num: 8,
      kind: "choice",
      title: "LOCK REMOTE DELETE — Block Revoke",
      lead: `CRITICAL (1/3): Subir is trying to revoke your access! Lock the remote wipe with your Contractor Token (${seed.contractorId}) — wrong token fails your run!`,
      options: [
        { id: "wrong1", label: "Override Token: WB-06-0000", sub: "Vehicle permit prefix", correct: false },
        { id: "token", label: `Override Token: ${seed.contractorId}`, sub: "Authorized Syndicate Admin Key", correct: true },
        { id: "wrong2", label: "Override Token: DEPT-815", sub: "Expired guest key", correct: false },
      ],
      milestone: true,
      milestoneLabel: "1/3 · Remote Wipe Locked On",
    },
    {
      num: 9,
      kind: "choice",
      title: "SEVER LALBAZAR POLICE UPLINK",
      lead: "CRITICAL (2/3): BangoVault is uploading Tender #404 to the authorities! Cut the exact Lalbazar upload channel before it completes!",
      options: [
        { id: "chan1", label: "Cut Port 80 · Kolkata Gazette Feed", sub: "Public news RSS", correct: false },
        { id: "chan2", label: "Cut Port 404 · LALBAZAR-CYBER-UPLINK", sub: "Active Tender #404 Police Stream", correct: true },
        { id: "chan3", label: "Cut Port 53 · Local Weather Sync", sub: "Background telemetry", correct: false },
      ],
      milestone: true,
      milestoneLabel: "2/3 · Police Uplink Severed",
    },
    {
      num: 10,
      kind: "map_escape",
      title: "ESCAPE KOLKATA — Hit the Open Exit",
      lead: `CRITICAL (3/3): PCR barricaded ${blockedName}! Click ${escapeName} on the Kolkata Map to break out onto the highway ramp!`,
      milestone: true,
      milestoneLabel: "3/3 · Escaped Kolkata!",
    },
  ];
}

// 8:15 PM // WIPEOUT — tuning constants & static content (v2 spec, 3-minute round)

export const ROUND_MS = 180_000; // 03:00 (Dept security delay on remote resets)
export const HANDSHAKE_MS = 10_000; // Rohan's cloud handshake (03:00 → 02:50)
export const COUNTDOWN_MS = 3_000; // synced 3-2-1

// Wipe milestones, expressed as TIME LEFT (wipe % is linear over the round)
export const WIPE20_MS = 144_000; // 02:24 — warning: PingMe purges at 50%
export const WIPE50_MS = 90_000; // 01:30 — PingMe purged
export const FINAL_MS = 36_000; // 00:36 — 80%: QuickNotes purged, Final Stretch
export const LAST_CHANCE_MS = 10_000; // 00:10

export const OVERWRITE_MS = 4_000;
export const TRACE_MS = 4_000;
export const RAID_TRAVEL_MS = 3_000;
export const VAN_REGROUP_MS = 10_000;
export const CYBER_LOCK_MS = 5_000;
export const SPOOF_MS = 10_000;
export const NOTE_CORRUPT_MS = 8_000;
export const FAKE_CALL_MS = 4_000;
export const ABORT_WINDOW_MS = 3_000;
export const ABORT_TAPS = 4;
export const ABORT_PENALTY_MS = 5_000;

export const CD = {
  ping: 10_000,
  pingFinal: 5_000,
  reroute: 10_000,
  rerouteFinal: 6_000,
  spoofer: 25_000,
  sabotage: 18_000,
  taunt: 10_000,
  cyberLock: 30_000,
};

export const HOLD_MS = { lead1: 2000, lead2: 2000, lead3: 3000, restore: 1000 };

// 3-regular "prism" road network: every zone touches exactly 3 others, is far from 2.
export const ZONES = {
  saltlake: { name: "Salt Lake", sub: "CK Block", x: 44, y: 40 },
  ultadanga: { name: "Ultadanga", sub: "VIP Rd", x: 14, y: 30 },
  kestopur: { name: "Kestopur", sub: "Canal Rd", x: 66, y: 13 },
  karunamoyee: { name: "Karunamoyee", sub: "Bus Depot", x: 50, y: 61 },
  sectorv: { name: "Sector V", sub: "IT Hub", x: 86, y: 50 },
  chingrighata: { name: "Chingrighata", sub: "EM Bypass", x: 20, y: 86 },
};
export const ZONE_IDS = Object.keys(ZONES);

export const ADJ = {
  saltlake: ["ultadanga", "kestopur", "karunamoyee"],
  ultadanga: ["saltlake", "kestopur", "chingrighata"],
  kestopur: ["saltlake", "ultadanga", "sectorv"],
  karunamoyee: ["saltlake", "sectorv", "chingrighata"],
  sectorv: ["kestopur", "karunamoyee", "chingrighata"],
  chingrighata: ["ultadanga", "karunamoyee", "sectorv"],
};

export const EDGES = [
  ["saltlake", "ultadanga"],
  ["saltlake", "kestopur"],
  ["saltlake", "karunamoyee"],
  ["ultadanga", "kestopur"],
  ["ultadanga", "chingrighata"],
  ["kestopur", "sectorv"],
  ["karunamoyee", "sectorv"],
  ["karunamoyee", "chingrighata"],
  ["sectorv", "chingrighata", { cx: 70, cy: 94 }],
];

export const ROHAN_NUMBER = "+91 98300-44102";
export const CONTRACTOR_ID = "RC-44102";

export const LEADS = {
  lead1: { title: "Back Gate Lure", source: "Chat — Rohan", via: "Tower snapshot" },
  lead2: { title: "Bypass Corridor", source: "Chat — Ananya", via: "Traffic CCTV sweep" },
  lead3: { title: "Contractor ID", source: "BangoVault audit", via: "Full trace" },
};

export const TAUNTS = [
  "Don't waste your vans, Uncle. She's fine.",
  "Driver just took a turn. Wrong side of Salt Lake.",
  "Too slow, Inspector. Wipe is almost done.",
];

export const CHATS = {
  rohan: {
    name: "Rohan",
    number: ROHAN_NUMBER,
    seen: "Last seen 7:51 PM",
    lead: "lead1",
    messages: [
      {
        from: "them",
        time: "7:50 PM",
        text: "Near your block. 10-min walk? Need to clear my head. Meet me at the back garden gate — street lights are out, quieter there.",
        lead: "lead1",
      },
      { from: "me", time: "7:52 PM", text: "Ok! Coming down in 5 🙂" },
    ],
  },
  ananya: {
    name: "Ananya (Dept)",
    seen: "Last seen 7:20 PM",
    lead: "lead2",
    messages: [
      {
        from: "them",
        time: "7:12 PM",
        text: "Riya, Tender #404 is completely rigged! ₹80 Crore drained from the Sector V fund.",
      },
      {
        from: "me",
        time: "7:16 PM",
        text: "Haven't read the full list yet — downloaded the audit into BangoVault. Showing Baba after dinner.",
      },
      {
        from: "them",
        time: "7:20 PM",
        text: "Careful. Someone on our floor tipped off the syndicate. They run everything out of the Bypass corridor.",
        lead: "lead2",
      },
    ],
  },
  gatebot: {
    name: "Salt Lake GateBot",
    seen: "Automated · 8:13 PM",
    lead: null,
    messages: [
      {
        from: "them",
        time: "8:13 PM",
        text: "⚠️ BACK LANE CAM: Unregistered White SUV (WB-06-{PLATE}) sped out of CK Block at 8:13 PM.",
      },
    ],
  },
};

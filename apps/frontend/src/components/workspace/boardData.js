import { CASE_BRIEF } from "@/data/caseData";

// x / y are percentages of the chalkboard. kind: polaroid | scrap | tape | emblem
export const BOARD_NODES = [
  {
    id: "crew",
    kind: "polaroid",
    title: "Pinehollow Crew",
    subCaption: "(Adam, Rohan, Maya, Kabir)",
    role: "Group Photo · Autumn Blackout Week",
    details:
      "Taken 48 hours before Adam vanished. Everyone claims they went home before 11:00 PM.",
    variant: "crew",
    x: 46,
    y: 13,
    rot: -1,
    wide: true,
  },
  {
    id: "maya",
    kind: "polaroid",
    title: "Maya",
    role: "Local Archivist · Witness",
    details:
      "Called Adam at 11:00 PM on the night of the blackout. Tension over the substation records.",
    variant: "maya",
    x: 76,
    y: 16,
    rot: 2,
  },
  {
    id: "map",
    kind: "polaroid",
    title: "Marked locations",
    role: "Substation B & North Platform",
    details:
      "Pinned routes around Pinehollow Rail Yard. Check Adam's Photos EXIF metadata to confirm where he went at 00:52 AM.",
    variant: "map",
    x: 16,
    y: 36,
    rot: -2,
    wide: true,
    clueId: "clue_exif_substation",
  },
  {
    id: "adam",
    kind: "polaroid",
    title: "Adam",
    role: "Missing Person · Case #04",
    details: CASE_BRIEF.summary,
    variant: "adam",
    x: 49,
    y: 46,
    rot: -1,
    hero: true,
    clueId: "clue_ping",
  },
  {
    id: "tara",
    kind: "polaroid",
    title: "Tara",
    role: "Café Shift Lead",
    details:
      "Saw Adam earlier that evening with someone carrying a silver keycard.",
    variant: "tara",
    x: 82,
    y: 43,
    rot: 1.5,
  },
  {
    id: "rohan",
    kind: "polaroid",
    title: "Rohan",
    role: "Roommate & Co-Host",
    details:
      "Claimed he stayed home, but his messages on Adam's device tell a different story.",
    variant: "rohan",
    x: 16,
    y: 60,
    rot: -2.5,
    clueId: "clue_rohan_meet",
  },
  {
    id: "unknown",
    kind: "polaroid",
    title: "Unknown",
    role: "Burner Contact (404)",
    details:
      "Sent Adam a threat 12 minutes before the North Platform blackout. Identity unconfirmed.",
    variant: "unknown",
    x: 17,
    y: 82,
    rot: 1,
  },
  {
    id: "kabir",
    kind: "polaroid",
    title: "Insp. Kabir",
    role: "Case Handler",
    details:
      "Mounted Adam's synced devices to your desk. Waiting for confirmation on the hidden drive.",
    variant: "kabir",
    x: 48,
    y: 82,
    rot: -1,
  },
  {
    id: "vikram",
    kind: "polaroid",
    title: "Vikram",
    role: "Night Shift Guard",
    details:
      "On duty at Pinehollow Rail Yard during Tuesday's manual grid override.",
    variant: "vikram",
    x: 79,
    y: 71,
    rot: 2,
    clueId: "clue_locked_note",
  },
  {
    id: "tape",
    kind: "tape",
    title: "substation_b",
    role: "Grid Override Tag",
    details:
      "Found in Adam's exported logs. Power failed at Substation B at 00:50 AM.",
    x: 16,
    y: 24,
    rot: -5,
  },
  {
    id: "emblem",
    kind: "emblem",
    title: "Locker #19 / Vault Mark",
    role: "Chalked Symbol",
    details:
      "Recurring mark spotted near Pinehollow North Platform. Unlock Adam's Notes with the 4-digit ticket code.",
    x: 42,
    y: 27,
    rot: 0,
  },
  {
    id: "sketch",
    kind: "scrap",
    title: "Torn Platform Sketch",
    role: "Recovered Paper Scrap",
    details:
      "Hand-drawn layout of Pinehollow North Platform storage bay. Ticket #0419 scribbled on the margin.",
    lines: ["NORTH BAY", "Gate B → Locker #19", "00:52 AM"],
    x: 65,
    y: 29,
    rot: 2,
  },
  {
    id: "receipt",
    kind: "scrap",
    tan: true,
    title: "Crumpled Receipt",
    role: "Evidence Fragment",
    details:
      "PINEHOLLOW TRANSIT STORAGE · Status: OCCUPIED. Full copy stored in Adam's synced Files.",
    lines: ["TRANSIT", "STORAGE", "#0419"],
    x: 32,
    y: 66,
    rot: -4,
  },
];

// Yarn between nodes. `requires` = clue that makes the thread "verified" (red).
export const STRINGS = [
  { from: "crew", to: "adam" },
  { from: "maya", to: "adam" },
  { from: "maya", to: "tara" },
  { from: "map", to: "adam", requires: "clue_exif_substation" },
  { from: "tape", to: "map" },
  { from: "rohan", to: "adam", requires: "clue_rohan_meet" },
  { from: "adam", to: "unknown" },
  { from: "adam", to: "kabir" },
  { from: "tara", to: "vikram" },
  { from: "vikram", to: "adam", requires: "clue_locked_note" },
  { from: "sketch", to: "emblem" },
];

export const ANNOTATIONS = [
  { text: "identity unknown", x: 21, y: 13, rot: -7, red: true },
  { text: "???", x: 24, y: 29, rot: -2 },
  { text: "coordinates", x: 52, y: 33, rot: -10, red: true },
  { text: "called Adam\n11 pm", x: 61, y: 38, rot: -4 },
  { text: "enemies?", x: 87, y: 30, rot: -5 },
  { text: "left together\n12 am", x: 30, y: 50, rot: -2 },
  { text: "another\nlead?", x: 68, y: 54, rot: -4 },
  { text: "keycard?", x: 88, y: 58, rot: -5 },
  { text: "who?", x: 16, y: 71, rot: -4 },
  { text: "handler", x: 42, y: 71, rot: -2 },
  { text: "night shift", x: 80, y: 83, rot: -5 },
  { text: "why?", x: 22, y: 94, rot: -8, red: true },
  { text: "hiding\nsomething?", x: 84, y: 93, rot: -11, red: true },
];

// Where newly discovered clues get pinned as sticky notes.
export const CLUE_SLOTS = [
  { x: 63, y: 10, rot: 4 },
  { x: 33, y: 8, rot: -5 },
  { x: 91, y: 22, rot: 6 },
  { x: 7, y: 8, rot: -3 },
];

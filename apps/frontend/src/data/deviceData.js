import { FILES } from "./caseData";

/* ---------------- MAP ---------------- */
// Coordinates are in a 400 x 300 SVG space.
export const MAP_PINS = [
  {
    id: "home",
    name: "Adam & Rohan's Flat",
    x: 60,
    y: 70,
    time: "Mon 10:00 PM",
    info: "Last confirmed location before the blackout. Rohan says he never left the flat that night.",
  },
  {
    id: "cafe",
    name: "Oak Street Café",
    x: 95,
    y: 195,
    time: "Mon 09:15 PM",
    info: "Adam's cover story: coffee with Rohan. The receipt in Photos shows a cash payment for two.",
  },
  {
    id: "sub",
    name: "Substation B",
    x: 200,
    y: 122,
    time: "Tue 00:52 AM",
    info: "Grid went to 0 kW at 00:50 under a manual override. The fence gate was cut. Ticket #0419 was clipped to the wire.",
  },
  {
    id: "tower",
    name: "Cell Tower 7",
    x: 255,
    y: 238,
    time: "Tue 01:30 AM",
    requires: "clue_rohan_meet",
    hint: "A tower ping is waiting on a lead. Press Rohan on where he was.",
    info: "Rohan's phone pinged this tower at 01:30 AM, two blocks from the rail yard. He told police he was asleep.",
  },
  {
    id: "yard",
    name: "Pinehollow Rail Yard",
    x: 322,
    y: 72,
    time: "Tue 01:47 AM",
    requires: "clue_exif_substation",
    hint: "Unknown location. Find out where Adam really was at 00:52.",
    info: "Adam's last sync pinged here at 01:47 AM, right before his phone went dark. The North Platform sits on the east side.",
  },
  {
    id: "locker",
    name: "North Platform · Locker #19",
    x: 345,
    y: 168,
    time: "Tue 01:28 AM (note)",
    requires: "clue_locked_note",
    hint: "Unknown location. Something is hidden at the platform.",
    info: "Adam's backup drive is stashed in Locker #19. Access needs the silver keycard, so tell Kabir before someone else gets there.",
  },
];

export const MAP_ROUTE = ["home", "sub", "yard", "locker"];

/* ---------------- BROWSER ---------------- */
export const BROWSER_BOOKMARKS = [
  { title: "Pinehollow Gazette", url: "gazette.ph/blackout" },
  { title: "Pinehollow Transit", url: "transit.ph/lockers" },
  { title: "Grid Status", url: "grid.ph/status" },
  { title: "Browsing History", url: "about:history" },
];

export const BROWSER_HISTORY = [
  { time: "Mon 11:41 PM", title: "substation b maintenance schedule", url: "grid.ph/status" },
  { time: "Mon 11:58 PM", title: "how to remotely wipe a phone", url: "about:blank" },
  { time: "Tue 12:10 AM", title: "pinehollow transit locker lookup", url: "transit.ph/lockers" },
  { time: "Tue 01:05 AM", title: "gazette: blackout hits pinehollow", url: "gazette.ph/blackout" },
];

export const GAZETTE_ARTICLE = {
  headline: "Blackout Hits Pinehollow; Rail Yard Grid 'Manually Overridden'",
  byline: "By M. Sen · Pinehollow Gazette · Tue 01:05 AM",
  paragraphs: [
    "Residents were plunged into darkness at 00:50 AM when Substation B dropped to zero load. The utility calls it an 'unscheduled event'.",
    "Sources close to the grid say the override was entered by hand, from inside the fence line. Nobody has claimed responsibility.",
    "The rail yard's freight schedule shows a locker bay on the North Platform being accessed minutes after the outage. Transit has declined to comment.",
  ],
};

export const GRID_STATUS = [
  { node: "SUB-A", load: "412 kW", state: "NORMAL" },
  { node: "SUB-B", load: "0 kW", state: "MANUAL OVERRIDE · 00:50" },
  { node: "NORTH-YARD", load: "0 kW", state: "OFFLINE · 01:45" },
  { node: "OAK-ST", load: "88 kW", state: "NORMAL" },
];

// Ticket number -> locker record (used by the transit lookup page).
export const TRANSIT_LOOKUP = {
  "0419": {
    bay: "North Platform",
    locker: "#19",
    status: "OCCUPIED",
    access: "Silver keycard holders only",
    opened: "Tue 01:12 AM",
  },
};

/* ---------------- TERMINAL ---------------- */
const filesIn = (folder) =>
  Object.fromEntries(
    FILES.filter((f) => f.folder === folder).map((f) => [f.name, f.preview])
  );

export const TERMINAL_FS = {
  "~": {
    dirs: ["Desktop", "Downloads", "Trash", ".cache"],
    files: {
      "readme.txt":
        "If I'm gone, check the north platform.\nThe four digits are on the ticket. -A",
    },
  },
  Desktop: { dirs: [], files: filesIn("Desktop") },
  Downloads: { dirs: [], files: filesIn("Downloads") },
  Trash: { dirs: [], files: filesIn("Trash") },
  ".cache": {
    dirs: [],
    hidden: true,
    files: {
      ".wipe_schedule":
        "REMOTE WIPE QUEUED\nrequested_by: unknown@burner-404\nscope: messages, photos (partial)\nstatus: PAUSED (device offline)",
    },
  },
};

export const TRACE_RESULT = [
  "tracing burner-404 ...",
  "tower: CELL-07 (Pinehollow East)",
  "last ping: 01:35 AM, 600m from the rail yard",
  "handset: prepaid, activated 3 days ago",
  "owner: unregistered",
];

export const PROTOTYPE_NAME = "TRACE // PINEHOLLOW";

export const CASE_BRIEF = {
  caseId: "CASE-04",
  title: "Missing Person: Adam Reyes",
  subtitle: "Cloud Device Backup Recovered — Pinehollow Rail Yard",
  summary:
    "Adam Reyes (22) vanished at 01:47 AM during Tuesday's town-wide blackout. A partial cloud sync of his laptop and phone was mounted to your investigation workspace.",
  lastSeen: "01:47 AM · Pinehollow North Platform",
  pinCode: "0419",
  pinHint: "Check the substation timestamp or train ticket number in Photos / Files.",
};

export const SUSPECTS = [
  {
    id: "rohan",
    name: "Rohan Das",
    role: "Roommate & Co-Host",
    status: "Cooperative (Unverified Alibi)",
    note: "Claims he was asleep by 11:00 PM, but cell tower logs place him near the rail yard.",
  },
  {
    id: "kabir",
    name: "Insp. Kabir Rao",
    role: "Lead Investigator",
    status: "Handler",
    note: "Assigned you to audit Adam's synced devices before the remote wipe completes.",
  },
  {
    id: "unknown",
    name: "Unknown (404)",
    role: "Burner Contact",
    status: "Active Threat",
    note: "Sent Adam a warning 12 minutes before his phone went offline.",
  },
];

export const INITIAL_CLUES = [
  {
    id: "clue_ping",
    title: "Last Device Sync",
    source: "System Telemetry",
    detail: "Last active ping recorded at 01:47 AM near Pinehollow North Platform.",
  },
];

export const ALL_CLUES_BY_ID = {
  clue_ping: INITIAL_CLUES[0],
  clue_rohan_meet: {
    id: "clue_rohan_meet",
    title: "Rohan's Deleted Meetup",
    source: "Messages · Rohan Das",
    detail: "Rohan admits he was supposed to meet Adam at Substation B around midnight.",
  },
  clue_exif_substation: {
    id: "clue_exif_substation",
    title: "Substation B EXIF (00:52 AM)",
    source: "Photos · IMG_0419.jpg",
    detail: "Photo metadata contradicts Adam's café story—he was at Substation B. Ticket #0419 visible.",
  },
  clue_locked_note: {
    id: "clue_locked_note",
    title: "Decrypted Note: Locker #19",
    source: "Notes · North Platform",
    detail: "Adam hid the blackout drive inside Locker #19 and warned not to trust anyone with a silver keycard.",
  },
};

export const INITIAL_CHATS = {
  rohan: {
    id: "rohan",
    name: "Rohan Das",
    avatar: "RD",
    status: "Online",
    unread: 1,
    messages: [
      {
        id: "r1",
        sender: "them",
        text: "Hey, did the police give you access to Adam's cloud backup too?",
        time: "01:58 AM",
      },
      {
        id: "r2",
        sender: "them",
        text: "He texted me something weird about the north platform right before the power cut.",
        time: "01:59 AM",
      },
    ],
    choices: [
      {
        id: "c_rohan_1",
        label: "Where were you around midnight?",
        replyText:
          "Okay fine—I walked toward Substation B to meet him, but the lights died and he never showed. Check his Photos, he snapped something there.",
        unlockClue: "clue_rohan_meet",
      },
      {
        id: "c_rohan_2",
        label: "Do you know his Notes passcode?",
        replyText:
          "Not directly, but Adam always uses 4 digits from whatever ticket or case number he's obsessing over. Try checking his latest photo or receipt.",
        unlockClue: null,
      },
    ],
  },
  kabir: {
    id: "kabir",
    name: "Insp. Kabir Rao",
    avatar: "KR",
    status: "Last seen 01:40 AM",
    unread: 1,
    messages: [
      {
        id: "k1",
        sender: "them",
        text: "Backup is mounted. Cross-check Adam's Messages, Photos EXIF, and locked Notes.",
        time: "01:42 AM",
      },
      {
        id: "k2",
        sender: "them",
        text: "Let me know as soon as you find where he stashed the drive.",
        time: "01:43 AM",
      },
    ],
    choices: [
      {
        id: "c_kabir_1",
        label: "Found Locker #19 lead — sending report",
        requiresClue: "clue_locked_note",
        replyText:
          "Copy that. Dispatching a unit to Pinehollow North Platform Locker #19 right now. Good work.",
        unlockClue: null,
      },
      {
        id: "c_kabir_2",
        label: "Still auditing his device files.",
        replyText:
          "Stay sharp. The remote wipe timer could trigger if we miss something.",
        unlockClue: null,
      },
    ],
  },
  unknown: {
    id: "unknown",
    name: "Unknown (404)",
    avatar: "??",
    status: "Offline",
    unread: 0,
    messages: [
      {
        id: "u1",
        sender: "them",
        text: "Stop digging into the substation logs, Adam.",
        time: "01:35 AM",
      },
      {
        id: "u2",
        sender: "me",
        text: "Too late. If the lights go out again, check the north platform.",
        time: "01:47 AM",
      },
    ],
    choices: [],
  },
};

export const PHOTOS = [
  {
    id: "photo_1",
    filename: "IMG_0419.jpg",
    title: "Substation B Gate",
    timestamp: "Tue 00:52 AM",
    location: "Pinehollow Substation B",
    device: "Adam's Phone",
    caption: "Ticket #0419 clipped to the fence. Silver keycard reflection in the puddle.",
    accent: "#3b82f6",
    unlockClue: "clue_exif_substation",
  },
  {
    id: "photo_2",
    filename: "IMG_0412.jpg",
    title: "Corner Café Receipt",
    timestamp: "Mon 09:15 PM",
    location: "Oak Street Café",
    device: "Adam's Phone",
    caption: "Two coffees ordered. Paid in cash.",
    accent: "#f59e0b",
    unlockClue: null,
  },
  {
    id: "photo_3",
    filename: "IMG_0398.jpg",
    title: "North Platform Map",
    timestamp: "Mon 06:40 PM",
    location: "Pinehollow Rail Yard",
    device: "Adam's Laptop Sync",
    caption: "Old locker bay diagram circled in red ink.",
    accent: "#10b981",
    unlockClue: null,
  },
];

export const NOTES = [
  {
    id: "note_1",
    title: "Blackout Timeline",
    updated: "Mon 10:30 PM",
    locked: false,
    body: "Power grid dips always start at Substation B.\nRohan thinks it's random maintenance, but the outage logs match the rail yard freight schedule.",
  },
  {
    id: "note_2",
    title: "North Platform — Do Not Share",
    updated: "Tue 01:28 AM",
    locked: true,
    body: "If you're reading this, I had to ditch my phone.\n\nThe backup drive is inside Locker #19 at the North Platform.\nDo NOT hand it to anyone carrying a silver keycard.",
    unlockClue: "clue_locked_note",
  },
  {
    id: "note_3",
    title: "Grocery List",
    updated: "Sun 04:10 PM",
    locked: false,
    body: "- AA Batteries\n- Coffee filters\n- USB-C cable",
  },
];

export const FILES = [
  {
    id: "file_1",
    name: "Locker_Receipt_0419.txt",
    folder: "Downloads",
    size: "2 KB",
    modified: "Tue 01:12 AM",
    preview: "PINEHOLLOW TRANSIT STORAGE\nTicket: #0419\nBay: North Platform\nStatus: OCCUPIED",
  },
  {
    id: "file_2",
    name: "Voicemail_0141AM.m4a",
    folder: "Desktop",
    size: "420 KB",
    modified: "Tue 01:41 AM",
    preview:
      "[00:02] *Heavy rain & distant train horn*\n[00:06] Adam (whispering): \"Someone's at the gate. Four-digit code is on the ticket...\"",
  },
  {
    id: "file_3",
    name: "grid_export_draft.csv",
    folder: "Trash",
    size: "18 KB",
    modified: "Mon 11:55 PM",
    preview: "timestamp,substation,load_kw\n00:50,SUB-B,0 (MANUAL OVERRIDE)\n01:45,NORTH-YARD,0",
  },
];

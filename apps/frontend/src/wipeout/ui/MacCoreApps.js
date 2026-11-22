"use client";

import { useEffect, useRef, useState } from "react";
import { CONTRACTOR_ID, ROHAN_NUMBER, ZONES, ZONE_IDS } from "../constants";
import { sfx } from "../sfx";
import MapBoard from "./MapBoard";
import m from "./MacDesktop.module.css";

/* ═══════════════════════════════════════════════════════════════
   WALLPAPER PRESETS (Used in Desktop + System Settings)
   ═══════════════════════════════════════════════════════════════ */
export const WALLPAPERS = [
  {
    id: "sequoia",
    name: "Sequoia Twilight",
    css: 'url("/macos-wallpaper.jpg") center / cover no-repeat',
    thumb: 'url("/macos-wallpaper.jpg") center / cover no-repeat',
  },
  {
    id: "sonoma",
    name: "Sonoma Horizon",
    css: "radial-gradient(ellipse at 72% 18%, rgba(251, 146, 60, 0.55) 0%, transparent 48%), radial-gradient(ellipse at 18% 80%, rgba(56, 189, 248, 0.45) 0%, transparent 52%), radial-gradient(ellipse at 52% 48%, rgba(168, 85, 247, 0.45) 0%, transparent 58%), linear-gradient(160deg, #0b1228 0%, #1d1538 45%, #0c192c 100%)",
    thumb: "linear-gradient(135deg, #fb923c, #a855f7 52%, #0c192c)",
  },
  {
    id: "monterey",
    name: "Monterey Silk",
    css: "radial-gradient(ellipse at 80% 25%, rgba(236, 72, 153, 0.48) 0%, transparent 52%), radial-gradient(ellipse at 20% 72%, rgba(79, 70, 229, 0.55) 0%, transparent 56%), linear-gradient(155deg, #120829 0%, #2a104f 48%, #090616 100%)",
    thumb: "linear-gradient(135deg, #ec4899, #4f46e5 55%, #120829)",
  },
  {
    id: "ventura",
    name: "Kolkata Dusk",
    css: 'linear-gradient(180deg, rgba(10, 12, 22, 0.25) 0%, rgba(10, 12, 22, 0.52) 100%), url("/photos/img-1965-victoria.jpg") center / cover no-repeat',
    thumb: 'url("/photos/img-1965-victoria.jpg") center / cover no-repeat',
  },
  {
    id: "aurora",
    name: "Midnight Aurora",
    css: "radial-gradient(ellipse at 28% 22%, rgba(16, 185, 129, 0.35) 0%, transparent 50%), radial-gradient(ellipse at 76% 74%, rgba(59, 130, 246, 0.4) 0%, transparent 52%), linear-gradient(170deg, #040d18 0%, #0b1e2d 50%, #060912 100%)",
    thumb: "linear-gradient(135deg, #10b981, #2563eb 55%, #060912)",
  },
];

/* ═══════════════════════════════════════════════════════════════
   1. PINGME (macOS Messages Clone — Tasks 1 & 4)
   ═══════════════════════════════════════════════════════════════ */
export function MacPingMeApp({
  seed,
  taskNum,
  playing,
  passedTasks,
  forwardedLogs,
  onForwardMessage,
}) {
  const [chatId, setChatId] = useState("rohan");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [localReplies, setLocalReplies] = useState({});

  const ananyaUnlocked = taskNum >= 4 || passedTasks.includes(3);
  const gatebotUnlocked = taskNum >= 5 || passedTasks.includes(4);

  const rohanChatMsgs = [
    {
      from: "them",
      time: "7:50 PM",
      text: "Near your block. 10-min walk? Need to clear my head. Meet me at the back garden gate — street lights are out, quieter there.",
      targetTask: 1,
      fromLabel: "Rohan",
    },
    {
      from: "me",
      time: "7:52 PM",
      text: "Ok! Coming down in 5 🙂",
      targetTask: null,
      fromLabel: "Riya",
    },
  ];

  const ananyaChatMsgs = [
    {
      from: "them",
      time: "7:05 PM",
      text: "Are you free for lunch at the canteen tomorrow?",
      targetTask: null,
      fromLabel: "Ananya (Dept)",
    },
    {
      from: "me",
      time: "7:14 PM",
      text: "Maybe after I finish the audit folder — showing Baba after dinner.",
      targetTask: null,
      fromLabel: "Riya",
    },
    {
      from: "them",
      time: "7:20 PM",
      text: "Careful. Someone on our floor tipped off the syndicate. Tender #404 is rigged — they run everything out of the Bypass corridor.",
      targetTask: 4,
      fromLabel: "Ananya (Dept)",
    },
  ];

  const babaChatMsgs = [
    {
      from: "them",
      time: "6:38 PM",
      text: "Riya, I'm on a Lalbazar call till 8:15. Keep your locket on if you step out!",
      targetTask: null,
      fromLabel: "Baba",
    },
    {
      from: "me",
      time: "6:41 PM",
      text: "Always on, Baba. Warming up dal before 9.",
      targetTask: null,
      fromLabel: "Riya",
    },
  ];

  const threads = [
    {
      id: "rohan",
      name: "Rohan Chatterjee",
      initials: "RC",
      avatarBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      time: "7:52 PM",
      preview: "Meet me at the back garden gate…",
      unread: taskNum === 1,
      visible: true,
    },
    {
      id: "ananya",
      name: "Ananya (Dept)",
      initials: "AC",
      avatarBg: "linear-gradient(135deg, #a855f7, #6d28d9)",
      time: "7:20 PM",
      preview: "Tender #404 is rigged — Bypass corridor.",
      unread: taskNum === 4,
      visible: ananyaUnlocked,
    },
    {
      id: "gatebot",
      name: "Salt Lake GateBot",
      initials: "GB",
      avatarBg: "linear-gradient(135deg, #f59e0b, #b45309)",
      time: "8:13 PM",
      preview: `White SUV WB-06-${seed.plateNum} sped out…`,
      unread: false,
      visible: gatebotUnlocked,
    },
    {
      id: "dispatch",
      name: "Lalbazar Dispatch",
      initials: "KP",
      avatarBg: "linear-gradient(135deg, #ef4444, #991b1b)",
      time: "8:15 PM",
      preview: `${forwardedLogs.length} evidence forwarded`,
      unread: false,
      visible: true,
    },
    {
      id: "baba",
      name: "Baba ❤️",
      initials: "SS",
      avatarBg: "linear-gradient(135deg, #10b981, #047857)",
      time: "6:41 PM",
      preview: "Always on, Baba. Warming up dal…",
      unread: false,
      visible: true,
    },
  ].filter(
    (t) =>
      t.visible &&
      (!search.trim() ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.preview.toLowerCase().includes(search.toLowerCase()))
  );

  const activeThread = threads.find((t) => t.id === chatId) || threads[0];

  function sendLocalMsg(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    sfx.tap();
    setLocalReplies((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), { time: "8:15 PM", text: draft.trim() }],
    }));
    setDraft("");
  }

  return (
    <div className={m.splitApp}>
      <aside className={m.msgSidebar}>
        <div className={m.sidebarSearchWrap}>
          <input
            className={m.macSearch}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={m.threadList}>
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${m.threadRow} ${activeThread?.id === t.id ? m.threadRowOn : ""}`}
              onClick={() => {
                sfx.tabSwitch();
                setChatId(t.id);
              }}
            >
              <span className={m.threadUnreadSlot}>
                {t.unread && <span className={m.unreadBlueDot} />}
              </span>
              <span className={m.avatarCircle} style={{ background: t.avatarBg }}>
                {t.initials}
              </span>
              <div className={m.threadMeta}>
                <div className={m.threadTop}>
                  <b>{t.name}</b>
                  <span>{t.time}</span>
                </div>
                <div className={m.threadPreview}>{t.preview}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className={m.msgPane}>
        <div className={m.msgHeader}>
          <span className={m.msgToLabel}>To:</span>
          <b>{activeThread?.name}</b>
          <span className={m.msgHeaderSub}>
            {activeThread?.id === "rohan"
              ? `${ROHAN_NUMBER} · Last seen 7:51 PM`
              : activeThread?.id === "ananya"
                ? "Urban Dev. Dept · Last seen 7:20 PM"
                : activeThread?.id === "gatebot"
                  ? "Automated CK Block Cam · 8:13 PM"
                  : activeThread?.id === "dispatch"
                    ? "Lalbazar Cyber Cell · Encrypted"
                    : "Inspector Subir Sen"}
          </span>
        </div>

        <div className={m.msgScroll}>
          {activeThread?.id === "dispatch" ? (
            <>
              <div className={m.msgDayStamp}>Today 8:15 PM</div>
              <div className={`${m.imBubble} ${m.imThem}`}>
                <p>
                  🚨 Remote wipe detected on Riya&apos;s MacBook. Forward key messages from PingMe
                  threads directly to this dispatch channel.
                </p>
              </div>
              {forwardedLogs.map((fwd) => (
                <div key={fwd.id} className={`${m.imBubble} ${m.imMe}`}>
                  <div className={m.imQuote}>↪ Forwarded from {fwd.from}</div>
                  <p>{fwd.text}</p>
                  <span className={m.imTime}>Delivered to Lalbazar</span>
                </div>
              ))}
            </>
          ) : activeThread?.id === "gatebot" ? (
            <>
              <div className={m.msgDayStamp}>Today 8:13 PM</div>
              <div className={`${m.imBubble} ${m.imThem}`}>
                <p>
                  ⚠️ <b>CK BLOCK BACK LANE CAM:</b> Unregistered White SUV{" "}
                  <b>WB-06-{seed.plateNum}</b> sped out of Salt Lake CK Block at 8:13 PM.
                </p>
                <span className={m.imTime}>8:13 PM · Automated Security Alert</span>
              </div>
            </>
          ) : (
            (() => {
              const list =
                activeThread?.id === "ananya"
                  ? ananyaChatMsgs
                  : activeThread?.id === "baba"
                    ? babaChatMsgs
                    : rohanChatMsgs;
              return (
                <>
                  <div className={m.msgDayStamp}>Today</div>
                  {list.map((msg, idx) => {
                    const alreadyPassed = msg.targetTask && passedTasks.includes(msg.targetTask);
                    return (
                      <div
                        key={idx}
                        className={`${m.imRow} ${msg.from === "me" ? m.imRowMe : m.imRowThem}`}
                      >
                        <div
                          className={`${m.imBubble} ${msg.from === "me" ? m.imMe : m.imThem} ${
                            alreadyPassed ? m.imBubbleSaved : ""
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div className={m.imFoot}>
                            <span className={m.imTime}>{msg.time}</span>
                            {alreadyPassed ? (
                              <span className={m.imSavedPill}>✓ Forwarded to Lalbazar</span>
                            ) : (
                              <button
                                type="button"
                                className={m.imForwardBtn}
                                disabled={!playing}
                                onClick={() =>
                                  onForwardMessage(msg.fromLabel, msg.text, msg.targetTask)
                                }
                              >
                                ↪ Forward to Lalbazar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {(localReplies[activeThread?.id] || []).map((lr, i) => (
                    <div key={`lr-${i}`} className={`${m.imRow} ${m.imRowMe}`}>
                      <div className={`${m.imBubble} ${m.imMe}`}>
                        <p>{lr.text}</p>
                        <span className={m.imTime}>{lr.time} · Delivered</span>
                      </div>
                    </div>
                  ))}
                </>
              );
            })()
          )}
        </div>

        <form className={m.msgCompose} onSubmit={sendLocalMsg}>
          <input
            className={m.msgComposeInput}
            placeholder="PingMe Message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className={m.msgSendBtn} aria-label="Send message">
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. FACETIME / CALL LOGS (Task 2)
   ═══════════════════════════════════════════════════════════════ */
export function MacFaceTimeCallsApp({ taskNum, playing, onPassTask, onFailTask }) {
  const [filter, setFilter] = useState("all");
  const calls = [
    {
      id: "baba",
      who: "Baba (Inspector Sen)",
      initials: "SS",
      bg: "linear-gradient(135deg, #10b981, #047857)",
      num: "Home Landline",
      time: "8:14 PM",
      type: "Missed · 0s",
      missed: true,
      tone: "cyan",
      isTarget: false,
    },
    {
      id: "rohan",
      who: "Rohan Chatterjee",
      initials: "RC",
      bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      num: ROHAN_NUMBER,
      time: "7:51 PM",
      type: "Incoming · 1m 14s",
      missed: false,
      tone: "amber",
      isTarget: false,
    },
    {
      id: "burner",
      who: "Unknown Burner",
      initials: "?",
      bg: "linear-gradient(135deg, #ef4444, #991b1b)",
      num: "+91 70440-81924",
      time: "7:44 PM",
      type: "Declined · Burner SIM",
      missed: true,
      tone: "red",
      isTarget: true,
    },
    {
      id: "ananya",
      who: "Ananya (Dept)",
      initials: "AC",
      bg: "linear-gradient(135deg, #a855f7, #6d28d9)",
      num: "Ext. 404",
      time: "7:08 PM",
      type: "Outgoing · 4m 02s",
      missed: false,
      tone: "cyan",
      isTarget: false,
    },
  ];

  const visible = filter === "missed" ? calls.filter((c) => c.missed) : calls;

  function handleFlag(call) {
    if (!playing) return;
    if (taskNum === 2 && call.isTarget) {
      sfx.forward();
      onPassTask("Unknown Burner (+91 70440-81924) flagged for Lalbazar tower trace!");
    } else if (taskNum === 2) {
      onFailTask(
        "wrong",
        `Flagged ${call.who} instead of the Unknown Burner (+91 70440-81924)!`
      );
    } else {
      onFailTask(
        "wrong",
        `Wrong action in FaceTime / Call Logs — follow your active Task ${taskNum} Lead!`
      );
    }
  }

  return (
    <div className={m.splitApp}>
      <aside className={m.appSidebar} style={{ width: 200 }}>
        <div className={m.segmentedWrap} style={{ marginBottom: 12 }}>
          {[
            ["all", "All"],
            ["missed", "Missed"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`${m.segBtn} ${filter === id ? m.segBtnOn : ""}`}
              onClick={() => {
                sfx.tabSwitch();
                setFilter(id);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={m.sideSection}>SYNCED FROM IPHONE</div>
        <div className={m.sideRowMuted}>Riya&apos;s iPhone 15 · Continuity</div>
        <div className={m.sideRowMuted} style={{ marginTop: 6 }}>
          Tower Trace: Lalbazar Cyber Cell Ready
        </div>
      </aside>

      <div className={m.contentPad}>
        <div className={m.paneHeader}>
          <h3>Recent Calls</h3>
          <span className={m.paneSub}>Today · Friday, 20 Nov 2026</span>
        </div>

        <div className={m.macList}>
          {visible.map((c) => (
            <div key={c.id} className={m.callRow}>
              <div className={m.callLeft}>
                <span className={m.avatarCircle} style={{ background: c.bg }}>
                  {c.initials}
                </span>
                <div>
                  <div className={m.callName}>{c.who}</div>
                  <div className={m.callMeta}>
                    {c.num} · {c.time}
                  </div>
                </div>
              </div>
              <div className={m.callRight}>
                <span className={`${m.macPill} ${m[`pill_${c.tone}`]}`}>{c.type}</span>
                <button
                  type="button"
                  className={m.macBtnPrimary}
                  disabled={!playing}
                  onClick={() => handleFlag(c)}
                >
                  🚩 Flag Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. PHOTOS (macOS Photos Clone with Real Images — Task 3)
   ═══════════════════════════════════════════════════════════════ */
export function MacPhotosApp({ initialPhotoIdx = 1, taskNum, playing, onPassTask, onFailTask }) {
  // Default to index 1 (IMG_1998.jpg) so player actively inspects & selects IMG_2014.jpg
  const [selected, setSelected] = useState(initialPhotoIdx);
  const [album, setAlbum] = useState("all");

  const photos = [
    {
      name: "IMG_2014.jpg",
      src: "/photos/img-2014-suv.jpg",
      time: "Today · 7:48 PM",
      place: "Salt Lake CK Block · Back Gate",
      camera: "iPhone 15 · 26mm f/1.6 · ISO 2500",
      album: "saltlake",
      caption:
        "Streetlights broken along the back lane. A White SUV was idling right near the corner turn.",
      isTarget: true,
    },
    {
      name: "IMG_1998.jpg",
      src: "/photos/img-1998-dossier.jpg",
      time: "Today · 6:30 PM",
      place: "Urban Dev. Dept · 4th Floor",
      camera: "iPhone 15 · 26mm f/1.6 · ISO 400",
      album: "office",
      caption:
        "Snap of Tender #404 desk cover before uploading into BangoVault. Margin scribbled: 'Check Bypass firms'.",
      isTarget: false,
    },
    {
      name: "IMG_1982.jpg",
      src: "/photos/img-1982-teastall.jpg",
      time: "Yesterday · 8:10 PM",
      place: "Karunamoyee Bus Depot",
      camera: "iPhone 15 · 26mm f/1.6 · ISO 800",
      album: "saltlake",
      caption:
        "Riya & Rohan at the evening tea stall. Nothing unusual in the street background.",
      isTarget: false,
    },
    {
      name: "IMG_1965.jpg",
      src: "/photos/img-1965-victoria.jpg",
      time: "Sun 15 Nov · 5:42 PM",
      place: "Victoria Memorial · Maidan",
      camera: "iPhone 15 · 26mm f/1.6 · ISO 125",
      album: "favorites",
      caption: "Sunday golden hour walk with Baba around the south lawn pond.",
      isTarget: false,
    },
  ];

  const visiblePhotos =
    album === "all" ? photos : photos.filter((p) => p.album === album);
  const cur = photos[selected] || photos[0];

  function handleTag() {
    if (!playing) return;
    if (taskNum === 3 && cur.isTarget) {
      sfx.forward();
      onPassTask("White SUV sighting photo (IMG_2014.jpg) tagged as evidence!");
    } else if (taskNum === 3) {
      onFailTask(
        "wrong",
        `Wrong photo tagged (${cur.name}) — IMG_2014.jpg captured the White SUV at CK Block Back Gate!`
      );
    } else {
      onFailTask(
        "wrong",
        `Wrong action in Photos — follow your active Task ${taskNum} Lead!`
      );
    }
  }

  return (
    <div className={m.splitApp}>
      <aside className={m.appSidebar} style={{ width: 165 }}>
        <div className={m.sideSection}>PHOTOS</div>
        {[
          ["all", "🖼️ Library", photos.length],
          ["favorites", "❤️ Favorites", 1],
          ["saltlake", "📍 Salt Lake", 2],
          ["office", "🏢 Office", 1],
        ].map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            className={`${m.sideRow} ${album === id ? m.sideRowOn : ""}`}
            onClick={() => {
              sfx.tabSwitch();
              setAlbum(id);
            }}
          >
            <span>{label}</span>
            <span className={m.sideCount}>{count}</span>
          </button>
        ))}
      </aside>

      <div className={m.photosWorkspace}>
        <div className={m.photoThumbRow}>
          {visiblePhotos.map((p) => {
            const realIdx = photos.findIndex((x) => x.name === p.name);
            return (
              <button
                key={p.name}
                type="button"
                className={`${m.photoThumbCard} ${selected === realIdx ? m.photoThumbOn : ""}`}
                onClick={() => {
                  sfx.tabSwitch();
                  setSelected(realIdx);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.name} className={m.photoThumbImg} />
                <div className={m.photoThumbMeta}>
                  <b>{p.name}</b>
                  <small>{p.time}</small>
                </div>
              </button>
            );
          })}
        </div>

        <div className={m.photoInspector}>
          <div className={m.photoPreviewStage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cur.src} alt={cur.name} className={m.photoLargeImg} />
          </div>
          <div className={m.photoExifCol}>
            <div className={m.exifTitleRow}>
              <strong>{cur.name}</strong>
              <span>{cur.time}</span>
            </div>
            <div className={m.exifChip}>📍 {cur.place}</div>
            <div className={m.exifCamera}>{cur.camera}</div>
            <p className={m.exifCaption}>{cur.caption}</p>
            <button
              type="button"
              className={m.macBtnPrimary}
              style={{ marginTop: "auto", width: "100%", justifyContent: "center" }}
              disabled={!playing}
              onClick={handleTag}
            >
              🏷️ Tag {cur.name} as SUV Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. SAFARI (macOS Safari Browser — Task 5)
   ═══════════════════════════════════════════════════════════════ */
export function MacSafariApp({ seed, taskNum, playing, onPassTask, onFailTask }) {
  const [tab, setTab] = useState("gazette");
  const [showStartTab, setShowStartTab] = useState(false);

  const tabMeta = {
    gazette: {
      title: "Kolkata Gazette",
      url: "https://kolkatagazette.in/sector-v-tender-404",
      host: "kolkatagazette.in",
    },
    rto: {
      title: "WB Plate Lookup",
      url: `https://vahan.wb.gov.in/lookup?plate=WB-06-${seed.plateNum}`,
      host: "vahan.wb.gov.in",
    },
    locket: {
      title: "LocketLink Cloud",
      url: "https://locketlink.in/device/riya-sen",
      host: "locketlink.in",
    },
    start: {
      title: "Start Page",
      url: "favorites://",
      host: "Search or enter website name",
    },
  };

  function handleVerify(which) {
    if (!playing) return;
    if (taskNum === 5 && which === "rto") {
      sfx.forward();
      onPassTask(
        `White SUV WB-06-${seed.plateNum} verified as East-Bypass Infra shell vehicle!`
      );
    } else if (taskNum === 5) {
      onFailTask(
        "wrong",
        `Wrong browser tab verified — open WB Plate Lookup to verify WB-06-${seed.plateNum}!`
      );
    } else {
      onFailTask(
        "wrong",
        `Wrong action in Safari — follow your active Task ${taskNum} Lead!`
      );
    }
  }

  const tabs = [
    ["gazette", "📰 Kolkata Gazette"],
    ["rto", "🚘 WB Plate Lookup"],
    ["locket", "📡 LocketLink Cloud"],
    ...(showStartTab ? [["start", "✦ Start Page"]] : []),
  ];

  const curMeta = tabMeta[tab] || tabMeta.gazette;

  return (
    <div className={m.safariWrap}>
      {/* Unified Safari Toolbar */}
      <div className={m.safariToolbar}>
        <div className={m.safariNavBtns}>
          <button
            type="button"
            className={m.safariToolBtn}
            onClick={() => {
              sfx.tabSwitch();
              setTab("gazette");
            }}
            aria-label="Back"
          >
            ‹
          </button>
          <button
            type="button"
            className={m.safariToolBtn}
            onClick={() => {
              sfx.tabSwitch();
              setTab("rto");
            }}
            aria-label="Forward"
          >
            ›
          </button>
        </div>

        <div className={m.safariUrlPill}>
          <span className={m.safariLock}>🔒</span>
          <span>{curMeta.host}</span>
        </div>

        <button
          type="button"
          className={m.safariToolBtn}
          title="New Tab"
          onClick={() => {
            sfx.tap();
            setShowStartTab(true);
            setTab("start");
          }}
        >
          ＋
        </button>
      </div>

      {/* Safari Tab Bar */}
      <div className={m.safariTabStrip}>
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`${m.safariTab} ${tab === id ? m.safariTabOn : ""}`}
            onClick={() => {
              sfx.tabSwitch();
              setTab(id);
            }}
          >
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Page Viewport */}
      <div className={m.safariViewport}>
        {tab === "gazette" && (
          <article className={m.webSheet}>
            <div className={m.webBar}>
              <span className={m.webMasthead}>THE KOLKATA GAZETTE</span>
              <span>{curMeta.url}</span>
            </div>
            <h2>₹80 Cr Sector V Urban Corridor Audit Leaks Inside Dept</h2>
            <p className={m.webByline}>By Bidhannagar Desk · Updated Nov 20, 2026 · 6:55 PM IST</p>
            <p>
              Whistleblowers inside the West Bengal Urban Development Department flagged a shell
              contractor operating along the <b>EM Bypass — Salt Lake — Sector V</b> corridor under
              Tender #404. Auditors say funds were routed via commercial fleet leases.
            </p>
            <button
              type="button"
              className={m.webBtn}
              disabled={!playing}
              onClick={() => handleVerify("gazette")}
            >
              Flag News Article as Registration
            </button>
          </article>
        )}

        {tab === "rto" && (
          <article className={m.webSheet}>
            <div className={m.webBar}>
              <span className={m.webMasthead} style={{ color: "#1d4ed8" }}>
                GOVT. OF WEST BENGAL · VAHAN RTO LOOKUP
              </span>
              <span>{curMeta.url}</span>
            </div>
            <h2>West Bengal Motor Vehicles Registry</h2>
            <div className={m.rtoTable}>
              <div>
                <span>Registration No.</span>
                <b>WB-06-{seed.plateNum}</b>
              </div>
              <div>
                <span>Vehicle Class</span>
                <b>White SUV (Commercial Fleet · Temp Permit)</b>
              </div>
              <div>
                <span>Registered Lessee</span>
                <b style={{ color: "#b91c1c" }}>East-Bypass Infra Holdings (Shell Entity)</b>
              </div>
              <div>
                <span>Jurisdiction</span>
                <b>Salt Lake / Bidhannagar RTO (WB-06)</b>
              </div>
            </div>
            <button
              type="button"
              className={m.webBtn}
              disabled={!playing}
              onClick={() => handleVerify("rto")}
            >
              ✅ Verify SUV WB-06-{seed.plateNum} &amp; Flag Shell Firm
            </button>
          </article>
        )}

        {tab === "locket" && (
          <article className={m.webSheet}>
            <div className={m.webBar}>
              <span className={m.webMasthead} style={{ color: "#0f766e" }}>
                LOCKETLINK SAFETY CLOUD
              </span>
              <span>{curMeta.url}</span>
            </div>
            <h2>LocketLink Safety Pendant — LIVE TELEMETRY</h2>
            <p>
              Paired Owner: <b>Riya Sen</b> · Status: <b style={{ color: "#dc2626" }}>MOVING</b>
            </p>
            <p>
              eSIM active across Salt Lake / Bidhannagar cell towers near{" "}
              <b>{ZONES[seed.blockedNeighbor]?.name || "Salt Lake"}</b>. Open <b>CholoMap</b> to
              view live pushpins.
            </p>
            <button
              type="button"
              className={m.webBtn}
              disabled={!playing}
              onClick={() => handleVerify("locket")}
            >
              Flag Pendant Page as Registration
            </button>
          </article>
        )}

        {tab === "start" && (
          <div className={m.safariStartPage}>
            <h3>Favorites</h3>
            <div className={m.safariFavGrid}>
              {[
                ["📰", "Kolkata Gazette", "gazette"],
                ["🚘", "WB Vahan RTO", "rto"],
                ["📡", "LocketLink", "locket"],
              ].map(([ic, label, target]) => (
                <button
                  key={target}
                  type="button"
                  className={m.safariFavCard}
                  onClick={() => {
                    sfx.tabSwitch();
                    setTab(target);
                  }}
                >
                  <span>{ic}</span>
                  <b>{label}</b>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. FINDER (macOS Finder Clone — Task 6 + Trash)
   ═══════════════════════════════════════════════════════════════ */
export function MacFinderApp({
  initialFolder = "Recents",
  taskNum,
  playing,
  onPassTask,
  onFailTask,
}) {
  const [folder, setFolder] = useState(initialFolder);
  const [selectedName, setSelectedName] = useState("README_FOR_BABA.txt");
  const [trashEmptied, setTrashEmptied] = useState(false);

  const allFiles = [
    {
      name: "README_FOR_BABA.txt",
      folder: "Desktop",
      kind: "Plain Text Document",
      size: "214 bytes",
      modified: "Today, 7:45 PM",
      icon: "📄",
      isTarget: false,
      body: "Baba, if anything looks off tonight:\nCheck my PingMe messages, Safari plate lookup, and Tender #404 audit inside Downloads & BangoVault.",
    },
    {
      name: "tender_404_summary.txt",
      folder: "Downloads",
      kind: "Plain Text Document",
      size: "1.4 KB",
      modified: "Today, 7:16 PM",
      icon: "🔒",
      isTarget: true,
      body: `CONFIDENTIAL AUDIT BRIEF\nProject: Sector V Urban Corridor\nSuspected Shell: East-Bypass Infra Holdings\nFull encrypted Contractor ID (${CONTRACTOR_ID}) is sealed inside BangoVault.`,
    },
    {
      name: "locket_zones_cheat.txt",
      folder: "Documents",
      kind: "Plain Text Document",
      size: "412 bytes",
      modified: "Yesterday, 9:20 PM",
      icon: "📝",
      isTarget: false,
      body: "East Kolkata corridors:\nSalt Lake · Ultadanga · Kestopur · Karunamoyee · Sector V · Chingrighata.",
    },
    {
      name: "SectorV_Budget_Q3.csv",
      folder: "Documents",
      kind: "CSV Spreadsheet",
      size: "48 KB",
      modified: "18 Nov 2026",
      icon: "📊",
      isTarget: false,
      body: "LineItem,Vendor,Amount_INR\nPhase1_Drainage,East-Bypass Infra,320000000\nPhase2_Lighting,East-Bypass Infra,480000000\nSTATUS: FLAGGED FOR AUDIT",
    },
    {
      name: "old_cloud_invite.ics",
      folder: "Trash",
      kind: "Calendar Invite",
      size: "820 bytes",
      modified: "14 Nov 2026",
      icon: "🗑️",
      isTarget: false,
      body: "Organizer: Rohan Chatterjee\nSubject: Link Cloud Backup for Safety\nNote: Accepted on 14 Nov 2026.",
    },
  ];

  const filtered = allFiles.filter((fl) => {
    if (folder === "Trash") return !trashEmptied && fl.folder === "Trash";
    if (folder === "Recents") return fl.folder !== "Trash";
    return fl.folder === folder;
  });

  const cur = filtered.find((f) => f.name === selectedName) || filtered[0] || null;

  function handleQuarantine() {
    if (!playing || !cur) return;
    if (taskNum === 6 && cur.isTarget) {
      sfx.forward();
      onPassTask("tender_404_summary.txt quarantined safely from cloud sync wipe!");
    } else if (taskNum === 6) {
      onFailTask("wrong", `Quarantined ${cur.name} instead of tender_404_summary.txt!`);
    } else {
      onFailTask(
        "wrong",
        `Wrong action in Finder — follow your active Task ${taskNum} Lead!`
      );
    }
  }

  return (
    <div className={m.splitApp}>
      <aside className={m.appSidebar} style={{ width: 175 }}>
        <div className={m.sideSection}>FAVORITES</div>
        {[
          ["Recents", "🕒 Recents"],
          ["Desktop", "🖥️ Desktop"],
          ["Documents", "📁 Documents"],
          ["Downloads", "⬇️ Downloads"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`${m.sideRow} ${folder === id ? m.sideRowOn : ""}`}
            onClick={() => {
              sfx.tabSwitch();
              setFolder(id);
            }}
          >
            <span>{label}</span>
          </button>
        ))}

        <div className={m.sideSection} style={{ marginTop: 14 }}>
          LOCATIONS
        </div>
        <button
          type="button"
          className={`${m.sideRow} ${folder === "Trash" ? m.sideRowOn : ""}`}
          onClick={() => {
            sfx.tabSwitch();
            setFolder("Trash");
          }}
        >
          <span>🗑️ Trash</span>
        </button>
      </aside>

      <div className={m.finderMain}>
        <div className={m.finderTopBar}>
          <div className={m.finderTitle}>{folder}</div>
          {folder === "Trash" && !trashEmptied && (
            <button
              type="button"
              className={m.macBtnSecondary}
              onClick={() => {
                sfx.appClose();
                setTrashEmptied(true);
              }}
            >
              Empty Trash
            </button>
          )}
        </div>

        <div className={m.finderBody}>
          <div className={m.finderList}>
            {filtered.length === 0 ? (
              <div className={m.calEmpty} style={{ padding: 18 }}>
                Folder is empty.
              </div>
            ) : (
              filtered.map((fl) => (
                <button
                  key={fl.name}
                  type="button"
                  className={`${m.finderRow} ${cur?.name === fl.name ? m.finderRowOn : ""}`}
                  onClick={() => {
                    sfx.tabSwitch();
                    setSelectedName(fl.name);
                  }}
                >
                  <span style={{ fontSize: 16 }}>{fl.icon}</span>
                  <div className={m.finderRowMeta}>
                    <b>{fl.name}</b>
                    <small>
                      {fl.folder} · {fl.size}
                    </small>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className={m.finderPreview}>
            {cur ? (
              <>
                <div className={m.finderPrevHead}>
                  <span style={{ fontSize: 28 }}>{cur.icon}</span>
                  <div>
                    <strong>{cur.name}</strong>
                    <small>
                      {cur.kind} · {cur.size} · {cur.modified}
                    </small>
                  </div>
                </div>
                <pre className={m.finderPre}>{cur.body}</pre>
                {folder !== "Trash" && (
                  <div style={{ marginTop: "auto", paddingTop: 12 }}>
                    <button
                      type="button"
                      className={m.macBtnPrimary}
                      disabled={!playing}
                      onClick={handleQuarantine}
                    >
                      🛡️ Quarantine {cur.name}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={m.calEmpty}>Select a file to preview</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. NOTES / QUICKNOTES (macOS Notes Clone — Task 7)
   ═══════════════════════════════════════════════════════════════ */
export function MacNotesApp({ seed, pinRecovered, playing, onPickPin }) {
  const [userNotes, setUserNotes] = useState([]);
  const [selectedId, setSelectedId] = useState("pin");

  const fixedNotes = [
    {
      id: "pin",
      title: "BangoVault Backup PIN",
      time: "7:19 PM",
      preview: `Backup PIN: ${seed.vaultPin} (Do not share)`,
    },
    {
      id: "tonight",
      title: "Tonight",
      time: "6:50 PM",
      preview: "Remind Baba about BP meds. Warm up dal before 9 PM.",
    },
    {
      id: "weird",
      title: "Weird (Last Week)",
      time: "14 Nov",
      preview: `Linked my cloud backup to R's phone (${ROHAN_NUMBER})…`,
    },
  ];

  const allNotes = [...fixedNotes, ...userNotes];

  function addNewNote() {
    sfx.tap();
    const id = `note_${Date.now()}`;
    setUserNotes((prev) => [
      ...prev,
      { id, title: "Untitled Note", time: "Just now", body: "" },
    ]);
    setSelectedId(id);
  }

  const activeUserNote = userNotes.find((n) => n.id === selectedId);

  return (
    <div className={m.splitApp}>
      <aside className={m.notesSidebar}>
        <div className={m.notesSideHead}>
          <span>All iCloud ({allNotes.length})</span>
          <button
            type="button"
            className={m.notesNewBtn}
            title="New Note"
            onClick={addNewNote}
          >
            ✎
          </button>
        </div>
        <div className={m.notesListCol}>
          {allNotes.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`${m.noteListRow} ${selectedId === n.id ? m.noteListRowOn : ""}`}
              onClick={() => {
                sfx.tabSwitch();
                setSelectedId(n.id);
              }}
            >
              <b>{n.title || "Untitled Note"}</b>
              <div className={m.noteListSub}>
                <span>{n.time}</span>
                <span>{n.preview || n.body?.slice(0, 32) || "No additional text"}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className={m.notesEditor}>
        {selectedId === "pin" && (
          <div className={m.noteArticle}>
            <div className={m.noteDateStamp}>20 November 2026 at 7:19 PM</div>
            <h2>BangoVault Backup PIN</h2>
            <div className={m.notePinHero}>{seed.vaultPin}</div>
            <p className={m.noteSubCopy}>
              Click the matching 4-digit PIN below to copy it to your Case Clipboard:
            </p>
            {pinRecovered ? (
              <div className={m.noteSuccessBanner}>
                ✅ PIN {seed.vaultPin} RECOVERED &amp; SAVED TO MENU BAR
              </div>
            ) : (
              <div className={m.notePinChoices}>
                {seed.pinChoices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    className={m.notePinBtn}
                    disabled={!playing}
                    onClick={() => onPickPin(choice)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedId === "tonight" && (
          <div className={m.noteArticle}>
            <div className={m.noteDateStamp}>20 November 2026 at 6:50 PM</div>
            <h2>Tonight</h2>
            <p>Remind Baba about BP meds. Warm up dal before 9 PM.</p>
            <p>Show him the Tender #404 audit folder from BangoVault right after dinner.</p>
          </div>
        )}

        {selectedId === "weird" && (
          <div className={m.noteArticle}>
            <div className={m.noteDateStamp}>14 November 2026 at 11:18 AM</div>
            <h2>Weird (Last Week)</h2>
            <p>
              Linked my cloud backup to R&apos;s phone (<b>{ROHAN_NUMBER}</b>) &ldquo;for
              safety&rdquo;?? Must revoke it in <b>System Settings</b> right away.
            </p>
          </div>
        )}

        {activeUserNote && (
          <div className={m.noteArticle} style={{ height: "100%" }}>
            <div className={m.noteDateStamp}>20 November 2026 at 8:15 PM</div>
            <input
              className={m.noteTitleInput}
              value={activeUserNote.title}
              onChange={(e) =>
                setUserNotes((prev) =>
                  prev.map((x) =>
                    x.id === activeUserNote.id ? { ...x, title: e.target.value } : x
                  )
                )
              }
              placeholder="Note title..."
            />
            <textarea
              className={m.noteBodyInput}
              value={activeUserNote.body}
              onChange={(e) =>
                setUserNotes((prev) =>
                  prev.map((x) =>
                    x.id === activeUserNote.id ? { ...x, body: e.target.value } : x
                  )
                )
              }
              placeholder="Start typing..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. SYSTEM SETTINGS (macOS Sequoia Settings — Task 8 + Real Controls)
   ═══════════════════════════════════════════════════════════════ */
export function MacSettingsApp({
  taskNum,
  playing,
  onPassTask,
  onFailTask,
  wallpaperId,
  onSelectWallpaper,
  brightness,
  onChangeBrightness,
  muted,
  onToggleMute,
}) {
  const [section, setSection] = useState("security");

  function handleSystemAction(kind) {
    if (!playing) return;
    if (taskNum === 8 && kind === "revoke_rohan") {
      sfx.revoke();
      onPassTask(
        "★ MILESTONE 1/3: Rohan's remote cloud access REVOKED — fraud evidence saved from remote delete!"
      );
    } else if (kind === "airplane") {
      onFailTask(
        "wrong",
        "Airplane Mode does NOT stop the local Dept wipe — you had to REVOKE Rohan's linked device!"
      );
    } else if (kind === "locket") {
      onFailTask(
        "wrong",
        "Unlinking LocketLink killed Riya's GPS signal — you had to REVOKE Rohan's linked device!"
      );
    } else {
      onFailTask(
        "wrong",
        `Not ready for System Revoke yet — complete Task ${taskNum} first!`
      );
    }
  }

  return (
    <div className={m.splitApp}>
      <aside className={m.appSidebar} style={{ width: 215 }}>
        <div className={m.appleIdCard}>
          <span className={m.appleIdAvatar}>RS</span>
          <div>
            <b>Riya Sen</b>
            <small>Apple Account</small>
          </div>
        </div>

        {[
          ["security", "🛡️", "#EF4444", "Security & Wipe"],
          ["wifi", "📶", "#0A84FF", "Wi-Fi"],
          ["wallpaper", "🖼️", "#30D158", "Wallpaper"],
          ["displays", "☀️", "#64D2FF", "Displays & Sound"],
          ["about", "💻", "#8E8E93", "About This Mac"],
        ].map(([id, ic, bg, label]) => (
          <button
            key={id}
            type="button"
            className={`${m.sideRow} ${section === id ? m.sideRowOn : ""}`}
            onClick={() => {
              sfx.tabSwitch();
              setSection(id);
            }}
          >
            <span className={m.setMiniIcon} style={{ background: bg }}>
              {ic}
            </span>
            <span>{label}</span>
          </button>
        ))}
      </aside>

      <div className={m.contentPad}>
        {section === "security" && (
          <>
            <div className={m.paneHeader}>
              <h3>Security &amp; Linked Cloud Devices</h3>
              <span className={m.paneSub}>Dept Managed MacBook Air · Stop the Remote Delete</span>
            </div>

            <div className={m.settingsGroup}>
              <div className={m.setRow}>
                <div>
                  <b>Remote Factory Reset Daemon</b>
                  <small>Local Dept countdown active — Airplane Mode will NOT halt local trigger</small>
                </div>
                <button
                  type="button"
                  className={m.macBtnWarn}
                  disabled={!playing}
                  onClick={() => handleSystemAction("airplane")}
                >
                  ✈️ Enable Airplane Mode
                </button>
              </div>

              <div
                className={m.setRow}
                style={
                  taskNum === 8
                    ? { background: "rgba(239, 68, 68, 0.14)", borderColor: "rgba(248, 113, 113, 0.5)" }
                    : undefined
                }
              >
                <div>
                  <b>Linked Cloud Device · R&apos;s Phone ({ROHAN_NUMBER})</b>
                  <small>ACTIVE REMOTE WIPE SOURCE — Holds Admin Delete Token (…44102)</small>
                </div>
                <button
                  type="button"
                  className={m.macBtnDanger}
                  disabled={!playing}
                  onClick={() => handleSystemAction("revoke_rohan")}
                >
                  🛑 REVOKE ACCESS
                </button>
              </div>

              <div className={m.setRow}>
                <div>
                  <b>LocketLink Safety Pendant (Riya Sen)</b>
                  <small>Provides live Kolkata GPS coordinates for PCR rescue</small>
                </div>
                <button
                  type="button"
                  className={m.macBtnSecondary}
                  disabled={!playing}
                  onClick={() => handleSystemAction("locket")}
                >
                  🔌 Unlink LocketLink
                </button>
              </div>
            </div>
          </>
        )}

        {section === "wallpaper" && (
          <>
            <div className={m.paneHeader}>
              <h3>Wallpaper</h3>
              <span className={m.paneSub}>Change Riya&apos;s MacBook desktop background live</span>
            </div>
            <div className={m.wallGrid}>
              {WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  type="button"
                  className={`${m.wallCard} ${wallpaperId === wp.id ? m.wallCardOn : ""}`}
                  onClick={() => {
                    sfx.tap();
                    onSelectWallpaper(wp.id);
                  }}
                >
                  <span className={m.wallThumb} style={{ background: wp.thumb }} />
                  <span>{wp.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {section === "wifi" && (
          <>
            <div className={m.paneHeader}>
              <h3>Wi-Fi</h3>
              <span className={m.paneSub}>Stay online to keep LocketLink &amp; Lalbazar synced</span>
            </div>
            <div className={m.settingsGroup}>
              <div className={m.setRow}>
                <div>
                  <b>Sen_Home_5G</b>
                  <small style={{ color: "#30D158" }}>● Connected · Salt Lake CK Block</small>
                </div>
                <span className={m.macPill}>WPA3</span>
              </div>
              <div className={m.setRow}>
                <div>
                  <b>SaltLake_CK_Fiber</b>
                  <small>Secured network</small>
                </div>
                <span className={m.paneSub}>🔒</span>
              </div>
              <div className={m.setRow}>
                <div>
                  <b>WB_UrbanDev_VPN</b>
                  <small>Configured · Active</small>
                </div>
                <span className={m.paneSub}>🔒</span>
              </div>
            </div>
          </>
        )}

        {section === "displays" && (
          <>
            <div className={m.paneHeader}>
              <h3>Displays &amp; Sound</h3>
              <span className={m.paneSub}>Built-in Liquid Retina Display (2560 × 1664)</span>
            </div>
            <div className={m.settingsGroup}>
              <div className={m.setRow}>
                <div>
                  <b>Display Brightness</b>
                  <small>{Math.round(brightness * 100)}%</small>
                </div>
                <input
                  type="range"
                  min={0.45}
                  max={1.1}
                  step={0.05}
                  value={brightness}
                  onChange={(e) => onChangeBrightness(Number(e.target.value))}
                  style={{ width: 180, accentColor: "#0A84FF" }}
                />
              </div>
              <div className={m.setRow}>
                <div>
                  <b>System Sound Effects &amp; Score</b>
                  <small>{muted ? "Muted" : "Active — MacBook Air Speakers"}</small>
                </div>
                <button type="button" className={m.macBtnSecondary} onClick={onToggleMute}>
                  {muted ? "🔇 Unmute" : "🔊 Mute"}
                </button>
              </div>
            </div>
          </>
        )}

        {section === "about" && (
          <div className={m.aboutPane}>
            <div className={m.aboutLaptopGlyph}>💻</div>
            <h3>MacBook Air</h3>
            <p className={m.paneSub}>13-inch, M2, 2023</p>
            <div className={m.aboutSpecs}>
              <div>
                <span>Chip</span>
                <b>Apple M2</b>
              </div>
              <div>
                <span>Memory</span>
                <b>16 GB</b>
              </div>
              <div>
                <span>Owner</span>
                <b>Riya Sen (WB Urban Dev.)</b>
              </div>
              <div>
                <span>Serial Number</span>
                <b>C02RY404ML82</b>
              </div>
              <div>
                <span>macOS</span>
                <b>Sequoia 15.1</b>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. BANGOVAULT (Encrypted Govt Audit Vault — Task 9)
   ═══════════════════════════════════════════════════════════════ */
export function MacVaultApp({
  playing,
  isFocused,
  vaultUnlocked,
  passedTasks,
  onSubmitPin,
  onTransmit,
}) {
  const [pin, setPin] = useState("");
  const pinRef = useRef("");
  const submitRef = useRef(onSubmitPin);

  useEffect(() => {
    submitRef.current = onSubmitPin;
  }, [onSubmitPin]);

  function updatePin(next) {
    pinRef.current = next;
    setPin(next);
  }

  function submitDigit(d) {
    if (!playing) return;
    sfx.keyPress();
    const next = (pinRef.current + d).slice(0, 4);
    updatePin(next);
    if (next.length === 4) {
      setTimeout(() => {
        submitRef.current(next);
        updatePin("");
      }, 120);
    }
  }

  useEffect(() => {
    if (!playing || !isFocused || vaultUnlocked) return;
    function onKey(e) {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key >= "0" && e.key <= "9") {
        submitDigit(e.key);
      } else if (e.key === "Backspace") {
        sfx.tap();
        updatePin(pinRef.current.slice(0, -1));
      } else if (e.key === "Escape") {
        sfx.tap();
        updatePin("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, isFocused, vaultUnlocked]);

  if (!vaultUnlocked) {
    return (
      <div className={m.vaultCenter}>
        <div className={m.vaultHeader}>
          <span className={m.vaultShield}>🔐</span>
          <h3>BangoVault — Tender #404 Fraud Dossier</h3>
          <p>Enter 4-digit PIN (click or type on keyboard)</p>
        </div>

        <div className={m.vaultDots}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`${m.vaultSlot} ${pin[i] ? m.vaultSlotFilled : ""}`}>
              {pin[i] || ""}
            </span>
          ))}
        </div>

        <div className={m.vaultPad}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "⌫"].map((k) => (
            <button
              key={k}
              type="button"
              className={m.vaultKey}
              disabled={!playing}
              onClick={() => {
                if (k === "CLR") {
                  sfx.tap();
                  updatePin("");
                } else if (k === "⌫") {
                  sfx.tap();
                  updatePin(pinRef.current.slice(0, -1));
                } else {
                  submitDigit(k);
                }
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={m.vaultDossier}>
      <div className={m.vaultStamp}>GOVT OF WEST BENGAL — CONFIDENTIAL FRAUD AUDIT</div>
      <div className={m.dossierRows}>
        <div>
          <span>Project</span>
          <b>SECTOR V URBAN CORRIDOR // TENDER #404</b>
        </div>
        <div>
          <span>Flagged Shell Firm</span>
          <b>East-Bypass Infra Holdings (₹80 Cr Fraud)</b>
        </div>
        <div>
          <span>Encrypted Contractor ID</span>
          <b className={m.contractorHighlight}>{CONTRACTOR_ID}</b>
        </div>
      </div>

      {passedTasks.includes(9) ? (
        <div className={m.noteSuccessBanner}>
          ✅ MILESTONE 2/3 — FRAUD DOSSIER TRANSMITTED TO LALBAZAR POLICE. Close or switch to
          CholoMap in the Dock for Task 10!
        </div>
      ) : (
        <div className={m.vaultActions}>
          <button
            type="button"
            className={m.macBtnDanger}
            style={{ padding: "12px 16px", fontSize: 14.5, justifyContent: "center" }}
            disabled={!playing}
            onClick={() => onTransmit(true)}
          >
            📡 TRANSMIT ALL FRAUD INFO TO LALBAZAR POLICE
          </button>
          <button
            type="button"
            className={m.macBtnSecondary}
            style={{ justifyContent: "center" }}
            disabled={!playing}
            onClick={() => onTransmit(false)}
          >
            💾 Save Local Draft Only
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. CHOLOMAP (macOS Maps Clone — Task 10)
   ═══════════════════════════════════════════════════════════════ */
export function MacCholoMapApp({
  seed,
  taskNum,
  playing,
  mapGameState,
  selectedZone,
  onSelectZone,
  onDispatchRescue,
  onOpenDeskView,
}) {
  return (
    <div className={m.splitApp}>
      <aside className={m.mapSidebar}>
        <div className={m.mapSideHead}>
          <div className={m.sideSection}>KOLKATA SECTORS · LOCKETLINK</div>
          <span className={m.liveBadge}>● eSIM LIVE</span>
        </div>

        <div className={m.zoneList}>
          {ZONE_IDS.map((id) => {
            const z = ZONES[id];
            const isSel = selectedZone === id;
            const isLiveSuv = taskNum === 10 && id === seed.suvZone;
            const isCleared = mapGameState.clearedZones.includes(id);
            return (
              <button
                key={id}
                type="button"
                className={`${m.zoneItem} ${isSel ? m.zoneItemOn : ""}`}
                onClick={() => {
                  sfx.pinDrop();
                  onSelectZone(id);
                }}
              >
                <div>
                  <b>{z.name}</b>
                  <small>{z.sub}</small>
                </div>
                {isLiveSuv ? (
                  <span className={m.zoneSignalTag}>🎯 SUV LIVE</span>
                ) : isCleared ? (
                  <span className={m.zoneClearedTag}>CLEARED</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className={m.mapDispatchBox}>
          <div className={m.mapSelSummary}>
            <span>Selected Target</span>
            <b>
              {ZONES[selectedZone]?.name}
              {taskNum === 10 && selectedZone === seed.suvZone ? " · 🎯 SUV" : ""}
            </b>
          </div>

          <button
            type="button"
            className={m.macBtnDanger}
            style={{ width: "100%", padding: "10px 12px", justifyContent: "center" }}
            disabled={!playing}
            onClick={onDispatchRescue}
          >
            🚓 Dispatch PCR ({ZONES[selectedZone]?.name})
          </button>

          <button
            type="button"
            className={m.macBtnSecondary}
            style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
            onClick={onOpenDeskView}
          >
            📌 Open Detective Desk Pinboard
          </button>
        </div>
      </aside>

      <div className={m.mapCanvasWrap}>
        <MapBoard
          g={mapGameState}
          now={0}
          role="father"
          selected={selectedZone}
          onSelect={(z) => {
            sfx.pinDrop();
            onSelectZone(z);
          }}
        />
      </div>
    </div>
  );
}

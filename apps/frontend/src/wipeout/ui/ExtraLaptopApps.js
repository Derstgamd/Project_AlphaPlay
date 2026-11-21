"use client";

import { useState } from "react";
import { CONTRACTOR_ID, ROHAN_NUMBER, ZONES } from "../constants";
import { sfx } from "../sfx";
import f from "./FatherWorkspace.module.css";

export function GalleryApp({ taskNum, playing, onPassTask, onFailTask }) {
  // Default to index 1 (IMG_1998.jpg) so the player actively inspects & picks IMG_2014.jpg
  const [selected, setSelected] = useState(1);
  const photos = [
    {
      name: "IMG_2014.jpg",
      time: "Today · 7:48 PM",
      place: "Salt Lake CK Block · Back Gate",
      caption:
        "Streetlights broken along the back lane. A White SUV was idling right near the corner turn.",
      tint: "linear-gradient(135deg,#1e3a5f,#0b1120)",
      isTarget: true,
    },
    {
      name: "IMG_1998.jpg",
      time: "Today · 6:30 PM",
      place: "Urban Dev. Dept · 4th Floor",
      caption:
        "Snap of Tender #404 desk cover before uploading into BangoVault. Margin scribbled: 'Check Bypass firms'.",
      tint: "linear-gradient(135deg,#7c2d12,#1c1917)",
      isTarget: false,
    },
    {
      name: "IMG_1982.jpg",
      time: "Yesterday · 8:10 PM",
      place: "Karunamoyee Bus Depot",
      caption:
        "Riya & Rohan at the evening tea stall. Nothing unusual in the street background.",
      tint: "linear-gradient(135deg,#14532d,#090d14)",
      isTarget: false,
    },
  ];

  const cur = photos[selected];

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
        `Wrong action in Gallery — follow your active Task ${taskNum} Lead!`
      );
    }
  }

  return (
    <div className={f.extraWrap}>
      <div className={f.extraBanner}>
        <span>📸 Riya&apos;s Camera Roll · Inspect &amp; Tag Key Evidence</span>
      </div>
      <div className={f.photoStrip}>
        {photos.map((p, i) => (
          <button
            key={p.name}
            type="button"
            className={`${f.photoCardBtn} ${selected === i ? f.photoCardOn : ""}`}
            style={{ background: p.tint }}
            onClick={() => {
              sfx.tabSwitch();
              setSelected(i);
            }}
          >
            <b style={{ fontSize: 15 }}>{p.name}</b>
            <small style={{ fontSize: 12 }}>{p.time}</small>
          </button>
        ))}
      </div>
      <div className={f.exifBox}>
        <div className={f.exifHead}>
          <strong>{cur.name}</strong>
          <span>{cur.time}</span>
        </div>
        <div className={f.exifLoc}>📍 {cur.place}</div>
        <p>{cur.caption}</p>
        <div style={{ marginTop: 6 }}>
          <button
            type="button"
            className={f.actionBtn}
            disabled={!playing}
            onClick={handleTag}
          >
            🏷️ Tag {cur.name} as SUV Evidence
          </button>
        </div>
      </div>
    </div>
  );
}

export function CallLogsApp({ taskNum, playing, onPassTask, onFailTask }) {
  const calls = [
    {
      id: "baba",
      who: "Baba (Inspector Sen)",
      num: "Home Landline",
      time: "8:14 PM",
      type: "Missed · 0s",
      tone: "cyan",
      isTarget: false,
    },
    {
      id: "rohan",
      who: "Rohan Chatterjee",
      num: ROHAN_NUMBER,
      time: "7:51 PM",
      type: "Incoming · 1m 14s",
      tone: "amber",
      isTarget: false,
    },
    {
      id: "burner",
      who: "Unknown Burner",
      num: "+91 70440-81924",
      time: "7:44 PM",
      type: "Declined · Burner SIM",
      tone: "red",
      isTarget: true,
    },
    {
      id: "ananya",
      who: "Ananya (Dept)",
      num: "Ext. 404",
      time: "7:08 PM",
      type: "Outgoing · 4m 02s",
      tone: "cyan",
      isTarget: false,
    },
  ];

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
        `Wrong action in Call Logs — check your active Task ${taskNum} Lead!`
      );
    }
  }

  return (
    <div className={f.extraWrap}>
      <div className={f.extraBanner}>
        <span>📞 Recent Calls · Flag the Getaway Burner for Tower Trace</span>
      </div>
      <div className={f.listStack}>
        {calls.map((c) => (
          <div key={c.id} className={f.listRow}>
            <div>
              <b>{c.who}</b>
              <small>
                {c.num} · {c.time}
              </small>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className={f[`tag_${c.tone}`]}>{c.type}</span>
              <button
                type="button"
                className={f.actionBtn}
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
  );
}

export function BrowserApp({ seed, taskNum, playing, onPassTask, onFailTask }) {
  const [tab, setTab] = useState("gazette");

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
        `Wrong action in Browser — follow your active Task ${taskNum} Lead!`
      );
    }
  }

  return (
    <div className={f.extraWrap}>
      <div className={f.browserTabs}>
        {[
          ["gazette", "Kolkata Gazette"],
          ["rto", "WB Plate Lookup"],
          ["locket", "LocketLink Cloud"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`${f.bTab} ${tab === id ? f.bTabOn : ""}`}
            onClick={() => {
              sfx.tabSwitch();
              setTab(id);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "gazette" && (
        <article className={f.webPage}>
          <div className={f.webUrl}>https://kolkatagazette.in/sector-v-tender-404</div>
          <h3>₹80 Cr Sector V Urban Corridor Audit Leaks Inside Dept</h3>
          <p>
            Whistleblowers inside the Urban Development Dept flagged a shell contractor operating
            along the <b>EM Bypass — Salt Lake — Sector V</b> corridor under Tender #404.
          </p>
          <button
            type="button"
            className={f.webActionBtn}
            disabled={!playing}
            onClick={() => handleVerify("gazette")}
          >
            Flag News Article as Registration
          </button>
        </article>
      )}

      {tab === "rto" && (
        <article className={f.webPage}>
          <div className={f.webUrl}>
            https://vahan.wb.gov.in/lookup?plate=WB-06-{seed.plateNum}
          </div>
          <h3>West Bengal Motor Vehicles Registry</h3>
          <p>
            Registration: <b>WB-06-{seed.plateNum}</b>
          </p>
          <p>Vehicle: White SUV (Commercial Fleet · Temporary Permit)</p>
          <p>
            Registered Lessee: <b>East-Bypass Infra Holdings (Shell Entity)</b>
          </p>
          <button
            type="button"
            className={f.webActionBtn}
            disabled={!playing}
            onClick={() => handleVerify("rto")}
          >
            ✅ Verify SUV WB-06-{seed.plateNum} &amp; Flag Shell Firm
          </button>
        </article>
      )}

      {tab === "locket" && (
        <article className={f.webPage}>
          <div className={f.webUrl}>https://locketlink.in/device/riya-sen</div>
          <h3>LocketLink Safety Pendant — LIVE</h3>
          <p>
            Status: <b>MOVING</b> · eSIM active across Salt Lake / Bidhannagar towers near{" "}
            <b>{ZONES[seed.blockedNeighbor]?.name || "Salt Lake"}</b>.
          </p>
          <button
            type="button"
            className={f.webActionBtn}
            disabled={!playing}
            onClick={() => handleVerify("locket")}
          >
            Flag Pendant Page as Registration
          </button>
        </article>
      )}
    </div>
  );
}

export function FilesApp({ taskNum, playing, onPassTask, onFailTask }) {
  const [active, setActive] = useState(0);
  const files = [
    {
      name: "README_FOR_BABA.txt",
      folder: "Desktop",
      isTarget: false,
      body: "Baba, if anything looks off tonight:\nCheck my PingMe messages, Browser plate lookup, and Tender #404 audit inside Downloads & BangoVault.",
    },
    {
      name: "tender_404_summary.txt",
      folder: "Downloads",
      isTarget: true,
      body: `CONFIDENTIAL AUDIT BRIEF\nProject: Sector V Urban Corridor\nSuspected Shell: East-Bypass Infra Holdings\nFull encrypted Contractor ID (${CONTRACTOR_ID}) is sealed inside BangoVault.`,
    },
    {
      name: "locket_zones_cheat.txt",
      folder: "Documents",
      isTarget: false,
      body: "East Kolkata corridors:\nSalt Lake · Ultadanga · Kestopur · Karunamoyee · Sector V · Chingrighata.",
    },
  ];

  const cur = files[active];

  function handleQuarantine() {
    if (!playing) return;
    if (taskNum === 6 && cur.isTarget) {
      sfx.forward();
      onPassTask("tender_404_summary.txt quarantined safely from cloud sync wipe!");
    } else if (taskNum === 6) {
      onFailTask(
        "wrong",
        `Quarantined ${cur.name} instead of tender_404_summary.txt!`
      );
    } else {
      onFailTask(
        "wrong",
        `Wrong action in Files — follow your active Task ${taskNum} Lead!`
      );
    }
  }

  return (
    <div className={f.extraWrap}>
      <div className={f.filesSplit}>
        <div className={f.fileList}>
          {files.map((fl, i) => (
            <button
              key={fl.name}
              type="button"
              className={`${f.fileRow} ${active === i ? f.fileRowOn : ""}`}
              onClick={() => {
                sfx.tabSwitch();
                setActive(i);
              }}
            >
              <b style={{ fontSize: 13.5 }}>{fl.name}</b>
              <small style={{ fontSize: 11.5 }}>{fl.folder}</small>
            </button>
          ))}
        </div>
        <div className={f.filePreview}>
          <div className={f.exifHead}>
            <strong>{cur.name}</strong>
            <span>{cur.folder}</span>
          </div>
          <pre className={f.filePre}>{cur.body}</pre>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              type="button"
              className={f.actionBtn}
              disabled={!playing}
              onClick={handleQuarantine}
            >
              🛡️ Quarantine {cur.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsApp({ taskNum, playing, onPassTask, onFailTask }) {
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
    <div className={f.extraWrap}>
      <div className={f.extraBanner}>
        <span>⚙️ System Security &amp; Linked Cloud Devices — Stop the Remote Delete</span>
      </div>
      <div className={f.listStack}>
        <div className={f.listRow}>
          <div>
            <b>Remote Factory Reset Daemon</b>
            <small>Local Dept countdown active — Airplane Mode will NOT halt local trigger</small>
          </div>
          <button
            type="button"
            className={`${f.actionBtn} ${f.actionBtnWarn}`}
            disabled={!playing}
            onClick={() => handleSystemAction("airplane")}
          >
            ✈️ Enable Airplane Mode
          </button>
        </div>

        <div
          className={f.listRow}
          style={{
            borderColor: taskNum === 8 ? "rgba(248, 113, 113, 0.75)" : undefined,
            background: taskNum === 8 ? "rgba(127, 29, 29, 0.25)" : undefined,
          }}
        >
          <div>
            <b>Linked Cloud Device · R&apos;s Phone ({ROHAN_NUMBER})</b>
            <small>ACTIVE REMOTE WIPE SOURCE — Holds Admin Delete Token (…44102)</small>
          </div>
          <button
            type="button"
            className={`${f.actionBtn} ${f.actionBtnDanger}`}
            disabled={!playing}
            onClick={() => handleSystemAction("revoke_rohan")}
          >
            🛑 REVOKE ACCESS
          </button>
        </div>

        <div className={f.listRow}>
          <div>
            <b>LocketLink Safety Pendant (Riya Sen)</b>
            <small>Provides live Kolkata GPS coordinates for PCR rescue</small>
          </div>
          <button
            type="button"
            className={f.actionBtn}
            disabled={!playing}
            onClick={() => handleSystemAction("locket")}
          >
            🔌 Unlink LocketLink
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { TERMINAL_FS, TRACE_RESULT } from "@/data/deviceData";
import { useCase } from "@/context/CaseContext";
import { PhoneHeader } from "../parts";
import styles from "../Apps.module.css";

const BANNER = [
  { t: "ok", text: "ADAM-LAPTOP secure shell · synced backup mounted" },
  { t: "dim", text: "type 'help' to list commands. remote wipe: PAUSED" },
];

const HELP = [
  "help              list commands",
  "ls [-a]           list files",
  "cd <dir>          change directory (cd .. to go back)",
  "cat <file>        read a file",
  "pwd / whoami      where / who",
  "status            device + sync status",
  "clues             evidence recovered so far",
  "trace burner      trace the unknown contact",
  "unlock notes <pin>  decrypt the locked note",
  "clear             clear the screen",
];

function execute(raw, ctx) {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const out = [];
  const say = (text, t = "out") => out.push({ t, text });
  let cwd = ctx.cwd;
  let clear = false;

  const dir = TERMINAL_FS[cwd];

  switch (cmd) {
    case "help":
      HELP.forEach((l) => say(l));
      break;
    case "ls": {
      const all = args.includes("-a");
      const dirs = dir.dirs.filter((d) => all || !d.startsWith("."));
      const files = Object.keys(dir.files).filter((f) => all || !f.startsWith("."));
      if (dir.hidden && !all) say("(empty)", "dim");
      dirs.forEach((d) => say(`${d}/`, "ok"));
      files.forEach((f) => say(f));
      if (!dirs.length && !files.length && !dir.hidden) say("(empty)", "dim");
      break;
    }
    case "cd": {
      const target = args[0];
      if (!target || target === "~" || target === "..") cwd = "~";
      else if (cwd === "~" && dir.dirs.includes(target.replace(/\/$/, ""))) {
        cwd = target.replace(/\/$/, "");
      } else say(`cd: ${target}: no such directory`, "err");
      break;
    }
    case "pwd":
      say(cwd === "~" ? "/home/adam" : `/home/adam/${cwd}`);
      break;
    case "whoami":
      say("adam@pinehollow-laptop");
      break;
    case "cat": {
      const name = args[0];
      if (!name) say("usage: cat <file>", "warn");
      else if (dir.files[name]) say(dir.files[name]);
      else say(`cat: ${name}: no such file`, "err");
      break;
    }
    case "status":
      say("battery      38%");
      say("network      offline (last sync 01:47 AM)");
      say("remote wipe  PAUSED · queued by unknown@burner-404", "warn");
      say(`notes vault  ${ctx.notesUnlocked ? "DECRYPTED" : "LOCKED"}`, ctx.notesUnlocked ? "ok" : "warn");
      break;
    case "clues":
      ctx.clues.forEach((c, i) => say(`[${i + 1}] ${c.title}  <${c.source}>`));
      break;
    case "trace":
      if (args[0] !== "burner") say("usage: trace burner", "warn");
      else if (!ctx.found("clue_rohan_meet")) {
        say("insufficient leads. Press Rohan on where he was first.", "warn");
      } else TRACE_RESULT.forEach((l) => say(l, "ok"));
      break;
    case "unlock":
      if (args[0] !== "notes") say("usage: unlock notes <pin>", "warn");
      else if (ctx.notesUnlocked) say("notes already decrypted.", "ok");
      else if (!args[1]) say("usage: unlock notes <pin>", "warn");
      else if (ctx.tryUnlockNotes(args[1])) {
        say("PIN accepted. Vault decrypted.", "ok");
        say("open Notes → 'North Platform — Do Not Share'", "dim");
      } else say("access denied. wrong PIN.", "err");
      break;
    case "echo":
      say(args.join(" "));
      break;
    case "date":
      say("Tue 02:14 AM (clock frozen at last sync)");
      break;
    case "sudo":
    case "rm":
      say("nice try, detective. this backup is read-only.", "err");
      break;
    case "clear":
      clear = true;
      break;
    default:
      say(`${cmd}: command not found. try 'help'`, "err");
  }

  return { out, cwd, clear };
}

export default function TerminalApp({ variant, onHome }) {
  const phone = variant === "phone";
  const { clues, notesUnlocked, tryUnlockNotes } = useCase();
  const [lines, setLines] = useState(BANNER);
  const [cwd, setCwd] = useState("~");
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const outRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = (e) => {
    e.preventDefault();
    const raw = input.trim();
    const prompt = `adam@laptop:${cwd}$ ${raw}`;
    setInput("");
    if (!raw) {
      setLines((l) => [...l, { t: "in", text: prompt }]);
      return;
    }
    const found = (id) => clues.some((c) => c.id === id);
    const result = execute(raw, { cwd, clues, notesUnlocked, tryUnlockNotes, found });
    setCmdHistory((h) => [...h, raw]);
    setCursor(-1);
    setCwd(result.cwd);
    setLines((l) =>
      result.clear ? result.out : [...l, { t: "in", text: prompt }, ...result.out]
    );
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp" && cmdHistory.length) {
      e.preventDefault();
      const next = cursor === -1 ? cmdHistory.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(cmdHistory[next]);
    } else if (e.key === "ArrowDown" && cursor !== -1) {
      e.preventDefault();
      const next = cursor + 1;
      if (next >= cmdHistory.length) {
        setCursor(-1);
        setInput("");
      } else {
        setCursor(next);
        setInput(cmdHistory[next]);
      }
    }
  };

  const tone = {
    in: styles.tIn,
    ok: styles.tOk,
    warn: styles.tWarn,
    err: styles.tErr,
    dim: styles.tDim,
    out: "",
  };

  return (
    <div className={`${styles.app} ${styles.term} ${phone ? styles.phone : ""}`}>
      {phone && <PhoneHeader title="Terminal" onBack={onHome} backLabel="Home" />}
      <div className={styles.termOut} ref={outRef} onClick={() => inputRef.current?.focus()}>
        {lines.map((l, i) => (
          <div key={i} className={`${styles.tl} ${tone[l.t]}`}>
            {l.text}
          </div>
        ))}
        <form className={styles.promptRow} onSubmit={submit}>
          <span className={styles.prompt}>adam@laptop:{cwd}$</span>
          <input
            ref={inputRef}
            className={styles.termInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
        </form>
      </div>
    </div>
  );
}

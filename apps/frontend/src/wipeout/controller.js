// Session controller (outside React). Owns the authoritative game loop when
// hosting, the transport, bots, and clock-offset estimation when guesting.
// React subscribes via useSyncExternalStore.

import { applyAction, createRoom, startRound, tick } from "./engine";
import { fatherBot, rohanBot } from "./bots";
import { openTransport } from "./transport";

const LINK0 = { status: "idle", kind: null, peerAway: false, error: null };
const genCode = () => String(1000 + Math.floor(Math.random() * 9000));
const genId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export class WipeoutController {
  constructor() {
    this.snap = { screen: "landing", game: null, side: null, mode: null, roomCode: "", link: LINK0 };
    this.listeners = new Set();
    this.offset = 0;
    this.id = null;
    this.t = null;
    this.loop = null;
    this.session = 0;
    this.bot = null;
    this.guest = { id: null, seen: 0 };
    this.hostSeen = 0;
    this.joinStarted = 0;
    this.bcastTimer = null;
    this.bcastLast = 0;
  }

  subscribe = (fn) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getSnapshot = () => this.snap;
  now = () => Date.now() + this.offset;

  set(patch) {
    this.snap = { ...this.snap, ...patch };
    for (const fn of this.listeners) fn();
  }
  setLink(patch) {
    this.set({ link: { ...this.snap.link, ...patch } });
  }

  // ───────────── flows ─────────────

  leave = () => {
    this.session += 1;
    if (this.loop) clearInterval(this.loop);
    this.loop = null;
    clearTimeout(this.bcastTimer);
    this.bcastTimer = null;
    if (this.t) {
      const t = this.t;
      this.t = null;
      try {
        t.send({ t: "bye" });
      } catch {
        /* ignore */
      }
      setTimeout(() => t.close(), 200);
    }
    this.bot = null;
    this.guest = { id: null, seen: 0 };
    this.offset = 0;
    this.hostSeen = 0;
    if (this.snap.screen !== "landing" || this.snap.game) {
      this.set({ screen: "landing", game: null, side: null, mode: null, roomCode: "", link: LINK0 });
    }
  };

  hostOnline = (role) => {
    this.leave();
    const sess = this.session;
    this.id = genId();
    const code = genCode();
    this.set({
      screen: "pairing",
      side: "host",
      mode: "online",
      roomCode: code,
      game: createRoom(role),
      link: { ...LINK0, status: "connecting" },
    });
    this.loop = setInterval(() => this.hostStep(), 100);
    this.connect(code, sess);
  };

  playBot = (role) => {
    this.leave();
    this.bot = { mem: {} };
    this.set({
      screen: "game",
      side: "host",
      mode: "bot",
      roomCode: "",
      game: startRound(createRoom(role), Date.now()),
      link: LINK0,
    });
    this.loop = setInterval(() => this.hostStep(), 100);
  };

  join = (code) => {
    this.leave();
    const sess = this.session;
    this.id = genId();
    this.joinStarted = Date.now();
    this.set({
      screen: "joining",
      side: "guest",
      mode: "online",
      roomCode: code,
      game: null,
      link: { ...LINK0, status: "connecting" },
    });
    this.connect(code, sess).then((t) => t?.send({ t: "hello" }));
    this.loop = setInterval(() => this.guestStep(), 1000);
  };

  dispatch = (action) => {
    const { side, game } = this.snap;
    if (!game) return;
    if (side === "host") {
      const r = applyAction(game, { ...action, role: game.roles.host }, Date.now());
      if (r.state !== game) this.commit(r.state);
      return;
    }
    this.t?.send({ t: "action", a: action });
  };

  // ───────────── internals ─────────────

  async connect(code, sess) {
    try {
      const t = await openTransport(
        code,
        this.id,
        (m) => {
          if (sess === this.session) this.onMessage(m);
        },
        (status) => {
          if (sess === this.session) this.setLink({ status });
        }
      );
      if (sess !== this.session) {
        t.close();
        return null;
      }
      this.t = t;
      this.setLink({ kind: t.kind });
      return t;
    } catch (e) {
      if (sess === this.session) this.setLink({ status: "error", error: e?.message || "Connection failed" });
      return null;
    }
  }

  commit(g) {
    const patch = { game: g };
    if (this.snap.screen === "pairing" && g.status !== "lobby") patch.screen = "game";
    this.set(patch);
    if (this.snap.mode === "online") this.scheduleBroadcast();
  }

  broadcastNow() {
    clearTimeout(this.bcastTimer);
    this.bcastTimer = null;
    if (!this.t || this.snap.side !== "host" || !this.guest.id) return;
    this.bcastLast = Date.now();
    this.t.send({ t: "state", s: this.snap.game, hostNow: Date.now(), guest: this.guest.id });
  }

  scheduleBroadcast() {
    if (this.bcastTimer) return;
    const wait = Math.max(0, 100 - (Date.now() - this.bcastLast));
    this.bcastTimer = setTimeout(() => this.broadcastNow(), wait);
  }

  hostStep() {
    const g0 = this.snap.game;
    if (!g0) return;
    const now = Date.now();
    let g = tick(g0, now);
    if (this.bot && g.status !== "lobby") {
      const role = g.roles.guest;
      const a = (role === "rohan" ? rohanBot : fatherBot)(g, now, this.bot.mem);
      if (a) g = applyAction(g, { ...a, role }, now).state;
    }
    if (g !== g0) this.commit(g);
    if (this.snap.mode === "online") {
      if (now - this.bcastLast > 1000) this.broadcastNow();
      if (this.guest.id) {
        const away = now - this.guest.seen > 5000;
        if (away !== this.snap.link.peerAway) this.setLink({ peerAway: away });
      }
    }
  }

  guestStep() {
    const now = Date.now();
    this.t?.send({ t: "hello" });
    if (!this.snap.game) {
      if (now - this.joinStarted > 12000 && !this.snap.link.error) {
        this.setLink({ error: "No host answered yet. Double-check the room code." });
      }
      return;
    }
    const away = now - this.hostSeen > 5000;
    if (away !== this.snap.link.peerAway) this.setLink({ peerAway: away });
  }

  onMessage(m) {
    const now = Date.now();
    if (this.snap.side === "host") {
      if (m.t === "hello") {
        const g = this.snap.game;
        const free = !this.guest.id || this.guest.id === m.from || now - this.guest.seen > 4000;
        if (!free || !g) {
          this.t?.send({ t: "full", to: m.from });
          return;
        }
        const isNew = this.guest.id !== m.from;
        this.guest = { id: m.from, seen: now };
        if (isNew) {
          if (g.status === "lobby") this.commit(startRound(g, now));
          this.broadcastNow();
        }
        return;
      }
      if (m.t === "action" && m.from === this.guest.id) {
        this.guest.seen = now;
        const g = this.snap.game;
        const r = applyAction(g, { ...m.a, role: g.roles.guest }, now);
        if (r.state !== g) this.commit(r.state);
        return;
      }
      if (m.t === "bye" && m.from === this.guest.id) {
        this.guest.seen = 0;
        this.setLink({ peerAway: true });
      }
      return;
    }

    // guest side
    if (m.t === "state") {
      if (m.guest !== this.id) return; // we're not the paired guest
      const cur = this.snap.game;
      if (cur && m.s.v < cur.v) return;
      const sample = m.hostNow - now;
      this.offset = this.hostSeen ? Math.max(this.offset, sample) : sample;
      this.hostSeen = now;
      const patch = { game: m.s };
      if (this.snap.screen === "joining") patch.screen = "game";
      if (this.snap.link.error || this.snap.link.peerAway) {
        patch.link = { ...this.snap.link, error: null, peerAway: false };
      }
      this.set(patch);
      return;
    }
    if (m.t === "full" && m.to === this.id) {
      this.setLink({ error: "Room is full — another phone already joined." });
      return;
    }
    if (m.t === "bye" && this.snap.game) this.setLink({ peerAway: true });
  }
}

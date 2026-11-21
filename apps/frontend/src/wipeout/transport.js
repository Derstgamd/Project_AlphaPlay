// Realtime transport. Uses Supabase Realtime Broadcast when
// NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY are set; otherwise
// falls back to the built-in SSE relay at /api/relay/[code] (same Next server).

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const transportKind = () => (SUPABASE_URL && SUPABASE_KEY ? "supabase" : "relay");

let supabaseClient = null;

async function openSupabase(code, clientId, onMessage, onStatus) {
  const { createClient } = await import("@supabase/supabase-js");
  supabaseClient ??= createClient(SUPABASE_URL, SUPABASE_KEY, {
    realtime: { params: { eventsPerSecond: 20 } },
  });
  const channel = supabaseClient.channel(`wipeout-${code}`, {
    config: { broadcast: { self: false, ack: false } },
  });
  channel.on("broadcast", { event: "m" }, ({ payload }) => {
    if (payload && payload.from !== clientId) onMessage(payload);
  });
  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") onStatus("open");
    else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") onStatus("error");
    else if (status === "CLOSED") onStatus("closed");
  });
  return {
    kind: "supabase",
    send(msg) {
      channel.send({ type: "broadcast", event: "m", payload: { ...msg, from: clientId } });
    },
    close() {
      supabaseClient?.removeChannel(channel);
    },
  };
}

function openRelay(code, clientId, onMessage, onStatus) {
  const es = new EventSource(`/api/relay/${code}?id=${encodeURIComponent(clientId)}`);
  es.onopen = () => onStatus("open");
  es.onerror = () => onStatus("connecting"); // EventSource auto-reconnects
  es.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.from !== clientId) onMessage(msg);
    } catch {
      /* ignore malformed */
    }
  };

  // Sequential POST queue; newer state snapshots replace queued older ones.
  const queue = [];
  let sending = false;
  let closed = false;
  async function pump() {
    if (sending) return;
    sending = true;
    while (queue.length && !closed) {
      const msg = queue.shift();
      try {
        await fetch(`/api/relay/${code}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(msg),
          keepalive: true,
        });
      } catch {
        /* network blip — next heartbeat will resync */
      }
    }
    sending = false;
  }
  return {
    kind: "relay",
    send(msg) {
      const full = { ...msg, from: clientId };
      if (full.t === "state") {
        for (let i = queue.length - 1; i >= 0; i--) if (queue[i].t === "state") queue.splice(i, 1);
      }
      queue.push(full);
      pump();
    },
    close() {
      closed = true;
      es.close();
    },
  };
}

export async function openTransport(code, clientId, onMessage, onStatus) {
  if (transportKind() === "supabase") return openSupabase(code, clientId, onMessage, onStatus);
  return openRelay(code, clientId, onMessage, onStatus);
}

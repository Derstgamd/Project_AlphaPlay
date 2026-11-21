// Built-in zero-config realtime relay (Server-Sent Events down, POST up).
// Used when Supabase env vars are not set. Works with `next dev` / `next start`
// (single Node process). For serverless hosting, configure Supabase instead.

const rooms = (globalThis.__wipeoutRooms ??= new Map()); // code -> Map<clientId, controller>
const enc = new TextEncoder();
const CODE_RE = /^\d{4}$/;

export async function GET(request, { params }) {
  const { code } = await params;
  if (!CODE_RE.test(code)) return new Response("bad room", { status: 400 });
  const id = new URL(request.url).searchParams.get("id") || crypto.randomUUID();

  let keepAlive;
  let me;
  const cleanup = () => {
    clearInterval(keepAlive);
    const room = rooms.get(code);
    if (room && room.get(id) === me) room.delete(id);
    if (room && room.size === 0) rooms.delete(code);
  };

  const stream = new ReadableStream({
    start(controller) {
      me = controller;
      let room = rooms.get(code);
      if (!room) rooms.set(code, (room = new Map()));
      room.set(id, controller);
      controller.enqueue(enc.encode("retry: 1500\n: connected\n\n"));
      keepAlive = setInterval(() => {
        try {
          controller.enqueue(enc.encode(": keepalive\n\n"));
        } catch {
          cleanup();
        }
      }, 15000);
      request.signal.addEventListener("abort", () => {
        cleanup();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
    cancel: cleanup,
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function POST(request, { params }) {
  const { code } = await params;
  if (!CODE_RE.test(code)) return new Response("bad room", { status: 400 });
  const text = await request.text();
  if (text.length > 64_000) return new Response("too large", { status: 413 });
  let msg;
  try {
    msg = JSON.parse(text);
  } catch {
    return new Response("bad json", { status: 400 });
  }
  const room = rooms.get(code);
  if (room) {
    const data = enc.encode(`data: ${JSON.stringify(msg)}\n\n`);
    for (const [cid, c] of room) {
      if (cid === msg.from) continue;
      try {
        c.enqueue(data);
      } catch {
        room.delete(cid);
      }
    }
  }
  return new Response(null, { status: 204 });
}

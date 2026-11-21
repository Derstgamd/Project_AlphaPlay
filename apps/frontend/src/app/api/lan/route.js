// Returns this machine's LAN IPv4 addresses so the pairing QR code works on a
// second phone even when the host opened the game via http://localhost.
import os from "node:os";

export async function GET(request) {
  const host = request.headers.get("host") || "";
  const port = host.includes(":") ? host.split(":").pop() : "";
  const ips = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const ni of list || []) {
      if (ni.family === "IPv4" && !ni.internal) ips.push(ni.address);
    }
  }
  // Prefer typical home/office LAN ranges.
  ips.sort((a, b) => Number(b.startsWith("192.168.")) - Number(a.startsWith("192.168.")));
  return Response.json({ ips, port });
}

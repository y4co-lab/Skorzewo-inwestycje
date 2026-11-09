import { getStore } from "@netlify/blobs";
export default async (req) => {
  const s = getStore("skorzewo");
  if (req.method === "GET") {
    const d = await s.get("data", { type: "json" });
    return Response.json(d || { items: null }, { headers: { "cache-control": "no-store" } });
  }
  if (req.method === "POST") {
    let b = {};
    try { b = await req.json(); } catch {}
    if (!process.env.ADMIN_PASSWORD || b.password !== process.env.ADMIN_PASSWORD)
      return new Response("Unauthorized", { status: 401 });
    if (Array.isArray(b.items))
      await s.setJSON("data", { items: b.items, savedAt: new Date().toISOString() });
    return Response.json({ ok: true });
  }
  return new Response("Method not allowed", { status: 405 });
};
export const config = { path: "/api/data" };

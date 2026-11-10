import { getStore } from "@netlify/blobs";
const L = { name: "nazwa", type: "typ", stage: "etap", coordStatus: "status lokalizacji", cost: "koszt", signed: "data umowy", dur: "czas trwania", unit: "jednostka", status: "status" };
const v = (x) => (x === null || x === undefined || x === "" ? "—" : String(x));
function diff(a, b) {
  const out = [], A = new Map(a.map((i) => [i.id, i])), B = new Map(b.map((i) => [i.id, i]));
  for (const [id, x] of B) {
    const o = A.get(id), n = (x.name || id).slice(0, 40);
    if (!o) { out.push("dodano: " + n); continue; }
    const ch = [];
    for (const k in L) if (v(o[k]) !== v(x[k])) ch.push(L[k] + " " + v(o[k]) + " → " + v(x[k]));
    if (o.lat !== x.lat || o.lng !== x.lng) ch.push("położenie");
    if (ch.length) out.push(n + ": " + ch.join("; "));
  }
  for (const [id, o] of A) if (!B.has(id)) out.push("usunięto: " + (o.name || id).slice(0, 40));
  if (out.length > 60) { const n = out.length - 60; out.length = 60; out.push("…i " + n + " więcej"); }
  return out;
}
export default async (req, context) => {
  const s = getStore("skorzewo");
  if (req.method === "GET") {
    const d = await s.get("data", { type: "json" });
    return Response.json(d || { items: null }, { headers: { "cache-control": "no-store" } });
  }
  if (req.method === "POST") {
    let b = {};
    try { b = await req.json(); } catch {}
    const log = async (k, d) => {
      const l = (await s.get("log", { type: "json" })) || [];
      l.unshift({ t: new Date().toISOString(), ip: (context && context.ip) || "", k, d });
      await s.setJSON("log", l.slice(0, 1000));
    };
    const ok = process.env.ADMIN_PASSWORD && b.password === process.env.ADMIN_PASSWORD;
    if (!ok) { await log("fail", ["Nieudana próba logowania"]); return new Response("Unauthorized", { status: 401 }); }
    if (b.action === "log") return Response.json({ log: (await s.get("log", { type: "json" })) || [] }, { headers: { "cache-control": "no-store" } });
    if (b.action === "login") await log("login", ["Zalogowano"]);
    if (Array.isArray(b.items)) {
      const prev = await s.get("data", { type: "json" });
      const ch = prev && Array.isArray(prev.items) ? diff(prev.items, b.items) : ["Pierwszy zapis danych (" + b.items.length + " inwestycji)"];
      await s.setJSON("data", { items: b.items, savedAt: new Date().toISOString() });
      await log("save", ch.length ? ch : ["Zapisano bez zmian w danych"]);
    }
    return Response.json({ ok: true });
  }
  return new Response("Method not allowed", { status: 405 });
};
export const config = { path: "/api/data" };

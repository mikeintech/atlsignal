import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deskPath = path.join(root, "data", "social-desk.json");
const ledgerPath = path.join(root, "data", "social-dispatch.json");
const endpoint = process.env.SOCIAL_PUBLISH_ENDPOINT;
const token = process.env.SOCIAL_PUBLISH_TOKEN;
const now = new Date(process.env.SOCIAL_NOW || Date.now());

async function readJson(filename, fallback) {
  try {
    return JSON.parse(await readFile(filename, "utf8"));
  } catch {
    return fallback;
  }
}

if (!endpoint) {
  console.log(JSON.stringify({ status: "SKIPPED", reason: "SOCIAL_PUBLISH_ENDPOINT is not configured" }, null, 2));
  process.exit(0);
}

const desk = await readJson(deskPath, { packages: [] });
const ledger = await readJson(ledgerPath, { schemaVersion: "atlsignal_social_dispatch_v1", deliveries: [] });
const deliveredStoryIds = new Set(ledger.deliveries.filter((item) => item.status === "DELIVERED").map((item) => item.storyId));
const due = desk.packages.filter((item) =>
  item.status === "AUTO_READY"
  && new Date(item.scheduledFor).valueOf() <= now.valueOf()
  && !deliveredStoryIds.has(item.storyId),
);

for (const item of due) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "idempotency-key": item.idempotencyKey,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ event: "atlsignal.social.package.ready", package: item }),
  });
  if (!response.ok) throw new Error(`Social publishing endpoint returned HTTP ${response.status} for ${item.packageId}`);
  ledger.deliveries.push({ packageId: item.packageId, storyId: item.storyId, deliveredAt: now.toISOString(), status: "DELIVERED" });
}

ledger.updatedAt = now.toISOString();
await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ status: "OK", due: due.length, delivered: due.length }, null, 2));

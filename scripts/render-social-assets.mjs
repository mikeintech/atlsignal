import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const desk = JSON.parse(await readFile(path.join(root, "data", "social-desk.json"), "utf8"));
const outputRoot = path.join(root, "public", "social-assets");

const colors = {
  ink: "#102b25",
  forest: "#173f35",
  ivory: "#f4efe4",
  paper: "#fffdf7",
  orange: "#e86f3b",
  lime: "#cddf72",
  muted: "#64736d",
};

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrap(value, maxCharacters, maxLines) {
  const words = String(value).trim().split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length <= maxCharacters || !line) {
      line = next;
      continue;
    }
    lines.push(line);
    line = word;
    if (lines.length === maxLines - 1) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  const consumed = lines.join(" ").replace(/…$/, "");
  if (consumed.length < String(value).trim().length) {
    lines[lines.length - 1] = `${lines.at(-1).replace(/[.,;:!?]?$/, "")}…`;
  }
  return lines;
}

function textBlock(lines, { x, y, size, lineHeight, fill, weight = 700, family = "Arial, Helvetica, sans-serif" }) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? lineHeight : 0}">${escapeXml(line)}</tspan>`).join("")}</text>`;
}

function renderCard(storyPackage, card) {
  const isCover = card.slide === 1;
  const isReceipt = card.slide === 4;
  const background = isCover ? colors.forest : colors.ivory;
  const foreground = isCover ? colors.paper : colors.ink;
  const accent = isReceipt ? colors.lime : colors.orange;
  const headingSize = isCover ? 76 : 86;
  const headingLines = wrap(card.heading, isCover ? 24 : 22, isCover ? 4 : 3);
  const bodyLines = wrap(card.body, 43, isCover ? 3 : 5);
  const headingY = isCover ? 360 : 330;
  const bodyY = headingY + headingLines.length * (isCover ? 86 : 96) + 70;
  const sourceNames = [...new Set(storyPackage.sources.map((source) => source.name))].join(" • ");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
      <rect width="1080" height="1350" fill="${background}"/>
      <path d="M72 190 H1008 M72 1120 H1008" stroke="${isCover ? "#3b5c53" : "#d9d1c1"}" stroke-width="2"/>
      <rect x="72" y="72" width="112" height="54" rx="27" fill="${accent}"/>
      <text x="128" y="108" text-anchor="middle" fill="${colors.ink}" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800">ATL</text>
      <text x="204" y="111" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" letter-spacing="-1">SIGNAL</text>
      <text x="1008" y="108" text-anchor="end" fill="${isCover ? "#b8cbc4" : colors.muted}" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">${escapeXml(String(card.slide).padStart(2, "0"))} / 06</text>
      <text x="72" y="260" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" letter-spacing="2">${escapeXml(card.label.toUpperCase())}</text>
      ${textBlock(headingLines, { x: 72, y: headingY, size: headingSize, lineHeight: isCover ? 86 : 96, fill: foreground, weight: 800, family: "Georgia, 'Times New Roman', serif" })}
      ${textBlock(bodyLines, { x: 72, y: bodyY, size: 38, lineHeight: 55, fill: isCover ? "#dce7e1" : colors.muted, weight: 500 })}
      <rect x="72" y="1160" width="936" height="2" fill="${accent}"/>
      <text x="72" y="1216" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800">${escapeXml(storyPackage.evidenceLabel.toUpperCase())}</text>
      <text x="72" y="1260" fill="${isCover ? "#b8cbc4" : colors.muted}" font-family="Arial, Helvetica, sans-serif" font-size="22">${escapeXml(wrap(sourceNames, 70, 1)[0])}</text>
      <text x="1008" y="1260" text-anchor="end" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">ATLSIGNAL.COM</text>
    </svg>`;
}

let rendered = 0;
for (const storyPackage of desk.packages) {
  const packageDirectory = path.join(outputRoot, storyPackage.packageId);
  await mkdir(packageDirectory, { recursive: true });
  for (const card of storyPackage.carousel) {
    const outputPath = path.join(packageDirectory, `${card.slide}.png`);
    await sharp(Buffer.from(renderCard(storyPackage, card)))
      .png({ compressionLevel: 9, quality: 95 })
      .toFile(outputPath);
    const metadata = await sharp(outputPath).metadata();
    if (metadata.width !== 1080 || metadata.height !== 1350) {
      throw new Error(`Invalid social asset dimensions for ${outputPath}`);
    }
    rendered += 1;
  }
}

console.log(JSON.stringify({ output: path.relative(root, outputRoot), packages: desk.packages.length, rendered, dimensions: "1080x1350" }, null, 2));

#!/usr/bin/env node

/**
 * Optional helper: generate updates table rows from data JSON.
 *
 * Usage:
 *   node scripts/render-updates.js data/site-content.template.json
 */
const fs = require("fs");
const path = require("path");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/render-updates.js <path-to-site-content.json>");
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), inputPath);
const raw = fs.readFileSync(absolutePath, "utf8");
const data = JSON.parse(raw);

if (!Array.isArray(data.updates)) {
  console.error("Input JSON must contain an updates array.");
  process.exit(1);
}

const rows = data.updates.map((update) => {
  const date = String(update.date || "").trim();
  const html = String(update.html || "").trim();
  return [
    "<tr>",
    `  <td><p class="news-date">[${date}] &nbsp</p></td>`,
    `  <td>${html}</td>`,
    "</tr>"
  ].join("\n");
});

process.stdout.write(rows.join("\n\n") + "\n");

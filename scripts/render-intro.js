#!/usr/bin/env node

/**
 * Generate intro/profile HTML block from JSON.
 *
 * Usage:
 *   node scripts/render-intro.js data/intro.template.json
 */
const fs = require("fs");
const path = require("path");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/render-intro.js <path-to-intro.json>");
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), inputPath);
const intro = JSON.parse(fs.readFileSync(absolutePath, "utf8"));

if (!Array.isArray(intro.paragraphsHtml) || !Array.isArray(intro.links)) {
  console.error("Intro JSON must include paragraphsHtml[] and links[].");
  process.exit(1);
}

const links = intro.links
  .map((entry) => `<a href="${String(entry.url || "").trim()}" target="_blank">${String(entry.label || "").trim()}</a>`)
  .join(" &nbsp;/&nbsp;\n                ");

function normalizeParagraph(paragraphValue) {
  if (paragraphValue && typeof paragraphValue === "object" && !Array.isArray(paragraphValue)) {
    if (paragraphValue.published === false) {
      return null;
    }

    if (Array.isArray(paragraphValue.chunks)) {
      return paragraphValue.chunks.map((chunk) => String(chunk).trim()).filter(Boolean).join(" ");
    }

    if (typeof paragraphValue.html === "string") {
      return paragraphValue.html.trim();
    }
  }

  if (Array.isArray(paragraphValue)) {
    return paragraphValue.map((chunk) => String(chunk).trim()).filter(Boolean).join(" ");
  }

  return String(paragraphValue || "").trim();
}

const paragraphs = intro.paragraphsHtml
  .map((paragraphHtml) => normalizeParagraph(paragraphHtml))
  .filter((paragraphHtml) => paragraphHtml)
  .map((paragraphHtml) => `              <p style="text-align:justify">\n              ${paragraphHtml}\n              </p>`)
  .join("\n");

const lines = [
  "              <p align=\"center\">",
  `                <name>${intro.name || ""} </name>`,
  "              </p>",
  "              <p align=\"center\">",
  `                <font size="3">${intro.emailHtml || ""} </font>`,
  "              </p>",
  paragraphs,
  "",
  "              <p align=\"center\">",
  "                <strong>",
  `                ${links}`,
  "                </strong>",
  "              </p>"
];

process.stdout.write(lines.join("\n") + "\n");

#!/usr/bin/env node

/**
 * Generate research publication table rows from JSON.
 *
 * Usage:
 *   node scripts/render-publications.js data/publications.template.json
 */
const fs = require("fs");
const path = require("path");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/render-publications.js <path-to-publications.json>");
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), inputPath);
const publications = JSON.parse(fs.readFileSync(absolutePath, "utf8"));

if (!Array.isArray(publications)) {
  console.error("Input JSON must be an array of publication objects.");
  process.exit(1);
}

function renderLinks(links) {
  if (!Array.isArray(links) || links.length === 0) {
    return "";
  }

  return links
    .map((link) => {
      const label = String(link.label || "").trim();
      const url = String(link.url || "").trim();
      const color = link.color ? ` style="color: ${String(link.color).trim()}"` : "";
      return `[<a href="${url}"${color} target="_blank">${label}</a>]`;
    })
    .join("\n            ");
}

const rows = publications.map((publication) => {
  const contentWidth = Number(publication.contentWidth || 70);
  const imageWidth = Number(publication.imageWidth || 220);
  const imageHeight = publication.imageHeight ? ` height="${Number(publication.imageHeight)}"` : "";
  const imageTag = `<img src="${publication.imageSrc}" width="${imageWidth}"${imageHeight}>`;
  const imageHtml = publication.imageLink
    ? `<a href="${publication.imageLink}" target="_blank">\n        ${imageTag}\n      </a>`
    : imageTag;
  const venueHtml = publication.venueHtml
    ? `            <em>${publication.venueHtml}</em><br>\n`
    : "";
  const notesHtml = publication.notesHtml ? `            ${publication.notesHtml}\n` : "";
  const linksHtml = renderLinks(publication.links);
  const abstractHtml = publication.abstractHtml ? `          ${publication.abstractHtml}\n` : "";

  return [
    "    <tr>",
    '      <td width="25%" align="center">',
    `        ${imageHtml}`,
    "      </td>",
    `      <td width="${contentWidth}%" valign="center">`,
    "        <details>",
    "          <summary>",
    "            <papertitle>",
    `            ${publication.title}`,
    "            </papertitle>",
    '            <div style="height:5px;font-size:1px;">&nbsp;</div>',
    `            ${publication.authorsHtml}`,
    '            <div style="height:5px;font-size:1px;">&nbsp;</div>',
    venueHtml + notesHtml + (linksHtml ? `            ${linksHtml}\n` : "") + '            <div style="height:15px;font-size:1px;">&nbsp;</div>',
    "          </summary>",
    "          <i>",
    abstractHtml + "        </details>",
    "      </td>",
    "    </tr>"
  ].join("\n");
});

process.stdout.write(rows.join("\n\n") + "\n");

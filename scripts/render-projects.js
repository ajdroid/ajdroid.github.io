#!/usr/bin/env node

/**
 * Generate project table rows from JSON.
 *
 * Usage:
 *   node scripts/render-projects.js data/projects.template.json
 */
const fs = require("fs");
const path = require("path");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/render-projects.js <path-to-projects.json>");
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), inputPath);
const projects = JSON.parse(fs.readFileSync(absolutePath, "utf8"));

if (!Array.isArray(projects)) {
  console.error("Input JSON must be an array of project objects.");
  process.exit(1);
}

function renderLinks(links) {
  if (!Array.isArray(links) || links.length === 0) {
    return "";
  }

  return links
    .map((link) => `[<a href="${String(link.url || "").trim()}" target="_blank">${String(link.label || "").trim()}</a>]`)
    .join("\n                ");
}

const rows = projects.map((project) => {
  const imageWidth = Number(project.imageWidth || 150);
  const imageHeight = project.imageHeight ? ` height="${Number(project.imageHeight)}"` : "";
  const linksHtml = renderLinks(project.links);

  return [
    "    <tr>",
    '      <td width="10%" align="center">',
    `        <img src="${project.imageSrc}" width="${imageWidth}"${imageHeight}>`,
    "      </td>",
    '      <td width="90%" valign="center">',
    "        <papertitle>",
    `          ${project.title}`,
    "        </papertitle>",
    "        <br>",
    '        <div style="height:3px;font-size:1px;">&nbsp;</div>',
    `        ${project.authorsHtml}`,
    '        <div style="height:3px;font-size:1px;">&nbsp;</div>',
    `        ${linksHtml}`,
    '        <div style="height:3px;font-size:1px;">&nbsp;</div>',
    `        <i>${project.blurbHtml}</i>`,
    "      </td>",
    "    </tr>"
  ].join("\n");
});

process.stdout.write(rows.join("\n\n") + "\n");

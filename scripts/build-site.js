#!/usr/bin/env node

/**
 * Build index.html by refreshing all generated content blocks.
 *
 * Usage:
 *   node scripts/build-site.js
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const indexPath = path.join(rootDir, "index.html");

function runRenderer(scriptName, dataPath) {
  const scriptPath = path.join(rootDir, "scripts", scriptName);
  const absoluteDataPath = path.join(rootDir, dataPath);

  return execFileSync(process.execPath, [scriptPath, absoluteDataPath], {
    encoding: "utf8"
  }).trimEnd();
}

function replaceGeneratedBlock(html, blockName, generatedContent) {
  const beginMarker = `<!-- BEGIN GENERATED: ${blockName} -->`;
  const endMarker = `<!-- END GENERATED: ${blockName} -->`;
  const pattern = new RegExp(`(${escapeRegExp(beginMarker)})[\\s\\S]*?(${escapeRegExp(endMarker)})`);
  const match = html.match(pattern);

  if (!match) {
    throw new Error(`Could not find generated block markers for "${blockName}" in index.html`);
  }

  const startLineMatch = html
    .slice(0, match.index)
    .match(/(^|\n)([ \t]*)[^\n]*$/);
  const indent = startLineMatch ? startLineMatch[2] : "";

  const normalizedContent = generatedContent
    .split("\n")
    .map((line) => (line.length ? `${indent}${line}` : ""))
    .join("\n");

  return html.replace(pattern, `${beginMarker}\n${normalizedContent}\n${indent}${endMarker}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const generatedBlocks = [
  {
    blockName: "intro block",
    scriptName: "render-intro.js",
    dataPath: "data/intro.template.json"
  },
  {
    blockName: "updates rows",
    scriptName: "render-updates.js",
    dataPath: "data/site-content.template.json"
  },
  {
    blockName: "publications rows",
    scriptName: "render-publications.js",
    dataPath: "data/publications.template.json"
  },
  {
    blockName: "projects rows",
    scriptName: "render-projects.js",
    dataPath: "data/projects.template.json"
  }
];

let html = fs.readFileSync(indexPath, "utf8");

for (const block of generatedBlocks) {
  const rendered = runRenderer(block.scriptName, block.dataPath);
  html = replaceGeneratedBlock(html, block.blockName, rendered);
}

fs.writeFileSync(indexPath, html, "utf8");
console.log("index.html updated from data templates.");

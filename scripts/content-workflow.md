# Optional Data-Driven Workflow

This site remains fully static and deploys exactly as before.  
Use this optional workflow to reduce manual edits for intro, `Updates`, `Research`, and `Other projects`.

## 1) Edit content data

Update one or more data files:

- `data/site-content.template.json` for updates
- `data/intro.template.json` for intro/profile text
- `data/publications.template.json` for research entries
- `data/projects.template.json` for other projects

## 2) Generate rows

Run (Python, recommended on this machine):

```bash
py scripts/build-site.py
```

Or run (Node):

```bash
node scripts/build-site.js
```

This updates all generated blocks in `index.html` in one step.

Or run section-specific generators:

```bash
node scripts/render-updates.js data/site-content.template.json
node scripts/render-intro.js data/intro.template.json
node scripts/render-publications.js data/publications.template.json
node scripts/render-projects.js data/projects.template.json
```

Each command prints `<tr>...</tr>` rows for one section with consistent structure.

## 3) Paste into `index.html` generated blocks

Replace only rows inside each generated section marker:

- `BEGIN GENERATED: intro block` ... `END GENERATED: intro block`
- `BEGIN GENERATED: updates rows` ... `END GENERATED: updates rows`
- `BEGIN GENERATED: publications rows` ... `END GENERATED: publications rows`
- `BEGIN GENERATED: projects rows` ... `END GENERATED: projects rows`

If you use `py scripts/build-site.py` or `node scripts/build-site.js`, this step is automatic.

## Why this helps

- One place to edit each section's content
- Less repetitive manual HTML editing
- Lower chance of malformed table rows

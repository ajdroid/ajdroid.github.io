#!/usr/bin/env python3
"""
Build index.html by refreshing all generated content blocks.

Usage:
  py scripts/build-site.py
"""
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = ROOT / "index.html"


def read_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def render_intro() -> str:
    intro = read_json(ROOT / "data" / "intro.template.json")

    def normalize_paragraph(value):
        if isinstance(value, dict):
            if value.get("published") is False:
                return None
            if isinstance(value.get("chunks"), list):
                return " ".join(str(chunk).strip() for chunk in value["chunks"] if str(chunk).strip())
            if isinstance(value.get("html"), str):
                return value["html"].strip()
        if isinstance(value, list):
            return " ".join(str(chunk).strip() for chunk in value if str(chunk).strip())
        return str(value or "").strip()

    links = " &nbsp;/&nbsp;\n                ".join(
        f'<a href="{str(entry.get("url", "")).strip()}" target="_blank">{str(entry.get("label", "")).strip()}</a>'
        for entry in intro["links"]
    )

    paragraphs = []
    for paragraph_value in intro["paragraphsHtml"]:
        paragraph = normalize_paragraph(paragraph_value)
        if paragraph:
            paragraphs.append(
                "              <p style=\"text-align:justify\">\n"
                f"              {paragraph}\n"
                "              </p>"
            )

    lines = [
        "              <p align=\"center\">",
        f'                <name>{intro.get("name", "")} </name>',
        "              </p>",
        "              <p align=\"center\">",
        f'                <font size="3">{intro.get("emailHtml", "")} </font>',
        "              </p>",
        "\n".join(paragraphs),
        "",
        "              <p align=\"center\">",
        "                <strong>",
        f"                {links}",
        "                </strong>",
        "              </p>",
    ]
    return "\n".join(lines)


def render_updates() -> str:
    updates_data = read_json(ROOT / "data" / "site-content.template.json")
    rows = []
    for update in updates_data["updates"]:
        rows.append(
            "\n".join(
                [
                    "<tr>",
                    f'  <td><p class="news-date">[{str(update.get("date", "")).strip()}] &nbsp</p></td>',
                    f'  <td>{str(update.get("html", "")).strip()}</td>',
                    "</tr>",
                ]
            )
        )
    return "\n\n".join(rows)


def render_publications() -> str:
    publications = read_json(ROOT / "data" / "publications.template.json")

    def render_links(links):
        if not links:
            return ""
        rendered = []
        for link in links:
            color = f' style="color: {str(link.get("color", "")).strip()}"' if link.get("color") else ""
            rendered.append(
                f'[<a href="{str(link.get("url", "")).strip()}"{color} target="_blank">{str(link.get("label", "")).strip()}</a>]'
            )
        return "\n            ".join(rendered)

    rows = []
    for publication in publications:
        content_width = int(publication.get("contentWidth", 70))
        image_width = int(publication.get("imageWidth", 220))
        image_height = f' height="{int(publication["imageHeight"])}"' if publication.get("imageHeight") else ""
        image_tag = f'<img src="{publication["imageSrc"]}" width="{image_width}"{image_height}>'
        if publication.get("imageLink"):
            image_html = (
                f'<a href="{publication["imageLink"]}" target="_blank">\n'
                f"        {image_tag}\n"
                "      </a>"
            )
        else:
            image_html = image_tag

        venue_html = f'            <em>{publication["venueHtml"]}</em><br>\n' if publication.get("venueHtml") else ""
        notes_html = f'            {publication["notesHtml"]}\n' if publication.get("notesHtml") else ""
        links_html = render_links(publication.get("links"))
        abstract_html = f'          {publication["abstractHtml"]}\n' if publication.get("abstractHtml") else ""

        rows.append(
            "\n".join(
                [
                    "    <tr>",
                    '      <td width="25%" align="center">',
                    f"        {image_html}",
                    "      </td>",
                    f'      <td width="{content_width}%" valign="center">',
                    "        <details>",
                    "          <summary>",
                    "            <papertitle>",
                    f'            {publication["title"]}',
                    "            </papertitle>",
                    '            <div style="height:5px;font-size:1px;">&nbsp;</div>',
                    f'            {publication["authorsHtml"]}',
                    '            <div style="height:5px;font-size:1px;">&nbsp;</div>',
                    venue_html + notes_html + (f"            {links_html}\n" if links_html else "") + '            <div style="height:15px;font-size:1px;">&nbsp;</div>',
                    "          </summary>",
                    "          <i>",
                    abstract_html + "        </details>",
                    "      </td>",
                    "    </tr>",
                ]
            )
        )
    return "\n\n".join(rows)


def render_projects() -> str:
    projects = read_json(ROOT / "data" / "projects.template.json")

    def render_links(links):
        if not links:
            return ""
        return "\n                ".join(
            f'[<a href="{str(link.get("url", "")).strip()}" target="_blank">{str(link.get("label", "")).strip()}</a>]'
            for link in links
        )

    rows = []
    for project in projects:
        image_width = int(project.get("imageWidth", 150))
        image_height = f' height="{int(project["imageHeight"])}"' if project.get("imageHeight") else ""
        links_html = render_links(project.get("links"))
        rows.append(
            "\n".join(
                [
                    "    <tr>",
                    '      <td width="10%" align="center">',
                    f'        <img src="{project["imageSrc"]}" width="{image_width}"{image_height}>',
                    "      </td>",
                    '      <td width="90%" valign="center">',
                    "        <papertitle>",
                    f'          {project["title"]}',
                    "        </papertitle>",
                    "        <br>",
                    '        <div style="height:3px;font-size:1px;">&nbsp;</div>',
                    f'        {project["authorsHtml"]}',
                    '        <div style="height:3px;font-size:1px;">&nbsp;</div>',
                    f"        {links_html}",
                    '        <div style="height:3px;font-size:1px;">&nbsp;</div>',
                    f'        <i>{project["blurbHtml"]}</i>',
                    "      </td>",
                    "    </tr>",
                ]
            )
        )
    return "\n\n".join(rows)


def replace_generated_block(html: str, block_name: str, generated_content: str) -> str:
    begin_marker = f"<!-- BEGIN GENERATED: {block_name} -->"
    end_marker = f"<!-- END GENERATED: {block_name} -->"
    pattern = re.compile(rf"({re.escape(begin_marker)})([\s\S]*?)({re.escape(end_marker)})")
    match = pattern.search(html)
    if not match:
        raise ValueError(f'Could not find generated block markers for "{block_name}" in index.html')

    prefix = html[: match.start()]
    indent_match = re.search(r"(?:^|\n)([ \t]*)[^\n]*$", prefix)
    indent = indent_match.group(1) if indent_match else ""
    normalized = "\n".join((f"{indent}{line}" if line else "") for line in generated_content.splitlines())
    return pattern.sub(f"{begin_marker}\n{normalized}\n{indent}{end_marker}", html, count=1)


def main():
    html = INDEX_PATH.read_text(encoding="utf-8")
    html = replace_generated_block(html, "intro block", render_intro())
    html = replace_generated_block(html, "updates rows", render_updates())
    html = replace_generated_block(html, "publications rows", render_publications())
    html = replace_generated_block(html, "projects rows", render_projects())
    INDEX_PATH.write_text(html, encoding="utf-8")
    print("index.html updated from data templates.")


if __name__ == "__main__":
    main()

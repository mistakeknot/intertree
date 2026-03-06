# Interactive Project Layout (compact)

Guide users through discovering, organizing, and registering projects for Notion sync.

## When to Invoke

User says "set up projects", "discover projects", "organize projects", or "layout".

## Prerequisites

- interkasten MCP server running
- Notion token set and `interkasten_init` completed

## Workflow

1. **Scan** — call `interkasten_scan_preview` (no args). Present discovered tree with LOC, commits, markers. Ask user to confirm.

2. **Hierarchy Review** — walk through tree: confirm parent-child from `.beads` nesting, ask about standalone projects, use `interkasten_set_project_parent` for corrections.

3. **Classification** — for batches of 3-5 projects, use `interkasten_gather_signals` to propose doc tier (Product/Tool/Inactive), tags (from signals), and status (Active/Archived).

4. **Notion Schema** — set up properties via `interkasten_add_database_property`: Status, Doc Tier, Tags, Parent Project, key doc URL columns.

5. **Register** — parent-first, then children: `interkasten_register_project` with properties, `interkasten_set_project_tags`, report Notion URLs.

6. **File Selection** — `interkasten_scan_files` per project: sync key docs and project docs, let user decide on notes, warn on generated/large files (>50KB).

## Batch Mode (>10 projects)

Offer: (1) walk through each, (2) auto-classify with summary confirmation, (3) register everything with defaults.

## Output

Summary: registered count, hierarchy, tags, files selected, Notion URL, next steps.

---
*For conversational pattern table and visual tree examples, read SKILL.md.*

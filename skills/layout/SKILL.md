---
name: layout
description: Use when organizing projects — interactive project discovery, hierarchy review, classification, tagging, and Notion registration. Use when the user says "set up projects", "discover projects", "organize my projects", or "layout".
---

# Interactive Project Discovery & Layout

Guide the user through discovering, organizing, and registering their projects for Notion sync.

## Prerequisites

- interkasten MCP server running (tools: `interkasten_scan_preview`, `interkasten_register_project`, `interkasten_set_project_parent`, `interkasten_set_project_tags`, `interkasten_add_database_property`, `interkasten_gather_signals`, `interkasten_scan_files`)
- Notion token set and `interkasten_init` completed (database exists)

## Workflow

### Step 1: Scan

Call `interkasten_scan_preview` with no arguments (uses configured `projects_dir`).

Present the discovered tree as a visual hierarchy:

```
Found 14 projects:

~/projects/Interverse/          [.beads]
  os/clavain/                  [.git, .beads]  15,000 LOC  247 commits
  plugins/interflux/            [.git, .beads]   3,200 LOC   89 commits
  ...

~/projects/standalone-tool/     [.git]            800 LOC   12 commits
```

Ask: "Does this look right? Any projects missing or incorrectly grouped?"

### Step 2: Hierarchy Review

Walk through the tree with the user:

- **Parent-child from `.beads` nesting**: Confirm grouping
- **Standalone projects**: Ask if any are related
- **Cross-root links**: Explain manual link limitations
- **Corrections**: Use `interkasten_set_project_parent` to adjust

### Step 3: Classification

For each project (batches of 3-5), use signals from `interkasten_gather_signals` to propose:

- **Doc tier** with reasoning (Product / Tool / Inactive)
- **Tags** from signals (`has_plugin_json` -> "claude-plugin", `has_go_mod` -> "go", etc.)
- **Status**: Active (recent commits) or Archived (stale)

### Step 4: Notion Schema

Set up database properties via `interkasten_add_database_property`:
- **Status** (select): Active, Planning, Paused, Archived
- **Doc Tier** (select): Product, Tool, Inactive
- **Tags** (multi_select)
- **Parent Project** (relation): Self-referential
- **Key doc columns** (url): Vision, PRD, Roadmap, AGENTS.md, CLAUDE.md

### Step 5: Register

Register confirmed projects **parent-first, children after**:
1. `interkasten_register_project` with properties
2. `interkasten_set_project_tags` with confirmed tags
3. Report Notion URLs

### Step 6: File Selection

For each project, scan with `interkasten_scan_files`:
- **Key docs** (CLAUDE.md, AGENTS.md, Vision.md) — recommend syncing
- **Project docs** (docs/ directory) — recommend syncing
- **Notes/scratch** — let user decide
- **Generated/large** (>50KB) — warn

## Batch Mode

For >10 projects, offer:
1. Walk through each one (thorough)
2. Auto-classify, show summary for confirmation (faster)
3. Register everything with defaults

## Conversational Patterns

| User says | Action |
|-----------|--------|
| "These are all part of the same project" | `set_project_parent` |
| "Skip this" | Skip, move to next |
| "These are all plugins" | Batch-tag |
| "Re-scan" | Re-run `scan_preview` |
| "Just register everything" | Batch-register with defaults |

## Output

End with summary: registered count, hierarchy, tags, files selected, Notion URL, and next steps (`/interkasten:onboard`, `interkasten_sync`).

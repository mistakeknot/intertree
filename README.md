# intertree

Project hierarchy management for Claude Code.

## What this does

intertree discovers projects on your filesystem, maps parent-child relationships (monorepo → subprojects), applies classification tags, and orchestrates layout — the directory structure that makes a multi-project workspace navigable.

The `/intertree:layout` skill walks you through interactive project discovery: scan a directory tree, review what was found, classify projects by type, and register them in the hierarchy database.

## Installation

First, add the [interagency marketplace](https://github.com/mistakeknot/interagency-marketplace) (one-time setup):

```bash
/plugin marketplace add mistakeknot/interagency-marketplace
```

Then install the plugin:

```bash
/plugin install intertree
```

## Usage

```
/intertree:layout
```

Or ask naturally:

```
"scan my projects directory and organize it"
"show the project hierarchy"
```

## Architecture

```
skills/
  layout/SKILL.md           Interactive discovery + classification workflow
server/src/
  discovery.ts              Filesystem tree walking (pure function)
  signals.ts                Signal gathering for classification (pure function)
```

Currently uses [interkasten](https://github.com/mistakeknot/interkasten)'s MCP tools for hierarchy operations (`interkasten_scan_preview`, `interkasten_set_project_parent`, `interkasten_set_project_tags`, etc.). These will migrate to a dedicated intertree MCP server in a future release.

## Ecosystem

intertree was extracted from [interkasten](https://github.com/mistakeknot/interkasten) to separate the hierarchy concern (filesystem-level) from the Notion sync concern (cloud-level). The pure discovery and signal-gathering functions live here; the database-backed MCP tools remain in interkasten until the DaemonContext dependency is decoupled.

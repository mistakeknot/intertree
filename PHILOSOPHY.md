# intertree Philosophy

## Purpose
Project hierarchy management — filesystem discovery, parent-child relationships, tagging, and layout orchestration. Extracted from interkasten.

## North Star
Every project in the ecosystem should know where it sits and what it's connected to.

## Working Priorities
- Discovery accuracy (find all projects, miss none)
- Relationship fidelity (parent-child, tags reflect reality)
- Layout consistency (same structure across environments)

## Brainstorming Doctrine
1. Start from outcomes and failure modes, not implementation details.
2. Generate at least three options: conservative, balanced, and aggressive.
3. Explicitly call out assumptions, unknowns, and dependency risk across modules.
4. Prefer ideas that improve clarity, reversibility, and operational visibility.

## Planning Doctrine
1. Convert selected direction into small, testable, reversible slices.
2. Define acceptance criteria, verification steps, and rollback path for each slice.
3. Sequence dependencies explicitly and keep integration contracts narrow.
4. Reserve optimization work until correctness and reliability are proven.

## Decision Filters
- Does this help agents understand project context faster?
- Does this reduce manual project registration?
- Is the hierarchy discoverable without configuration?
- Does this work across different filesystem layouts?

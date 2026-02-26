/**
 * Project discovery — pure filesystem tree walking.
 * No database or Notion dependencies.
 *
 * Extracted from interkasten/server/src/daemon/tools/init.ts
 */

import {
  existsSync,
  readdirSync,
  lstatSync,
  statSync,
  realpathSync,
} from "fs";
import { join } from "path";

/**
 * A discovered project with its hierarchy.
 */
export interface DiscoveredProject {
  path: string;
  markers: string[]; // which markers were found ([".git"], [".beads"], [".git", ".beads"])
  children: DiscoveredProject[];
}

/**
 * Recursively discover projects in a directory tree.
 *
 * Projects are identified by the presence of marker files (e.g., ".git", ".beads").
 * The hierarchy marker (typically ".beads") determines whether a project can have children.
 * Leaf projects (markers without hierarchy marker) are not recursed into.
 * Intermediate directories without markers are transparent (traversed, not registered).
 * Symlinks are deduplicated via realpathSync when resolveSymlinks is true.
 */
export function discoverProjects(
  dir: string,
  markers: string[],
  exclude: string[],
  maxDepth: number,
  hierarchyMarker: string,
  resolveSymlinks: boolean,
  currentDepth = 0,
  seenPaths?: Set<string>
): DiscoveredProject[] {
  if (currentDepth >= maxDepth) return [];
  if (!existsSync(dir)) return [];

  const seen = seenPaths ?? new Set<string>();

  // Symlink dedup: resolve to real path, skip if already seen
  if (resolveSymlinks) {
    try {
      const realPath = realpathSync(dir);
      if (seen.has(realPath)) return [];
      seen.add(realPath);
    } catch {
      // Can't resolve — proceed with original path
    }
  }

  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }

  const excludeSet = new Set(exclude);

  // Check which markers this directory has
  const foundMarkers = markers.filter((m) => entries.includes(m));
  const isProject = foundMarkers.length > 0 && currentDepth > 0;
  const hasHierarchyMarker = foundMarkers.includes(hierarchyMarker);

  if (isProject && !hasHierarchyMarker) {
    // Leaf project (e.g., .git only, no .beads) — register, don't recurse
    return [{ path: dir, markers: foundMarkers, children: [] }];
  }

  // Either: (a) this is a hierarchy-capable project (.beads) — recurse for children
  //     or: (b) this is not a project at all — recurse to find projects below
  const children: DiscoveredProject[] = [];

  for (const entry of entries) {
    if (entry.startsWith(".") || excludeSet.has(entry)) continue;
    const fullPath = join(dir, entry);
    try {
      // Skip symlinks to non-directories and check symlink targets
      const lstats = lstatSync(fullPath);
      if (lstats.isSymbolicLink()) {
        if (!resolveSymlinks) continue; // skip symlinks if not resolving
        // For symlinks, check if target is a directory
        try {
          if (!statSync(fullPath).isDirectory()) continue;
        } catch {
          continue; // broken symlink
        }
      } else if (!lstats.isDirectory()) {
        continue;
      }

      children.push(
        ...discoverProjects(fullPath, markers, exclude, maxDepth, hierarchyMarker, resolveSymlinks, currentDepth + 1, seen)
      );
    } catch {
      // Skip inaccessible dirs
    }
  }

  if (isProject) {
    // This is a hierarchy-capable project with children
    return [{ path: dir, markers: foundMarkers, children }];
  }

  // Not a project — return discovered children as-is (transparent directory)
  return children;
}

/**
 * Flatten a discovery tree into a list of paths.
 */
export function flattenDiscovery(projects: DiscoveredProject[]): string[] {
  const result: string[] = [];
  for (const p of projects) {
    result.push(p.path);
    result.push(...flattenDiscovery(p.children));
  }
  return result;
}

/**
 * Count total projects in a discovery tree.
 */
export function countProjects(projects: DiscoveredProject[]): number {
  let count = projects.length;
  for (const p of projects) {
    count += countProjects(p.children);
  }
  return count;
}

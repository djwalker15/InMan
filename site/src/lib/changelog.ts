import { existsSync, readFileSync } from 'node:fs'

export interface ReleaseSection {
  heading: string
  items: string[] // sanitized HTML per bullet
}

export interface Release {
  version: string
  date: string
  sections: ReleaseSection[]
}

// Client-friendly names for release-please's conventional-commit headings.
const HEADING_LABELS: Record<string, string> = {
  Features: 'New',
  'Bug Fixes': 'Fixes',
  'Performance Improvements': 'Performance',
  Reverts: 'Rolled back',
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Bullets are escaped first, then markdown links are re-introduced as <a>.
function bulletToHtml(text: string): string {
  return escapeHtml(text).replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" rel="noopener">$1</a>',
  )
}

/**
 * Parses a release-please CHANGELOG.md into releases, newest first.
 * Returns [] when the file doesn't exist yet (before the first release).
 */
export function loadReleases(changelogPath: string): Release[] {
  if (!existsSync(changelogPath)) return []
  const lines = readFileSync(changelogPath, 'utf8').split('\n')

  const releases: Release[] = []
  let release: Release | null = null
  let section: ReleaseSection | null = null

  for (const line of lines) {
    // e.g. `## [0.2.0](https://github.com/...) (2026-06-20)` or `## 0.2.0 (2026-06-20)`
    const versionMatch = line.match(/^##\s+\[?(\d+\.\d+\.\d+[^\]\s]*)\]?.*\((\d{4}-\d{2}-\d{2})\)/)
    if (versionMatch) {
      release = { version: versionMatch[1], date: versionMatch[2], sections: [] }
      releases.push(release)
      section = null
      continue
    }
    const headingMatch = line.match(/^###\s+(.+)/)
    if (headingMatch && release) {
      const raw = headingMatch[1].trim()
      section = { heading: HEADING_LABELS[raw] ?? raw, items: [] }
      release.sections.push(section)
      continue
    }
    const bulletMatch = line.match(/^[*-]\s+(.+)/)
    if (bulletMatch && section) {
      section.items.push(bulletToHtml(bulletMatch[1].trim()))
    }
  }

  return releases
}

/**
 * Design token constants for use in JSX inline style props.
 *
 * Tailwind utilities (bg-bs-blue, text-bs-body, etc.) are the preferred
 * approach for static values. Use these constants only where Tailwind
 * utilities can't be used — e.g. SVG stroke/fill, dynamic style objects,
 * or third-party component props.
 *
 * All values mirror the CSS custom properties defined in index.css :root.
 */

// ── Primary brand ────────────────────────────────────────────────────────────
export const BS_BLUE        = '#2A6EBB'  // Primary action / active state
export const BS_BLUE_LIGHT  = '#4A9FD4'  // Accent / info / hover
export const BS_BLUE_PALE   = '#EBF4FB'  // Secondary button bg / tints

// ── Structural neutrals ──────────────────────────────────────────────────────
export const BS_NAVY        = '#0B1829'  // Sidebar bg / headings / ink
export const BS_NAVY_MID    = '#112240'  // Sidebar hover surfaces
export const BS_NAVY_CARD   = '#162B45'  // Dark card interior surfaces
export const BS_NAVY_BORDER = '#1E3A5F'  // Borders on dark surfaces
export const BS_BODY        = '#3A5068'  // All prose / secondary text on white
export const BS_SURFACE_ALT = '#F8FAFC'  // Card header / section tint (on white)

// ── Border palette (normalized) ──────────────────────────────────────────────
// Use BS_BORDER for card / content borders on light backgrounds.
// Use BS_BORDER_LIGHT for very subtle dividers inside cards.
// Use BS_BORDER_INPUT for form control strokes (focused → BS_BLUE_LIGHT).
// Do NOT introduce new border colors.
export const BS_BORDER       = '#E2ECF5'
export const BS_BORDER_LIGHT = '#E8F0F8'
export const BS_BORDER_INPUT = '#D0DEF0'

// ── Semantic ─────────────────────────────────────────────────────────────────
export const BS_SUCCESS = '#28A87C'
export const BS_WARNING = '#F5A623'
export const BS_DANGER  = '#E84C4C'

// ── Track accent colors ──────────────────────────────────────────────────────
// RULE (The Track Fence): track colors are for module-track identification
// surfaces ONLY — track headers, track dots, track progress bars scoped
// to that track. Never use track colors for global interactive states.
//
// NOTE: Several components currently use BS_TRACK_1 (#007AFF) for
// non-track-1-specific interactive elements (sidebar nav active bg,
// global progress bar fill, main header badge). These should migrate to
// BS_BLUE (#2A6EBB) per "The One Blue Rule."
export const BS_TRACK_1      = '#007AFF'
export const BS_TRACK_1_PALE = '#E1F0FF'
export const BS_TRACK_2      = '#F59E0B'
export const BS_TRACK_3      = '#10B981'
export const BS_EXAM         = '#EF4444'

// ── Track map (keyed by track label prefix used in data/modules) ─────────────
export const TRACK_COLOR: Record<string, string> = {
  'Track 1': BS_TRACK_1,
  'Track 2': BS_TRACK_2,
  'Track 3': BS_TRACK_3,
  'Exam':    BS_EXAM,
}

export const TRACK_PALE: Record<string, string> = {
  'Track 1': BS_TRACK_1_PALE,
  'Track 2': '#FEF3C7',
  'Track 3': '#D1FAE5',
  'Exam':    '#FEE2E2',
}

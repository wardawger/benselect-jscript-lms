// Monochromatic SVG icon components — all use stroke="currentColor" + fill="none"
// Color is controlled by the parent's text-color class or style prop.
// Default size 16×16; override with width/height props.

interface IconProps { size?: number; className?: string }

// ── Navigation ──────────────────────────────────────────────────────────────

export function IcDashboard({ size = 15, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1.5" y="1.5" width="5" height="5" rx="1"/>
      <rect x="8.5" y="1.5" width="5" height="5" rx="1"/>
      <rect x="1.5" y="8.5" width="5" height="5" rx="1"/>
      <rect x="8.5" y="8.5" width="5" height="5" rx="1"/>
    </svg>
  )
}

export function IcModules({ size = 15, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1.5" y="1.5" width="12" height="3" rx="1"/>
      <rect x="1.5" y="6" width="12" height="3" rx="1"/>
      <rect x="1.5" y="10.5" width="12" height="3" rx="1"/>
    </svg>
  )
}

export function IcProgress({ size = 15, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1.5" y="9" width="2.5" height="4.5" rx="0.75"/>
      <rect x="6.25" y="6" width="2.5" height="7.5" rx="0.75"/>
      <rect x="11" y="3" width="2.5" height="10.5" rx="0.75"/>
    </svg>
  )
}

export function IcGlossary({ size = 15, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 2.5h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3"/>
      <path d="M3 2.5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1"/>
      <line x1="5" y1="5.5" x2="10" y2="5.5"/>
      <line x1="5" y1="8" x2="10" y2="8"/>
      <line x1="5" y1="10.5" x2="8" y2="10.5"/>
    </svg>
  )
}

// ── Status ───────────────────────────────────────────────────────────────────

export function IcCheckCircle({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="7" cy="7" r="5.5"/>
      <polyline points="4.5,7 6.5,9 9.5,5"/>
    </svg>
  )
}

export function IcCheck({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="2,6 5,9 10,3"/>
    </svg>
  )
}

export function IcX({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <line x1="2" y1="2" x2="10" y2="10"/>
      <line x1="10" y1="2" x2="2" y2="10"/>
    </svg>
  )
}

export function IcLock({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="6.5" width="8" height="6" rx="1"/>
      <path d="M4.5 6.5V5a2.5 2.5 0 0 1 5 0v1.5"/>
    </svg>
  )
}

export function IcChevronRight({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="5,3 9,7 5,11"/>
    </svg>
  )
}

export function IcChevronDown({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <polyline points="2,4 6,8 10,4"/>
    </svg>
  )
}

// ── Stats / Dashboard ────────────────────────────────────────────────────────

export function IcLayers({ size = 18, className }: IconProps) {
  // Stack of 3 layers — represents modules/content
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="9,2 16,6 9,10 2,6"/>
      <polyline points="2,10 9,14 16,10"/>
    </svg>
  )
}

export function IcTarget({ size = 18, className }: IconProps) {
  // Bullseye — represents quiz score / accuracy
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <circle cx="9" cy="9" r="7"/>
      <circle cx="9" cy="9" r="4"/>
      <circle cx="9" cy="9" r="1.5" strokeWidth="0" fill="currentColor"/>
    </svg>
  )
}

export function IcAward({ size = 18, className }: IconProps) {
  // Ribbon / medal — represents certification
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="7" r="5"/>
      <polyline points="6,12 5,17 9,14.5 13,17 12,12"/>
    </svg>
  )
}

export function IcClock({ size = 18, className }: IconProps) {
  // Clock — represents time / content duration
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="9" r="7"/>
      <polyline points="9,5 9,9 12,11"/>
    </svg>
  )
}

// ── Actions ──────────────────────────────────────────────────────────────────

export function IcSearch({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <circle cx="7" cy="7" r="5"/>
      <line x1="11" y1="11" x2="14" y2="14"/>
    </svg>
  )
}

export function IcEdit({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 2.5l1.5 1.5L4.5 11H3v-1.5L10 2.5z"/>
    </svg>
  )
}

export function IcReset({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <path d="M2 7a5 5 0 1 0 1-3"/>
      <polyline points="1,2 1,5 4,5"/>
    </svg>
  )
}

export function IcMenu({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <line x1="3" y1="6" x2="17" y2="6"/>
      <line x1="3" y1="10" x2="17" y2="10"/>
      <line x1="3" y1="14" x2="17" y2="14"/>
    </svg>
  )
}

export function IcInfo({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <circle cx="6" cy="6" r="5"/>
      <line x1="6" y1="5" x2="6" y2="9"/>
      <circle cx="6" cy="3.5" r="0.75" fill="currentColor" stroke="none"/>
    </svg>
  )
}

export function IcSidebarToggle({ size = 16, className }: IconProps) {
  // Panel-left icon: outer rect + vertical divider representing sidebar
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1.5" y="2" width="13" height="12" rx="1.5"/>
      <line x1="5.5" y1="2" x2="5.5" y2="14"/>
    </svg>
  )
}

export function IcArrowRight({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="2" y1="7" x2="12" y2="7"/>
      <polyline points="8,3 12,7 8,11"/>
    </svg>
  )
}

export function IcExpandCollapse({ size = 12, open = false, className }: IconProps & { open?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <polyline points={open ? '2,8 6,4 10,8' : '2,4 6,8 10,4'}/>
    </svg>
  )
}

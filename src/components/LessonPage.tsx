import { useMemo } from 'react'
import { MODULES } from '@/data/modules'
import { LESSONS } from '@/data/lessons'
import { QUIZ_EXERCISES } from '@/data/quizExercises'
import { BenSelectScriptEditor } from './BenSelectScriptEditor'
import type { AppState } from '@/store/progress'
import { IcClock, IcCheck, IcChevronRight, IcTarget } from './Icons'

interface LessonPageProps {
  moduleId: number
  state: AppState
  onStartQuiz: (moduleId: number) => void
  onBack: () => void
}

interface LessonSection {
  heading: string | null
  body: string
}

// Split raw lesson HTML at every <h2> boundary.
// Chunk 0 is the preamble (video, etc.); subsequent chunks are named sections.
function parseSections(html: string): LessonSection[] {
  const parts = html.split(/(?=<h2>)/)
  return parts
    .map(chunk => {
      const m = chunk.match(/^<h2>([\s\S]*?)<\/h2>/)
      if (m) return { heading: m[1], body: chunk.slice(m[0].length) }
      return chunk.trim() ? { heading: null, body: chunk } : null
    })
    .filter(Boolean) as LessonSection[]
}

const TRACK_COLOR: Record<string, string> = {
  'Track 1': '#007aff',
  'Track 2': '#f59e0b',
  'Track 3': '#10b981',
  'Exam':    '#ef4444',
}

// ── Unique SVG tile pattern per module ──────────────────────────────────────
function ModulePattern({ id, color }: { id: number; color: string }) {
  const pid = `mp${id}`
  const c = color
  const o = 0.18  // pattern opacity

  const patterns: Record<number, React.ReactNode> = {
    // M1 — Intro: uniform dot grid (foundation)
    1: <pattern id={pid} width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="14" cy="14" r="2" fill={c} opacity={o} />
       </pattern>,
    // M2 — Language: horizontal code-line stripes
    2: <pattern id={pid} width="48" height="16" patternUnits="userSpaceOnUse">
        <rect x="0" y="6" width="32" height="2" rx="1" fill={c} opacity={o} />
        <rect x="0" y="12" width="20" height="2" rx="1" fill={c} opacity={o * 0.6} />
       </pattern>,
    // M3 — Functions: nested squares (scope / closure)
    3: <pattern id={pid} width="40" height="40" patternUnits="userSpaceOnUse">
        <rect x="4" y="4" width="32" height="32" rx="2" fill="none" stroke={c} strokeWidth="1.5" opacity={o} />
        <rect x="12" y="12" width="16" height="16" rx="2" fill="none" stroke={c} strokeWidth="1" opacity={o * 0.6} />
       </pattern>,
    // M4 — OOP: hexagon grid (structure / class hierarchy)
    4: <pattern id={pid} width="36" height="31.2" patternUnits="userSpaceOnUse">
        <polygon points="18,2 32,9.6 32,24.6 18,32.2 4,24.6 4,9.6" fill="none" stroke={c} strokeWidth="1.2" opacity={o} />
       </pattern>,
    // M5 — .NET Framework: connected node graph
    5: <pattern id={pid} width="56" height="56" patternUnits="userSpaceOnUse">
        <circle cx="8"  cy="8"  r="3" fill={c} opacity={o} />
        <circle cx="48" cy="8"  r="3" fill={c} opacity={o} />
        <circle cx="28" cy="28" r="3" fill={c} opacity={o} />
        <circle cx="8"  cy="48" r="3" fill={c} opacity={o} />
        <circle cx="48" cy="48" r="3" fill={c} opacity={o} />
        <line x1="8"  y1="8"  x2="28" y2="28" stroke={c} strokeWidth="1" opacity={o * 0.7} />
        <line x1="48" y1="8"  x2="28" y2="28" stroke={c} strokeWidth="1" opacity={o * 0.7} />
        <line x1="8"  y1="48" x2="28" y2="28" stroke={c} strokeWidth="1" opacity={o * 0.7} />
        <line x1="48" y1="48" x2="28" y2="28" stroke={c} strokeWidth="1" opacity={o * 0.7} />
       </pattern>,
    // M6 — Error Handling: zigzag / lightning bolt
    6: <pattern id={pid} width="32" height="24" patternUnits="userSpaceOnUse">
        <polyline points="0,12 8,4 16,20 24,8 32,12" fill="none" stroke={c} strokeWidth="1.5" opacity={o} strokeLinecap="round" strokeLinejoin="round" />
       </pattern>,
    // M7 — Architecture: blueprint grid crosshatch
    7: <pattern id={pid} width="32" height="32" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="32" y2="0" stroke={c} strokeWidth="0.6" opacity={o} />
        <line x1="0" y1="0" x2="0"  y2="32" stroke={c} strokeWidth="0.6" opacity={o} />
        <line x1="16" y1="0" x2="16" y2="32" stroke={c} strokeWidth="0.3" opacity={o * 0.5} />
        <line x1="0" y1="16" x2="32" y2="16" stroke={c} strokeWidth="0.3" opacity={o * 0.5} />
       </pattern>,
    // M8 — Event Object: concentric rings (event ripple)
    8: <pattern id={pid} width="60" height="60" patternUnits="userSpaceOnUse">
        <circle cx="30" cy="30" r="6"  fill="none" stroke={c} strokeWidth="1.2" opacity={o} />
        <circle cx="30" cy="30" r="14" fill="none" stroke={c} strokeWidth="0.8" opacity={o * 0.6} />
        <circle cx="30" cy="30" r="22" fill="none" stroke={c} strokeWidth="0.5" opacity={o * 0.35} />
       </pattern>,
    // M9 — Rate Groups: diagonal parallel lines
    9: <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="20" y2="0" stroke={c} strokeWidth="1.5" opacity={o} />
        <line x1="-10" y1="20" x2="10" y2="0" stroke={c} strokeWidth="1.5" opacity={o} />
        <line x1="10" y1="20" x2="30" y2="0" stroke={c} strokeWidth="1.5" opacity={o} />
       </pattern>,
    // M10 — Dates: calendar grid (rows × columns)
    10: <pattern id={pid} width="48" height="40" patternUnits="userSpaceOnUse">
         {[0,1,2,3].map(col => [0,1,2].map(row => (
           <rect key={`${col}-${row}`} x={col * 12 + 2} y={row * 12 + 10} width="8" height="8" rx="1" fill={c} opacity={row === 0 && col < 2 ? o * 1.2 : o * 0.5} />
         )))}
         <rect x="0" y="2" width="46" height="6" rx="2" fill={c} opacity={o * 0.4} />
        </pattern>,
    // M11 — Benefits/GI: triangle tessellation
    11: <pattern id={pid} width="32" height="28" patternUnits="userSpaceOnUse">
         <polygon points="16,2 30,26 2,26" fill="none" stroke={c} strokeWidth="1.2" opacity={o} />
         <polygon points="0,28 14,4 28,28" fill="none" stroke={c} strokeWidth="0.7" opacity={o * 0.4} />
        </pattern>,
    // M12 — Life Events: branching Y-path (decision tree)
    12: <pattern id={pid} width="48" height="48" patternUnits="userSpaceOnUse">
         <line x1="24" y1="48" x2="24" y2="24" stroke={c} strokeWidth="1.5" opacity={o} strokeLinecap="round" />
         <line x1="24" y1="24" x2="8"  y2="8"  stroke={c} strokeWidth="1.2" opacity={o} strokeLinecap="round" />
         <line x1="24" y1="24" x2="40" y2="8"  stroke={c} strokeWidth="1.2" opacity={o} strokeLinecap="round" />
         <circle cx="8"  cy="8"  r="3" fill={c} opacity={o} />
         <circle cx="40" cy="8"  r="3" fill={c} opacity={o} />
        </pattern>,
    // M13 — Reports: bar chart silhouette
    13: <pattern id={pid} width="48" height="40" patternUnits="userSpaceOnUse">
         <rect x="4"  y="24" width="6" height="14" rx="1" fill={c} opacity={o} />
         <rect x="14" y="14" width="6" height="24" rx="1" fill={c} opacity={o} />
         <rect x="24" y="8"  width="6" height="30" rx="1" fill={c} opacity={o} />
         <rect x="34" y="18" width="6" height="20" rx="1" fill={c} opacity={o} />
         <line x1="0" y1="38" x2="48" y2="38" stroke={c} strokeWidth="1" opacity={o * 0.6} />
        </pattern>,
    // M14 — Exam: radial star burst
    14: <pattern id={pid} width="64" height="64" patternUnits="userSpaceOnUse">
         {[0,30,60,90,120,150].map((deg, i) => {
           const r = deg * Math.PI / 180
           return <line key={i} x1="32" y1="32" x2={32 + Math.cos(r) * 26} y2={32 + Math.sin(r) * 26} stroke={c} strokeWidth="1.2" opacity={o} strokeLinecap="round" />
         })}
         <circle cx="32" cy="32" r="5" fill={c} opacity={o * 0.8} />
        </pattern>,
  }

  const pat = patterns[id]
  if (!pat) return null
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0" preserveAspectRatio="xMidYMid slice">
      <defs>{pat}</defs>
      <rect width="100%" height="100%" fill={`url(#${pid})`} />
    </svg>
  )
}

export function LessonPage({ moduleId, state, onStartQuiz, onBack }: LessonPageProps) {
  const mod = MODULES.find(m => m.id === moduleId)
  if (!mod) return null

  const lessonHtml = LESSONS[moduleId] ?? '<p>Lesson content coming soon.</p>'
  const p = state.progress[moduleId]
  const trackColor = TRACK_COLOR[mod.track] ?? '#007aff'

  const sections = useMemo(() => parseSections(lessonHtml), [lessonHtml])

  // Separate the preamble (video) from the named content sections
  const preamble  = sections[0]?.heading === null ? sections[0] : null
  const contentSections = sections.filter(s => s.heading !== null)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-5">
        <button onClick={onBack} className="hover:text-[#007aff] transition-colors">Dashboard</button>
        <IcChevronRight size={10} />
        <span className="text-slate-500">{mod.track}</span>
        <IcChevronRight size={10} />
        <span className="text-[#0B1829] font-medium truncate" aria-current="page">Module {mod.id}</span>
      </nav>

      {/* ── Module header card ──────────────────────────────────────────────── */}
      <div className="rounded-2xl shadow-lg overflow-hidden mb-6 relative" style={{ background: '#0B1829' }}>
        {/* Unique SVG pattern overlay */}
        <ModulePattern id={moduleId} color={trackColor} />

        {/* Bottom edge color strip keyed to track */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: trackColor }} />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Track + module number */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white tracking-wide"
                  style={{ background: trackColor }}
                >
                  {mod.track}
                </span>
                <span className="text-[12px] font-mono text-white/40">Module {mod.id} of 14</span>
              </div>

              <h1 className="text-[22px] sm:text-[26px] font-bold tracking-tight leading-tight mb-3 text-white">
                {mod.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-[12px] text-white/60">
                  <IcClock size={13} /> {mod.time}
                </span>
                <span className="w-px h-3 bg-white/20" />
                <span className="text-[12px] text-white/60">{mod.topics.length} topics</span>
                {p.status === 'complete' && (
                  <>
                    <span className="w-px h-3 bg-white/20" />
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-900/50 border border-emerald-700/50 px-2.5 py-0.5 rounded-full">
                      <IcCheck size={9} /> Completed{p.score ? ` · ${p.score}%` : ''}
                    </span>
                  </>
                )}
                {p.needsReview && (
                  <>
                    <span className="w-px h-3 bg-white/20" />
                    <span className="text-[11px] font-semibold text-amber-300 bg-amber-900/40 border border-amber-700/40 px-2.5 py-0.5 rounded-full">
                      Review Recommended
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quiz CTA */}
            <div className="shrink-0">
              <button
                onClick={() => onStartQuiz(moduleId)}
                className="flex items-center gap-2 text-[13px] font-semibold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90 shadow-sm"
                style={{ background: trackColor }}
              >
                {p.status === 'complete' ? 'Retake Quiz' : 'Take Quiz'}
                <IcChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout: main content + sticky sidebar ──────────────── */}
      <div className="flex gap-6 items-start">

        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Learning Objectives */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#e2e8f0]" style={{ background: '#f8fafc' }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#e1f0ff', color: '#007aff' }}>
                <IcTarget size={13} />
              </div>
              <span className="text-[13px] font-semibold" style={{ color: '#0B1829' }}>Learning Objectives</span>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mod.topics.map(t => (
                <div key={t} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-[5px] shrink-0" style={{ background: trackColor }} />
                  <span className="text-[13px] text-slate-600 leading-snug">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video preamble (full-width, no card border — it has its own dark shell) */}
          {preamble && (
            <div id="section-video" className="lesson-content rounded-xl overflow-hidden scroll-mt-20" dangerouslySetInnerHTML={{ __html: preamble.body }} />
          )}

          {/* Content section cards */}
          {contentSections.map((section, idx) => (
            <div key={idx} id={`section-${idx}`} className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden scroll-mt-20">
              {/* Section header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e2e8f0]" style={{ background: '#f8fafc' }}>
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                  style={{ background: trackColor }}
                >
                  {idx + 1}
                </span>
                <h2
                  className="text-[14px] font-semibold leading-snug"
                  style={{ color: '#0B1829' }}
                  dangerouslySetInnerHTML={{ __html: section.heading! }}
                />
              </div>
              {/* Section body */}
              <div className="p-5 sm:p-6 lesson-content lesson-section-body" dangerouslySetInnerHTML={{ __html: section.body }} />
            </div>
          ))}

          {/* Practice coding exercise */}
          {QUIZ_EXERCISES[moduleId] && (
            <div id="section-exercise" className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden scroll-mt-20">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#e2e8f0]" style={{ background: '#f8fafc' }}>
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: '#007aff' }}
                >
                  Practice
                </span>
                <span className="text-[13px] font-semibold" style={{ color: '#0B1829' }}>Coding Exercise</span>
                <span className="text-[11px] text-slate-400 ml-auto">Use the JScript editor below</span>
              </div>
              <div className="p-5">
                <BenSelectScriptEditor moduleId={moduleId} mode="lesson" />
              </div>
            </div>
          )}

          {/* Quiz CTA footer */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-[14px] font-semibold" style={{ color: '#0B1829' }}>Ready to test your knowledge?</div>
              <div className="text-[12px] text-slate-500 mt-0.5">Score 60% or higher to unlock the next module</div>
            </div>
            <button
              onClick={() => onStartQuiz(moduleId)}
              className="shrink-0 flex items-center gap-2 text-[13px] font-semibold text-white px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: '#007aff' }}
            >
              {p.status === 'complete' ? 'Retake Quiz' : 'Take Module Quiz'}
              <IcChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Sticky sidebar: section TOC (desktop only) */}
        <aside className="hidden lg:block w-48 xl:w-52 shrink-0 sticky top-[76px]" aria-label="In this module">
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e2e8f0]" style={{ background: '#f8fafc' }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">In this module</span>
            </div>
            <nav className="p-2">
              {preamble && (
                <a
                  href="#section-video"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-slate-500 hover:bg-slate-50 hover:text-[#007aff] transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300" />
                  Video Overview
                </a>
              )}
              {contentSections.map((s, idx) => (
                <a
                  key={idx}
                  href={`#section-${idx}`}
                  className="flex items-start gap-2 px-3 py-2 rounded-lg text-[11px] text-slate-500 hover:bg-slate-50 hover:text-[#007aff] transition-colors"
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-px"
                    style={{ background: trackColor }}
                  >
                    {idx + 1}
                  </span>
                  <span className="leading-snug" dangerouslySetInnerHTML={{ __html: s.heading! }} />
                </a>
              ))}
              {QUIZ_EXERCISES[moduleId] && (
                <a
                  href="#section-exercise"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-slate-500 hover:bg-slate-50 hover:text-[#007aff] transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#007aff' }} />
                  Practice Exercise
                </a>
              )}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  )
}

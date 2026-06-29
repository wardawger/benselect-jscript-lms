import { useMemo, useEffect, useState, useRef } from 'react'
import { MODULES } from '@/data/modules'
import { LESSONS } from '@/data/lessons'
import { QUIZ_EXERCISES } from '@/data/quizExercises'
import { BenSelectScriptEditor } from './BenSelectScriptEditor'
import type { AppState } from '@/store/progress'
import { IcClock, IcCheck, IcChevronRight, IcTarget } from './Icons'

interface LessonPageProps {
  moduleId: number
  state: AppState
  sidebarCollapsed?: boolean
  onStartQuiz: (moduleId: number) => void
  onBack: () => void
}

interface LessonSection {
  heading: string | null
  body: string
}

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
  'Track 1': '#3FA9F5',
  'Track 2': '#FF8300',
  'Track 3': '#28A87C',
  'Exam':    '#DA291C',
}

// ── Unique SVG tile pattern per module ──────────────────────────────────────
function ModulePattern({ id, color }: { id: number; color: string }) {
  const pid = `mp${id}`
  const c = color
  const o = 0.18

  const patterns: Record<number, React.ReactNode> = {
    1: <pattern id={pid} width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="14" cy="14" r="2" fill={c} opacity={o} />
       </pattern>,
    2: <pattern id={pid} width="48" height="16" patternUnits="userSpaceOnUse">
        <rect x="0" y="6" width="32" height="2" rx="1" fill={c} opacity={o} />
        <rect x="0" y="12" width="20" height="2" rx="1" fill={c} opacity={o * 0.6} />
       </pattern>,
    3: <pattern id={pid} width="40" height="40" patternUnits="userSpaceOnUse">
        <rect x="4" y="4" width="32" height="32" rx="2" fill="none" stroke={c} strokeWidth="1.5" opacity={o} />
        <rect x="12" y="12" width="16" height="16" rx="2" fill="none" stroke={c} strokeWidth="1" opacity={o * 0.6} />
       </pattern>,
    4: <pattern id={pid} width="36" height="31.2" patternUnits="userSpaceOnUse">
        <polygon points="18,2 32,9.6 32,24.6 18,32.2 4,24.6 4,9.6" fill="none" stroke={c} strokeWidth="1.2" opacity={o} />
       </pattern>,
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
    6: <pattern id={pid} width="32" height="24" patternUnits="userSpaceOnUse">
        <polyline points="0,12 8,4 16,20 24,8 32,12" fill="none" stroke={c} strokeWidth="1.5" opacity={o} strokeLinecap="round" strokeLinejoin="round" />
       </pattern>,
    7: <pattern id={pid} width="32" height="32" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="32" y2="0" stroke={c} strokeWidth="0.6" opacity={o} />
        <line x1="0" y1="0" x2="0"  y2="32" stroke={c} strokeWidth="0.6" opacity={o} />
        <line x1="16" y1="0" x2="16" y2="32" stroke={c} strokeWidth="0.3" opacity={o * 0.5} />
        <line x1="0" y1="16" x2="32" y2="16" stroke={c} strokeWidth="0.3" opacity={o * 0.5} />
       </pattern>,
    8: <pattern id={pid} width="60" height="60" patternUnits="userSpaceOnUse">
        <circle cx="30" cy="30" r="6"  fill="none" stroke={c} strokeWidth="1.2" opacity={o} />
        <circle cx="30" cy="30" r="14" fill="none" stroke={c} strokeWidth="0.8" opacity={o * 0.6} />
        <circle cx="30" cy="30" r="22" fill="none" stroke={c} strokeWidth="0.5" opacity={o * 0.35} />
       </pattern>,
    9: <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="20" y2="0" stroke={c} strokeWidth="1.5" opacity={o} />
        <line x1="-10" y1="20" x2="10" y2="0" stroke={c} strokeWidth="1.5" opacity={o} />
        <line x1="10" y1="20" x2="30" y2="0" stroke={c} strokeWidth="1.5" opacity={o} />
       </pattern>,
    10: <pattern id={pid} width="48" height="40" patternUnits="userSpaceOnUse">
         {[0,1,2,3].map(col => [0,1,2].map(row => (
           <rect key={`${col}-${row}`} x={col * 12 + 2} y={row * 12 + 10} width="8" height="8" rx="1" fill={c} opacity={row === 0 && col < 2 ? o * 1.2 : o * 0.5} />
         )))}
         <rect x="0" y="2" width="46" height="6" rx="2" fill={c} opacity={o * 0.4} />
        </pattern>,
    11: <pattern id={pid} width="32" height="28" patternUnits="userSpaceOnUse">
         <polygon points="16,2 30,26 2,26" fill="none" stroke={c} strokeWidth="1.2" opacity={o} />
         <polygon points="0,28 14,4 28,28" fill="none" stroke={c} strokeWidth="0.7" opacity={o * 0.4} />
        </pattern>,
    12: <pattern id={pid} width="48" height="48" patternUnits="userSpaceOnUse">
         <line x1="24" y1="48" x2="24" y2="24" stroke={c} strokeWidth="1.5" opacity={o} strokeLinecap="round" />
         <line x1="24" y1="24" x2="8"  y2="8"  stroke={c} strokeWidth="1.2" opacity={o} strokeLinecap="round" />
         <line x1="24" y1="24" x2="40" y2="8"  stroke={c} strokeWidth="1.2" opacity={o} strokeLinecap="round" />
         <circle cx="8"  cy="8"  r="3" fill={c} opacity={o} />
         <circle cx="40" cy="8"  r="3" fill={c} opacity={o} />
        </pattern>,
    13: <pattern id={pid} width="48" height="40" patternUnits="userSpaceOnUse">
         <rect x="4"  y="24" width="6" height="14" rx="1" fill={c} opacity={o} />
         <rect x="14" y="14" width="6" height="24" rx="1" fill={c} opacity={o} />
         <rect x="24" y="8"  width="6" height="30" rx="1" fill={c} opacity={o} />
         <rect x="34" y="18" width="6" height="20" rx="1" fill={c} opacity={o} />
         <line x1="0" y1="38" x2="48" y2="38" stroke={c} strokeWidth="1" opacity={o * 0.6} />
        </pattern>,
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

// ── Step type ────────────────────────────────────────────────────────────────
type Step =
  | { kind: 'objectives' }
  | { kind: 'preamble'; section: LessonSection }
  | { kind: 'section'; section: LessonSection; index: number }
  | { kind: 'exercise' }

export function LessonPage({ moduleId, state, sidebarCollapsed, onStartQuiz, onBack }: LessonPageProps) {
  const mod = MODULES.find(m => m.id === moduleId)
  if (!mod) return null

  const lessonHtml = LESSONS[moduleId] ?? '<p>Lesson content coming soon.</p>'
  const p = state.progress[moduleId]
  const trackColor = TRACK_COLOR[mod.track] ?? '#3FA9F5'
  const hasExercise = Boolean(QUIZ_EXERCISES[moduleId])

  const sections = useMemo(() => parseSections(lessonHtml), [lessonHtml])
  const preamble = sections[0]?.heading === null ? sections[0] : null
  const contentSections = sections.filter(s => s.heading !== null)

  // Build steps array
  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [{ kind: 'objectives' }]
    if (preamble) s.push({ kind: 'preamble', section: preamble })
    contentSections.forEach((section, index) => s.push({ kind: 'section', section, index }))
    if (hasExercise) s.push({ kind: 'exercise' })
    return s
  }, [preamble, contentSections, hasExercise])

  const [currentStep, setCurrentStep] = useState(0)
  const [animState, setAnimState] = useState<'idle' | 'exit' | 'enter'>('idle')
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const pendingStep = useRef<number | null>(null)

  const total = steps.length
  const isLast = currentStep === total - 1
  const completedStepsCount = currentStep
  const pctComplete = Math.round((completedStepsCount / total) * 100)

  // Step label for bottom bar
  function stepLabel(step: Step): string {
    if (step.kind === 'objectives') return 'Learning Objectives'
    if (step.kind === 'preamble') return 'Video Overview'
    if (step.kind === 'section') return step.section.heading ? step.section.heading.replace(/<[^>]+>/g, '') : `Section ${step.index + 1}`
    return 'Practice Exercise'
  }

  function goTo(idx: number) {
    if (idx === currentStep) return
    const dir = idx > currentStep ? 'forward' : 'back'
    setDirection(dir)
    setAnimState('exit')
    pendingStep.current = idx
  }

  // Drive the exit → enter sequence
  useEffect(() => {
    if (animState === 'exit') {
      const t = setTimeout(() => {
        if (pendingStep.current !== null) {
          setCurrentStep(pendingStep.current)
          pendingStep.current = null
        }
        setAnimState('enter')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 180)
      return () => clearTimeout(t)
    }
    if (animState === 'enter') {
      const t = setTimeout(() => setAnimState('idle'), 220)
      return () => clearTimeout(t)
    }
  }, [animState])

  function goNext() {
    if (isLast) { onStartQuiz(moduleId); return }
    goTo(currentStep + 1)
  }

  function goPrev() {
    if (currentStep > 0) goTo(currentStep - 1)
  }

  // Re-inject copy buttons whenever step changes
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>('.lesson-content .code-block:not([data-copy])')
    blocks.forEach(block => {
      block.setAttribute('data-copy', '1')
      const btn = document.createElement('button')
      btn.className = 'code-copy-btn'
      btn.setAttribute('aria-label', 'Copy code')
      btn.innerHTML =
        `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">` +
        `<rect x="5" y="5" width="9" height="9" rx="1.5"/>` +
        `<path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"/>` +
        `</svg>Copy Code`
      btn.addEventListener('click', e => {
        e.stopPropagation()
        const text = block.innerText.replace(/^Copy Code\n?/, '')
        navigator.clipboard.writeText(text).then(() => {
          btn.innerHTML =
            `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">` +
            `<polyline points="2 8 6 12 14 4"/>` +
            `</svg>Copied!`
          btn.classList.add('code-copy-btn--copied')
          setTimeout(() => {
            btn.innerHTML =
              `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">` +
              `<rect x="5" y="5" width="9" height="9" rx="1.5"/>` +
              `<path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"/>` +
              `</svg>Copy Code`
            btn.classList.remove('code-copy-btn--copied')
          }, 2000)
        })
      })
      block.style.position = 'relative'
      block.appendChild(btn)
    })
  }, [currentStep, moduleId])

  // Reset step when module changes
  useEffect(() => { setCurrentStep(0) }, [moduleId])

  const step = steps[currentStep]

  return (
    <div className="flex flex-col min-h-[calc(100vh-60px)] overflow-x-hidden" style={{ background: '#EEF3F8' }}>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full" style={{ paddingBottom: '8rem' }}>

        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-5">
          <button onClick={onBack} className="hover:text-[#2A6EBB] transition-colors">Dashboard</button>
          <IcChevronRight size={10} />
          <span>{mod.track}</span>
          <IcChevronRight size={10} />
          <span className="text-[#0B1829] font-medium truncate" aria-current="page">Module {mod.id}</span>
        </nav>

        {/* ── Module header card ───────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden mb-6 relative" style={{ background: '#0B1829' }}>
          <ModulePattern id={moduleId} color={trackColor} />
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: trackColor }} />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white tracking-wide"
                    style={{ background: trackColor }}>
                    {mod.track}
                  </span>
                  <span className="text-[12px] font-mono text-white/40">Module {mod.id} of 14</span>
                </div>
                <h1 className="text-[22px] sm:text-[26px] font-bold tracking-tight leading-tight mb-3 text-white break-words"
                  style={{ fontFamily: 'var(--font-display)' }}>
                  {mod.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[12px] text-white/60">
                    <IcClock size={13} /> {mod.time}
                  </span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="text-[12px] text-white/60">{total} sections</span>
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
              <div className="shrink-0">
                <button
                  onClick={() => onStartQuiz(moduleId)}
                  className="flex items-center gap-2 text-[13px] font-semibold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: trackColor }}
                >
                  {p.status === 'complete' ? 'Retake Quiz' : 'Take Quiz'}
                  <IcChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column: main content + sidebar ──────────────────────────── */}
        <div className="flex gap-6 items-start">

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div
            className="flex-1 min-w-0"
            style={{
              opacity: animState === 'exit' ? 0 : 1,
              transform: animState === 'exit'
                ? `translateX(${direction === 'forward' ? '-18px' : '18px'})`
                : animState === 'enter'
                ? `translateX(${direction === 'forward' ? '18px' : '-18px'})`
                : 'translateX(0)',
              transition: animState === 'idle'
                ? 'none'
                : 'opacity 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.4,0,0.2,1)',
            }}
          >

            {/* Step: Learning Objectives */}
            {step.kind === 'objectives' && (
              <div className="bg-white rounded-xl border border-[#E2ECF5] overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#E2ECF5]" style={{ background: '#F8FAFC' }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${trackColor}22`, color: trackColor }}>
                    <IcTarget size={13} />
                  </div>
                  <span className="text-[13px] font-semibold text-[#0B1829]">Learning Objectives</span>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mod.topics.map(t => (
                    <div key={t} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full mt-[5px] shrink-0" style={{ background: trackColor }} />
                      <span className="text-[13px] text-[#3A5068] leading-snug">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step: Video preamble */}
            {step.kind === 'preamble' && (
              <div className="lesson-content rounded-xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: step.section.body }} />
            )}

            {/* Step: Content section */}
            {step.kind === 'section' && (
              <div className="bg-white rounded-xl border border-[#E2ECF5] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2ECF5]" style={{ background: '#F8FAFC' }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                    style={{ background: trackColor }}>
                    {step.index + 1}
                  </span>
                  <h2 className="text-[14px] font-semibold text-[#0B1829] leading-snug"
                    dangerouslySetInnerHTML={{ __html: step.section.heading! }} />
                </div>
                <div className="p-5 sm:p-6 lesson-content lesson-section-body"
                  dangerouslySetInnerHTML={{ __html: step.section.body }} />
              </div>
            )}

            {/* Step: Practice exercise */}
            {step.kind === 'exercise' && (
              <div className="bg-white rounded-xl border border-[#E2ECF5] overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#E2ECF5]" style={{ background: '#F8FAFC' }}>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: '#2A6EBB' }}>
                    Practice
                  </span>
                  <span className="text-[13px] font-semibold text-[#0B1829]">Coding Exercise</span>
                  <span className="text-[11px] text-slate-400 ml-auto">Use the JScript editor below</span>
                </div>
                <div className="p-5">
                  <BenSelectScriptEditor moduleId={moduleId} mode="lesson" />
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar: section list ─────────────────────────────────────── */}
          <aside className="hidden lg:block w-52 xl:w-60 shrink-0 sticky top-[76px]" aria-label="Module sections">
            <div className="bg-white rounded-xl border border-[#E2ECF5] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E2ECF5]" style={{ background: '#F8FAFC' }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A9BB8]">In this module</span>
              </div>
              <nav className="p-2 space-y-0.5">
                {steps.map((s, idx) => {
                  const isCurrent = idx === currentStep
                  const isDone = idx < currentStep
                  const label = stepLabel(s)
                  return (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={[
                        'w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer',
                        isCurrent
                          ? 'text-white'
                          : isDone
                          ? 'text-[#3A5068] hover:bg-[#F4F7FB]'
                          : 'text-[#7A9BB8] hover:bg-[#F4F7FB]',
                      ].join(' ')}
                      style={isCurrent ? { background: trackColor } : undefined}
                    >
                      <span className={[
                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-px text-[9px] font-bold transition-all',
                        isCurrent ? 'bg-white/25 text-white' : isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-[#EEF3F8] text-[#7A9BB8]',
                      ].join(' ')}>
                        {isDone ? <IcCheck size={9} /> : idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[11.5px] font-medium leading-snug truncate ${isCurrent ? 'text-white' : ''}`}>
                          {label}
                        </div>
                        {isCurrent && (
                          <div className="text-[10px] mt-0.5 font-semibold uppercase tracking-wider text-white/70">
                            Current
                          </div>
                        )}
                        {isDone && !isCurrent && (
                          <div className="text-[10px] mt-0.5 text-emerald-500 font-medium">Done</div>
                        )}
                      </div>
                    </button>
                  )
                })}

                {/* Quiz entry — always at bottom */}
                <div className="mt-1 pt-1 border-t border-[#E8F0F8]">
                  <button
                    onClick={() => onStartQuiz(moduleId)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left hover:bg-[#F4F7FB] transition-colors cursor-pointer group"
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${trackColor}22`, color: trackColor }}>
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
                        <polygon points="1,1 8,4.5 1,8"/>
                      </svg>
                    </span>
                    <div>
                      <div className="text-[11.5px] font-semibold text-[#0B1829] group-hover:text-[#2A6EBB] transition-colors">
                        {p.status === 'complete' ? 'Retake Quiz' : 'Module Quiz'}
                      </div>
                      <div className="text-[10px] text-[#7A9BB8] mt-0.5">60% to pass</div>
                    </div>
                  </button>
                </div>
              </nav>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Sticky bottom nav bar ────────────────────────────────────────────── */}
      <div className={`fixed bottom-0 right-0 z-30 border-t border-[#D0DEF0] left-0 ${!sidebarCollapsed ? 'lg:left-60' : ''}`}
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">

          {/* Previous */}
          <button
            onClick={goPrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#3A5068] hover:text-[#0B1829] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 7H3M6 4L3 7l3 3"/>
            </svg>
            Previous
          </button>

          {/* Progress */}
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] text-[#7A9BB8]">
              <span className="font-medium truncate hidden sm:block">
                {stepLabel(step)}
              </span>
              <span className="font-mono shrink-0">Section {currentStep + 1} of {total}</span>
              <span className="shrink-0 hidden sm:block">{pctComplete}% complete</span>
            </div>
            <div className="h-1 rounded-full bg-[#E2ECF5] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / total) * 100}%`, background: trackColor }}
              />
            </div>
          </div>

          {/* Next / Quiz */}
          <button
            onClick={goNext}
            className="flex items-center gap-2 text-[13px] font-semibold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90 cursor-pointer shrink-0"
            style={{ background: isLast ? '#2A6EBB' : trackColor }}
          >
            {isLast
              ? (p.status === 'complete' ? 'Retake Quiz' : 'Take Quiz')
              : 'Continue'}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 7h8M8 4l3 3-3 3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

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
      <div className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-5">
        <button onClick={onBack} className="hover:text-[#007aff] transition-colors">Dashboard</button>
        <IcChevronRight size={10} />
        <span className="text-slate-400">{mod.track}</span>
        <IcChevronRight size={10} />
        <span className="text-[#0d1e3d] font-medium truncate">Module {mod.id}</span>
      </div>

      {/* ── Module header card ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden mb-6">
        {/* Color accent bar keyed to track */}
        <div className="h-1 w-full" style={{ background: trackColor }} />

        <div className="p-6 sm:p-8">
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
                <span className="text-[12px] font-mono text-slate-400">Module {mod.id} of 14</span>
              </div>

              <h1 className="text-[22px] sm:text-[26px] font-bold tracking-tight leading-tight mb-3" style={{ color: '#0d1e3d' }}>
                {mod.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                  <IcClock size={13} /> {mod.time}
                </span>
                <span className="w-px h-3 bg-slate-200" />
                <span className="text-[12px] text-slate-500">{mod.topics.length} topics</span>
                {p.status === 'complete' && (
                  <>
                    <span className="w-px h-3 bg-slate-200" />
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                      <IcCheck size={9} /> Completed{p.score ? ` · ${p.score}%` : ''}
                    </span>
                  </>
                )}
                {p.needsReview && (
                  <>
                    <span className="w-px h-3 bg-slate-200" />
                    <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
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
                style={{ background: '#007aff' }}
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
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#e2e8f0]" style={{ background: '#f8fafc' }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#e1f0ff', color: '#007aff' }}>
                <IcTarget size={13} />
              </div>
              <span className="text-[13px] font-semibold" style={{ color: '#0d1e3d' }}>Learning Objectives</span>
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
            <div key={idx} id={`section-${idx}`} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden scroll-mt-20">
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
                  style={{ color: '#0d1e3d' }}
                  dangerouslySetInnerHTML={{ __html: section.heading! }}
                />
              </div>
              {/* Section body */}
              <div className="p-5 sm:p-6 lesson-content lesson-section-body" dangerouslySetInnerHTML={{ __html: section.body }} />
            </div>
          ))}

          {/* Practice coding exercise */}
          {QUIZ_EXERCISES[moduleId] && (
            <div id="section-exercise" className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden scroll-mt-20">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#e2e8f0]" style={{ background: '#f8fafc' }}>
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: '#007aff' }}
                >
                  Practice
                </span>
                <span className="text-[13px] font-semibold" style={{ color: '#0d1e3d' }}>Coding Exercise</span>
                <span className="text-[11px] text-slate-400 ml-auto">Use the JScript editor below</span>
              </div>
              <div className="p-5">
                <BenSelectScriptEditor moduleId={moduleId} mode="lesson" />
              </div>
            </div>
          )}

          {/* Quiz CTA footer */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-[14px] font-semibold" style={{ color: '#0d1e3d' }}>Ready to test your knowledge?</div>
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
        <aside className="hidden xl:block w-52 shrink-0 sticky top-[76px]">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
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

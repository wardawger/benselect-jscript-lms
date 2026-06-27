import { MODULES } from '@/data/modules'
import { LESSONS } from '@/data/lessons'
import { QUIZ_EXERCISES } from '@/data/quizExercises'
import { BenSelectScriptEditor } from './BenSelectScriptEditor'
import type { AppState } from '@/store/progress'

interface LessonPageProps {
  moduleId: number
  state: AppState
  onStartQuiz: (moduleId: number) => void
  onBack: () => void
}

export function LessonPage({ moduleId, state, onStartQuiz, onBack }: LessonPageProps) {
  const mod = MODULES.find(m => m.id === moduleId)
  if (!mod) return null
  const lessonHtml = LESSONS[moduleId] ?? '<p>Lesson content coming soon.</p>'
  const p = state.progress[moduleId]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5 pb-5 border-b border-[#E8F0F8]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={onBack} className="text-[12px] text-[#7A9BB8] hover:text-[#2A6EBB] transition-colors">← Back</button>
            <span className="text-[#E8F0F8]">·</span>
            <span className="text-[11px] font-medium text-[#4A9FD4] uppercase tracking-wider">{mod.track}</span>
          </div>
          <h1 className="text-[22px] font-bold text-[#0B1829] tracking-tight leading-tight">
            Module {mod.id}: {mod.title}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[12px] text-[#7A9BB8]">⏱ {mod.time}</span>
            {p.status === 'complete' && (
              <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">✓ Completed{p.score ? ` · ${p.score}%` : ''}</span>
            )}
            {p.needsReview && (
              <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">Review recommended</span>
            )}
          </div>
        </div>
        <div className="shrink-0 flex gap-2 flex-wrap justify-end">
          <button
            onClick={() => onStartQuiz(moduleId)}
            className="bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] text-white text-[13px] font-medium px-4 py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            {p.status === 'complete' ? 'Retake Quiz' : 'Take Quiz →'}
          </button>
        </div>
      </div>

      {/* Topics */}
      <div className="bg-[#EBF4FB] rounded-xl p-4 mb-6 flex flex-wrap gap-2">
        <span className="text-[11px] font-semibold text-[#2A6EBB] uppercase tracking-wider mr-1">Topics:</span>
        {mod.topics.map(t => (
          <span key={t} className="text-[12px] text-[#2A6EBB] bg-white/70 px-2.5 py-0.5 rounded-full border border-[rgba(74,159,212,0.2)]">{t}</span>
        ))}
      </div>

      {/* Lesson content */}
      <div
        className="lesson-content"
        dangerouslySetInnerHTML={{ __html: lessonHtml }}
      />

      {/* Practice coding challenge — Selerix-style plan JScript editor */}
      {QUIZ_EXERCISES[moduleId] && <BenSelectScriptEditor moduleId={moduleId} mode="lesson" />}

      {/* Quiz CTA at bottom */}
      <div className="mt-10 pt-6 border-t border-[#E8F0F8] flex items-center justify-between">
        <div>
          <div className="text-[13px] font-semibold text-[#0B1829]">Ready to test your knowledge?</div>
          <div className="text-[12px] text-[#7A9BB8] mt-0.5">60% required to advance to the next module</div>
        </div>
        <button
          onClick={() => onStartQuiz(moduleId)}
          className="bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
        >
          {p.status === 'complete' ? 'Retake Quiz' : 'Take Module Quiz →'}
        </button>
      </div>
    </div>
  )
}

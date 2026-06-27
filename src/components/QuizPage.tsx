import { useState, useEffect } from 'react'
import { IcCheck, IcX } from './Icons'
import { QUIZ } from '@/data/quizzes'
import { QUIZ_EXERCISES } from '@/data/quizExercises'
import { BenSelectScriptEditor } from './BenSelectScriptEditor'
import { cn } from '@/lib/utils'

interface QuizPageProps {
  moduleId: number
  onComplete: (moduleId: number, score: number, passed: boolean) => void
  onBack: () => void
}

type AnswerState = 'unanswered' | 'correct' | 'wrong'

interface Answer {
  selected: number | null
  state: AnswerState
}

// Animated score ring using SVG
function ScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const [animated, setAnimated] = useState(false)
  const r = 54
  const circ = 2 * Math.PI * r
  const filled = animated ? (score / 100) * circ : 0

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80)
    return () => clearTimeout(t)
  }, [])

  const color = passed ? '#28A87C' : '#E84C4C'
  const bg = passed ? 'rgba(40,168,124,0.08)' : 'rgba(232,76,76,0.08)'

  return (
    <div className="relative w-36 h-36 mx-auto mb-6">
      {/* Glow */}
      <div className="absolute inset-0 rounded-full" style={{ background: bg, filter: 'blur(16px)', transform: 'scale(0.85)' }} />
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        {/* Track */}
        <circle cx="64" cy="64" r={r} fill="none" stroke="#E8F0F8" strokeWidth="10" />
        {/* Fill */}
        <circle
          cx="64" cy="64" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - filled}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[32px] font-bold leading-none tracking-tight" style={{ color }}>{score}%</div>
        <div className="text-[12px] text-[#7A9BB8] mt-1 font-medium">{passed ? 'Passed' : 'Failed'}</div>
      </div>
    </div>
  )
}

export function QuizPage({ moduleId, onComplete, onBack }: QuizPageProps) {
  const questions = QUIZ[moduleId] ?? []
  const [answers, setAnswers] = useState<Answer[]>(questions.map(() => ({ selected: null, state: 'unanswered' })))
  const [submitted, setSubmitted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [hoveredQ, setHoveredQ] = useState<number | null>(null)
  const [exerciseBonus, setExerciseBonus] = useState(0)

  // Scroll to top when result appears
  useEffect(() => {
    if (showResult) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [showResult])

  function selectAnswer(qi: number, oi: number) {
    if (submitted) return
    setAnswers(prev => prev.map((a, i) => i === qi ? { ...a, selected: oi } : a))
  }

  function submit() {
    if (answers.some(a => a.selected === null)) {
      alert('Please answer all questions before submitting.')
      return
    }
    const graded = answers.map((a, i) => ({
      ...a,
      state: (a.selected === questions[i].a ? 'correct' : 'wrong') as AnswerState
    }))
    setAnswers(graded)
    setSubmitted(true)
    setShowResult(true)
  }

  const correctCount = answers.filter(a => a.state === 'correct').length
  const mcScore = submitted ? Math.round((correctCount / questions.length) * 100) : 0
  const score = Math.min(100, mcScore + exerciseBonus)
  const passed = score >= 60

  if (showResult) {
    return (
      <div className="p-8 max-w-2xl">
        {/* Result card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8F0F8] mb-6">
          <div className="text-center">
            <ScoreRing score={score} passed={passed} />

            <div className="text-[20px] font-bold text-[#0B1829] mb-1">{passed ? 'Quiz Passed!' : 'Not Yet Passed'}</div>
            <div className="text-[13px] text-[#3A5068] mb-4">{correctCount} of {questions.length} questions correct</div>

            {/* Stats mini-grid */}
            <div className={`grid gap-3 mb-5 text-left ${exerciseBonus > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E8F0F8]">
                <div className="text-[10px] text-[#7A9BB8] uppercase tracking-wider font-medium mb-1">Correct</div>
                <div className="text-[22px] font-bold text-[#0B1829]">{correctCount}<span className="text-[13px] text-[#7A9BB8] font-normal">/{questions.length}</span></div>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E8F0F8]">
                <div className="text-[10px] text-[#7A9BB8] uppercase tracking-wider font-medium mb-1">Score</div>
                <div className="text-[22px] font-bold" style={{ color: passed ? '#28A87C' : '#E84C4C' }}>{score}<span className="text-[13px] font-normal text-[#7A9BB8]">%</span></div>
              </div>
              {exerciseBonus > 0 && (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <div className="text-[10px] text-emerald-600 uppercase tracking-wider font-medium mb-1">Coding Bonus</div>
                  <div className="text-[22px] font-bold text-emerald-700">+{exerciseBonus}<span className="text-[13px] font-normal text-emerald-500">pts</span></div>
                </div>
              )}
            </div>

            <div className="mb-5">
              <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-1.5 rounded-full ${passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {passed ? (
                  <><IcCheck size={12} /> 60% threshold met</>
                ) : (
                  <><IcX size={12} /> 60% required to advance</>
                )}
              </span>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              {passed && moduleId < 14 && (
                <button
                  onClick={() => onComplete(moduleId, score, passed)}
                  className="bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                >
                  Next Module →
                </button>
              )}
              {passed && moduleId === 14 && (
                <button
                  onClick={() => onComplete(moduleId, score, passed)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-[13px] font-medium px-5 py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                >
                  🏆 Claim Certificate
                </button>
              )}
              {!passed && (
                <button
                  onClick={() => { setSubmitted(false); setShowResult(false); setAnswers(questions.map(() => ({ selected: null, state: 'unanswered' }))) }}
                  className="bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                >
                  Review & Retry
                </button>
              )}
              <button
                onClick={() => { onComplete(moduleId, score, passed); onBack() }}
                className="border border-[#D0DEF0] text-[#3A5068] text-[13px] px-5 py-2.5 rounded-lg hover:bg-[#F4F7FB] transition-colors"
              >
                Back to Lesson
              </button>
            </div>
          </div>
        </div>

        {/* Question review */}
        <div className="space-y-4">
          {questions.map((q, qi) => {
            const ans = answers[qi]
            const isHovered = hoveredQ === qi
            return (
              <div
                key={qi}
                className={cn('bg-white rounded-xl p-5 shadow-sm border transition-all duration-200', isHovered ? 'border-[#4A9FD4] shadow-md' : 'border-[#E8F0F8]')}
                onMouseEnter={() => setHoveredQ(qi)}
                onMouseLeave={() => setHoveredQ(null)}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-[#4A9FD4] uppercase tracking-wider">Q{qi + 1}</span>
                  <span className={cn('flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', ans.state === 'correct' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                    {ans.state === 'correct' ? <><IcCheck size={9} /> Correct</> : <><IcX size={9} /> Incorrect</>}
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-[#0B1829] mb-3">{q.q}</div>
                <div className="space-y-2 mb-3">
                  {q.opts.map((opt, oi) => (
                    <div key={oi} className={cn(
                      'text-[13px] p-3 rounded-lg border transition-colors',
                      oi === q.a ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium' :
                      oi === ans.selected && ans.state === 'wrong' ? 'border-red-300 bg-red-50 text-red-800' :
                      'border-[#E8F0F8] text-[#7A9BB8]'
                    )}>
                      {oi === q.a && <IcCheck size={10} className="mr-1 inline-block text-emerald-600" />}{opt}
                    </div>
                  ))}
                </div>
                <div className={cn('text-[12.5px] p-3 rounded-lg border-l-[3px]',
                  ans.state === 'correct' ? 'bg-emerald-50 border-l-emerald-500 text-emerald-800' : 'bg-amber-50 border-l-amber-400 text-amber-800'
                )}>
                  <span className="font-semibold">Explanation: </span>{q.exp}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className="text-[12px] text-[#7A9BB8] hover:text-[#2A6EBB] transition-colors">← Back to Lesson</button>
        </div>
        <h1 className="text-[22px] font-bold text-[#0B1829] tracking-tight">Module {moduleId} Quiz</h1>
        <p className="text-[13px] text-[#3A5068] mt-1">{questions.length} questions · 60% required to pass</p>
      </div>

      <div className="space-y-5">
        {questions.map((q, qi) => (
          <div
            key={qi}
            className={cn('bg-white rounded-xl p-5 shadow-sm border transition-all', hoveredQ === qi ? 'border-[#4A9FD4]' : 'border-[#E8F0F8]')}
            onMouseEnter={() => setHoveredQ(qi)}
            onMouseLeave={() => setHoveredQ(null)}
          >
            <div className="text-[11px] font-mono text-[#4A9FD4] uppercase tracking-wider mb-1.5">Question {qi + 1}</div>
            <div className="text-[14px] font-semibold text-[#0B1829] mb-3 leading-snug">{q.q}</div>
            <div className="space-y-2">
              {q.opts.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => selectAnswer(qi, oi)}
                  className={cn(
                    'w-full text-left flex items-start gap-3 p-3 rounded-lg border-[1.5px] text-[13px] transition-all',
                    answers[qi].selected === oi
                      ? 'border-[#2A6EBB] bg-[#EBF4FB] text-[#0B1829] font-medium'
                      : 'border-[#D8E8F4] text-[#3A5068] hover:border-[#4A9FD4] hover:bg-[#EBF4FB]'
                  )}
                >
                  <input type="radio" readOnly checked={answers[qi].selected === oi} className="mt-0.5 shrink-0 accent-[#2A6EBB]" />
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Coding exercise (graded — bonus pts) — Selerix-style plan JScript editor */}
      {QUIZ_EXERCISES[moduleId] && (
        <div className="mt-6">
          <BenSelectScriptEditor moduleId={moduleId} mode="quiz" onScore={setExerciseBonus} />
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <span className="text-[13px] text-[#7A9BB8]">
          {answers.filter(a => a.selected !== null).length} of {questions.length} answered
        </span>
        <button
          onClick={submit}
          disabled={answers.some(a => a.selected === null)}
          className="bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] text-white text-[13px] font-medium px-6 py-2.5 rounded-lg shadow-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { IcCheck, IcX } from './Icons'
import { QUIZ, QUIZ_B } from '@/data/quizzes'
import { QUIZ_EXERCISES } from '@/data/quizExercises'
import { BenSelectScriptEditor } from './BenSelectScriptEditor'
import { cn } from '@/lib/utils'

interface QuizPageProps {
  moduleId: number
  attempts?: number
  onComplete: (moduleId: number, score: number, passed: boolean) => void
  onBack: () => void
}

type AnswerState = 'unanswered' | 'correct' | 'wrong'

interface Answer {
  /** Selected option indices — single-element for radio, multi for checkboxes */
  selected: number[]
  state: AnswerState
}

function isMulti(a: number | number[]): a is number[] {
  return Array.isArray(a)
}

function gradeAnswer(selected: number[], a: number | number[]): AnswerState {
  if (selected.length === 0) return 'unanswered'
  if (isMulti(a)) {
    const correct = [...a].sort()
    const given = [...selected].sort()
    return correct.length === given.length && correct.every((v, i) => v === given[i]) ? 'correct' : 'wrong'
  }
  return selected[0] === a ? 'correct' : 'wrong'
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
        <div className="text-[12px] text-[#5A7890] mt-1 font-medium">{passed ? 'Passed' : 'Failed'}</div>
      </div>
    </div>
  )
}

export function QuizPage({ moduleId, attempts = 0, onComplete, onBack }: QuizPageProps) {
  const versionB = attempts > 0 && QUIZ_B[moduleId] != null
  const questions = (versionB ? QUIZ_B[moduleId] : QUIZ[moduleId]) ?? []
  const [answers, setAnswers] = useState<Answer[]>(questions.map(() => ({ selected: [], state: 'unanswered' })))
  const [submitted, setSubmitted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [hoveredQ, setHoveredQ] = useState<number | null>(null)
  const [exerciseBonus, setExerciseBonus] = useState(0)
  const [validationError, setValidationError] = useState(false)

  // Scroll to top when result appears
  useEffect(() => {
    if (showResult) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [showResult])

  function selectAnswer(qi: number, oi: number) {
    if (submitted) return
    const multi = isMulti(questions[qi].a)
    setAnswers(prev => prev.map((a, i) => {
      if (i !== qi) return a
      if (multi) {
        const already = a.selected.includes(oi)
        return { ...a, selected: already ? a.selected.filter(x => x !== oi) : [...a.selected, oi] }
      }
      return { ...a, selected: [oi] }
    }))
    setValidationError(false)
  }

  function submit() {
    if (answers.some(a => a.selected.length === 0)) {
      setValidationError(true)
      return
    }
    setValidationError(false)
    const graded = answers.map((a, i) => ({
      ...a,
      state: gradeAnswer(a.selected, questions[i].a)
    }))
    setAnswers(graded)
    setSubmitted(true)
    setShowResult(true)
  }

  const correctCount = answers.filter(a => a.state === 'correct').length
  const mcScore = submitted ? Math.round((correctCount / questions.length) * 100) : 0
  const score = Math.min(100, mcScore + exerciseBonus)
  const passed = score >= 60

  // Fire confetti when quiz is passed
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const confettiRef = useRef<confetti.CreateTypes | null>(null)
  useEffect(() => {
    if (!showResult || !passed) return
    const canvas = canvasRef.current
    if (!canvas) return
    if (!confettiRef.current) {
      confettiRef.current = confetti.create(canvas, { resize: true, useWorker: true })
    }
    const fire = confettiRef.current
    const burst = (origin: { x: number; y: number }, angle: number) =>
      fire({ particleCount: 60, spread: 70, angle, origin, colors: ['#2A6EBB', '#4A9FD4', '#28A87C', '#F5A623', '#E84C4C', '#ffffff'] })
    burst({ x: 0.2, y: 0.6 }, 60)
    burst({ x: 0.8, y: 0.6 }, 120)
    const t = setTimeout(() => {
      burst({ x: 0.5, y: 0.5 }, 90)
    }, 350)
    return () => clearTimeout(t)
  }, [showResult, passed])

  if (showResult) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
        {/* Full-viewport confetti canvas (pointer-events:none so it doesn't block clicks) */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none z-50"
          style={{ display: passed ? 'block' : 'none' }}
        />
        {/* Result card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8F0F8] mb-6">
          <div className="text-center">
            <ScoreRing score={score} passed={passed} />

            <div className="text-[20px] font-bold text-[#0B1829] mb-1">{passed ? 'Quiz Passed!' : 'Not Yet Passed'}</div>
            <div className="text-[13px] text-bs-body mb-4">{correctCount} of {questions.length} questions correct</div>

            {/* Stats mini-grid */}
            <div className={`grid gap-3 mb-5 text-left ${exerciseBonus > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E8F0F8]">
                <div className="text-[11px] text-[#5A7890] font-medium mb-1">Correct</div>
                <div className="text-[22px] font-bold text-[#0B1829]">{correctCount}<span className="text-[13px] text-[#5A7890] font-normal">/{questions.length}</span></div>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E8F0F8]">
                <div className="text-[11px] text-[#5A7890] font-medium mb-1">Score</div>
                <div className="text-[22px] font-bold" style={{ color: passed ? '#28A87C' : '#E84C4C' }}>{score}<span className="text-[13px] font-normal text-[#5A7890]">%</span></div>
              </div>
              {exerciseBonus > 0 && (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <div className="text-[11px] text-emerald-600 font-medium mb-1">Coding Bonus</div>
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
                  className="text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ background: '#2A6EBB' }}
                >
                  Next Module →
                </button>
              )}
              {passed && moduleId === 14 && (
                <button
                  onClick={() => onComplete(moduleId, score, passed)}
                  className="text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ background: '#28A87C' }}
                >
                  🏆 Claim Certificate
                </button>
              )}
              {!passed && (
                <button
                  onClick={() => { setSubmitted(false); setShowResult(false); setAnswers(questions.map(() => ({ selected: [], state: 'unanswered' }))) }}
                  className="text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ background: '#2A6EBB' }}
                >
                  Review & Retry
                </button>
              )}
              <button
                onClick={() => { onComplete(moduleId, score, passed); onBack() }}
                className="border border-[#D0DEF0] text-bs-body text-[13px] px-5 py-2.5 rounded-lg hover:bg-[#F4F7FB] transition-colors"
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
            const correctSet = new Set(isMulti(q.a) ? q.a : [q.a])
            const multi = isMulti(q.a)
            return (
              <div
                key={qi}
                className={cn('bg-white rounded-xl p-5 shadow-sm border transition-all duration-200', isHovered ? 'border-[#4A9FD4] shadow-md' : 'border-[#E8F0F8]')}
                onMouseEnter={() => setHoveredQ(qi)}
                onMouseLeave={() => setHoveredQ(null)}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-[#4A9FD4]">Q{qi + 1}</span>
                  {multi && <span className="text-[10px] font-medium text-[#5A7890] bg-[#F4F7FB] px-2 py-0.5 rounded-full">Select all that apply</span>}
                  <span className={cn('flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', ans.state === 'correct' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                    {ans.state === 'correct' ? <><IcCheck size={9} /> Correct</> : <><IcX size={9} /> Incorrect</>}
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-[#0B1829] mb-3">{q.q}</div>
                <div className="space-y-2 mb-3">
                  {q.opts.map((opt, oi) => {
                    const isCorrectOpt = correctSet.has(oi)
                    const wasSelected = ans.selected.includes(oi)
                    const isWrongSelected = wasSelected && !isCorrectOpt
                    return (
                    <div key={oi} className={cn(
                      'text-[13px] p-3 rounded-lg border transition-colors',
                      isCorrectOpt ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium' :
                      isWrongSelected ? 'border-red-300 bg-red-50 text-red-800' :
                      'border-[#E8F0F8] text-[#5A7890]'
                    )}>
                      {isCorrectOpt && <IcCheck size={10} className="mr-1 inline-block text-emerald-600" />}{opt}
                    </div>
                  )})}
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className="text-[12px] text-[#5A7890] hover:text-[#2A6EBB] transition-colors">← Back to Lesson</button>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-[22px] font-bold text-[#0B1829] tracking-tight">Module {moduleId} Quiz</h1>
          {versionB && <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: '#EBF4FB', color: '#2A6EBB' }}>Retake Version</span>}
        </div>
        <p className="text-[13px] text-bs-body mt-1">{questions.length} questions · 60% required to pass</p>
      </div>

      <div className="space-y-5">
        {questions.map((q, qi) => {
          const multi = isMulti(q.a)
          return (
            <div
              key={qi}
              className={cn('bg-white rounded-xl p-5 shadow-sm border transition-all', hoveredQ === qi ? 'border-[#4A9FD4]' : 'border-[#E8F0F8]')}
              onMouseEnter={() => setHoveredQ(qi)}
              onMouseLeave={() => setHoveredQ(null)}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="text-[11px] font-mono text-[#4A9FD4]">Question {qi + 1}</div>
                {multi && <span className="text-[10px] font-medium text-[#5A7890] bg-[#F4F7FB] px-2 py-0.5 rounded-full">Select all that apply</span>}
              </div>
              <div className="text-[14px] font-semibold text-[#0B1829] mb-3 leading-snug">{q.q}</div>
              <div className="space-y-2">
                {q.opts.map((opt, oi) => {
                  const isSelected = answers[qi].selected.includes(oi)
                  return (
                    <button
                      key={oi}
                      onClick={() => selectAnswer(qi, oi)}
                      className={cn(
                        'w-full text-left flex items-start gap-3 p-3 rounded-lg border-[1.5px] text-[13px] transition-all cursor-pointer',
                        isSelected
                          ? 'border-[#2A6EBB] bg-[#EBF4FB] text-[#0B1829] font-medium'
                          : 'border-[#D8E8F4] text-bs-body hover:border-[#4A9FD4] hover:bg-[#F4F9FE]'
                      )}
                    >
                      {multi ? (
                        <span className={cn(
                          'w-4 h-4 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors',
                          isSelected ? 'border-[#2A6EBB] bg-[#2A6EBB]' : 'border-[#C8D8E8] bg-white'
                        )}>
                          {isSelected && <IcCheck size={9} className="text-white" />}
                        </span>
                      ) : (
                        <span className={cn(
                          'w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors',
                          isSelected ? 'border-[#2A6EBB] bg-[#2A6EBB]' : 'border-[#C8D8E8] bg-white'
                        )}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                        </span>
                      )}
                      <span>{opt}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Coding exercise (graded — bonus pts) — Selerix-style plan JScript editor */}
      {QUIZ_EXERCISES[moduleId] && (
        <div className="mt-6">
          <BenSelectScriptEditor moduleId={moduleId} mode="quiz" onScore={setExerciseBonus} />
        </div>
      )}

      <div className="mt-6 space-y-3">
        {validationError && (
          <div role="alert" className="flex items-center gap-2 text-[13px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r="0.75" fill="currentColor" stroke="none"/></svg>
            Please answer all {questions.length} questions before submitting.
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#5A7890]">
            {answers.filter(a => a.selected.length > 0).length} of {questions.length} answered
          </span>
          <button
            onClick={submit}
            className="text-white text-[13px] font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: '#2A6EBB' }}
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

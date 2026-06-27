import { useState } from 'react'
import { QUIZ } from '@/data/quizzes'

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

export function QuizPage({ moduleId, onComplete, onBack }: QuizPageProps) {
  const questions = QUIZ[moduleId] ?? []
  const [answers, setAnswers] = useState<Answer[]>(questions.map(() => ({ selected: null, state: 'unanswered' })))
  const [submitted, setSubmitted] = useState(false)
  const [showResult, setShowResult] = useState(false)

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
  const score = submitted ? Math.round((correctCount / questions.length) * 100) : 0
  const passed = score >= 60

  if (showResult) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8F0F8] text-center">
          {/* Score ring */}
          <div
            className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{
              background: `conic-gradient(${passed ? '#2A6EBB' : '#E84C4C'} 0deg, ${passed ? '#4A9FD4' : '#E84C4C'} ${score * 3.6}deg, #E8F0F8 ${score * 3.6}deg)`
            }}
          >
            <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">
              <div className={`text-[28px] font-bold leading-none ${passed ? 'text-[#2A6EBB]' : 'text-[#E84C4C]'}`}>{score}%</div>
              <div className="text-[12px] text-[#7A9BB8] mt-0.5">{correctCount}/{questions.length}</div>
            </div>
          </div>

          <div className="text-[18px] font-bold text-[#0B1829] mb-1.5">{passed ? 'Quiz Passed!' : 'Not Yet Passed'}</div>
          <div className="text-[13px] text-[#3A5068] mb-2">{correctCount} of {questions.length} questions correct</div>
          <div className="mb-6">
            <span className={`inline-flex text-[12px] font-semibold px-4 py-1.5 rounded-full ${passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {passed ? '✓ 60% threshold met' : '✗ 60% required to advance'}
            </span>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            {passed && moduleId < 14 && (
              <button
                onClick={() => onComplete(moduleId, score, passed)}
                className="bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg shadow-sm hover:opacity-90"
              >
                Next Module →
              </button>
            )}
            {!passed && (
              <button
                onClick={() => { setSubmitted(false); setShowResult(false); setAnswers(questions.map(() => ({ selected: null, state: 'unanswered' }))); }}
                className="bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg shadow-sm hover:opacity-90"
              >
                Review &amp; Retry
              </button>
            )}
            <button onClick={() => { onComplete(moduleId, score, passed); onBack(); }} className="border border-[#D0DEF0] text-[#3A5068] text-[13px] px-5 py-2.5 rounded-lg hover:bg-[#F4F7FB]">
              Dashboard
            </button>
          </div>
        </div>

        {/* Question review */}
        <div className="mt-6 space-y-4">
          {questions.map((q, qi) => (
            <div key={qi} className="bg-white rounded-xl p-5 shadow-sm border border-[#E8F0F8]">
              <div className="text-[11px] font-mono text-[#4A9FD4] uppercase tracking-wider mb-1.5">Q{qi + 1}</div>
              <div className="text-[14px] font-semibold text-[#0B1829] mb-3">{q.q}</div>
              <div className="space-y-2">
                {q.opts.map((opt, oi) => (
                  <div key={oi} className={cn(
                    'text-[13px] p-3 rounded-lg border',
                    oi === q.a ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium' :
                    oi === answers[qi].selected && answers[qi].state === 'wrong' ? 'border-red-300 bg-red-50 text-red-800' :
                    'border-[#E8F0F8] text-[#7A9BB8]'
                  )}>
                    {oi === q.a && '✓ '}{opt}
                  </div>
                ))}
              </div>
              <div className={cn('mt-3 text-[12.5px] p-3 rounded-lg border-l-[3px]',
                answers[qi].state === 'correct'
                  ? 'bg-emerald-50 border-l-emerald-500 text-emerald-800'
                  : 'bg-amber-50 border-l-amber-400 text-amber-800'
              )}>
                {q.exp}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className="text-[12px] text-[#7A9BB8] hover:text-[#2A6EBB]">← Back to Lesson</button>
        </div>
        <h1 className="text-[22px] font-bold text-[#0B1829] tracking-tight">Module {moduleId} Quiz</h1>
        <p className="text-[13px] text-[#3A5068] mt-1">{questions.length} questions · 60% required to pass</p>
      </div>

      <div className="space-y-5">
        {questions.map((q, qi) => (
          <div key={qi} className="bg-white rounded-xl p-5 shadow-sm border border-[#E8F0F8]">
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

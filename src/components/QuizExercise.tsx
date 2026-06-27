import { useState } from 'react'
import { QUIZ_EXERCISES } from '@/data/quizExercises'
import { CodeEditor } from './CodeEditor'

interface QuizExerciseProps {
  moduleId: number
  onScore: (bonus: number) => void
}

export function QuizExercise({ moduleId, onScore }: QuizExerciseProps) {
  const ex = QUIZ_EXERCISES[moduleId]
  if (!ex) return null

  const [code, setCode] = useState(ex.starter)
  const [submitted, setSubmitted] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [results, setResults] = useState<{ label: string; earned: boolean }[]>([])
  const [bonus, setBonus] = useState(0)

  function handleSubmit() {
    const scored = ex.keywords.map(kw => ({
      label: kw.label,
      earned: kw.pattern.test(code),
    }))
    const earned = scored.filter(r => r.earned).length
    const total = ex.keywords.length
    const b = Math.round((earned / total) * 2)
    setResults(scored)
    setBonus(b)
    setSubmitted(true)
    onScore(b)
  }

  function handleReset() {
    setCode(ex.starter)
    setSubmitted(false)
    setShowSolution(false)
    setResults([])
    setBonus(0)
    onScore(0)
  }

  const earnedCount = results.filter(r => r.earned).length
  const totalCount = ex.keywords.length

  return (
    <div className="mt-8 border-t border-[#E8F0F8] pt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-mono font-bold text-[#2A6EBB] bg-[#EBF4FB] px-2 py-0.5 rounded uppercase tracking-wider">Coding Challenge</span>
        <span className="text-[10px] font-mono text-[#7A9BB8]">+0–2 bonus points</span>
      </div>
      <h3 className="text-[15px] font-bold text-[#0B1829] mb-1">{ex.title}</h3>
      <p className="text-[13px] text-[#3A5068] mb-3">{ex.intro}</p>

      {/* Task box */}
      <div className="bg-[#EBF4FB] border border-[rgba(42,110,187,0.2)] rounded-xl p-4 mb-4">
        <div className="text-[10px] font-mono font-bold text-[#2A6EBB] uppercase tracking-wider mb-1">Task</div>
        <p className="text-[13px] text-[#0B1829] leading-relaxed">{ex.task}</p>
      </div>

      {/* Hints toggle */}
      <button
        onClick={() => setShowHints(h => !h)}
        className="text-[12px] text-[#2A6EBB] hover:underline mb-3 flex items-center gap-1"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="6" cy="6" r="5"/><line x1="6" y1="5" x2="6" y2="9"/><circle cx="6" cy="3.5" r="0.75" fill="currentColor" stroke="none"/>
        </svg>
        {showHints ? 'Hide hints' : 'Show hints'}
      </button>

      {showHints && (
        <div className="bg-[#FFF8ED] border border-[rgba(245,166,35,0.25)] rounded-xl p-4 mb-4 space-y-1.5">
          {ex.hints.map((h, i) => (
            <div key={i} className="text-[12.5px] font-mono text-[#7A5200] flex items-start gap-2">
              <span className="text-[#F5A623] mt-0.5 shrink-0">›</span>{h}
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <CodeEditor
        value={code}
        onChange={setCode}
        rows={12}
        disabled={submitted}
      />

      {/* Actions */}
      {!submitted ? (
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] text-white text-[13px] font-medium px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Submit Code
          </button>
        </div>
      ) : (
        <div className="mt-4">
          {/* Score banner */}
          <div className={`rounded-xl p-4 mb-4 border ${bonus === 2 ? 'bg-emerald-50 border-emerald-200' : bonus === 1 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[14px] font-bold" style={{ color: bonus === 2 ? '#28A87C' : bonus === 1 ? '#D4820A' : '#E84C4C' }}>
                {bonus === 2 ? '🏆 Full bonus! +2 pts' : bonus === 1 ? '⚡ Partial bonus +1 pt' : '✗ No bonus this time'}
              </div>
              <div className="text-[12px] text-[#7A9BB8]">{earnedCount}/{totalCount} criteria met</div>
            </div>
            <div className="space-y-1.5">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px]">
                  <span className={r.earned ? 'text-emerald-600' : 'text-red-500'}>{r.earned ? '✓' : '✗'}</span>
                  <span className={r.earned ? 'text-emerald-800' : 'text-red-800'}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="mb-3">
            <button
              onClick={() => setShowSolution(s => !s)}
              className="text-[12px] text-[#2A6EBB] hover:underline flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <polyline points={showSolution ? '2,8 6,4 10,8' : '2,4 6,8 10,4'}/>
              </svg>
              {showSolution ? 'Hide solution' : 'View solution'}
            </button>
            {showSolution && (
              <div className="mt-2">
                <pre className="bg-[#0B1829] text-[#B8D4EC] font-mono text-[12px] p-4 rounded-xl overflow-x-auto leading-relaxed">{ex.solution}</pre>
                <div className="mt-2 bg-[#F0F6FD] border border-[#C8DFF0] rounded-xl p-3 text-[12.5px] text-[#3A5068]">
                  <strong className="text-[#0B1829]">Explanation: </strong>{ex.solutionExplain}
                </div>
              </div>
            )}
          </div>

          <button onClick={handleReset} className="text-[12px] border border-[#D0DEF0] text-[#3A5068] px-4 py-1.5 rounded-lg hover:bg-[#F4F7FB] transition-colors">
            Reset &amp; Try Again
          </button>
        </div>
      )}
    </div>
  )
}

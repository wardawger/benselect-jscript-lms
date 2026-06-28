import { useState } from 'react'
import { QUIZ_EXERCISES } from '@/data/quizExercises'
import { CodeEditor } from './CodeEditor'
import { IcInfo, IcExpandCollapse } from './Icons'

interface LessonChallengeProps {
  moduleId: number
}

export function LessonChallenge({ moduleId }: LessonChallengeProps) {
  const ex = QUIZ_EXERCISES[moduleId]
  if (!ex) return null

  const [code, setCode] = useState(ex.starter)
  const [submitted, setSubmitted] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [results, setResults] = useState<{ label: string; earned: boolean }[]>([])

  function handleSubmit() {
    const scored = ex.keywords.map(kw => ({
      label: kw.label,
      earned: kw.pattern.test(code),
    }))
    setResults(scored)
    setSubmitted(true)
  }

  function handleReset() {
    setCode(ex.starter)
    setSubmitted(false)
    setShowSolution(false)
    setResults([])
  }

  const earnedCount = results.filter(r => r.earned).length
  const totalCount = ex.keywords.length

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-sm border border-[#E8F0F8] p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-mono font-bold text-[#28A87C] bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">Practice Exercise</span>
        <span className="text-[10px] font-mono text-[#7A9BB8]">no grade · builds skills</span>
      </div>
      <h3 className="text-[15px] font-bold text-[#0B1829] mb-1">{ex.title}</h3>
      <p className="text-[13px] text-bs-body mb-3">{ex.intro}</p>

      {/* Task box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
        <div className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider mb-1">Task</div>
        <p className="text-[13px] text-emerald-900 leading-relaxed">{ex.task}</p>
      </div>

      {/* Hints toggle */}
      <button
        onClick={() => setShowHints(h => !h)}
        className="text-[12px] text-[#2A6EBB] hover:underline mb-3 flex items-center gap-1"
      >
        <IcInfo size={12} />
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
            className="bg-gradient-to-r from-[#28A87C] to-[#4ABF9A] text-white text-[13px] font-medium px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Check My Code
          </button>
        </div>
      ) : (
        <div className="mt-4">
          {/* Results */}
          <div className={`rounded-xl p-4 mb-4 border ${earnedCount === totalCount ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[14px] font-bold" style={{ color: earnedCount === totalCount ? '#28A87C' : '#D4820A' }}>
                {earnedCount === totalCount ? '✓ All criteria met!' : `${earnedCount}/${totalCount} criteria met`}
              </div>
            </div>
            <div className="space-y-1.5">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px]">
                  <span className={r.earned ? 'text-emerald-600' : 'text-amber-600'}>{r.earned ? '✓' : '○'}</span>
                  <span className={r.earned ? 'text-emerald-800' : 'text-amber-800'}>{r.label}</span>
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
              <IcExpandCollapse size={12} open={showSolution} />
              {showSolution ? 'Hide solution' : 'View solution'}
            </button>
            {showSolution && (
              <div className="mt-2">
                <pre className="bg-[#0B1829] text-[#B8D4EC] font-mono text-[12px] p-4 rounded-xl overflow-x-auto leading-relaxed">{ex.solution}</pre>
                <div className="mt-2 bg-[#F0F6FD] border border-[#C8DFF0] rounded-xl p-3 text-[12.5px] text-bs-body">
                  <strong className="text-[#0B1829]">Explanation: </strong>{ex.solutionExplain}
                </div>
              </div>
            )}
          </div>

          <button onClick={handleReset} className="text-[12px] border border-[#D0DEF0] text-bs-body px-4 py-1.5 rounded-lg hover:bg-[#F4F7FB] transition-colors">
            Reset &amp; Try Again
          </button>
        </div>
      )}
    </div>
  )
}

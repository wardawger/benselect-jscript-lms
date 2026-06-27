import { MODULES, TRACK_GROUPS } from '@/data/modules'
import type { AppState } from '@/store/progress'
import { getCompletedCount, getOverallScore } from '@/store/progress'

interface ProgressPageProps {
  state: AppState
  onNavigate: (page: string, moduleId?: number) => void
  onReset: () => void
}

export function ProgressPage({ state, onNavigate, onReset }: ProgressPageProps) {
  const completed = getCompletedCount(state.progress)
  const avgScore = getOverallScore(state.progress)
  const pct = Math.round((completed / 14) * 100)

  const scores = Object.entries(state.progress)
    .filter(([, p]) => p.score !== undefined)
    .map(([id, p]) => ({ id: Number(id), score: p.score!, mod: MODULES.find(m => m.id === Number(id))! }))

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <div className="text-[11px] font-medium text-[#4A9FD4] uppercase tracking-widest mb-1.5">Analytics</div>
        <h1 className="text-[26px] font-bold text-[#0B1829] tracking-tight">My Progress</h1>
        <p className="text-[13px] text-[#3A5068] mt-1.5">Track your completion and quiz performance across all modules.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8F0F8]">
          <div className="text-[28px] font-bold text-[#0B1829] tracking-tight">{pct}%</div>
          <div className="text-[11px] text-[#7A9BB8] font-medium uppercase tracking-wider mt-1">Overall completion</div>
          <div className="mt-3 h-2 bg-[#EBF4FB] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[12px] text-[#3A5068] mt-2">{completed} of 14 modules done</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8F0F8]">
          <div className="text-[28px] font-bold text-[#0B1829] tracking-tight">{avgScore ? `${avgScore}%` : '—'}</div>
          <div className="text-[11px] text-[#7A9BB8] font-medium uppercase tracking-wider mt-1">Average quiz score</div>
          {avgScore > 0 && (
            <div className="mt-3 h-2 bg-[#EBF4FB] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${avgScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : avgScore >= 60 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-[#E84C4C]'}`} style={{ width: `${avgScore}%` }} />
            </div>
          )}
          <div className="text-[12px] text-[#3A5068] mt-2">{scores.length} modules scored</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8F0F8]">
          <div className="text-[28px] font-bold text-[#0B1829] tracking-tight">
            {completed === 14 ? '🏆' : `${14 - completed}`}
          </div>
          <div className="text-[11px] text-[#7A9BB8] font-medium uppercase tracking-wider mt-1">
            {completed === 14 ? 'Certified!' : 'Modules remaining'}
          </div>
          <div className="text-[12px] text-[#3A5068] mt-4">
            {completed === 14 ? 'All modules complete. Certificate earned!' : 'Keep going to earn your certification'}
          </div>
        </div>
      </div>

      {/* Track progress */}
      {TRACK_GROUPS.map(track => {
        const trackMods = track.ids.map(id => ({ mod: MODULES.find(m => m.id === id)!, p: state.progress[id] }))
        const trackDone = trackMods.filter(m => m.p.status === 'complete').length
        const trackPct = Math.round((trackDone / trackMods.length) * 100)
        return (
          <div key={track.label} className="bg-white rounded-xl shadow-sm border border-[#E8F0F8] mb-4 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8F0F8] flex items-center justify-between">
              <div>
                <div className="text-[14px] font-semibold text-[#0B1829]">{track.label}</div>
                <div className="text-[12px] text-[#7A9BB8] mt-0.5">{track.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-mono font-medium text-[#3A5068]">{trackDone}/{trackMods.length}</div>
                <div className="text-[11px] text-[#7A9BB8]">{trackPct}%</div>
              </div>
            </div>
            <div className="divide-y divide-[#F4F7FB]">
              {trackMods.map(({ mod, p }) => (
                <div key={mod.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#F8FAFC] transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === 'complete' ? 'bg-emerald-500' : p.status === 'available' ? 'bg-[#4A9FD4]' : 'bg-[#E8F0F8]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#0B1829] truncate">
                      {mod.id}. {mod.title}
                    </div>
                    <div className="text-[11px] text-[#7A9BB8] mt-0.5">{mod.time}</div>
                  </div>
                  {p.status === 'complete' && (
                    <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium shrink-0">
                      ✓ {p.score !== undefined ? `${p.score}%` : 'Done'}
                    </span>
                  )}
                  {p.status === 'available' && (
                    <button
                      onClick={() => onNavigate('lesson', mod.id)}
                      className="text-[11px] text-[#2A6EBB] bg-[#EBF4FB] px-2.5 py-0.5 rounded-full font-medium hover:bg-[#D0E8FA] transition-colors shrink-0"
                    >
                      Start →
                    </button>
                  )}
                  {p.status === 'locked' && (
                    <span className="text-[11px] text-[#B0C8DC] shrink-0">🔒</span>
                  )}
                  {p.needsReview && (
                    <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium shrink-0 ml-1">Review</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Reset */}
      <div className="mt-8 pt-6 border-t border-[#E8F0F8]">
        <button
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) onReset()
          }}
          className="text-[12px] text-[#E84C4C] hover:underline"
        >
          Reset all progress
        </button>
      </div>
    </div>
  )
}

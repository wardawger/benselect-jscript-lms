import { MODULES, TRACK_GROUPS } from '@/data/modules'
import type { AppState } from '@/store/progress'
import { getCompletedCount, getOverallScore } from '@/store/progress'
import { IcLayers, IcTarget, IcAward, IcClock, IcCheck, IcLock, IcChevronRight } from './Icons'

interface DashboardProps {
  state: AppState
  page?: string
  onNavigate: (page: string, moduleId?: number) => void
}

const TRACK_BADGE: Record<string, { bg: string; text: string }> = {
  'Track 1': { bg: 'bg-blue-100 text-blue-700',     text: 'T1' },
  'Track 2': { bg: 'bg-amber-100 text-amber-700',   text: 'T2' },
  'Track 3': { bg: 'bg-emerald-100 text-emerald-700', text: 'T3' },
  'Exam':    { bg: 'bg-red-100 text-red-700',        text: 'EX' },
}

export function Dashboard({ state, page = 'dashboard', onNavigate }: DashboardProps) {
  const completed = getCompletedCount(state.progress)
  const avgScore  = getOverallScore(state.progress)
  const pct       = Math.round((completed / 14) * 100)
  const isModulesPage = page === 'modules'

  const nextModule = MODULES.find(m => state.progress[m.id]?.status === 'available')

  const stats = [
    {
      Icon: IcLayers,
      value: `${completed}/14`,
      label: 'Modules Done',
      sub: `${pct}% complete`,
    },
    {
      Icon: IcTarget,
      value: avgScore ? `${avgScore}%` : '—',
      label: 'Avg Quiz Score',
      sub: completed > 0 ? 'across completed modules' : 'no quizzes yet',
    },
    {
      Icon: IcAward,
      value: completed === 14 ? (
        <span className="flex items-center gap-1 text-[#2A6EBB]">
          <IcCheck size={20} className="text-[#2A6EBB]" />
        </span>
      ) : '—',
      label: 'Certification',
      sub: completed === 14 ? 'Earned!' : 'Complete all modules',
    },
    {
      Icon: IcClock,
      value: '20.5h',
      label: 'Total Content',
      sub: '14 modules · all tracks',
    },
  ]

  return (
    <div className="p-8 max-w-4xl">
      {/* Page header */}
      <div className="mb-6">
        {isModulesPage ? (
          <>
            <div className="text-[11px] font-medium text-[#4A9FD4] uppercase tracking-widest mb-1.5">Course</div>
            <h1 className="text-[26px] font-bold text-[#0B1829] tracking-tight leading-tight">All Modules</h1>
            <p className="text-[13px] text-[#3A5068] mt-1.5 leading-relaxed">Browse all 14 modules. Complete each in order to unlock the next.</p>
          </>
        ) : (
          <>
            <div className="text-[11px] font-medium text-[#4A9FD4] uppercase tracking-widest mb-1.5">
              Welcome back{state.userName ? `, ${state.userName}` : ''}
            </div>
            <h1 className="text-[26px] font-bold text-[#0B1829] tracking-tight leading-tight">JScript in Selerix BenSelect</h1>
            <p className="text-[13px] text-[#3A5068] mt-1.5 leading-relaxed">Master BenSelect scripting through 13 modules and a final certification exam.</p>
          </>
        )}
      </div>

      {/* Stats — dashboard only */}
      {!isModulesPage && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8F0F8] relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4]" />
              <div className="w-9 h-9 rounded-lg bg-[#EBF4FB] flex items-center justify-center mb-3 text-[#2A6EBB]">
                <stat.Icon size={18} />
              </div>
              <div className="text-[28px] font-bold text-[#0B1829] leading-none tracking-tight">{stat.value}</div>
              <div className="text-[11px] text-[#7A9BB8] mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
              <div className="text-[12px] text-[#3A5068] mt-1.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Continue card — dashboard only */}
      {!isModulesPage && nextModule && (
        <div className="bg-gradient-to-r from-[#0B1829] to-[#112240] rounded-2xl p-6 mb-6 relative overflow-hidden shadow-lg">
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 rounded-full bg-[rgba(74,159,212,0.12)] pointer-events-none" />
          <div className="relative">
            <div className="text-[10px] font-medium text-[#4A9FD4] uppercase tracking-widest mb-1.5">Continue Learning</div>
            <div className="text-[16px] font-bold text-white mb-1.5 leading-tight">Module {nextModule.id}: {nextModule.title}</div>
            <div className="text-[12px] text-[rgba(255,255,255,0.5)] mb-4">{nextModule.time} · {nextModule.track}</div>
            <button
              onClick={() => onNavigate('lesson', nextModule.id)}
              className="bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] text-white text-[13px] font-medium px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition-opacity"
            >
              Start Module →
            </button>
          </div>
        </div>
      )}

      {/* Module grid by track */}
      {TRACK_GROUPS.map(track => (
        <div key={track.label} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-[#E8F0F8]" />
            <div className="text-[11px] font-semibold text-[#7A9BB8] uppercase tracking-wider whitespace-nowrap">{track.label}</div>
            <div className="flex-1 h-px bg-[#E8F0F8]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {track.ids.map(id => {
              const mod    = MODULES.find(m => m.id === id)!
              const p      = state.progress[id]
              const badge  = TRACK_BADGE[mod.track]
              const isLocked = p.status === 'locked'
              const isDone   = p.status === 'complete'
              return (
                <button
                  key={id}
                  onClick={() => !isLocked && onNavigate('lesson', id)}
                  disabled={isLocked}
                  className={`text-left bg-white rounded-xl p-4 border transition-all relative overflow-hidden group ${
                    isDone ? 'border-emerald-200' : 'border-[#E8F0F8]'
                  } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer shadow-sm'}`}
                >
                  {isDone && <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-emerald-400" />}
                  {!isDone && !isLocked && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.bg}`}>{mod.track}</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#7A9BB8] mb-0.5">Module {id}</div>
                  <div className="text-[13px] font-medium text-[#0B1829] leading-snug mb-2">{mod.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#7A9BB8]">{mod.time}</span>
                    {isDone && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <IcCheck size={9} className="text-emerald-600" />
                        Done{p.score ? ` · ${p.score}%` : ''}
                      </span>
                    )}
                    {p.status === 'available' && (
                      <span className="flex items-center gap-1 text-[10px] text-[#4A9FD4] font-semibold">
                        Available <IcChevronRight size={10} className="text-[#4A9FD4]" />
                      </span>
                    )}
                    {isLocked && (
                      <span className="flex items-center gap-1 text-[10px] text-[#B0C8DC]">
                        <IcLock size={10} className="text-[#B0C8DC]" /> Locked
                      </span>
                    )}
                  </div>
                  {isDone && (
                    <div className="mt-2 h-1 bg-[#EBF4FB] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '100%' }} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

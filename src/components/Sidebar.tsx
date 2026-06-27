import { MODULES, TRACK_GROUPS } from '@/data/modules'
import type { AppState, ModuleProgress } from '@/store/progress'
import { getCompletedCount, getOverallScore } from '@/store/progress'
import { cn } from '@/lib/utils'
import { IcDashboard, IcModules, IcProgress, IcGlossary, IcCheckCircle, IcLock, IcChevronRight } from './Icons'

interface SidebarProps {
  state: AppState
  onNavigate: (page: string, moduleId?: number) => void
  onClose?: () => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',        Icon: IcDashboard },
  { id: 'modules',   label: 'All Modules',      Icon: IcModules   },
  { id: 'progress',  label: 'My Progress',      Icon: IcProgress  },
  { id: 'glossary',  label: 'Glossary & Index', Icon: IcGlossary  },
]

function StatusIcon({ p }: { p: ModuleProgress }) {
  if (p.status === 'complete') return <IcCheckCircle size={14} className="text-emerald-400" />
  if (p.status === 'locked')   return <IcLock size={14} className="text-white/20" />
  return <IcChevronRight size={14} className="text-[#60a5fa]" />
}

export function Sidebar({ state, onNavigate, onClose }: SidebarProps) {
  const completed = getCompletedCount(state.progress)
  const total = 14
  const pct = Math.round((completed / total) * 100)
  const avgScore = getOverallScore(state.progress)

  return (
    <aside className="flex flex-col h-full w-60 shrink-0" style={{ background: '#0d1e3d' }}>

      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[13px] shrink-0"
            style={{ background: '#007aff' }}
          >
            BS
          </div>
          <div>
            <div className="text-white text-[13px] font-semibold tracking-tight leading-none">BenSelect LMS</div>
            <div className="text-white/40 text-[10px] mt-0.5 font-light tracking-wide">JScript in Selerix</div>
          </div>
        </div>
      </div>

      {/* Scrollable nav body */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-5">

        {/* Primary nav */}
        <div>
          <div className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.12em] px-5 mb-2">Navigation</div>
          <ul className="space-y-0.5 px-2">
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const isActive = state.page === id && !state.activeModule
              return (
                <li key={id}>
                  <button
                    onClick={() => { onNavigate(id); onClose?.() }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all text-left',
                      isActive
                        ? 'text-white font-medium'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
                    )}
                    style={isActive ? { background: '#007aff' } : undefined}
                  >
                    <Icon size={15} className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Module tracks */}
        {TRACK_GROUPS.map(track => (
          <div key={track.label}>
            <div className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.12em] px-5 mb-2 truncate">
              {track.label.split(' — ')[0]}
            </div>
            <ul className="space-y-0.5 px-2">
              {track.ids.map(id => {
                const mod = MODULES.find(m => m.id === id)!
                const p = state.progress[id]
                const isActive = state.activeModule === id
                const isLocked = p.status === 'locked'
                const isDone   = p.status === 'complete'
                return (
                  <li key={id}>
                    <button
                      onClick={() => { if (!isLocked) { onNavigate('lesson', id); onClose?.() } }}
                      disabled={isLocked}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] transition-all text-left group',
                        isActive
                          ? 'bg-white/10 text-white font-medium'
                          : isDone
                          ? 'text-emerald-400/80 hover:bg-white/[0.05] hover:text-emerald-300'
                          : isLocked
                          ? 'text-white/20 cursor-not-allowed'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
                      )}
                    >
                      <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                        <StatusIcon p={p} />
                      </span>
                      <span className="truncate flex-1">{id}. {mod.title.length > 21 ? mod.title.slice(0, 21) + '…' : mod.title}</span>
                      {p.score !== undefined && (
                        <span className="text-[10px] font-mono text-white/30 shrink-0">{p.score}%</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.07] space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-white/40">Progress</span>
          <span className="text-[11px] font-mono text-white/50">{completed}/{total} · {pct}%</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: '#007aff' }}
          />
        </div>
        {avgScore > 0 && (
          <div className="text-[10px] text-white/30">Avg quiz score: {avgScore}%</div>
        )}
      </div>
    </aside>
  )
}

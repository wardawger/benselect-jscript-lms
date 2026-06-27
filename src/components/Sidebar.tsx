import { MODULES, TRACK_GROUPS } from '@/data/modules'
import type { AppState, ModuleProgress } from '@/store/progress'
import { getCompletedCount, getOverallScore } from '@/store/progress'
import { cn } from '@/lib/utils'

interface SidebarProps {
  state: AppState
  onNavigate: (page: string, moduleId?: number) => void
  onClose?: () => void
}


export function Sidebar({ state, onNavigate, onClose }: SidebarProps) {
  const completed = getCompletedCount(state.progress)
  const total = 14
  const pct = Math.round((completed / total) * 100)
  const avgScore = getOverallScore(state.progress)

  function navDot(p: ModuleProgress) {
    if (p.status === 'complete') return 'bg-emerald-500'
    if (p.status === 'available') return 'bg-blue-400'
    return 'bg-[#1E3A5F]'
  }

  return (
    <aside className="flex flex-col h-full bg-[#0B1829] w-60 shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#1E3A5F]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2A6EBB] to-[#4A9FD4] flex items-center justify-center text-white font-bold text-sm mb-2 shrink-0">
          BS
        </div>
        <div className="text-white text-sm font-bold tracking-wide">BenSelect LMS</div>
        <div className="text-[#B0C8DC] text-[11px] mt-0.5 font-light">JScript in Selerix</div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {/* Course nav */}
        <div className="pb-2">
          <div className="text-[10px] font-medium text-[#B0C8DC] uppercase tracking-widest px-5 mb-1">Course</div>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'modules', label: 'All Modules' },
            { id: 'progress', label: 'My Progress' },
            { id: 'glossary', label: 'Glossary & Index' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onClose?.() }}
              className={cn(
                'w-full flex items-center gap-2.5 px-5 py-2 text-[13px] border-l-[3px] transition-all text-left',
                state.page === item.id && !state.activeModule
                  ? 'text-white font-medium bg-[rgba(74,159,212,0.15)] border-l-[#4A9FD4]'
                  : 'text-[rgba(255,255,255,0.6)] border-transparent hover:text-white hover:bg-[rgba(74,159,212,0.08)]'
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0',
                state.page === item.id && !state.activeModule ? 'bg-[#4A9FD4]' : 'bg-[#1E3A5F]')} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Modules by track */}
        {TRACK_GROUPS.map(track => (
          <div key={track.label} className="pt-1 pb-2">
            <div className="text-[10px] font-medium text-[#B0C8DC] uppercase tracking-widest px-5 mb-1 truncate">
              {track.label.replace(' — ', ' · ')}
            </div>
            {track.ids.map(id => {
              const mod = MODULES.find(m => m.id === id)!
              const p = state.progress[id]
              const isActive = state.activeModule === id
              const isLocked = p.status === 'locked'
              return (
                <button
                  key={id}
                  onClick={() => {
                    if (!isLocked) {
                      onNavigate('lesson', id)
                      onClose?.()
                    }
                  }}
                  disabled={isLocked}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-5 py-2 text-[13px] border-l-[3px] transition-all text-left',
                    isActive
                      ? 'text-white font-medium bg-[rgba(74,159,212,0.15)] border-l-[#4A9FD4]'
                      : p.status === 'complete'
                      ? 'text-emerald-400/90 border-transparent hover:bg-[rgba(74,159,212,0.08)]'
                      : isLocked
                      ? 'text-[rgba(255,255,255,0.25)] border-transparent cursor-not-allowed'
                      : 'text-[rgba(255,255,255,0.6)] border-transparent hover:text-white hover:bg-[rgba(74,159,212,0.08)]'
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', navDot(p))} />
                  <span className="truncate flex-1 text-left">{id}. {mod.title.length > 28 ? mod.title.slice(0, 28) + '…' : mod.title}</span>
                  {p.score !== undefined && (
                    <span className="text-[10px] font-mono text-[#B0C8DC] bg-white/5 px-1 rounded shrink-0">
                      {p.score}%
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer progress */}
      <div className="px-5 py-4 border-t border-[#1E3A5F]">
        <div className="flex justify-between text-[11px] text-[#B0C8DC] mb-2">
          <span>Overall Progress</span>
          <span className="font-mono">{completed}/{total} · {pct}%</span>
        </div>
        <div className="h-1 bg-[#1E3A5F] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2A6EBB] to-[#4A9FD4] rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {avgScore > 0 && (
          <div className="text-[11px] text-[#7A9BB8] mt-2">Avg quiz score: {avgScore}%</div>
        )}
      </div>
    </aside>
  )
}

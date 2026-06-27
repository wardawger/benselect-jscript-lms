import { MODULES, TRACK_GROUPS } from '@/data/modules'
import type { AppState, ModuleProgress } from '@/store/progress'
import { getCompletedCount, getOverallScore } from '@/store/progress'
import { cn } from '@/lib/utils'

interface SidebarProps {
  state: AppState
  onNavigate: (page: string, moduleId?: number) => void
  onClose?: () => void
}

// SVG icon helpers
function IconDashboard() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="1.5" width="5" height="5" rx="1"/><rect x="8.5" y="1.5" width="5" height="5" rx="1"/><rect x="1.5" y="8.5" width="5" height="5" rx="1"/><rect x="8.5" y="8.5" width="5" height="5" rx="1"/></svg>
}
function IconModules() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="1.5" width="12" height="3" rx="1"/><rect x="1.5" y="6" width="12" height="3" rx="1"/><rect x="1.5" y="10.5" width="12" height="3" rx="1"/></svg>
}
function IconProgress() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="9" width="2.5" height="4.5" rx="0.75"/><rect x="6.25" y="6" width="2.5" height="7.5" rx="0.75"/><rect x="11" y="3" width="2.5" height="10.5" rx="0.75"/></svg>
}
function IconGlossary() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2.5h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3"/><path d="M3 2.5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1"/><line x1="5" y1="5.5" x2="10" y2="5.5"/><line x1="5" y1="8" x2="10" y2="8"/><line x1="5" y1="10.5" x2="8" y2="10.5"/></svg>
}
function IconCheck() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="5.5"/><polyline points="4.5,7 6.5,9 9.5,5"/></svg>
}
function IconLock() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6.5" width="8" height="6" rx="1"/><path d="M4.5 6.5V5a2.5 2.5 0 0 1 5 0v1.5"/></svg>
}
function IconChevron() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5,3 9,7 5,11"/></svg>
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
  { id: 'modules', label: 'All Modules', Icon: IconModules },
  { id: 'progress', label: 'My Progress', Icon: IconProgress },
  { id: 'glossary', label: 'Glossary & Index', Icon: IconGlossary },
]

function moduleIcon(p: ModuleProgress) {
  if (p.status === 'complete') return <IconCheck />
  if (p.status === 'locked') return <IconLock />
  return <IconChevron />
}

export function Sidebar({ state, onNavigate, onClose }: SidebarProps) {
  const completed = getCompletedCount(state.progress)
  const total = 14
  const pct = Math.round((completed / total) * 100)
  const avgScore = getOverallScore(state.progress)

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
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = state.page === id && !state.activeModule
            return (
              <button
                key={id}
                onClick={() => { onNavigate(id); onClose?.() }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-5 py-2 text-[13px] border-l-[3px] transition-all text-left',
                  isActive
                    ? 'text-white font-medium bg-[rgba(74,159,212,0.15)] border-l-[#4A9FD4]'
                    : 'text-[rgba(255,255,255,0.6)] border-transparent hover:text-white hover:bg-[rgba(74,159,212,0.08)]'
                )}
              >
                <span className={cn('flex items-center justify-center w-4 h-4 shrink-0', isActive ? 'text-[#4A9FD4]' : '')}>
                  <Icon />
                </span>
                {label}
              </button>
            )
          })}
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
              const isDone = p.status === 'complete'
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
                      : isDone
                      ? 'text-emerald-400/90 border-transparent hover:bg-[rgba(74,159,212,0.08)]'
                      : isLocked
                      ? 'text-[rgba(255,255,255,0.25)] border-transparent cursor-not-allowed'
                      : 'text-[rgba(255,255,255,0.6)] border-transparent hover:text-white hover:bg-[rgba(74,159,212,0.08)]'
                  )}
                >
                  <span className="flex items-center justify-center w-[14px] h-[14px] shrink-0">
                    {moduleIcon(p)}
                  </span>
                  <span className="truncate flex-1 text-left text-[12px]">{id}. {mod.title.length > 22 ? mod.title.slice(0, 22) + '…' : mod.title}</span>
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

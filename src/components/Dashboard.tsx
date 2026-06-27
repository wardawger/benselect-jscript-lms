import { MODULES, TRACK_GROUPS } from '@/data/modules'
import type { AppState } from '@/store/progress'
import { getCompletedCount, getOverallScore } from '@/store/progress'
import { IcLayers, IcTarget, IcAward, IcClock, IcCheck, IcLock, IcChevronRight } from './Icons'

interface DashboardProps {
  state: AppState
  page?: string
  onNavigate: (page: string, moduleId?: number) => void
}

// ── Radial SVG progress ring ─────────────────────────────────────────────────
function RadialProgress({ pct, size = 96 }: { pct: number; size?: number }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e1f0ff" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#007aff" strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  )
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, score }: { status: string; score?: number }) {
  if (status === 'complete') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
        <IcCheck size={8} /> Done{score !== undefined ? ` · ${score}%` : ''}
      </span>
    )
  }
  if (status === 'available') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#007aff] border border-[#007aff]/20" style={{ background: '#e1f0ff' }}>
        Available
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
      <IcLock size={8} /> Locked
    </span>
  )
}

// ── Track accent colors ───────────────────────────────────────────────────────
const TRACK_META: Record<string, { dot: string; label: string }> = {
  'Track 1': { dot: '#007aff', label: 'T1' },
  'Track 2': { dot: '#f59e0b', label: 'T2' },
  'Track 3': { dot: '#10b981', label: 'T3' },
  'Exam':    { dot: '#ef4444', label: 'EX' },
}

export function Dashboard({ state, page = 'dashboard', onNavigate }: DashboardProps) {
  const completed = getCompletedCount(state.progress)
  const avgScore  = getOverallScore(state.progress)
  const pct       = Math.round((completed / 14) * 100)
  const isModulesPage = page === 'modules'
  const nextModule = MODULES.find(m => state.progress[m.id]?.status === 'available')

  const kpis = [
    {
      Icon: IcLayers,
      value: `${completed}/14`,
      label: 'Modules Done',
      sub: `${pct}% of course`,
      color: '#007aff',
      bg: '#e1f0ff',
    },
    {
      Icon: IcTarget,
      value: avgScore ? `${avgScore}%` : '—',
      label: 'Avg Quiz Score',
      sub: completed > 0 ? 'across completed' : 'no quizzes yet',
      color: '#10b981',
      bg: '#d1fae5',
    },
    {
      Icon: IcAward,
      value: completed === 14 ? '✓' : `${14 - completed}`,
      label: completed === 14 ? 'Certified!' : 'Modules Left',
      sub: completed === 14 ? 'Certificate earned' : 'until completion',
      color: '#f59e0b',
      bg: '#fef3c7',
    },
    {
      Icon: IcClock,
      value: '20.5h',
      label: 'Total Content',
      sub: '14 modules · 4 tracks',
      color: '#8b5cf6',
      bg: '#ede9fe',
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl space-y-8">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-1" style={{ color: '#007aff' }}>
          {isModulesPage ? 'Course' : `Welcome back${state.userName ? `, ${state.userName}` : ''}`}
        </p>
        <h1 className="text-[26px] font-bold tracking-tight" style={{ color: '#0d1e3d' }}>
          {isModulesPage ? 'All Modules' : 'JScript in Selerix BenSelect'}
        </h1>
        <p className="text-slate-500 text-[13px] mt-1">
          {isModulesPage
            ? 'Browse all 14 modules. Complete each in order to unlock the next.'
            : 'Master BenSelect scripting through 13 modules and a final certification exam.'}
        </p>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      {!isModulesPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ Icon, value, label, sub, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg, color }}>
                <Icon size={18} />
              </div>
              <div>
                <div className="text-[26px] font-bold leading-none tracking-tight" style={{ color: '#0d1e3d' }}>{value}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">{label}</div>
                <div className="text-[12px] text-slate-500 mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Hero: Continue Learning + Radial Progress ──────────────────────── */}
      {!isModulesPage && (
        <div
          className="rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm"
          style={{ background: '#0d1e3d' }}
        >
          <div className="flex flex-col sm:flex-row items-stretch">

            {/* Left: continue learning */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40 mb-2">Continue Learning</p>
                {nextModule ? (
                  <>
                    <h2 className="text-white text-[18px] font-bold leading-snug mb-1">
                      Module {nextModule.id}: {nextModule.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-white/50">
                        <IcClock size={11} /> {nextModule.time}
                      </span>
                      <span className="w-px h-3 bg-white/20" />
                      <span className="text-[11px] text-white/50">{nextModule.track}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {nextModule.topics.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] text-white/40 bg-white/[0.07] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <h2 className="text-white text-[18px] font-bold">All modules complete!</h2>
                )}
              </div>
              {nextModule && (
                <div>
                  <button
                    onClick={() => onNavigate('lesson', nextModule.id)}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                    style={{ background: '#007aff' }}
                  >
                    Start Module <IcChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Right: radial progress */}
            <div className="flex items-center justify-center p-6 sm:p-8 border-t sm:border-t-0 sm:border-l border-white/[0.07]">
              <div className="relative flex items-center justify-center">
                <RadialProgress pct={pct} size={108} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-bold text-[20px] leading-none">{pct}%</span>
                  <span className="text-white/40 text-[10px] mt-0.5">complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Track progress strips */}
          <div className="border-t border-white/[0.07] px-6 sm:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TRACK_GROUPS.map(track => {
              const done = track.ids.filter(id => state.progress[id]?.status === 'complete').length
              const tpct = Math.round((done / track.ids.length) * 100)
              const meta = TRACK_META[track.label.split(' — ')[0]] ?? { dot: '#007aff', label: '?' }
              return (
                <div key={track.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.dot }} />
                      <span className="text-[10px] text-white/40 font-medium">{meta.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/30">{done}/{track.ids.length}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${tpct}%`, background: meta.dot }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Bento Module Grid by Track ────────────────────────────────────── */}
      <div className="space-y-8">
        {TRACK_GROUPS.map(track => {
          const meta = TRACK_META[track.label.split(' — ')[0]] ?? { dot: '#007aff', label: '?' }
          const done = track.ids.filter(id => state.progress[id]?.status === 'complete').length
          return (
            <section key={track.label}>
              {/* Sticky track header */}
              <div className="sticky top-[60px] z-10 bg-white/80 backdrop-blur-sm border-b border-[#e2e8f0] mb-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: meta.dot }} />
                  <span className="text-[13px] font-bold" style={{ color: '#0d1e3d' }}>
                    {track.label.split(' — ')[0]}
                  </span>
                  <span className="text-slate-400 text-[13px]">—</span>
                  <span className="text-slate-500 text-[12px]">{track.label.split(' — ')[1] ?? track.desc}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{done}/{track.ids.length} done</span>
              </div>

              {/* Module cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {track.ids.map(id => {
                  const mod    = MODULES.find(m => m.id === id)!
                  const p      = state.progress[id]
                  const isLocked = p.status === 'locked'
                  const isDone   = p.status === 'complete'
                  return (
                    <button
                      key={id}
                      onClick={() => !isLocked && onNavigate('lesson', id)}
                      disabled={isLocked}
                      className={[
                        'text-left bg-white rounded-xl border border-[#e2e8f0] p-5 flex flex-col gap-3 transition-all relative overflow-hidden group',
                        isLocked
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer shadow-sm',
                        isDone ? 'border-emerald-100' : '',
                      ].join(' ')}
                    >
                      {/* Done top bar */}
                      {isDone && (
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-400 rounded-t-xl" />
                      )}
                      {/* Available hover bar */}
                      {!isDone && !isLocked && (
                        <div
                          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                          style={{ background: '#007aff' }}
                        />
                      )}

                      {/* Module number + status */}
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                          style={{ background: '#e1f0ff', color: '#007aff' }}
                        >
                          M{id}
                        </span>
                        <StatusBadge status={p.status} score={p.score} />
                      </div>

                      {/* Title */}
                      <div>
                        <div className="text-[13px] font-semibold leading-snug" style={{ color: '#0d1e3d' }}>
                          {mod.title}
                        </div>
                      </div>

                      {/* Footer meta */}
                      <div className="flex items-center gap-2 mt-auto flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <IcClock size={10} /> {mod.time}
                        </span>
                        {p.needsReview && (
                          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                            Review
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

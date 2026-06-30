import { useEffect, useRef, useState } from 'react'
import { MODULES, TRACK_GROUPS } from '@/data/modules'
import type { AppState } from '@/store/progress'
import { getCompletedCount, getOverallScore } from '@/store/progress'
import { IcClock, IcCheck, IcLock, IcChevronRight } from './Icons'

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900, triggered = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!triggered) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out quart
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [triggered, target, duration])
  return value
}

// ── Animated stat card ────────────────────────────────────────────────────────
function StatCard({ label, num, suffix, color }: {
  label: string
  num: number
  suffix: string
  color: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const count = useCountUp(num, 900, triggered)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); observer.disconnect() } },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="bg-white border border-[#E2ECF5] rounded-xl px-5 py-4 flex items-center gap-3">
      <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: color }}/>
      <div>
        <div className="text-[18px] font-bold text-[#0B1829] leading-none tabular-nums"
          style={{ fontFamily: 'var(--font-display)' }}>
          {count}{suffix}
        </div>
        <div className="text-[11px] font-medium text-[#5A7890] mt-1">{label}</div>
      </div>
    </div>
  )
}

interface DashboardProps {
  state: AppState
  page?: string
  onNavigate: (page: string, moduleId?: number) => void
}

// ── Track accent config ───────────────────────────────────────────────────────
const TRACK_STYLE: Record<string, { color: string; pale: string; label: string }> = {
  'Track 1':       { color: '#3FA9F5', pale: '#EBF6FE', label: 'Track 1' },
  'Track 2':       { color: '#FF8300', pale: '#FFF2E6', label: 'Track 2' },
  'Track 3':       { color: '#28A87C', pale: '#E6F7F1', label: 'Track 3' },
  'Certification': { color: '#DA291C', pale: '#FFE8E7', label: 'Exam' },
}

function getTS(key: string) {
  const match = Object.keys(TRACK_STYLE).find(k => key.startsWith(k)) ?? 'Certification'
  return TRACK_STYLE[match]
}

// ── Track icons ───────────────────────────────────────────────────────────────
function TrackIcon({ trackLabel, color, size = 20 }: { trackLabel: string; color: string; size?: number }) {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: 1.8,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (trackLabel.startsWith('Track 1')) return (
    <svg {...s} viewBox="0 0 20 20">
      <polyline points="6 14 2 10 6 6"/><polyline points="14 6 18 10 14 14"/>
      <line x1="12" y1="4" x2="8" y2="16"/>
    </svg>
  )
  if (trackLabel.startsWith('Track 2')) return (
    <svg {...s} viewBox="0 0 20 20">
      <polygon points="10 2 2 6.5 10 11 18 6.5 10 2"/>
      <polyline points="2 13.5 10 18 18 13.5"/>
      <polyline points="2 10 10 14.5 18 10"/>
    </svg>
  )
  if (trackLabel.startsWith('Track 3')) return (
    <svg {...s} viewBox="0 0 20 20">
      <polygon points="10 2 3 11 10 11 9 18 17 9 10 9 10 2"/>
    </svg>
  )
  return (
    <svg {...s} viewBox="0 0 20 20">
      <circle cx="10" cy="8" r="6"/>
      <polyline points="7.5 13 6.5 18 10 16.5 13.5 18 12.5 13"/>
    </svg>
  )
}

// ── Radial progress ring ──────────────────────────────────────────────────────
function RadialProgress({ pct, size = 120 }: { pct: number; size?: number }) {
  const [animPct, setAnimPct] = useState(0)
  const displayCount = useCountUp(pct, 1100, animPct > 0 || pct === 0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimPct(pct))
    return () => cancelAnimationFrame(id)
  }, [pct])

  const r = (size - 14) / 2
  const circ = 2 * Math.PI * r
  const dash = (animPct / 100) * circ

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]" role="img" aria-label={`${pct}% course complete`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2ECF5" strokeWidth={9}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2A6EBB" strokeWidth={9}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.1s cubic-bezier(0.16, 1, 0.3, 1)' }}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[22px] font-bold text-[#0B1829] leading-none tabular-nums"
          style={{ fontFamily: 'var(--font-display)' }}>
          {displayCount}%
        </span>
        <span className="text-[10px] text-[#5A7890] mt-1">done</span>
      </div>
    </div>
  )
}

// ── Status badge (modules page) ───────────────────────────────────────────────
function StatusBadge({ status, score }: { status: string; score?: number }) {
  if (status === 'complete') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
      <IcCheck size={8}/> Done{score !== undefined ? ` · ${score}%` : ''}
    </span>
  )
  if (status === 'available') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-bs-blue border border-[#2A6EBB]/20" style={{ background: '#EBF4FB' }}>
      Available
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
      <IcLock size={8}/> Locked
    </span>
  )
}

// ── Track card ────────────────────────────────────────────────────────────────
function TrackCard({ group, progress, onNavigate }: {
  group: typeof TRACK_GROUPS[0]
  progress: AppState['progress']
  onNavigate: DashboardProps['onNavigate']
}) {
  const ts = getTS(group.label)
  const done = group.ids.filter(id => progress[id]?.status === 'complete').length
  const total = group.ids.length
  const pct = total ? Math.round((done / total) * 100) : 0
  const nextMod = MODULES.find(m => group.ids.includes(m.id) && progress[m.id]?.status === 'available')
  const hasAccess = MODULES.some(m => group.ids.includes(m.id) && progress[m.id]?.status !== 'locked')
  const btnLabel = !hasAccess ? 'Locked' : pct === 100 ? 'Review' : pct === 0 ? 'Start' : 'Continue'
  // Short subtitle (strip "Track N — " prefix if present)
  const subtitle = group.label.includes(' — ') ? group.label.split(' — ')[1] : group.label

  return (
    <div className="bg-white border border-[#E2ECF5] rounded-xl p-5 flex flex-col gap-4">
      {/* Icon + badge */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ts.pale }}>
          <TrackIcon trackLabel={group.label} color={ts.color}/>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
          style={{ color: ts.color, background: ts.pale }}>
          {ts.label}
        </span>
      </div>

      {/* Name + desc */}
      <div>
        <div className="text-[13.5px] font-semibold text-[#0B1829] leading-snug mb-1"
          style={{ fontFamily: 'var(--font-display)' }}>
          {subtitle}
        </div>
        <div className="text-[11.5px] text-[#5A7890] leading-relaxed line-clamp-2">{group.desc}</div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="font-semibold text-[#3A5068]">{pct}%</span>
          <span className="text-[#5A7890]">{done}/{total} modules</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#F0F4F8] overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: ts.color }}/>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => {
          if (!hasAccess) return
          const target = nextMod ?? MODULES.find(m => group.ids.includes(m.id))
          if (target) onNavigate('lesson', target.id)
        }}
        disabled={!hasAccess}
        className="w-full text-[12px] font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]"
        style={{ color: 'white', background: ts.color }}
      >
        {btnLabel}
      </button>
    </div>
  )
}

// ── Recent activity ───────────────────────────────────────────────────────────
function RecentActivity({ progress, onNavigate }: {
  progress: AppState['progress']
  onNavigate: DashboardProps['onNavigate']
}) {
  const recent = MODULES
    .filter(m => progress[m.id]?.status === 'complete')
    .sort((a, b) => b.id - a.id)
    .slice(0, 4)

  return (
    <div className="bg-white border border-[#E2ECF5] rounded-xl flex flex-col h-full">
      <div className="px-5 py-4 border-b border-[#E8F0F8] flex items-center gap-2.5">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="#7A9BB8" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="7.5" cy="7.5" r="6"/><polyline points="7.5 4.5 7.5 7.5 9.5 9.5"/>
        </svg>
        <h2 className="text-[14px] font-semibold text-[#0B1829]"
          style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</h2>
      </div>

      {recent.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-2 min-h-[200px]">
          <div className="text-3xl opacity-40">📋</div>
          <p className="text-[12px] text-[#5A7890]">Complete your first module to see activity here.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E8F0F8]">
          {recent.map(mod => {
            const p = progress[mod.id]
            return (
              <button
                key={mod.id}
                onClick={() => onNavigate('lesson', mod.id)}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l2.5 2.5 5.5-5" stroke="#28A87C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium text-[#0B1829] truncate">{mod.title}</div>
                  <div className="text-[11px] text-[#5A7890] mt-0.5">Completed · {mod.track}</div>
                </div>
                {p.score !== undefined && (
                  <span className="text-[11px] font-bold shrink-0"
                    style={{ color: p.score >= 80 ? '#28A87C' : p.score >= 60 ? '#F5A623' : '#E84C4C' }}>
                    {p.score}%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Next Up card ──────────────────────────────────────────────────────────────
function NextUpCard({ state, onNavigate }: { state: AppState; onNavigate: DashboardProps['onNavigate'] }) {
  const nextModule = MODULES.find(m => state.progress[m.id]?.status === 'available')

  if (!nextModule) return (
    <div className="bg-white border border-[#E2ECF5] rounded-xl flex flex-col h-full">
      <div className="px-5 py-4 border-b border-[#E8F0F8] flex items-center gap-2.5">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" strokeLinecap="round">
          <polygon points="7.5 1 9.5 5.5 14.5 6 11 9.5 12 14.5 7.5 12 3 14.5 4 9.5 0.5 6 5.5 5.5 7.5 1"
            fill="#7A9BB8" stroke="none"/>
        </svg>
        <h2 className="text-[14px] font-semibold text-[#0B1829]"
          style={{ fontFamily: 'var(--font-display)' }}>Next Up</h2>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-2 min-h-[200px]">
        <div className="text-3xl">🎓</div>
        <div className="text-[14px] font-semibold text-[#0B1829]">All Modules Complete!</div>
        <div className="text-[12px] text-[#5A7890]">You've earned your BenSelect JScript certificate.</div>
      </div>
    </div>
  )

  const trackKey = nextModule.track === 'Exam' ? 'Certification' : nextModule.track
  const ts = getTS(trackKey)

  return (
    <div className="bg-white border border-[#E2ECF5] rounded-xl flex flex-col h-full">
      <div className="px-5 py-4 border-b border-[#E8F0F8] flex items-center gap-2.5">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="#7A9BB8" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="7.5" cy="7.5" r="6"/>
          <polygon points="6 4.5 11.5 7.5 6 10.5" fill="#7A9BB8" stroke="none"/>
        </svg>
        <h2 className="text-[14px] font-semibold text-[#0B1829]"
          style={{ fontFamily: 'var(--font-display)' }}>Next Up</h2>
      </div>
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Featured module */}
        <div className="rounded-xl p-4 border flex-1 flex flex-col justify-between"
          style={{ background: ts.pale, borderColor: `${ts.color}28` }}>
          <div>
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ color: ts.color, background: 'rgba(255,255,255,0.7)' }}>
                {nextModule.track}
              </span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.5)' }}>
                <TrackIcon trackLabel={trackKey} color={ts.color} size={16}/>
              </div>
            </div>
            <div className="text-[14px] font-semibold text-[#0B1829] leading-snug mb-1.5"
              style={{ fontFamily: 'var(--font-display)' }}>
              {nextModule.title}
            </div>
            <div className="text-[11.5px] text-[#3A5068] leading-relaxed">
              {nextModule.topics.slice(0, 2).join(' · ')}
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <IcClock size={10} className="text-[#5A7890]"/>
            <span className="text-[10px] text-[#5A7890]">{nextModule.time}</span>
          </div>
        </div>
        {/* CTA */}
        <button
          onClick={() => onNavigate('lesson', nextModule.id)}
          className="w-full text-[13px] font-semibold text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          style={{ background: ts.color }}
        >
          Start Module
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 7h8M8 4l3 3-3 3"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Main exported component ───────────────────────────────────────────────────
export function Dashboard({ state, page = 'dashboard', onNavigate }: DashboardProps) {
  const completed = getCompletedCount(state.progress)
  const avgScore  = getOverallScore(state.progress)
  const pct       = Math.round((completed / 14) * 100)
  const isModulesPage = page === 'modules'

  // ── All Modules view ────────────────────────────────────────────────────────
  if (isModulesPage) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full space-y-8">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#0B1829]"
            style={{ fontFamily: 'var(--font-display)' }}>All Modules</h1>
          <p className="text-slate-500 text-[13px] mt-1">Browse all 14 modules. Complete each in order to unlock the next.</p>
        </div>

        {TRACK_GROUPS.map(track => {
          const ts = getTS(track.label)
          const done = track.ids.filter(id => state.progress[id]?.status === 'complete').length
          const total = track.ids.length
          const pct = total ? Math.round((done / total) * 100) : 0
          const subtitle = track.label.includes(' — ') ? track.label.split(' — ')[1] : track.label
          const isAllDone = done === total
          return (
            <section key={track.label} className="rounded-2xl overflow-hidden border border-[#E2ECF5]" style={{ boxShadow: '0 1px 4px rgba(4,41,74,0.05)' }}>

              {/* ── Track header ── */}
              <div className="flex items-center gap-4 px-5 py-4 sm:py-5 border-b border-[#E2ECF5]"
                style={{ background: ts.pale }}>

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.65)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <TrackIcon trackLabel={track.label} color={ts.color} size={20}/>
                </div>

                {/* Name + desc */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.7)', color: ts.color }}>
                      {ts.label}
                    </span>
                  </div>
                  <div className="text-[14px] font-bold text-[#0B1829] leading-snug"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {subtitle}
                  </div>
                  <div className="text-[12px] text-[#3A5068] mt-0.5 leading-snug">{track.desc}</div>
                </div>

                {/* Progress */}
                <div className="shrink-0 text-right hidden sm:block">
                  <div className="text-[18px] font-bold text-[#0B1829] leading-none tabular-nums"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {done}<span className="text-[13px] font-normal text-[#5A7890]">/{total}</span>
                  </div>
                  <div className="text-[11px] text-[#5A7890] mt-0.5">
                    {isAllDone ? '✓ Complete' : 'done'}
                  </div>
                  <div className="mt-2 w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.5)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: ts.color }}/>
                  </div>
                </div>
              </div>

              {/* ── Module grid ── */}
              <div className="bg-white p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {track.ids.map(id => {
                    const mod      = MODULES.find(m => m.id === id)!
                    const p        = state.progress[id]
                    const isLocked = p.status === 'locked'
                    const isDone   = p.status === 'complete'
                    return (
                      <button
                        key={id}
                        onClick={() => !isLocked && onNavigate('lesson', id)}
                        disabled={isLocked}
                        className={[
                          'text-left bg-white rounded-xl border p-4 flex flex-col gap-3 transition-all relative overflow-hidden group',
                          isLocked
                            ? 'opacity-40 cursor-not-allowed border-[#E2ECF5]'
                            : isDone
                            ? 'border-emerald-100 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                            : 'border-[#E2ECF5] hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
                        ].join(' ')}
                      >
                        {/* Top color strip */}
                        {isDone
                          ? <div className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-400 rounded-t-xl"/>
                          : !isLocked && (
                            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                              style={{ background: ts.color }}/>
                          )
                        }

                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                            style={{ background: ts.pale, color: ts.color }}>M{id}</span>
                          <StatusBadge status={p.status} score={p.score}/>
                        </div>

                        <div className="text-[13px] font-semibold leading-snug text-[#0B1829] flex-1">{mod.title}</div>

                        <div className="flex items-center gap-2 mt-auto flex-wrap">
                          <span className="flex items-center gap-1 text-[11px] text-[#5A7890]">
                            <IcClock size={10}/> {mod.time}
                          </span>
                          {p.needsReview && (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">Review</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>
          )
        })}
      </div>
    )
  }

  // ── Dashboard view ──────────────────────────────────────────────────────────
  const tracksActive = TRACK_GROUPS.filter(tg =>
    tg.ids.some(id => state.progress[id]?.status !== 'locked')
  ).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">

      {/* ── Hero card ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E2ECF5] rounded-2xl p-6 sm:p-8 flex items-center gap-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-[24px] sm:text-[28px] font-bold leading-tight mb-2"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: '#2A6EBB' }}>
            {'Hello '}{state.userName || 'Hello'}!
          </h1>
          <p className="text-[13px] text-[#3A5068] leading-relaxed mb-5 max-w-[380px]">
            {completed === 0
              ? "You're all set to begin the BenSelect JScript certification. Start with Module 1 to unlock your path."
              : `You've completed ${completed} of 14 modules${tracksActive > 1 ? ` across ${tracksActive} tracks` : ''}. Keep up the momentum!`}
          </p>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('modules')}
              className="text-[13px] font-semibold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: '#0B1829' }}
            >
              View All Modules
            </button>
            {MODULES.find(m => state.progress[m.id]?.status === 'available') && (
              <button
                onClick={() => {
                  const next = MODULES.find(m => state.progress[m.id]?.status === 'available')
                  if (next) onNavigate('lesson', next.id)
                }}
                className="text-[13px] font-semibold text-[#0B1829] px-5 py-2.5 rounded-xl border border-[#D0DEF0] hover:bg-[#F4F7FB] transition-colors"
              >
                Next Lesson →
              </button>
            )}
          </div>
        </div>

        {/* Radial progress */}
        <div className="shrink-0 hidden sm:block">
          <RadialProgress pct={pct} size={124}/>
        </div>
      </div>

      {/* ── Track Overview ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-[#0B1829]"
            style={{ fontFamily: 'var(--font-display)' }}>Track Overview</h2>
          <button
            onClick={() => onNavigate('modules')}
            className="text-[12px] font-medium text-[#2A6EBB] hover:underline flex items-center gap-1"
          >
            View All <IcChevronRight size={12}/>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {TRACK_GROUPS.map(group => (
            <TrackCard key={group.label} group={group} progress={state.progress} onNavigate={onNavigate}/>
          ))}
        </div>
      </section>

      {/* ── Recent Activity + Next Up ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <RecentActivity progress={state.progress} onNavigate={onNavigate}/>
        </div>
        <div className="lg:col-span-2">
          <NextUpCard state={state} onNavigate={onNavigate}/>
        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      {completed > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Modules Done"   num={completed}        suffix={`/14`}  color="#2A6EBB" />
          <StatCard label="Avg Quiz Score" num={avgScore ?? 0}    suffix="%"      color="#28A87C" />
          <StatCard label="Modules Left"   num={14 - completed}   suffix=""       color="#FF8300" />
          <StatCard label="Total Content"  num={20}               suffix=".5h"    color="#00B4D8" />
        </div>
      )}
    </div>
  )
}

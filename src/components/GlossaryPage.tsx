import { useState, useMemo, useEffect } from 'react'
import { GLOSSARY_ITEMS, GLOSS_CATS } from '@/data/glossary'
import { IcSearch } from './Icons'
import { cn } from '@/lib/utils'


const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  'BenSelect Core':      { bg: '#EBF4FB', text: '#2A6EBB' },
  'Enrollment Timing':   { bg: '#FFF2E6', text: '#CC6A00' },
  'GI & Underwriting':   { bg: '#F3EEFF', text: '#6B3FA0' },
  'Event Types':         { bg: '#E6F7F1', text: '#1A7A5C' },
  'Event Object':        { bg: '#E0F5FF', text: '#0076A8' },
  'JScript.NET Language':{ bg: '#EEF2FF', text: '#3B4FC4' },
  'System.DateTime':     { bg: '#FFF0F3', text: '#C0254B' },
  'String Methods':      { bg: '#FFF3E6', text: '#B85000' },
  'Custom Fields':       { bg: '#FEFCE6', text: '#8A6800' },
  'Scripting Patterns':  { bg: '#E6FAF8', text: '#1A7A73' },
  'System.Decimal':      { bg: '#F3FBF0', text: '#286C3A' },
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? '#2A6EBB' : 'none'}
      stroke={filled ? '#2A6EBB' : '#C8D9EE'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2h10v13l-5-3-5 3V2z"/>
    </svg>
  )
}

const STORAGE_KEY = 'bs_lms_glossary_bookmarks'

function loadBookmarks(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')) }
  catch { return new Set() }
}

export function GlossaryPage() {
  const [search, setSearch]         = useState('')

  const [activeCat, setActiveCat]   = useState<string | null>(null)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [bookmarks, setBookmarks]   = useState<Set<string>>(loadBookmarks)
  const [visibleCount, setVisibleCount] = useState(20)

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarks]))
  }, [bookmarks])

  function toggleBookmark(term: string) {
    setBookmarks(prev => {
      const next = new Set(prev)
      next.has(term) ? next.delete(term) : next.add(term)
      return next
    })
  }


  const filtered = useMemo(() => {
    return GLOSSARY_ITEMS.filter(item => {
      const q = search.toLowerCase()
      const matchesSearch = !q ||
        item.term.toLowerCase().includes(q) ||
        item.def.toLowerCase().includes(q) ||
        (item.ex && item.ex.toLowerCase().includes(q)) ||
        item.cat.toLowerCase().includes(q)
      const matchesCat    = !activeCat || item.cat === activeCat

      const matchesBookmark = !showBookmarks || bookmarks.has(item.term)
      return matchesSearch && matchesCat && matchesBookmark
    })
  }, [search, activeCat, showBookmarks, bookmarks])

  const visible = filtered.slice(0, visibleCount)

  // Reset visible count when filters change
  useEffect(() => setVisibleCount(20), [search, activeCat, showBookmarks])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0B1829] leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}>Glossary & Index</h1>
        <p className="text-[13px] text-[#3A5068] mt-1.5 max-w-[560px] leading-relaxed">
          A comprehensive technical reference for BenSelect JScript scripting. Master core concepts, architecture
          patterns, and event-object terminology through clear definitions.
        </p>
      </div>

      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div className="relative mb-4">
        <IcSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A7890]" />
        <input
          type="text"
          placeholder="Search for terms, concepts, or patterns…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 border border-[#D0DEF0] rounded-xl bg-white text-[14px] text-[#0B1829] outline-none focus:border-[#2A6EBB] focus:ring-2 focus:ring-[rgba(42,110,187,0.1)] transition-all"
          style={{ boxShadow: '0 1px 4px rgba(4,41,74,0.06)' }}
        />
      </div>


      {/* ── Category filter + bookmark toggle ───────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => { setActiveCat(null); setShowBookmarks(false) }}
          className={cn('px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer',
            !activeCat && !showBookmarks
              ? 'bg-[#2A6EBB] text-white border-[#2A6EBB]'
              : 'border-[#D0DEF0] text-[#3A5068] bg-white hover:border-[#2A6EBB] hover:text-[#2A6EBB]')}
        >
          All <span className="opacity-60">({GLOSSARY_ITEMS.length})</span>
        </button>

        {/* Bookmark filter */}
        <button
          onClick={() => { setShowBookmarks(b => !b); setActiveCat(null) }}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer',
            showBookmarks
              ? 'bg-[#2A6EBB] text-white border-[#2A6EBB]'
              : 'border-[#D0DEF0] text-[#3A5068] bg-white hover:border-[#2A6EBB] hover:text-[#2A6EBB]'
          )}
        >
          <BookmarkIcon filled={showBookmarks} />
          Bookmarks
          {bookmarks.size > 0 && (
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5',
              showBookmarks ? 'bg-white/25 text-white' : 'bg-[#EBF4FB] text-[#2A6EBB]')}>
              {bookmarks.size}
            </span>
          )}
        </button>

        <div className="w-px h-5 bg-[#D0DEF0] mx-1" />

        {GLOSS_CATS.map(cat => {
          const col = CAT_COLORS[cat] ?? { bg: '#F0F4F8', text: '#3A5068' }
          const isActive = activeCat === cat
          return (
            <button
              key={cat}
              onClick={() => { setActiveCat(isActive ? null : cat); setShowBookmarks(false) }}
              className="px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer"
              style={isActive
                ? { background: col.text, color: '#fff', borderColor: col.text }
                : { background: col.bg, color: col.text, borderColor: 'transparent' }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* ── Empty state ─────────────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-[#5A7890]">
          <div className="text-4xl mb-4">{showBookmarks ? '🔖' : '🔍'}</div>
          <div className="text-[15px] font-semibold text-[#0B1829] mb-1">
            {showBookmarks ? 'No bookmarks yet' : `No results for "${search}"`}
          </div>
          <div className="text-[13px] text-[#5A7890]">
            {showBookmarks
              ? 'Click the bookmark icon on any term to save it here.'
              : 'Try a different term or clear your filters.'}
          </div>
        </div>
      )}

      {/* ── Term list ───────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {visible.map(item => {
          const col = CAT_COLORS[item.cat] ?? { bg: '#F0F4F8', text: '#3A5068' }
          const isBookmarked = bookmarks.has(item.term)
          return (
            <div
              key={item.term}
              className="bg-white border border-[#E2ECF5] rounded-xl p-5 hover:border-[#B8D0E8] transition-colors group relative overflow-hidden"
              style={{ boxShadow: '0 1px 3px rgba(4,41,74,0.04)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: col.text }} />
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Term name + category badge */}
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <span className="text-[15px] font-bold text-[#0B1829]">{item.term}</span>
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: col.bg, color: col.text }}
                    >
                      {item.cat}
                    </span>
                  </div>

                  {/* Definition */}
                  <p className="text-[13px] text-[#3A5068] leading-relaxed mb-2">{item.def}</p>

                  {/* Code example */}
                  {item.ex && (
                    <code className="block font-mono text-[11.5px] text-[#2A6EBB] bg-[#EBF4FB] border border-[#D0DEF0] px-3 py-2 rounded-lg mt-2 overflow-x-auto whitespace-pre-wrap break-all">
                      {item.ex}
                    </code>
                  )}

                  {/* Reference code footer */}
                  <p className="text-[11px] text-[#A8BED4] mt-2.5">Reference: {item.cat}</p>
                </div>

                {/* Bookmark button */}
                <button
                  onClick={() => toggleBookmark(item.term)}
                  className={cn(
                    'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer mt-0.5',
                    isBookmarked
                      ? 'bg-[#EBF4FB]'
                      : 'opacity-0 group-hover:opacity-100 hover:bg-[#F4F7FB]'
                  )}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this term'}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark this term'}
                >
                  <BookmarkIcon filled={isBookmarked} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Load more ───────────────────────────────────────────────────── */}
      {visibleCount < filtered.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount(n => n + 20)}
            className="px-8 py-2.5 rounded-xl border border-[#D0DEF0] text-[13px] font-semibold text-[#3A5068] bg-white hover:bg-[#F4F7FB] hover:border-[#2A6EBB] hover:text-[#2A6EBB] transition-all cursor-pointer"
          >
            Load More Definitions
            <span className="ml-2 text-[#5A7890] font-normal">({filtered.length - visibleCount} remaining)</span>
          </button>
        </div>
      )}
    </div>
  )
}

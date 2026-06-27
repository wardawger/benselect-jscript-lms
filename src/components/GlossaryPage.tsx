import { useState, useMemo } from 'react'
import { GLOSSARY_ITEMS, GLOSS_CATS } from '@/data/glossary'
import { cn } from '@/lib/utils'
import { IcSearch } from './Icons'

const CAT_COLORS: Record<string, string> = {
  'BenSelect Core': 'bg-blue-50 text-blue-700',
  'Enrollment Timing': 'bg-amber-50 text-amber-700',
  'GI & Underwriting': 'bg-purple-50 text-purple-700',
  'Event Types': 'bg-emerald-50 text-emerald-700',
  'Event Object': 'bg-sky-50 text-sky-700',
  'JScript.NET Language': 'bg-indigo-50 text-indigo-700',
  'System.DateTime': 'bg-rose-50 text-rose-700',
  'String Methods': 'bg-orange-50 text-orange-700',
  'Custom Fields': 'bg-yellow-50 text-yellow-700',
  'Scripting Patterns': 'bg-teal-50 text-teal-700',
}

export function GlossaryPage() {
  const [search, setSearch] = useState('')
  const [activecat, setActivecat] = useState<string | null>(null)

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { All: GLOSSARY_ITEMS.length }
    GLOSS_CATS.forEach(c => { counts[c] = GLOSSARY_ITEMS.filter(i => i.cat === c).length })
    return counts
  }, [])

  const filtered = useMemo(() => {
    return GLOSSARY_ITEMS.filter(item => {
      const matchesCat = !activecat || item.cat === activecat
      const q = search.toLowerCase()
      const matchesSearch = !q || item.term.toLowerCase().includes(q) || item.def.toLowerCase().includes(q) || (item.ex && item.ex.toLowerCase().includes(q)) || item.cat.toLowerCase().includes(q)
      return matchesCat && matchesSearch
    })
  }, [search, activecat])

  const grouped = useMemo(() => {
    const cats = [...new Set(filtered.map(i => i.cat))]
    return cats.map(cat => ({ cat, items: filtered.filter(i => i.cat === cat) }))
  }, [filtered])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <div className="text-[11px] font-medium text-[#4A9FD4] uppercase tracking-widest mb-1.5">Reference</div>
        <h1 className="text-[26px] font-bold text-[#0B1829] tracking-tight">Glossary & Index</h1>
        <p className="text-[13px] text-[#3A5068] mt-1.5">{GLOSSARY_ITEMS.length} terms across {GLOSS_CATS.length} categories</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <IcSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A9BB8]" />
        <input
          type="text"
          placeholder="Search terms, definitions, code examples…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-[1.5px] border-[#D0DEF0] rounded-xl bg-white text-[14px] text-[#0B1829] outline-none focus:border-[#4A9FD4] focus:ring-2 focus:ring-[rgba(74,159,212,0.1)] transition-all shadow-sm"
        />
      </div>

      {/* Category filters with counts */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActivecat(null)}
          className={cn('px-3.5 py-1.5 rounded-full text-[12px] font-medium border-[1.5px] transition-all',
            !activecat ? 'bg-[#2A6EBB] text-white border-[#2A6EBB]' : 'border-[#D0DEF0] text-[#3A5068] bg-white hover:border-[#4A9FD4] hover:text-[#2A6EBB]')}
        >
          All <span className="opacity-60">({catCounts['All']})</span>
        </button>
        {GLOSS_CATS.map(cat => (
          <button
            key={cat}
            onClick={() => setActivecat(activecat === cat ? null : cat)}
            className={cn('px-3.5 py-1.5 rounded-full text-[12px] font-medium border-[1.5px] transition-all',
              activecat === cat ? 'bg-[#2A6EBB] text-white border-[#2A6EBB]' : 'border-[#D0DEF0] text-[#3A5068] bg-white hover:border-[#4A9FD4] hover:text-[#2A6EBB]')}
          >
            {cat} <span className="opacity-60">({catCounts[cat]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#7A9BB8]">
          <div className="text-3xl mb-3">🔍</div>
          <div className="text-[14px]">No terms match "{search}"</div>
        </div>
      )}

      {grouped.map(({ cat, items }) => (
        <div key={cat} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-[11px] font-semibold text-[#7A9BB8] uppercase tracking-wider whitespace-nowrap">{cat}</h2>
            <span className="text-[10px] bg-[#EBF4FB] text-[#2A6EBB] px-2 py-0.5 rounded-full font-medium">{items.length}</span>
            <div className="flex-1 h-px bg-[#E8F0F8]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {items.map(item => (
              <div key={item.term} className="bg-white border border-[#E8F0F8] rounded-xl p-4 shadow-sm hover:border-[#4A9FD4] transition-colors">
                <span className={cn('text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded mb-2 inline-block', CAT_COLORS[item.cat] ?? 'bg-gray-100 text-gray-600')}>
                  {item.cat}
                </span>
                <div className="font-mono text-[12.5px] font-semibold text-[#0B1829] mb-1.5 break-words">{item.term}</div>
                <div className="text-[12.5px] text-[#3A5068] leading-relaxed">{item.def}</div>
                {item.ex && (
                  <code className="block font-mono text-[11px] text-[#2A6EBB] bg-[#EBF4FB] px-2.5 py-1.5 rounded-lg mt-2 overflow-x-auto whitespace-pre-wrap break-all">
                    {item.ex}
                  </code>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

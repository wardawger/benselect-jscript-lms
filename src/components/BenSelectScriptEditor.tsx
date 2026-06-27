import { useState, useRef, useEffect } from 'react'
import { QUIZ_EXERCISES } from '@/data/quizExercises'
import { IS_COMPLETIONS } from '@/data/intellisense'
import { CodeEditor } from './CodeEditor'

// ── Event type metadata ─────────────────────────────────────────────────────

const EVENT_TYPE_TOOLTIPS: Record<string, string> = {
  OnEligible:
    'The OnEligible script is called any time the system needs to determine if the employee is eligible for the benefit. Note that the employee must be eligible through the job class before this script is executed. Return true/false in Event.Value to indicate whether the employee is eligible.',
  OnLoad:
    'OnLoad is called every time the engine initializes. This includes: Enrollment site start-up, Before presentations are shown to the user, Before pre-qualifying questions are presented, Before the application screen is displayed, Before normal underwriting questions are displayed. Use OnLoad to update Event.Config (rate configuration) and set engine properties. You can also change the current rate group by setting Event.RateGroup.',
  OnSave:
    'The OnSave script is called just before the application record is completed as a final step before processing. Use this script to modify Event.Application and associated ApplicationPerson records.',
}

const EVENT_TYPES = [
  'OnEligible', 'OnLoad', 'OnCalc', 'OnSave',
  'OnDependentEligible', 'OnLifeEvent', 'OnUnderwriting', 'Field mapping',
]

const DOC_LINKS = [
  { label: 'Event',                url: 'https://docs.benselect.com/Selerix.BenSelect.Api.ApplicationCore~ETI.ProductEngines.Event.html' },
  { label: 'Event.Application',    url: 'https://docs.benselect.com/Selerix.BenSelect.Api.ApplicationCore~Selerix.BenSelect.View.ApplicationView.html' },
  { label: 'Event.Case',           url: 'https://docs.benselect.com/Selerix.BenSelect.Api.ApplicationCore~Selerix.BenSelect.View.CaseView.html' },
  { label: 'Event.Plan',           url: 'https://docs.benselect.com/Selerix.BenSelect.Api.ApplicationCore~Selerix.BenSelect.View.CaseProductView.html' },
  { label: 'Event.LastCoverage',   url: 'https://docs.benselect.com/Selerix.BenSelect.Api.ApplicationCore~Selerix.BenSelect.View.CoverageView.html' },
  { label: 'Event.ApplicationCtrl',url: 'https://docs.benselect.com/ETIProd~ETI.ProductEngines.Models.IMedicalApplication.html' },
  { label: 'Event.Config',         url: 'https://docs.benselect.com/ETIProd~Selerix.BenSelect.View.ProductEngines.COREProductConfigView.html' },
  { label: 'Event.Engine',         url: 'https://docs.benselect.com/ETIProd~Selerix.BenSelect.View.ProductEngines.COREEngineView.html' },
  { label: 'Portfolio',            url: 'https://docs.benselect.com/Selerix.BenSelect.Api.ApplicationCore~Selerix.BenSelect.View.PortfolioView.html' },
  { label: 'Session',              url: 'https://docs.benselect.com/Selerix.BenSelect.Api.ApplicationCore~Selerix.BenSelect.Server.BenSelectServerSessionView.html' },
  { label: 'Config',               url: 'https://docs.benselect.com/Selerix.BenSelect.Api.ApplicationCore~Selerix.BusinessObjects.AbstractConfigController.html' },
  { label: 'EmployeeEnrollment',   url: 'https://docs.benselect.com/Selerix.Foundation.Interfaces~Selerix.Foundation.Interfaces.IEmployeeEnrollment.html' },
  { label: 'Employee',             url: 'https://docs.benselect.com/Selerix.BenSelect.Api.ApplicationCore~Selerix.BenSelect.View.ApplicantView.html' },
  { label: 'System.DateTime',      url: 'http://msdn.microsoft.com/en-us/library/system.datetime.aspx' },
  { label: 'System.Decimal',       url: 'http://msdn.microsoft.com/en-us/library/system.decimal.aspx' },
  { label: 'System.String',        url: 'http://msdn.microsoft.com/en-us/library/system.string.aspx' },
]

const SNIPPETS = IS_COMPLETIONS.filter(c => c.type === 'snip')

// ── Helpers ────────────────────────────────────────────────────────────────

function detectEventType(starter: string): string {
  const m = starter.match(/\/\/\s*EventType:\s*(\w+)/i)
  return m ? m[1] : 'OnEligible'
}

interface SearchOptions { matchCase: boolean; wholeWord: boolean; useRegex: boolean }

function findMatches(code: string, term: string, opts: SearchOptions): [number, number][] {
  if (!term) return []
  let flags = 'g'
  if (!opts.matchCase) flags += 'i'
  let pattern = opts.useRegex ? term : term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (opts.wholeWord) pattern = `\\b${pattern}\\b`
  try {
    const re = new RegExp(pattern, flags)
    const out: [number, number][] = []
    let m: RegExpExecArray | null
    while ((m = re.exec(code)) !== null) out.push([m.index, m.index + m[0].length])
    return out
  } catch { return [] }
}

// ── Tooltip component ──────────────────────────────────────────────────────

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  function onEnter() {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect()
      setPos({ top: r.bottom + 6, left: r.left })
    }
    setShow(true)
  }

  return (
    <span ref={ref} onMouseEnter={onEnter} onMouseLeave={() => setShow(false)} className="relative">
      {children}
      {show && (
        <div
          className="fixed z-[10000] max-w-xs bg-[#222] text-white text-[11.5px] leading-relaxed p-2.5 rounded-lg shadow-xl pointer-events-none"
          style={{ top: pos.top, left: pos.left }}
        >
          {text}
        </div>
      )}
    </span>
  )
}

// ── History modal ──────────────────────────────────────────────────────────

interface HistoryEntry { code: string; savedAt: string }

function HistoryModal({ history, onRestore, onClose }: { history: HistoryEntry[]; onRestore: (code: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-[#2A6EBB] text-white px-5 py-3 flex items-center justify-between">
          <span className="font-semibold text-[14px]">Script History</span>
          <button onClick={onClose} className="text-white/70 hover:text-white text-lg leading-none">✕</button>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-[#E8F0F8]">
          {history.length === 0 && <div className="p-5 text-[13px] text-[#7A9BB8] text-center">No saved versions yet.</div>}
          {history.map((h, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-[#F4F7FB]">
              <div>
                <div className="text-[12px] font-mono text-[#0B1829]">Version {history.length - i}</div>
                <div className="text-[11px] text-[#7A9BB8] mt-0.5">{h.savedAt}</div>
                <div className="text-[11px] font-mono text-[#3A5068] mt-1 truncate max-w-[280px]">{h.code.split('\n')[0]}</div>
              </div>
              <button
                onClick={() => { onRestore(h.code); onClose() }}
                className="text-[12px] text-[#2A6EBB] hover:underline shrink-0 ml-4"
              >
                Restore
              </button>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-[#E8F0F8] flex justify-end">
          <button onClick={onClose} className="text-[13px] border border-[#D0DEF0] px-4 py-1.5 rounded-lg hover:bg-[#F4F7FB]">Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Script editor modal ────────────────────────────────────────────────────

interface EditorModalProps {
  eventType: string
  code: string
  onChange: (v: string) => void
  onSave: () => void
  onCancel: () => void
  history: HistoryEntry[]
  onRestore: (code: string) => void
  isExercise: boolean
}

function EditorModal({ eventType, code, onChange, onSave, onCancel, history, onRestore, isExercise }: EditorModalProps) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const lnRef = useRef<HTMLDivElement>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [saveAll, setSaveAll] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showSnippets, setShowSnippets] = useState(false)

  // Search state
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [replaceTerm, setReplaceTerm] = useState('')
  const [showReplace, setShowReplace] = useState(false)
  const [matchCase, setMatchCase] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0)

  const matches = findMatches(code, searchTerm, { matchCase, wholeWord, useRegex })

  // Sync line number scroll
  function handleScroll(e: React.UIEvent<HTMLTextAreaElement>) {
    if (lnRef.current) lnRef.current.scrollTop = (e.target as HTMLTextAreaElement).scrollTop
  }

  // Keyboard shortcut: Ctrl+F = open search
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setShowSearch(true)
        setTimeout(() => document.getElementById('bs-search-input')?.focus(), 50)
      }
      if (e.key === 'Escape') {
        if (showSearch) { setShowSearch(false); setShowReplace(false) }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showSearch])

  // Navigate to match
  function goToMatch(idx: number) {
    if (!taRef.current || matches.length === 0) return
    const clamped = (idx + matches.length) % matches.length
    setCurrentMatchIdx(clamped)
    const [start, end] = matches[clamped]
    taRef.current.focus()
    taRef.current.setSelectionRange(start, end)
    // scroll to selection
    const linesBefore = code.slice(0, start).split('\n').length
    const lineHeight = 21
    taRef.current.scrollTop = Math.max(0, (linesBefore - 3) * lineHeight)
  }

  function replaceCurrent() {
    if (matches.length === 0) return
    const [start, end] = matches[currentMatchIdx]
    const newCode = code.slice(0, start) + replaceTerm + code.slice(end)
    onChange(newCode)
    setTimeout(() => goToMatch(currentMatchIdx), 10)
  }

  function replaceAll() {
    if (!searchTerm) return
    const opts = { matchCase, wholeWord, useRegex }
    let flags = 'g'
    if (!opts.matchCase) flags += 'i'
    let pattern = opts.useRegex ? searchTerm : searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (opts.wholeWord) pattern = `\\b${pattern}\\b`
    try { onChange(code.replace(new RegExp(pattern, flags), replaceTerm)) } catch {}
  }

  function insertSnippet(insert: string) {
    const ta = taRef.current
    if (!ta) return
    const start = ta.selectionStart
    const newVal = code.slice(0, start) + insert + code.slice(ta.selectionEnd)
    onChange(newVal)
    setShowSnippets(false)
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + insert.length; ta.focus() }, 10)
  }

  function indentSelection(dir: 1 | -1) {
    const ta = taRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const lines = code.split('\n')
    let charCount = 0
    let firstLine = -1, lastLine = -1
    for (let i = 0; i < lines.length; i++) {
      const lineEnd = charCount + lines[i].length
      if (firstLine === -1 && lineEnd >= start) firstLine = i
      if (charCount <= end) lastLine = i
      charCount += lines[i].length + 1
    }
    const newLines = lines.map((l, i) => {
      if (i < firstLine || i > lastLine) return l
      if (dir === 1) return '    ' + l
      return l.replace(/^    /, '')
    })
    onChange(newLines.join('\n'))
  }

  const lineCount = (code.match(/\n/g) ?? []).length + 1

  const modalCls = fullscreen
    ? 'fixed inset-0 z-[10001] flex flex-col bg-white'
    : 'fixed inset-4 md:inset-8 z-[10001] flex flex-col bg-white rounded-lg shadow-2xl max-w-[1200px] max-h-[90vh] mx-auto'

  return (
    <>
      <div className="fixed inset-0 z-[10000] bg-black/50" />
      <div className={modalCls}>
        {/* Title bar */}
        <div className="bg-[#2A6EBB] text-white px-5 py-3 flex items-center justify-between shrink-0">
          <span className="font-semibold text-[15px]">
            {eventType} - Script
            {isExercise && <span className="ml-3 text-[11px] font-normal text-white/60 bg-white/10 px-2 py-0.5 rounded">Exercise</span>}
          </span>
          <button onClick={onCancel} className="text-white/70 hover:text-white text-xl leading-none px-1">✕</button>
        </div>

        {/* Toolbar */}
        <div className="bg-[#F0F0F0] border-b border-[#D0D0D0] px-2 py-1.5 flex items-center gap-1 shrink-0 flex-wrap">
          {/* Search toggle */}
          <ToolbarButton title="Find (Ctrl+F)" onClick={() => { setShowSearch(s => !s); setTimeout(() => document.getElementById('bs-search-input')?.focus(), 50) }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="6" cy="6" r="4"/><line x1="9.2" y1="9.2" x2="12" y2="12"/>
            </svg>
          </ToolbarButton>
          {/* Indent */}
          <ToolbarButton title="Indent selection" onClick={() => indentSelection(1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <line x1="2" y1="4" x2="12" y2="4"/><line x1="5" y1="7" x2="12" y2="7"/><line x1="5" y1="10" x2="12" y2="10"/><polyline points="1,6 3,7 1,8"/>
            </svg>
          </ToolbarButton>
          {/* Unindent */}
          <ToolbarButton title="Unindent selection" onClick={() => indentSelection(-1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <line x1="2" y1="4" x2="12" y2="4"/><line x1="5" y1="7" x2="12" y2="7"/><line x1="5" y1="10" x2="12" y2="10"/><polyline points="4,6 2,7 4,8"/>
            </svg>
          </ToolbarButton>
          {/* Insert Snippet */}
          <div className="relative">
            <button
              onClick={() => setShowSnippets(s => !s)}
              className="flex items-center gap-1.5 text-[12px] bg-[#5A5A5A] text-white hover:bg-[#4A4A4A] px-2.5 py-1 rounded transition-colors"
            >
              Insert Snippet
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="2,3 5,7 8,3"/></svg>
            </button>
            {showSnippets && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#D0D0D0] rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                {SNIPPETS.map(s => (
                  <button
                    key={s.label}
                    onClick={() => insertSnippet(s.insert)}
                    className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#EBF4FB] border-b border-[#F0F0F0] last:border-0"
                  >
                    <div className="font-mono text-[#0B1829]">{s.label}</div>
                    <div className="text-[10.5px] text-[#7A9BB8] mt-0.5">{s.detail}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1" />
          {/* Fullscreen */}
          <ToolbarButton title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={() => setFullscreen(f => !f)}>
            {fullscreen ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <polyline points="5,2 2,2 2,5"/><polyline points="9,2 12,2 12,5"/><polyline points="5,12 2,12 2,9"/><polyline points="9,12 12,12 12,9"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <polyline points="2,5 2,2 5,2"/><polyline points="12,5 12,2 9,2"/><polyline points="2,9 2,12 5,12"/><polyline points="12,9 12,12 9,12"/>
              </svg>
            )}
          </ToolbarButton>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="bg-[#F8F8F8] border-b border-[#D0D0D0] px-3 py-1.5 flex flex-col gap-1 shrink-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Expand replace */}
              <button
                title="Toggle replace"
                onClick={() => setShowReplace(r => !r)}
                className={`p-1 rounded text-[#555] hover:bg-[#E0E0E0] transition-colors text-[10px] font-bold ${showReplace ? 'bg-[#D0D8E8]' : ''}`}
              >▶</button>
              {/* Search input */}
              <input
                id="bs-search-input"
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentMatchIdx(0) }}
                placeholder="Find"
                className="border border-[#BCBCBC] rounded px-2 py-0.5 text-[12.5px] w-40 focus:outline-none focus:border-[#2A6EBB]"
              />
              {/* Match options */}
              <SearchToggle title="Match case" active={matchCase} onClick={() => setMatchCase(v => !v)}>Aa</SearchToggle>
              <SearchToggle title="Match whole word" active={wholeWord} onClick={() => setWholeWord(v => !v)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="10" height="6" rx="1"/></svg>
              </SearchToggle>
              <SearchToggle title="Use regular expression" active={useRegex} onClick={() => setUseRegex(v => !v)}>.*</SearchToggle>
              {/* Results count */}
              <span className="text-[11.5px] text-[#666] min-w-[52px]">
                {matches.length === 0 ? (searchTerm ? 'No results' : '') : `${currentMatchIdx + 1} of ${matches.length}`}
              </span>
              {/* Prev / Next */}
              <button title="Previous match" disabled={matches.length === 0} onClick={() => goToMatch(currentMatchIdx - 1)} className="p-0.5 rounded hover:bg-[#E0E0E0] disabled:opacity-30">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><polyline points="10,5 7,9 4,5"/></svg>
              </button>
              <button title="Next match" disabled={matches.length === 0} onClick={() => goToMatch(currentMatchIdx + 1)} className="p-0.5 rounded hover:bg-[#E0E0E0] disabled:opacity-30">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><polyline points="4,9 7,5 10,9"/></svg>
              </button>
              {/* Select all matches (decorative) */}
              <button title="Find in selection" className="p-0.5 rounded hover:bg-[#E0E0E0]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="2" y="4" width="10" height="6" rx="1" strokeDasharray="2 1.5"/></svg>
              </button>
              {/* Close */}
              <button title="Close (Esc)" onClick={() => { setShowSearch(false); setShowReplace(false) }} className="p-0.5 rounded hover:bg-[#E0E0E0]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="3" y1="3" x2="11" y2="11"/><line x1="11" y1="3" x2="3" y2="11"/></svg>
              </button>
            </div>
            {/* Replace row */}
            {showReplace && (
              <div className="flex items-center gap-1.5 ml-6">
                <input
                  type="text"
                  value={replaceTerm}
                  onChange={e => setReplaceTerm(e.target.value)}
                  placeholder="Replace"
                  className="border border-[#BCBCBC] rounded px-2 py-0.5 text-[12.5px] w-40 focus:outline-none focus:border-[#2A6EBB]"
                />
                <button
                  title="Replace current"
                  onClick={replaceCurrent}
                  disabled={matches.length === 0}
                  className="p-0.5 rounded hover:bg-[#E0E0E0] disabled:opacity-30"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 7h6M5 4l3 3-3 3"/><path d="M12 2v4a2 2 0 01-2 2H9"/></svg>
                </button>
                <button
                  title="Replace all"
                  onClick={replaceAll}
                  disabled={matches.length === 0}
                  className="p-0.5 rounded hover:bg-[#E0E0E0] disabled:opacity-30"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 5h4M3 3l2 2-2 2"/><path d="M2 10h4M3 8l2 2-2 2"/><path d="M10 2v4a1.5 1.5 0 01-1.5 1.5H8"/><path d="M10 6v4a1.5 1.5 0 01-1.5 1.5H8"/></svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main area: line numbers + editor + doc panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor pane */}
          <div className="flex flex-1 overflow-hidden bg-white">
            {/* Line numbers */}
            <div
              ref={lnRef}
              className="select-none bg-[#F5F5F5] border-r border-[#E0E0E0] overflow-hidden text-right py-3 px-2 shrink-0"
              style={{ minWidth: 44, fontFamily: 'Roboto Mono, monospace', fontSize: 12.5, lineHeight: '21px', color: '#AAA' }}
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>
            {/* Textarea via CodeEditor */}
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={code}
                onChange={onChange}
                rows={Math.max(lineCount + 2, 20)}
                textareaRef={taRef}
                onScroll={handleScroll}
                className="bs-editor-textarea"
                placeholder=""
              />
            </div>
          </div>

          {/* Right doc panel */}
          <div className="w-44 shrink-0 border-l border-[#D8D8D8] bg-[#F8F8F8] overflow-y-auto py-4 px-3">
            <ul className="space-y-1.5">
              {DOC_LINKS.map(l => (
                <li key={l.label} className="flex items-start gap-1 text-[12px]">
                  <span className="text-[#555] mt-0.5">•</span>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2A6EBB] hover:underline leading-snug"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F0F0F0] border-t border-[#D0D0D0] px-4 py-2 flex items-center shrink-0">
          <label className="flex items-center gap-1.5 text-[12px] text-[#333] cursor-pointer select-none">
            <input type="checkbox" checked={saveAll} onChange={e => setSaveAll(e.target.checked)} className="accent-[#2A6EBB]" />
            Save to all rate groups
          </label>
          <div className="flex-1" />
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="bg-[#F5820E] hover:bg-[#E07200] text-white text-[13px] font-medium px-5 py-1.5 rounded transition-colors"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="bg-[#888] hover:bg-[#777] text-white text-[13px] px-4 py-1.5 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-[#888] hover:bg-[#777] text-white text-[13px] px-4 py-1.5 rounded transition-colors"
            >
              History
            </button>
          </div>
        </div>
      </div>

      {showHistoryModal && (
        <HistoryModal
          history={history}
          onRestore={code => { onRestore(code); setShowHistoryModal(false) }}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </>
  )
}

// ── Small sub-components ───────────────────────────────────────────────────

function ToolbarButton({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="flex items-center justify-center w-7 h-7 rounded text-[#444] bg-[#E0E0E0] hover:bg-[#D0D0D0] border border-[#C0C0C0] transition-colors"
    >
      {children}
    </button>
  )
}

function SearchToggle({ title, active, onClick, children }: { title: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex items-center justify-center h-6 px-1.5 rounded text-[11.5px] border transition-colors ${active ? 'bg-[#D0D8E8] border-[#8AAACF] text-[#1A4A8F]' : 'border-[#BCBCBC] text-[#555] hover:bg-[#E8E8E8]'}`}
    >
      {children}
    </button>
  )
}

// ── Main exported component ────────────────────────────────────────────────

interface BenSelectScriptEditorProps {
  moduleId: number
  mode: 'lesson' | 'quiz'
  onScore?: (bonus: number) => void
}

export function BenSelectScriptEditor({ moduleId, mode, onScore }: BenSelectScriptEditorProps) {
  const ex = QUIZ_EXERCISES[moduleId]
  const targetEventType = ex ? detectEventType(ex.starter) : null

  // Per-event-type code storage
  const [scripts, setScripts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    if (ex && targetEventType) init[targetEventType] = ex.starter
    return init
  })
  const [openEventType, setOpenEventType] = useState<string | null>(null)
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({})

  // Grading state
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<{ label: string; earned: boolean }[]>([])
  const [bonus, setBonus] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)

  function setCurrentCode(v: string) {
    if (!openEventType) return
    setScripts(prev => ({ ...prev, [openEventType]: v }))
  }

  function handleSave() {
    if (!openEventType) return
    const code = scripts[openEventType] ?? ''

    // Push to history
    const entry: HistoryEntry = { code, savedAt: new Date().toLocaleString() }
    setHistory(prev => ({ ...prev, [openEventType]: [entry, ...(prev[openEventType] ?? [])].slice(0, 20) }))

    // Grade if this is the exercise event type
    if (ex && openEventType === targetEventType) {
      const scored = ex.keywords.map(kw => ({ label: kw.label, earned: kw.pattern.test(code) }))
      const earned = scored.filter(r => r.earned).length
      const b = Math.round((earned / ex.keywords.length) * 2)
      setResults(scored)
      setBonus(b)
      setSubmitted(true)
      onScore?.(b)
    }

    setOpenEventType(null)
  }

  function handleRestore(code: string) {
    if (!openEventType) return
    setScripts(prev => ({ ...prev, [openEventType]: code }))
  }

  function handleReset() {
    if (!ex || !targetEventType) return
    setScripts(prev => ({ ...prev, [targetEventType]: ex.starter }))
    setSubmitted(false)
    setResults([])
    setBonus(0)
    setShowSolution(false)
    onScore?.(0)
  }

  const earnedCount = results.filter(r => r.earned).length
  const totalCount = ex?.keywords.length ?? 0

  const headerLabel = mode === 'quiz'
    ? <span className="text-[10px] font-mono font-bold text-[#2A6EBB] bg-[#EBF4FB] px-2 py-0.5 rounded uppercase tracking-wider">Coding Challenge · +0–2 bonus pts</span>
    : <span className="text-[10px] font-mono font-bold text-[#28A87C] bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">Practice Exercise · no grade</span>

  return (
    <div className={`mt-8 border border-[#D4D4D4] rounded bg-white shadow-sm overflow-hidden`}>
      {/* Section header */}
      <div className="px-4 py-3 bg-[#F4F7FB] border-b border-[#E0E8F0] flex items-center gap-3">
        {headerLabel}
        {ex && <span className="text-[13px] font-semibold text-[#0B1829]">{ex.title}</span>}
      </div>

      {/* Intro + task */}
      {ex && (
        <div className="px-4 py-3 border-b border-[#E8EEF4] bg-white">
          <p className="text-[13px] text-[#3A5068] mb-2">{ex.intro}</p>
          <div className={`rounded-lg p-3 border ${mode === 'quiz' ? 'bg-[#EBF4FB] border-[rgba(42,110,187,0.2)]' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${mode === 'quiz' ? 'text-[#2A6EBB]' : 'text-emerald-700'}`}>Task</div>
            <p className={`text-[12.5px] leading-relaxed ${mode === 'quiz' ? 'text-[#0B1829]' : 'text-emerald-900'}`}>{ex.task}</p>
          </div>

          {/* Hints */}
          <button onClick={() => setShowHints(h => !h)} className="text-[12px] text-[#2A6EBB] hover:underline mt-2 flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6" cy="6" r="5"/><line x1="6" y1="5" x2="6" y2="9"/><circle cx="6" cy="3.5" r="0.75" fill="currentColor" stroke="none"/></svg>
            {showHints ? 'Hide hints' : 'Show hints'}
          </button>
          {showHints && (
            <div className="mt-2 bg-[#FFF8ED] border border-[rgba(245,166,35,0.25)] rounded-lg p-3 space-y-1">
              {ex.hints.map((h, i) => (
                <div key={i} className="text-[12px] font-mono text-[#7A5200] flex items-start gap-1.5">
                  <span className="text-[#F5A623] shrink-0 mt-0.5">›</span>{h}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Plan JScript table */}
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="bg-[#E8E8E8]">
            <th className="text-left px-4 py-2 font-semibold text-[#333] border-b border-[#CECECE] w-48">EventType</th>
            <th className="text-left px-4 py-2 font-semibold text-[#333] border-b border-[#CECECE]">Script</th>
            <th className="border-b border-[#CECECE] w-12" />
          </tr>
        </thead>
        <tbody>
          {EVENT_TYPES.map((et, i) => {
            const tooltip = EVENT_TYPE_TOOLTIPS[et]
            const isTarget = et === targetEventType
            const savedCode = scripts[et] ?? ''
            const preview = savedCode.split('\n').find(l => l.trim() && !l.trim().startsWith('//'))?.trim() ?? ''
            return (
              <tr key={et} className={`border-b border-[#E4E4E4] ${isTarget ? 'bg-[#F0F6FF]' : i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                <td className="px-4 py-2.5 text-[#1A5296]">
                  {tooltip ? (
                    <Tooltip text={tooltip}>
                      <span className="underline decoration-dotted cursor-help">{et}</span>
                    </Tooltip>
                  ) : (
                    <span>{et}</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-[#555] font-mono text-[12px] truncate max-w-0">
                  {preview}
                </td>
                <td className="px-2 py-2 text-right">
                  <button
                    onClick={() => setOpenEventType(et)}
                    title={`Edit ${et} script`}
                    className="inline-flex items-center justify-center w-8 h-7 bg-[#D8D8D8] hover:bg-[#C8C8C8] text-[#555] hover:text-[#333] rounded text-[11px] font-mono font-bold border border-[#BCBCBC] transition-colors"
                  >
                    {'</>'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* View All link */}
      <div className="px-4 py-2 border-t border-[#E4E4E4] bg-[#FAFAFA]">
        <span className="text-[12px] text-[#1A5296] underline cursor-default opacity-50">View All</span>
      </div>

      {/* Grading results (shown after save in quiz mode) */}
      {submitted && ex && (
        <div className="border-t border-[#E8EEF4]">
          <div className={`m-4 rounded-xl p-4 border ${bonus === 2 ? 'bg-emerald-50 border-emerald-200' : bonus === 1 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[14px] font-bold" style={{ color: bonus === 2 ? '#28A87C' : bonus === 1 ? '#D4820A' : '#E84C4C' }}>
                {bonus === 2 ? '🏆 Full bonus! +2 pts' : bonus === 1 ? '⚡ Partial bonus +1 pt' : '✗ No bonus earned'}
              </div>
              <div className="text-[12px] text-[#7A9BB8]">{earnedCount}/{totalCount} criteria met</div>
            </div>
            <div className="space-y-1">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px]">
                  <span className={r.earned ? 'text-emerald-600' : 'text-red-500'}>{r.earned ? '✓' : '✗'}</span>
                  <span className={r.earned ? 'text-emerald-800' : 'text-red-800'}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 pb-4 flex items-center gap-3">
            <button onClick={() => setShowSolution(s => !s)} className="text-[12px] text-[#2A6EBB] hover:underline flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <polyline points={showSolution ? '2,8 6,4 10,8' : '2,4 6,8 10,4'}/>
              </svg>
              {showSolution ? 'Hide solution' : 'View solution'}
            </button>
            <button onClick={handleReset} className="text-[12px] border border-[#D0DEF0] text-[#3A5068] px-3 py-1 rounded hover:bg-[#F4F7FB]">
              Reset &amp; Try Again
            </button>
          </div>
          {showSolution && (
            <div className="px-4 pb-4">
              <pre className="bg-[#0B1829] text-[#B8D4EC] font-mono text-[12px] p-4 rounded-xl overflow-x-auto leading-relaxed">{ex.solution}</pre>
              <div className="mt-2 bg-[#F0F6FD] border border-[#C8DFF0] rounded-xl p-3 text-[12.5px] text-[#3A5068]">
                <strong className="text-[#0B1829]">Explanation: </strong>{ex.solutionExplain}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lesson mode: show solution after save */}
      {mode === 'lesson' && !submitted && Object.keys(scripts).some(k => k === targetEventType && scripts[k] !== (ex?.starter ?? '')) && (
        <div className="px-4 py-3 border-t border-[#E8EEF4] flex items-center gap-3">
          <span className="text-[12px] text-emerald-700 font-medium">✓ Code saved</span>
          <button onClick={() => setShowSolution(s => !s)} className="text-[12px] text-[#2A6EBB] hover:underline">
            {showSolution ? 'Hide solution' : 'View solution'}
          </button>
          <button onClick={handleReset} className="text-[12px] border border-[#D0DEF0] text-[#3A5068] px-3 py-1 rounded hover:bg-[#F4F7FB]">Reset</button>
        </div>
      )}
      {mode === 'lesson' && showSolution && ex && (
        <div className="px-4 pb-4">
          <pre className="bg-[#0B1829] text-[#B8D4EC] font-mono text-[12px] p-4 rounded-xl overflow-x-auto leading-relaxed">{ex.solution}</pre>
          <div className="mt-2 bg-[#F0F6FD] border border-[#C8DFF0] rounded-xl p-3 text-[12.5px] text-[#3A5068]">
            <strong className="text-[#0B1829]">Explanation: </strong>{ex.solutionExplain}
          </div>
        </div>
      )}

      {/* Editor modal */}
      {openEventType && (
        <EditorModal
          eventType={openEventType}
          code={scripts[openEventType] ?? ''}
          onChange={setCurrentCode}
          onSave={handleSave}
          onCancel={() => setOpenEventType(null)}
          history={history[openEventType] ?? []}
          onRestore={handleRestore}
          isExercise={openEventType === targetEventType && !!ex}
        />
      )}
    </div>
  )
}

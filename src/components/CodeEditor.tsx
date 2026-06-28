import { useState, useRef, useEffect, useCallback } from 'react'
import { IS_COMPLETIONS, type ISCompletion } from '@/data/intellisense'

interface DropdownPos { top: number; left: number }

function getWord(el: HTMLTextAreaElement): string {
  const val = el.value
  const pos = el.selectionStart
  let start = pos
  while (start > 0 && /[\w.$_]/.test(val[start - 1])) start--
  return val.slice(start, pos)
}

function getMatches(word: string): ISCompletion[] {
  if (!word) return []
  const lw = word.toLowerCase()
  const scored = IS_COMPLETIONS.map(item => {
    const ll = item.label.toLowerCase()
    let s = 0
    if (ll === lw) s = 100
    else if (ll.startsWith(lw)) s = 80
    else if (ll.includes(lw)) s = 60
    else if (item.detail.toLowerCase().includes(lw)) s = 40
    return { item, s }
  }).filter(x => x.s > 0)
  scored.sort((a, b) => b.s - a.s)
  return scored.slice(0, 10).map(x => x.item)
}

function acceptCompletion(el: HTMLTextAreaElement, item: ISCompletion) {
  const val = el.value
  const pos = el.selectionStart
  let start = pos
  while (start > 0 && /[\w.$_]/.test(val[start - 1])) start--
  const before = val.slice(0, start)
  const after = val.slice(pos)
  const inserted = item.insert
  const newVal = before + inserted + after
  el.value = newVal

  // position cursor: before trailing ) for fns, else at end of insert
  let cursorPos = before.length + inserted.length
  const lastParen = inserted.lastIndexOf(')')
  const lastQuote = inserted.lastIndexOf('"')
  if (lastParen > 0 && inserted.endsWith(')')) cursorPos = before.length + lastParen
  else if (lastQuote > 0 && inserted.endsWith('"')) cursorPos = before.length + lastQuote

  el.selectionStart = el.selectionEnd = cursorPos
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

function getDropdownPos(el: HTMLTextAreaElement): DropdownPos {
  const rect = el.getBoundingClientRect()
  const lineHeight = parseInt(getComputedStyle(el).lineHeight) || 21
  const text = el.value.slice(0, el.selectionStart)
  const lines = text.split('\n')
  const lineNum = lines.length - 1
  const col = lines[lineNum].length
  // approximate: monospace ~7.5px per char
  const approxLeft = rect.left + col * 7.5 + 16
  const approxTop = rect.top + lineNum * lineHeight + lineHeight + 14
  return {
    top: Math.min(approxTop, window.innerHeight - 260),
    left: Math.min(approxLeft, window.innerWidth - 500),
  }
}

const ICON_LABELS: Record<string, string> = { prop: 'P', fn: 'F', kw: 'K', snip: 'S', const: 'C' }
const ICON_CLS: Record<string, string> = { prop: 'is-icon-prop', fn: 'is-icon-fn', kw: 'is-icon-kw', snip: 'is-icon-snip', const: 'is-icon-const' }

interface CodeEditorProps {
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
  disabled?: boolean
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void
  className?: string
}

export function CodeEditor({ value, onChange, rows = 10, placeholder, disabled, textareaRef: externalRef, onScroll, className }: CodeEditorProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null)
  const taRef = (externalRef ?? internalRef) as React.RefObject<HTMLTextAreaElement>
  const [matches, setMatches] = useState<ISCompletion[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [pos, setPos] = useState<DropdownPos>({ top: 0, left: 0 })
  const open = matches.length > 0

  const closeDropdown = useCallback(() => setMatches([]), [])

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
    const el = e.target
    const word = getWord(el)
    if (word.length >= 1) {
      const m = getMatches(word)
      setMatches(m)
      setActiveIdx(0)
      if (m.length > 0) setPos(getDropdownPos(el))
    } else {
      closeDropdown()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (open) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, matches.length - 1)); return }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); return }
      if (e.key === 'Escape')    { e.preventDefault(); closeDropdown(); return }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault()
        const item = matches.length === 1 ? matches[0] : matches[activeIdx]
        if (item && taRef.current) {
          acceptCompletion(taRef.current, item)
          onChange(taRef.current.value)
          // re-trigger match check
          const word = getWord(taRef.current)
          const m = getMatches(word)
          if (m.length > 0) { setMatches(m); setActiveIdx(0); setPos(getDropdownPos(taRef.current)) }
          else closeDropdown()
        }
        return
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const el = taRef.current!
      const start = el.selectionStart
      const end = el.selectionEnd
      const newVal = el.value.slice(0, start) + '    ' + el.value.slice(end)
      onChange(newVal)
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 4 })
    }
  }

  function pickItem(item: ISCompletion) {
    const el = taRef.current!
    acceptCompletion(el, item)
    onChange(el.value)
    closeDropdown()
    el.focus()
  }

  // close on outside click — but not when clicking inside the dropdown itself
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Node
      const insideTextarea = taRef.current?.contains(target)
      const insideDropdown = dropdownRef.current?.contains(target)
      if (!insideTextarea && !insideDropdown) closeDropdown()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [closeDropdown])

  return (
    <div className="relative">
      <textarea
        ref={taRef}
        className={className ?? 'qex-editor'}
        rows={rows}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onScroll={onScroll}
        placeholder={placeholder ?? 'Write your JScript here…'}
        disabled={disabled}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        style={{ minHeight: `${rows * 21}px` }}
      />

      {/* IntelliSense dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="is-dropdown is-visible"
          style={{ top: pos.top, left: pos.left }}
        >
          {matches.map((item, idx) => {
            const word = taRef.current ? getWord(taRef.current) : ''
            const labelHtml = word
              ? item.label.replace(new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'), '<em>$1</em>')
              : item.label
            return (
              <div
                key={item.label}
                className={`is-item${idx === activeIdx ? ' is-active' : ''}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseDown={e => { e.preventDefault(); pickItem(item) }}
              >
                <span className={`is-icon ${ICON_CLS[item.icon] ?? 'is-icon-prop'}`}>
                  {ICON_LABELS[item.icon] ?? 'P'}
                </span>
                <span className="is-content">
                  <div className="is-label" dangerouslySetInnerHTML={{ __html: labelHtml }} />
                  <div className="is-detail">{item.detail}</div>
                </span>
                <span className="is-type">{item.type}</span>
              </div>
            )
          })}
          <div className="is-footer">
            <span className="is-key"><kbd>↑↓</kbd> navigate</span>
            <span className="is-key"><kbd>Tab</kbd> or <kbd>Enter</kbd> accept</span>
            <span className="is-key"><kbd>Esc</kbd> dismiss</span>
          </div>
        </div>
      )}
    </div>
  )
}

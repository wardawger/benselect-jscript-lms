import { useState, useEffect, useRef } from 'react'
import { IcEdit, IcReset, IcMenu, IcChevronDown, IcChevronRight, IcSidebarToggle } from './components/Icons'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { LessonPage } from './components/LessonPage'
import { QuizPage } from './components/QuizPage'
import { GlossaryPage } from './components/GlossaryPage'
import { ProgressPage } from './components/ProgressPage'
import type { AppState } from './store/progress'
import { loadState, saveState, defaultState } from './store/progress'

function LoginModal({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('')
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1829]/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 border border-[#E2ECF5]">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-5" style={{ background: '#2A6EBB' }}>BS</div>
        <h2 className="text-[20px] font-bold text-[#0B1829] mb-1.5">Welcome to BenSelect LMS</h2>
        <p className="text-[13px] text-[#3A5068] mb-6">What's your name? We'll use it to personalize your progress.</p>
        <form onSubmit={e => { e.preventDefault(); if (name.trim()) onSubmit(name.trim()) }}>
          <input
            autoFocus
            type="text"
            placeholder="Your name…"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border-[1.5px] border-[#D0DEF0] rounded-xl px-4 py-3 text-[14px] text-[#0B1829] outline-none focus:border-[#4A9FD4] focus:ring-2 focus:ring-[rgba(74,159,212,0.12)] mb-4 transition-all"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full text-white font-medium py-3 rounded-xl text-[14px] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: '#2A6EBB' }}
          >
            Start Learning →
          </button>
        </form>
      </div>
    </div>
  )
}

function UserDropdown({ userName, onRename, onReset }: { userName: string; onRename: () => void; onReset: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-[13px] font-medium text-[#3A5068] bg-white hover:bg-[#F4F7FB] border border-[#D0DEF0] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
      >
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: '#2A6EBB' }}>
          {userName.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-[120px] truncate">{userName}</span>
        <span style={{ display: 'flex', transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <IcChevronDown size={12} />
        </span>
      </button>
      {/* Always rendered — animated with opacity + transform */}
      <div
        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-[#E2ECF5] overflow-hidden z-50"
        style={{
          boxShadow: '0 8px 24px rgba(4,41,74,0.12)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)',
          transition: 'opacity 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.22s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div className="px-4 py-2.5 border-b border-[#E8F0F8]">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7A9BB8]">Account</p>
          <p className="text-[13px] font-medium text-[#0B1829] mt-0.5 truncate">{userName}</p>
        </div>
        <div className="p-1">
          <button
            onClick={() => { onRename(); setOpen(false) }}
            className="w-full text-left px-3 py-2.5 text-[13px] text-[#3A5068] hover:bg-[#F4F7FB] hover:text-[#0B1829] rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <IcEdit size={14} />
            Change Name
          </button>
          <div className="h-px bg-[#E8F0F8] my-1" />
          <button
            onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) { onReset(); setOpen(false) } }}
            className="w-full text-left px-3 py-2.5 text-[13px] text-[#E84C4C] hover:bg-red-50 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <IcReset size={14} />
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(!loadState().userName)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    saveState(state)
  }, [state])

  function setUserName(name: string) {
    setState(prev => ({ ...prev, userName: name }))
    setShowLoginModal(false)
  }

  function navigate(page: string, moduleId?: number) {
    setState(prev => ({
      ...prev,
      page,
      activeModule: moduleId ?? null,
      quizMode: false,
    }))
    window.scrollTo(0, 0)
  }

  function startQuiz(moduleId: number) {
    setState(prev => ({
      ...prev,
      page: 'quiz',
      activeModule: moduleId,
      quizMode: true,
    }))
    window.scrollTo(0, 0)
  }

  function completeQuiz(moduleId: number, score: number, passed: boolean) {
    setState(prev => {
      const progress = { ...prev.progress }
      const current = { ...progress[moduleId] }
      current.score = score
      current.attempts = (current.attempts ?? 0) + 1
      if (passed) {
        current.status = 'complete'
        current.needsReview = false
        if (moduleId < 14 && progress[moduleId + 1]) {
          progress[moduleId + 1] = { ...progress[moduleId + 1], status: 'available' }
        }
      } else {
        current.needsReview = true
      }
      progress[moduleId] = current
      return {
        ...prev,
        progress,
        page: 'lesson',
        activeModule: passed && moduleId < 14 ? moduleId + 1 : moduleId,
        quizMode: false,
      }
    })
  }

  function resetProgress() {
    const fresh = defaultState()
    fresh.userName = state.userName
    setState(fresh)
    saveState(fresh)
  }

  function renderContent() {
    switch (state.page) {
      case 'dashboard':
        return <Dashboard state={state} page="dashboard" onNavigate={navigate} />
      case 'modules':
        return <Dashboard state={state} page="modules" onNavigate={navigate} />
      case 'lesson':
        if (state.activeModule) {
          return (
            <LessonPage
              moduleId={state.activeModule}
              state={state}
              onStartQuiz={startQuiz}
              onBack={() => navigate('dashboard')}
            />
          )
        }
        return <Dashboard state={state} page="dashboard" onNavigate={navigate} />
      case 'quiz':
        if (state.activeModule) {
          return (
            <QuizPage
              moduleId={state.activeModule}
              onComplete={completeQuiz}
              onBack={() => navigate('lesson', state.activeModule ?? 1)}
            />
          )
        }
        return <Dashboard state={state} page="dashboard" onNavigate={navigate} />
      case 'glossary':
        return <GlossaryPage />
      case 'progress':
        return <ProgressPage state={state} onNavigate={navigate} onReset={resetProgress} />
      default:
        return <Dashboard state={state} page="dashboard" onNavigate={navigate} />
    }
  }

  const pageTitle: Record<string, string> = {
    dashboard: 'Dashboard',
    modules: 'All Modules',
    lesson: `Module ${state.activeModule}`,
    quiz: `Module ${state.activeModule} Quiz`,
    glossary: 'Glossary & Index',
    progress: 'My Progress',
  }

  return (
    <div className="flex min-h-screen bg-white">
      {showLoginModal && <LoginModal onSubmit={setUserName} />}

      {/* Desktop sidebar — slides in/out with ease */}
      <div
        className="hidden lg:block fixed top-0 left-0 h-screen w-60 z-30"
        style={{
          transform: sidebarCollapsed ? 'translateX(-240px)' : 'translateX(0)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Sidebar state={state} onNavigate={navigate} />
      </div>

      {/* Mobile overlay — always mounted, animated in/out */}
      <div
        className="lg:hidden fixed inset-0 z-40 flex"
        style={{
          pointerEvents: mobileNavOpen ? 'auto' : 'none',
        }}
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setMobileNavOpen(false)}
          style={{
            opacity: mobileNavOpen ? 1 : 0,
            transition: 'opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        <div
          className="relative z-50 w-60 h-full"
          style={{
            transform: mobileNavOpen ? 'translateX(0)' : 'translateX(-240px)',
            transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Sidebar state={state} onNavigate={navigate} onClose={() => setMobileNavOpen(false)} />
        </div>
      </div>

      {/* Main content — margin-left syncs with sidebar slide */}
      <div className={`flex-1 flex flex-col min-h-screen sidebar-push ${sidebarCollapsed ? 'sidebar-push--collapsed' : ''}`}>
        {/* Top bar */}
        <header className="bg-white border-b border-[#D0DEF0] px-4 h-[60px] flex items-center justify-between sticky top-0 z-20" style={{ boxShadow: '0 1px 4px rgba(4,41,74,0.06)' }}>
          <div className="flex items-center gap-1.5">
            {/* Mobile hamburger */}
            <button
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-lg text-[#7A9BB8] hover:bg-[#F4F7FB] hover:text-[#0B1829] transition-colors cursor-pointer"
              onClick={() => setMobileNavOpen(true)}
            >
              <IcMenu size={20} />
            </button>
            {/* Desktop sidebar toggle */}
            <button
              aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
              className="hidden lg:flex p-2 rounded-lg text-[#7A9BB8] hover:bg-[#F4F7FB] hover:text-[#2A6EBB] transition-colors cursor-pointer"
              onClick={() => setSidebarCollapsed(c => !c)}
            >
              <IcSidebarToggle size={18} />
            </button>
            {/* Brand + breadcrumb */}
            <button
              onClick={() => navigate('dashboard')}
              className="text-[14px] font-semibold text-[#0B1829] hover:text-[#2A6EBB] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              BenSelect LMS
            </button>
            {state.page !== 'dashboard' && (
              <>
                <IcChevronRight size={12} className="text-[#C8D9EE] mx-0.5" />
                <span className="text-[13px] font-medium text-[#3A5068]">{pageTitle[state.page] ?? 'Dashboard'}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: '#EBF4FB', color: '#2A6EBB' }}>
              {Object.values(state.progress).filter(p => p.status === 'complete').length}/14 Complete
            </span>
            {state.userName && (
              <UserDropdown
                userName={state.userName}
                onRename={() => setShowLoginModal(true)}
                onReset={resetProgress}
              />
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ background: '#EEF3F8' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

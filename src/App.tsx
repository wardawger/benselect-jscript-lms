import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { LessonPage } from './components/LessonPage'
import { QuizPage } from './components/QuizPage'
import { GlossaryPage } from './components/GlossaryPage'
import { ProgressPage } from './components/ProgressPage'
import type { AppState } from './store/progress'
import { loadState, saveState, defaultState } from './store/progress'

export default function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    saveState(state)
  }, [state])

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
    setState(fresh)
    saveState(fresh)
  }

  function renderContent() {
    switch (state.page) {
      case 'dashboard':
      case 'modules':
        return <Dashboard state={state} onNavigate={navigate} />
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
        return <Dashboard state={state} onNavigate={navigate} />
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
        return <Dashboard state={state} onNavigate={navigate} />
      case 'glossary':
        return <GlossaryPage />
      case 'progress':
        return <ProgressPage state={state} onNavigate={navigate} onReset={resetProgress} />
      default:
        return <Dashboard state={state} onNavigate={navigate} />
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
    <div className="flex min-h-screen bg-[#F4F7FB]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen w-60 z-30">
        <Sidebar state={state} onNavigate={navigate} />
      </div>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <div className="relative z-50 w-60 h-full">
            <Sidebar state={state} onNavigate={navigate} onClose={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E2ECF5] px-6 h-[60px] flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-[#7A9BB8] hover:bg-[#F4F7FB]"
              onClick={() => setMobileNavOpen(true)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 20 20">
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            </button>
            <span className="text-[13px] text-[#7A9BB8]">BenSelect LMS</span>
            <span className="text-[#E8F0F8]">›</span>
            <span className="text-[13px] font-medium text-[#0B1829]">{pageTitle[state.page] ?? 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#2A6EBB] bg-[#EBF4FB] px-3 py-1 rounded-full">
              {Object.values(state.progress).filter(p => p.status === 'complete').length}/14 Complete
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

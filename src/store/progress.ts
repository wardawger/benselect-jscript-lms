export type ModuleStatus = 'locked' | 'available' | 'complete'

export interface ModuleProgress {
  status: ModuleStatus
  score?: number
  attempts?: number
  needsReview?: boolean
}

export interface AppState {
  page: string
  activeModule: number | null
  quizMode: boolean
  progress: Record<number, ModuleProgress>
  userName: string
}

const STORAGE_KEY = 'bs_lms_v2'

function initProgress(): Record<number, ModuleProgress> {
  const p: Record<number, ModuleProgress> = {}
  for (let i = 1; i <= 14; i++) {
    p[i] = { status: i === 1 ? 'available' : 'locked' }
  }
  return p
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      return { ...defaultState(), ...saved }
    }
  } catch (_) { /* ignore */ }
  return defaultState()
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (_) { /* ignore */ }
}

export function defaultState(): AppState {
  return {
    page: 'dashboard',
    activeModule: null,
    quizMode: false,
    progress: initProgress(),
    userName: 'Learner',
  }
}

export function getCompletedCount(progress: Record<number, ModuleProgress>): number {
  return Object.values(progress).filter(p => p.status === 'complete').length
}

export function getOverallScore(progress: Record<number, ModuleProgress>): number {
  const scores = Object.values(progress).filter(p => p.score !== undefined).map(p => p.score!)
  if (!scores.length) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

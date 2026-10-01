import { v4 as uuid } from 'uuid'
import type { AppState, Goal, JournalEntry } from './types'

export const STORAGE_KEY = 'live-journal-v1'

export function createId() {
  return uuid()
}

export function nowISO() {
  return new Date().toISOString()
}

export function createDefaultState(): AppState {
  const weightId = createId()
  return {
    avatarName: 'Juniper',
    logs: [],
    journal: [
      {
        id: createId(),
        createdAt: nowISO(),
        title: 'First page',
        body: 'This is your live journal. Log the day, and Juniper will keep you honest — gently.',
      },
    ],
    goals: [
      {
        id: weightId,
        kind: 'weight',
        createdAt: nowISO(),
        currentLbs: 300,
        targetLbs: 220,
        note: 'Steady progress, not perfection.',
      } satisfies Goal,
    ],
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    const base = createDefaultState()
    return {
      avatarName:
        typeof parsed.avatarName === 'string' && parsed.avatarName.trim()
          ? parsed.avatarName.trim()
          : base.avatarName,
      logs: Array.isArray(parsed.logs) ? (parsed.logs as AppState['logs']) : [],
      journal: Array.isArray(parsed.journal)
        ? (parsed.journal as JournalEntry[])
        : base.journal,
      goals: Array.isArray(parsed.goals) ? (parsed.goals as Goal[]) : base.goals,
    }
  } catch {
    return createDefaultState()
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

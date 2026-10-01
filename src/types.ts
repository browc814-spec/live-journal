export type LogCategory = 'food' | 'drink' | 'exercise' | 'mood' | 'meditation'

export type FoodQuality = 'healthy' | 'okay' | 'treat' | 'heavy'
export type DrinkKind = 'water' | 'coffee' | 'tea' | 'soda' | 'alcohol' | 'other'
export type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'rough'
export type ExerciseEffort = 'light' | 'steady' | 'hard'

export interface BaseLog {
  id: string
  category: LogCategory
  createdAt: string
  note: string
}

export interface FoodLog extends BaseLog {
  category: 'food'
  quality: FoodQuality
  title: string
}

export interface DrinkLog extends BaseLog {
  category: 'drink'
  kind: DrinkKind
  cups: number
  title: string
}

export interface ExerciseLog extends BaseLog {
  category: 'exercise'
  effort: ExerciseEffort
  minutes: number
  title: string
}

export interface MoodLog extends BaseLog {
  category: 'mood'
  level: MoodLevel
}

export interface MeditationLog extends BaseLog {
  category: 'meditation'
  minutes: number
}

export type DailyLog = FoodLog | DrinkLog | ExerciseLog | MoodLog | MeditationLog

export interface JournalEntry {
  id: string
  createdAt: string
  title: string
  body: string
}

export type GoalKind = 'weight' | 'habit' | 'custom'

export interface WeightGoal {
  id: string
  kind: 'weight'
  createdAt: string
  currentLbs: number
  targetLbs: number
  note: string
}

export interface HabitGoal {
  id: string
  kind: 'habit'
  createdAt: string
  title: string
  targetPerWeek: number
  note: string
}

export interface CustomGoal {
  id: string
  kind: 'custom'
  createdAt: string
  title: string
  note: string
}

export type Goal = WeightGoal | HabitGoal | CustomGoal

export type BodyType = 'slim' | 'average' | 'athletic' | 'soft'
export type OutfitLoadout =
  | 'cozy'
  | 'athletic'
  | 'stylish'
  | 'fancy'
  | 'casual'
  | 'undergarments'

export interface AvatarLook {
  /** 0–100, maps to height scale */
  height: number
  /** 0–100, maps to width / weight scale */
  weight: number
  bodyType: BodyType
  /** Preset outfit load-out */
  loadout: OutfitLoadout
}

export interface AppState {
  logs: DailyLog[]
  journal: JournalEntry[]
  goals: Goal[]
  avatarName: string
  avatarLook: AvatarLook
}

export type AvatarPose =
  | 'calm'
  | 'jittery'
  | 'hungry'
  | 'energized'
  | 'encouraged'
  | 'low'
  | 'sleepy'
  | 'proud'

export interface AvatarSnapshot {
  pose: AvatarPose
  headline: string
  detail: string
  cues: string[]
}

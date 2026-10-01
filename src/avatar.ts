import type {
  AppState,
  AvatarPose,
  AvatarSnapshot,
  DailyLog,
  DrinkLog,
  FoodLog,
  MoodLog,
  WeightGoal,
} from './types'

const HOUR = 60 * 60 * 1000

function hoursAgo(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / HOUR
}

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function isToday(iso: string) {
  return iso.slice(0, 10) === todayKey()
}

function weightGoal(state: AppState): WeightGoal | null {
  const goals = state.goals.filter((g): g is WeightGoal => g.kind === 'weight')
  return goals[0] ?? null
}

function latestOf<T extends DailyLog>(logs: DailyLog[], category: T['category']): T | null {
  const match = logs.find((l) => l.category === category)
  return (match as T | undefined) ?? null
}

function caffeineSinceFood(logs: DailyLog[]) {
  const drinks = logs.filter(
    (l): l is DrinkLog =>
      l.category === 'drink' &&
      (l.kind === 'coffee' || l.kind === 'soda') &&
      hoursAgo(l.createdAt) <= 10,
  )
  if (drinks.length === 0) return { cups: 0, lastAt: null as string | null }

  const cups = drinks.reduce((sum, d) => sum + (Number(d.cups) || 0), 0)
  const lastDrink = drinks[0]
  const foodAfter = logs.some(
    (l) =>
      l.category === 'food' &&
      new Date(l.createdAt).getTime() >= new Date(lastDrink.createdAt).getTime(),
  )
  return { cups, lastAt: lastDrink.createdAt, foodAfter }
}

function todayFood(logs: DailyLog[]) {
  return logs.filter((l): l is FoodLog => l.category === 'food' && isToday(l.createdAt))
}

function todayExercise(logs: DailyLog[]) {
  return logs.filter((l) => l.category === 'exercise' && isToday(l.createdAt))
}

function todayMeditation(logs: DailyLog[]) {
  return logs.filter((l) => l.category === 'meditation' && isToday(l.createdAt))
}

function latestMood(logs: DailyLog[]): MoodLog | null {
  return latestOf<MoodLog>(logs, 'mood')
}

export function deriveAvatar(state: AppState): AvatarSnapshot {
  const logs = [...state.logs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const cues: string[] = []
  const wg = weightGoal(state)
  const caffeine = caffeineSinceFood(logs)
  const foods = todayFood(logs)
  const workouts = todayExercise(logs)
  const meditations = todayMeditation(logs)
  const mood = latestMood(logs)

  // Priority 1: caffeine jitters until food
  if (caffeine.cups > 0 && !caffeine.foodAfter) {
    cues.push(`${caffeine.cups} caffeinated drink${caffeine.cups === 1 ? '' : 's'} without food`)
    return {
      pose: 'jittery',
      headline: `${state.avatarName} is buzzing`,
      detail:
        caffeine.cups >= 3
          ? 'Three coffees and no plate? Hands shaky. Log a real meal and the jitters settle.'
          : 'Caffeine is doing laps. Food will ground things again.',
      cues,
    }
  }

  // Priority 2: rough mood recently
  if (mood && hoursAgo(mood.createdAt) <= 18 && (mood.level === 'low' || mood.level === 'rough')) {
    cues.push(`Mood logged as ${mood.level}`)
    if (meditations.length) {
      return {
        pose: 'calm',
        headline: `${state.avatarName} is finding the floor again`,
        detail: 'Mood is heavy, but meditation showed up. That counts.',
        cues: [...cues, 'Meditation today'],
      }
    }
    return {
      pose: 'low',
      headline: `${state.avatarName} is sitting with it`,
      detail: 'No need to fake bright. A walk, water, or a few honest sentences in the journal help.',
      cues,
    }
  }

  // Priority 3: hungry — no food today and day is underway, or long gap
  const hour = new Date().getHours()
  const lastFood = foods[0] ?? logs.find((l): l is FoodLog => l.category === 'food')
  const longGap = !lastFood || hoursAgo(lastFood.createdAt) >= 7
  if ((foods.length === 0 && hour >= 11) || (longGap && hour >= 10 && foods.length === 0)) {
    cues.push('No food logged yet today')
    return {
      pose: 'hungry',
      headline: `${state.avatarName} is running on fumes`,
      detail: 'Stomach’s writing the plot now. Log breakfast or lunch — even something simple.',
      cues,
    }
  }

  // Weight-goal reactions
  if (wg && wg.currentLbs > wg.targetLbs) {
    const healthy = foods.filter((f) => f.quality === 'healthy').length
    const heavy = foods.filter((f) => f.quality === 'heavy').length
    const delta = wg.currentLbs - wg.targetLbs

    if (workouts.length && healthy > 0) {
      cues.push(`Weight goal: ${wg.currentLbs} → ${wg.targetLbs} lbs`, 'Healthy meal + workout')
      return {
        pose: 'proud',
        headline: `${state.avatarName} felt that`,
        detail: `You’re ${delta} lbs from the aim, and today’s choices point the right way — fuel plus movement.`,
        cues,
      }
    }

    if (healthy > 0 && workouts.length === 0) {
      cues.push('Healthy meal toward weight goal')
      return {
        pose: 'encouraged',
        headline: `${state.avatarName} is nodding along`,
        detail: 'Solid fuel for the weight goal. A short workout later would seal the day.',
        cues,
      }
    }

    if (workouts.length && healthy === 0) {
      cues.push('Workout logged toward weight goal')
      return {
        pose: 'energized',
        headline: `${state.avatarName} is still warm from it`,
        detail: 'Movement logged. Pair it with a steady meal and the goal gets quieter.',
        cues,
      }
    }

    if (heavy > 0 && healthy === 0 && workouts.length === 0) {
      cues.push('Heavier meal while aiming lower on the scale')
      return {
        pose: 'sleepy',
        headline: `${state.avatarName} got a little sluggish`,
        detail: 'Not a lecture — just a nudge. Water, a walk, or tomorrow’s breakfast can course-correct.',
        cues,
      }
    }
  }

  if (workouts.length) {
    cues.push('Exercise today')
    return {
      pose: 'energized',
      headline: `${state.avatarName} has leftover spark`,
      detail: 'Body’s humming after movement. Stretch or sip water so it sticks around.',
      cues,
    }
  }

  if (meditations.length) {
    cues.push('Meditation today')
    return {
      pose: 'calm',
      headline: `${state.avatarName} is unhurried`,
      detail: 'Breath work left a clear window. Keep the day simple if you can.',
      cues,
    }
  }

  if (mood?.level === 'great' || mood?.level === 'good') {
    cues.push(`Mood: ${mood.level}`)
    return {
      pose: 'encouraged',
      headline: `${state.avatarName} mirrors your weather`,
      detail: 'Good day energy. Write a line in the journal so future-you can steal it.',
      cues,
    }
  }

  if (caffeine.cups > 0 && caffeine.foodAfter) {
    cues.push('Caffeine balanced with food')
  }

  return {
    pose: 'calm',
    headline: `${state.avatarName} is ready when you are`,
    detail: 'Log food, drink, movement, mood, or a quiet sit — the avatar will shift with you.',
    cues: cues.length ? cues : ['Waiting on today’s first log'],
  }
}

export function poseLabel(pose: AvatarPose) {
  switch (pose) {
    case 'jittery':
      return 'Jittery'
    case 'hungry':
      return 'Hungry'
    case 'energized':
      return 'Energized'
    case 'encouraged':
      return 'Encouraged'
    case 'low':
      return 'Low'
    case 'sleepy':
      return 'Sluggish'
    case 'proud':
      return 'Proud'
    default:
      return 'Calm'
  }
}

import type { AvatarPose, DailyLog } from './types'

const TAP_LINES = [
  'Hey — I’m right here.',
  'Hmm? What’s up?',
  'Poke received. Soft poke returned.',
  'You looking at me looking at you.',
  'Okay okay, I’m awake.',
  'Tell me something about the day.',
]

const IDLE_LINES = [
  'Still with me?',
  'Whenever you’re ready…',
  'I can wait. Or snack. Waiting’s fine.',
]

export function tapLine(seed = Date.now()) {
  return TAP_LINES[seed % TAP_LINES.length]!
}

export function idleNudgeLine(seed = Date.now()) {
  return IDLE_LINES[seed % IDLE_LINES.length]!
}

export function poseSpeech(pose: AvatarPose, name: string): string {
  switch (pose) {
    case 'jittery':
      return 'Too much buzz. Food would help.'
    case 'hungry':
      return `${name} needs a bite. Even a small one.`
    case 'energized':
      return 'That movement landed. Keep the streak kind.'
    case 'encouraged':
      return 'See? Today’s leaning the right way.'
    case 'low':
      return 'Soft day. No need to force it.'
    case 'sleepy':
      return 'Heavy… water and a walk might clear the fog.'
    case 'proud':
      return 'That one counted. I’m proud of us.'
    default:
      return 'Log something — I’ll keep you company.'
  }
}

export function logSpeech(log: DailyLog, pose: AvatarPose, name: string): string {
  switch (log.category) {
    case 'food':
      if (log.quality === 'healthy') return 'Fuel locked in. That sits well.'
      if (log.quality === 'heavy') return 'Big plate. We’ll carry it gently.'
      if (log.quality === 'treat') return 'Treat logged. Enjoy it on purpose.'
      return 'Food noted. Stomach says thanks.'
    case 'drink':
      if (log.kind === 'water') return 'Hydration hit. Crisp.'
      if (log.kind === 'coffee' || log.kind === 'tea')
        return pose === 'jittery' ? 'Okay that’s a lot of buzz…' : 'Warm sip received.'
      if (log.kind === 'alcohol') return 'Noted. Pace yourself tonight.'
      return 'Drink logged.'
    case 'exercise':
      return log.effort === 'hard' ? 'You worked. I’m buzzing with you.' : 'Movement counts. Nice.'
    case 'mood':
      return log.level === 'rough' || log.level === 'low'
        ? 'I hear you. Soft landing.'
        : 'Mood checked in. Thanks for telling me.'
    case 'meditation':
      return 'Quiet minute. Shoulders drop a little.'
    default:
      return poseSpeech(pose, name)
  }
}

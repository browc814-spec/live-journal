import type {
  AvatarLook,
  BodyType,
  BottomStyle,
  FacialHair,
  HairStyle,
  TattooStyle,
  TopStyle,
} from './types'

export const SKIN_PRESETS = [
  { id: 'fair', label: 'Fair', value: '#f3d7bd' },
  { id: 'light', label: 'Light', value: '#e8c29a' },
  { id: 'medium', label: 'Medium', value: '#c9956a' },
  { id: 'tan', label: 'Tan', value: '#a67c52' },
  { id: 'deep', label: 'Deep', value: '#6b3f2a' },
] as const

export const HAIR_COLORS = [
  { id: 'black', label: 'Black', value: '#1c1410' },
  { id: 'brown', label: 'Brown', value: '#4a3428' },
  { id: 'auburn', label: 'Auburn', value: '#7a3e2c' },
  { id: 'blonde', label: 'Blonde', value: '#c9a36a' },
  { id: 'silver', label: 'Silver', value: '#9aa0a6' },
] as const

export const CLOTH_COLORS = [
  { id: 'teal', label: 'Teal', value: '#2f6f64' },
  { id: 'navy', label: 'Navy', value: '#2c3e50' },
  { id: 'rust', label: 'Rust', value: '#b85c38' },
  { id: 'cream', label: 'Cream', value: '#efe6d8' },
  { id: 'forest', label: 'Forest', value: '#1f4d45' },
  { id: 'slate', label: 'Slate', value: '#5b6770' },
] as const

export function createDefaultLook(): AvatarLook {
  return {
    bodyType: 'average',
    skinTone: '#e8c29a',
    hairStyle: 'wavy',
    hairColor: '#4a3428',
    facialHair: 'none',
    topStyle: 'sweater',
    topColor: '#2f6f64',
    bottomStyle: 'jeans',
    bottomColor: '#3d4a55',
    tattoo: 'none',
  }
}

export function migrateLook(raw: unknown): AvatarLook {
  const base = createDefaultLook()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Partial<AvatarLook>
  return {
    bodyType: isBody(r.bodyType) ? r.bodyType : base.bodyType,
    skinTone: typeof r.skinTone === 'string' ? r.skinTone : base.skinTone,
    hairStyle: isHair(r.hairStyle) ? r.hairStyle : base.hairStyle,
    hairColor: typeof r.hairColor === 'string' ? r.hairColor : base.hairColor,
    facialHair: isFacial(r.facialHair) ? r.facialHair : base.facialHair,
    topStyle: isTop(r.topStyle) ? r.topStyle : base.topStyle,
    topColor: typeof r.topColor === 'string' ? r.topColor : base.topColor,
    bottomStyle: isBottom(r.bottomStyle) ? r.bottomStyle : base.bottomStyle,
    bottomColor: typeof r.bottomColor === 'string' ? r.bottomColor : base.bottomColor,
    tattoo: isTattoo(r.tattoo) ? r.tattoo : base.tattoo,
  }
}

function isBody(v: unknown): v is BodyType {
  return v === 'slim' || v === 'average' || v === 'broad'
}
function isHair(v: unknown): v is HairStyle {
  return v === 'short' || v === 'wavy' || v === 'long' || v === 'bun' || v === 'bald'
}
function isFacial(v: unknown): v is FacialHair {
  return v === 'none' || v === 'stubble' || v === 'mustache' || v === 'beard'
}
function isTop(v: unknown): v is TopStyle {
  return v === 'tee' || v === 'sweater' || v === 'hoodie' || v === 'tank'
}
function isBottom(v: unknown): v is BottomStyle {
  return v === 'jeans' || v === 'joggers' || v === 'shorts'
}
function isTattoo(v: unknown): v is TattooStyle {
  return v === 'none' || v === 'armband' || v === 'forearm' || v === 'chest'
}

export function bodyScale(type: BodyType) {
  switch (type) {
    case 'slim':
      return { torso: 0.88, arm: 0.9, leg: 0.92 }
    case 'broad':
      return { torso: 1.14, arm: 1.12, leg: 1.08 }
    default:
      return { torso: 1, arm: 1, leg: 1 }
  }
}

export const LOOK_LABELS = {
  bodyType: {
    slim: 'Slim',
    average: 'Average',
    broad: 'Broad',
  },
  hairStyle: {
    short: 'Short',
    wavy: 'Wavy',
    long: 'Long',
    bun: 'Bun',
    bald: 'Bald',
  },
  facialHair: {
    none: 'None',
    stubble: 'Stubble',
    mustache: 'Mustache',
    beard: 'Beard',
  },
  topStyle: {
    tee: 'T-shirt',
    sweater: 'Sweater',
    hoodie: 'Hoodie',
    tank: 'Tank',
  },
  bottomStyle: {
    jeans: 'Jeans',
    joggers: 'Joggers',
    shorts: 'Shorts',
  },
  tattoo: {
    none: 'None',
    armband: 'Arm band',
    forearm: 'Forearm',
    chest: 'Chest',
  },
} as const

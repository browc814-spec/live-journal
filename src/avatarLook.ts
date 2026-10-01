import type {
  AccessoryItem,
  AvatarLook,
  AvatarPose,
  BodyType,
  BottomItem,
  ShoeItem,
  TopItem,
  UnderItem,
} from './types'

export const BODY_TYPES: { id: BodyType; label: string }[] = [
  { id: 'slim', label: 'Slim' },
  { id: 'average', label: 'Average' },
  { id: 'athletic', label: 'Athletic' },
  { id: 'soft', label: 'Soft' },
]

export const TOPS: { id: TopItem; label: string }[] = [
  { id: 'tee', label: 'T-shirt' },
  { id: 'crop', label: 'Crop top' },
  { id: 'hoodie', label: 'Hoodie' },
  { id: 'jacket', label: 'Jacket' },
  { id: 'sweater', label: 'Sweater' },
]

export const BOTTOMS: { id: BottomItem; label: string }[] = [
  { id: 'jeans', label: 'Jeans' },
  { id: 'pants', label: 'Pants' },
  { id: 'joggers', label: 'Joggers' },
  { id: 'skirt', label: 'Skirt' },
  { id: 'shorts', label: 'Shorts' },
]

export const SHOES: { id: ShoeItem; label: string }[] = [
  { id: 'sneakers', label: 'Sneakers' },
  { id: 'boots', label: 'Boots' },
  { id: 'flats', label: 'Flats' },
  { id: 'sandals', label: 'Sandals' },
]

export const UNDERS: { id: UnderItem; label: string }[] = [
  { id: 'everyday', label: 'Everyday' },
  { id: 'sport', label: 'Sport' },
  { id: 'sleep', label: 'Sleep' },
]

export const ACCESSORIES: { id: AccessoryItem; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'necklace', label: 'Necklace' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'both', label: 'Necklace + earrings' },
  { id: 'belt', label: 'Belt chain' },
]

export function createDefaultLook(): AvatarLook {
  return {
    height: 50,
    weight: 45,
    bodyType: 'average',
    top: 'sweater',
    bottom: 'pants',
    shoes: 'sneakers',
    under: 'everyday',
    accessory: 'none',
  }
}

export function migrateLook(raw: unknown): AvatarLook {
  const base = createDefaultLook()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Partial<AvatarLook> & { stylePack?: string }

  // Legacy style packs → wardrobe
  if (r.stylePack === 'street') {
    return { ...base, top: 'hoodie', bottom: 'joggers', shoes: 'sneakers' }
  }
  if (r.stylePack === 'sakura') {
    return { ...base, top: 'sweater', bottom: 'skirt', shoes: 'flats' }
  }
  if (r.stylePack === 'cozy') {
    return { ...base, top: 'sweater', bottom: 'pants', shoes: 'sneakers' }
  }

  return {
    height: clamp(Number(r.height), 0, 100, base.height),
    weight: clamp(Number(r.weight), 0, 100, base.weight),
    bodyType: isBody(r.bodyType) ? r.bodyType : base.bodyType,
    top: isTop(r.top) ? r.top : base.top,
    bottom: isBottom(r.bottom) ? r.bottom : base.bottom,
    shoes: isShoe(r.shoes) ? r.shoes : base.shoes,
    under: isUnder(r.under) ? r.under : base.under,
    accessory: isAcc(r.accessory) ? r.accessory : base.accessory,
  }
}

function clamp(n: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

function isBody(v: unknown): v is BodyType {
  return v === 'slim' || v === 'average' || v === 'athletic' || v === 'soft'
}
function isTop(v: unknown): v is TopItem {
  return v === 'tee' || v === 'crop' || v === 'hoodie' || v === 'jacket' || v === 'sweater'
}
function isBottom(v: unknown): v is BottomItem {
  return v === 'jeans' || v === 'skirt' || v === 'joggers' || v === 'shorts' || v === 'pants'
}
function isShoe(v: unknown): v is ShoeItem {
  return v === 'sneakers' || v === 'boots' || v === 'flats' || v === 'sandals'
}
function isUnder(v: unknown): v is UnderItem {
  return v === 'everyday' || v === 'sport' || v === 'sleep'
}
function isAcc(v: unknown): v is AccessoryItem {
  return v === 'none' || v === 'necklace' || v === 'earrings' || v === 'both' || v === 'belt'
}

/** Map wardrobe choices onto the closest illustrated pack folder */
export function resolvePack(look: AvatarLook): string {
  // Distinct tops always win — Studio picks should feel immediate
  if (look.top === 'tee') return 'tee'
  if (look.top === 'crop') return 'crop'
  if (look.top === 'hoodie') return 'hoodie'
  if (look.top === 'jacket') return 'jacket'

  // Sweater / neutral top: bottoms, shoes, and base layer nudge the look
  if (look.under === 'sport') return 'crop'
  if (look.under === 'sleep') return 'hoodie'
  if (look.bottom === 'skirt') return 'skirt'
  if (look.bottom === 'joggers') return 'hoodie'
  if (look.bottom === 'shorts') return 'crop'
  if (look.shoes === 'boots') return 'jacket'
  if (look.shoes === 'flats' || look.shoes === 'sandals') return 'skirt'

  return 'cozy'
}

export function poseArtFile(pose: AvatarPose): string {
  if (pose === 'encouraged') return 'proud'
  return pose
}

export function avatarArtSrc(look: AvatarLook, pose: AvatarPose) {
  const pack = resolvePack(look)
  const file = poseArtFile(pose)
  return `./avatar/packs/${pack}/${file}.jpg`
}

/** CSS scale factors from sliders + body type */
export function bodyTransform(look: AvatarLook) {
  const h = look.height / 100
  const w = look.weight / 100
  let scaleY = 0.88 + h * 0.28 // 0.88–1.16
  let scaleX = 0.86 + w * 0.32 // 0.86–1.18

  switch (look.bodyType) {
    case 'slim':
      scaleX *= 0.9
      scaleY *= 1.03
      break
    case 'athletic':
      scaleX *= 1.04
      scaleY *= 1.02
      break
    case 'soft':
      scaleX *= 1.1
      scaleY *= 0.98
      break
    default:
      break
  }

  return {
    transform: `scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`,
    transformOrigin: '50% 100%',
  }
}

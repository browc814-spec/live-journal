import type { AvatarLook, AvatarPose, BodyType, OutfitLoadout } from './types'

export const BODY_TYPES: { id: BodyType; label: string }[] = [
  { id: 'slim', label: 'Slim' },
  { id: 'average', label: 'Average' },
  { id: 'athletic', label: 'Athletic' },
  { id: 'soft', label: 'Soft' },
]

export const LOADOUTS: {
  id: OutfitLoadout
  label: string
  blurb: string
}[] = [
  { id: 'cozy', label: 'Cozy', blurb: 'Soft sweater energy for slow days.' },
  { id: 'athletic', label: 'Athletic', blurb: 'Ready to move — cropped and light.' },
  { id: 'stylish', label: 'Stylish', blurb: 'Jacket polish with a city edge.' },
  { id: 'fancy', label: 'Fancy', blurb: 'Dressed up for a nicer night out.' },
  { id: 'casual', label: 'Casual', blurb: 'Easy tee-and-jeans everyday look.' },
  { id: 'undergarments', label: 'Undergarments', blurb: 'Simple base layer / lounge set.' },
]

export function createDefaultLook(): AvatarLook {
  return {
    height: 50,
    weight: 45,
    bodyType: 'average',
    loadout: 'cozy',
  }
}

export function migrateLook(raw: unknown): AvatarLook {
  const base = createDefaultLook()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Partial<AvatarLook> & {
    stylePack?: string
    top?: string
    bottom?: string
    under?: string
    shoes?: string
  }

  const loadout = resolveLegacyLoadout(r) ?? (isLoadout(r.loadout) ? r.loadout : base.loadout)

  return {
    height: clamp(Number(r.height), 0, 100, base.height),
    weight: clamp(Number(r.weight), 0, 100, base.weight),
    bodyType: isBody(r.bodyType) ? r.bodyType : base.bodyType,
    loadout,
  }
}

function resolveLegacyLoadout(r: {
  stylePack?: string
  loadout?: unknown
  top?: string
  bottom?: string
  under?: string
  shoes?: string
}): OutfitLoadout | null {
  if (isLoadout(r.loadout)) return r.loadout

  if (r.stylePack === 'cozy') return 'cozy'
  if (r.stylePack === 'street') return 'casual'
  if (r.stylePack === 'sakura') return 'fancy'

  if (r.under === 'sport' || r.top === 'crop') return 'athletic'
  if (r.under === 'sleep') return 'undergarments'
  if (r.top === 'jacket' || r.shoes === 'boots') return 'stylish'
  if (r.top === 'tee') return 'casual'
  if (r.bottom === 'skirt' || r.shoes === 'flats') return 'fancy'
  if (r.top === 'hoodie' || r.top === 'sweater') return 'cozy'

  return null
}

function clamp(n: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

function isBody(v: unknown): v is BodyType {
  return v === 'slim' || v === 'average' || v === 'athletic' || v === 'soft'
}

function isLoadout(v: unknown): v is OutfitLoadout {
  return (
    v === 'cozy' ||
    v === 'athletic' ||
    v === 'stylish' ||
    v === 'fancy' ||
    v === 'casual' ||
    v === 'undergarments'
  )
}

export function poseArtFile(pose: AvatarPose): string {
  if (pose === 'encouraged') return 'proud'
  return pose
}

export function avatarArtSrc(look: AvatarLook, pose: AvatarPose) {
  const file = poseArtFile(pose)
  return `./avatar/packs/${look.loadout}/${file}.jpg`
}

export function loadoutThumbSrc(loadout: OutfitLoadout) {
  return `./avatar/packs/${loadout}/calm.jpg`
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

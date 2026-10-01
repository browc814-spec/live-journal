import type { AvatarLook, AvatarPose, StylePack } from './types'

export const STYLE_PACKS: {
  id: StylePack
  label: string
  blurb: string
}[] = [
  {
    id: 'cozy',
    label: 'Cozy teal',
    blurb: 'Soft oversized sweatshirt energy — warm and everyday.',
  },
  {
    id: 'street',
    label: 'Street soft',
    blurb: 'Cropped hoodie, jeans, messy bun — casual and cool.',
  },
  {
    id: 'sakura',
    label: 'Sakura classic',
    blurb: 'Dark cropped set, black hair, a little floral detail.',
  },
]

export function createDefaultLook(): AvatarLook {
  return { stylePack: 'cozy' }
}

export function migrateLook(raw: unknown): AvatarLook {
  const base = createDefaultLook()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Partial<AvatarLook> & { topStyle?: string; hairStyle?: string }
  if (r.stylePack === 'cozy' || r.stylePack === 'street' || r.stylePack === 'sakura') {
    return { stylePack: r.stylePack }
  }
  // Map older layered-studio choices onto the closest pack
  if (r.topStyle === 'hoodie' || r.hairStyle === 'bun') return { stylePack: 'street' }
  if (r.hairStyle === 'long' || r.hairStyle === 'bald') return { stylePack: 'sakura' }
  return base
}

export function poseArtFile(pose: AvatarPose): string {
  if (pose === 'encouraged') return 'proud'
  return pose
}

export function avatarArtSrc(look: AvatarLook, pose: AvatarPose) {
  const pack = look.stylePack || 'cozy'
  const file = poseArtFile(pose)
  return `./avatar/packs/${pack}/${file}.jpg`
}

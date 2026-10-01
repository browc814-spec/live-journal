import type { AvatarLook } from './types'

export function AccessoryOverlay({ look }: { look: AvatarLook }) {
  const showNecklace = look.accessory === 'necklace' || look.accessory === 'both'
  const showEarrings = look.accessory === 'earrings' || look.accessory === 'both'
  const showBelt = look.accessory === 'belt'
  if (!showNecklace && !showEarrings && !showBelt) return null

  return (
    <svg className="accessory-overlay" viewBox="0 0 200 360" aria-hidden="true">
      {showEarrings ? (
        <g fill="#d4af37" stroke="#8a7019" strokeWidth="0.6">
          <circle cx="78" cy="78" r="2.4" />
          <circle cx="122" cy="78" r="2.4" />
          <path d="M78 80v6M122 80v6" stroke="#d4af37" strokeWidth="1.2" />
          <circle cx="78" cy="88" r="1.6" />
          <circle cx="122" cy="88" r="1.6" />
        </g>
      ) : null}
      {showNecklace ? (
        <g fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round">
          <path d="M86 118c6 14 22 14 28 0" />
          <circle cx="100" cy="132" r="2.5" fill="#d4af37" stroke="#8a7019" />
        </g>
      ) : null}
      {showBelt ? (
        <g>
          <path d="M78 210h44" stroke="#2a2a2a" strokeWidth="4" strokeLinecap="round" />
          <path
            d="M112 210c6 10 10 18 8 26"
            fill="none"
            stroke="#c0c0c0"
            strokeWidth="1.8"
          />
          <path
            d="M118 210c4 8 8 16 6 24"
            fill="none"
            stroke="#c0c0c0"
            strokeWidth="1.4"
          />
        </g>
      ) : null}
    </svg>
  )
}

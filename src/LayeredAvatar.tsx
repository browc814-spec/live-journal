import type { AvatarLook, AvatarPose } from './types'
import { bodyScale } from './avatarLook'

function shade(hex: string, amount: number) {
  const h = hex.replace('#', '')
  if (h.length !== 6) return hex
  const n = parseInt(h, 16)
  const r = Math.min(255, Math.max(0, ((n >> 16) & 255) + amount))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amount))
  const b = Math.min(255, Math.max(0, (n & 255) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function faceFor(pose: AvatarPose) {
  switch (pose) {
    case 'jittery':
      return { brow: -3, eye: 1.15, mouth: 'M91 78c4 1 12 1.5 16-2', open: false }
    case 'hungry':
      return { brow: 2, eye: 0.9, mouth: 'M92 80c4-3.5 12-3.5 16 0', open: true }
    case 'energized':
      return { brow: -2, eye: 1.05, mouth: 'M90 76c5 7.5 17 7.5 22 0', open: true }
    case 'encouraged':
      return { brow: -1, eye: 1, mouth: 'M91 78c4 4.5 14 4.5 18 0', open: false }
    case 'proud':
      return { brow: -2.5, eye: 1, mouth: 'M88 75c6 9 20 9 26 0', open: true }
    case 'low':
      return { brow: 2.5, eye: 0.72, mouth: 'M93 81c4-2.5 11-2.5 15 0', open: false }
    case 'sleepy':
      return { brow: 1.5, eye: 0.22, mouth: 'M94 80h12', open: false }
    default:
      return { brow: 0, eye: 1, mouth: 'M92 79c3.5 3 12 3 16 0', open: false }
  }
}

function Hair({
  style,
  color,
}: {
  style: AvatarLook['hairStyle']
  color: string
}) {
  const dark = shade(color, -25)
  if (style === 'bald') {
    return <path d="M78 48c2-6 10-10 22-10 8 0 14 2 18 6" stroke={color} strokeWidth="3" fill="none" opacity="0.35" />
  }
  if (style === 'short') {
    return (
      <g>
        <path d="M72 58C74 30 88 20 100 19c14-1 28 9 32 28 2 10 1 20-1 28-6-14-16-22-27-22s-22 10-30 26c-2-8-3-16-2-21z" fill={color} />
        <path d="M74 50c8-12 20-16 28-14 10 2 18 10 22 18-8-6-14-8-22-8-9 0-16 6-22 12z" fill={dark} />
      </g>
    )
  }
  if (style === 'bun') {
    return (
      <g>
        <ellipse cx="100" cy="22" rx="14" ry="12" fill={color} />
        <ellipse cx="100" cy="20" rx="10" ry="8" fill={dark} opacity="0.35" />
        <path d="M72 58C74 32 88 22 100 21c14-1 28 9 32 27 1 10 0 20-2 28-6-12-15-20-26-20s-21 10-28 24c-2-8-3-14-4-22z" fill={color} />
      </g>
    )
  }
  if (style === 'long') {
    return (
      <g>
        <path d="M70 56C72 28 88 16 100 15c14-1 30 10 34 30 2 12 2 24 0 36-4 16-6 34-4 50h-12c-2-16-2-32 0-44-6-12-16-18-28-18s-22 8-28 20c2 12 2 28 0 44H50c2-16 0-34-2-50-2-12-2-24 0-36 2-8 6-16 12-22z" fill={color} />
        <path d="M74 48c8-14 20-18 28-16 12 2 20 12 24 22-8-8-16-12-26-12-10 0-18 6-26 14z" fill={dark} />
      </g>
    )
  }
  // wavy default
  return (
    <g>
      <path d="M72 56C74 26 88 16 100 15c15-1 30 11 34 30 2 12 1 24-1 34-5-14-15-22-27-22s-23 10-30 26c-3-8-4-16-4-24z" fill={color} />
      <path d="M74 50c8-14 22-20 30-18 12 2 22 12 26 24-10-8-18-12-28-12-10 0-18 6-28 14z" fill={dark} />
      <path d="M72 70c-2 14 0 30 4 42 2-12 4-26 4-38z" fill={color} />
      <path d="M128 70c2 14 0 30-4 42-2-12-4-26-4-38z" fill={color} />
    </g>
  )
}

function FacialHairLayer({
  style,
  color,
  skin,
}: {
  style: AvatarLook['facialHair']
  color: string
  skin: string
}) {
  if (style === 'none') return null
  if (style === 'stubble') {
    return (
      <g opacity="0.45">
        <ellipse cx="100" cy="84" rx="16" ry="10" fill={color} />
        <ellipse cx="100" cy="78" rx="10" ry="4" fill={skin} />
      </g>
    )
  }
  if (style === 'mustache') {
    return (
      <path
        d="M88 76c6 6 10 6 12 2 2 4 6 4 12-2"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    )
  }
  return (
    <g>
      <path d="M82 74c4 18 10 28 18 30 8-2 14-12 18-30-8 8-14 10-18 10s-10-2-18-10z" fill={color} />
      <path d="M88 76c5 5 9 5 12 1 2 4 7 4 12-1" stroke={shade(color, 20)} strokeWidth="2" fill="none" />
    </g>
  )
}

function Top({
  style,
  color,
  scaleX,
}: {
  style: AvatarLook['topStyle']
  color: string
  scaleX: number
}) {
  const dark = shade(color, -30)
  const mid = shade(color, -12)
  return (
    <g transform={`translate(100 0) scale(${scaleX} 1) translate(-100 0)`}>
      {style === 'hoodie' ? (
        <>
          <path d="M78 112c8-8 14-10 22-10s14 2 22 10l4 8H74z" fill={mid} />
          <path d="M58 136C58 122 74 114 100 114s42 8 42 22l8 92c1 14-10 24-24 24H74c-14 0-25-10-24-24z" fill={color} />
          <path d="M86 118c5 12 23 12 28 0" stroke={dark} strokeWidth="4" fill="none" />
          <path d="M70 128c-18 8-28 28-24 52 8-4 18-8 28-10z" fill={mid} />
          <path d="M130 128c18 8 28 28 24 52-8-4-18-8-28-10z" fill={mid} />
        </>
      ) : style === 'tank' ? (
        <>
          <path d="M70 128C74 116 86 112 100 112s26 4 30 16l4 100c0 12-10 20-22 20H88c-12 0-22-8-22-20z" fill={color} />
          <path d="M78 118c0-10 8-16 14-16" stroke={dark} strokeWidth="5" fill="none" />
          <path d="M122 118c0-10-8-16-14-16" stroke={dark} strokeWidth="5" fill="none" />
        </>
      ) : style === 'tee' ? (
        <>
          <path d="M62 132C66 118 80 114 100 114s34 4 38 18l6 96c1 12-10 22-22 22H78c-12 0-23-10-22-22z" fill={color} />
          <path d="M62 136c-14 6-20 20-16 36 10-2 20-6 28-10z" fill={mid} />
          <path d="M138 136c14 6 20 20 16 36-10-2-20-6-28-10z" fill={mid} />
          <path d="M88 118c5 8 19 8 24 0" stroke={dark} strokeWidth="3" fill="none" />
        </>
      ) : (
        <>
          <path d="M58 138C58 122 74 114 100 114s42 8 42 24l8 90c1 14-10 24-24 24H74c-14 0-25-10-24-24z" fill={color} />
          <path d="M58 140c-12 8-18 24-12 42 8-2 18-8 28-12z" fill={mid} />
          <path d="M142 140c12 8 18 24 12 42-8-2-18-8-28-12z" fill={mid} />
          <path d="M88 118c5 10 19 10 24 0" stroke={dark} strokeWidth="3.5" fill="none" />
        </>
      )}
    </g>
  )
}

function Bottoms({
  style,
  color,
  scaleX,
  skin,
}: {
  style: AvatarLook['bottomStyle']
  color: string
  scaleX: number
  skin: string
}) {
  const dark = shade(color, -35)
  const hem = style === 'shorts' ? 278 : 322
  return (
    <g transform={`translate(100 0) scale(${scaleX} 1) translate(-100 0)`}>
      <path
        d={`M78 246c-1 20-2 ${style === 'shorts' ? 28 : 50}-3 ${hem - 246}h20c2-18 2-40 1-${hem - 246}z`}
        fill={color}
      />
      <path
        d={`M104 246c0 20 1 ${style === 'shorts' ? 28 : 50} 2 ${hem - 246}h20c-1-18-2-40-2-${hem - 246}z`}
        fill={color}
      />
      <path d="M74 246h52c2 8-2 14-10 14H84c-8 0-12-6-10-14z" fill={dark} opacity="0.5" />
      {style === 'joggers' ? (
        <>
          <path d={`M76 ${hem}h22v6H76z`} fill={dark} />
          <path d={`M106 ${hem}h22v6H106z`} fill={dark} />
        </>
      ) : null}
      {style !== 'shorts' ? (
        <>
          <path d="M70 320h28v10c0 3-2 6-6 6H76c-3 0-6-3-6-6z" fill="#1b2a25" />
          <path d="M104 320h28v10c0 3-2 6-6 6h-16c-3 0-6-3-6-6z" fill="#1b2a25" />
        </>
      ) : (
        <>
          <path d="M76 278c0 8 2 18 2 28h18c0-10 0-20-1-28z" fill={skin} />
          <path d="M108 278c0 8 0 18 1 28h18c0-10-1-20-2-28z" fill={skin} />
          <path d="M74 304h24v8c0 2-2 4-5 4H78c-2 0-4-2-4-4z" fill="#1b2a25" />
          <path d="M106 304h24v8c0 2-2 4-5 4h-15c-2 0-4-2-4-4z" fill="#1b2a25" />
        </>
      )}
    </g>
  )
}

function Tattoos({
  style,
  ink = '#2a333c',
}: {
  style: AvatarLook['tattoo']
  ink?: string
}) {
  if (style === 'none') return null
  if (style === 'armband') {
    return (
      <g opacity="0.75">
        <rect x="48" y="168" width="14" height="5" rx="2" fill={ink} />
        <rect x="138" y="168" width="14" height="5" rx="2" fill={ink} />
      </g>
    )
  }
  if (style === 'forearm') {
    return (
      <g opacity="0.7" fill="none" stroke={ink} strokeWidth="1.8">
        <path d="M52 178c4 8 6 16 4 24" />
        <path d="M56 182c6 2 8 10 6 18" />
        <path d="M146 178c-4 8-6 16-4 24" />
      </g>
    )
  }
  return (
    <g opacity="0.55" fill="none" stroke={ink} strokeWidth="1.7">
      <path d="M92 150c6-8 12-8 18 0" />
      <path d="M96 156c4-4 8-4 12 0" />
      <circle cx="100" cy="160" r="3" />
    </g>
  )
}

export function LayeredAvatar({
  look,
  pose,
}: {
  look: AvatarLook
  pose: AvatarPose
}) {
  const face = faceFor(pose)
  const scale = bodyScale(look.bodyType)
  const skin = look.skinTone
  const skinDeep = shade(skin, -28)
  const armsUp = pose === 'proud' || pose === 'energized'
  const armsLow = pose === 'low' || pose === 'sleepy'
  const eyeRy = Math.max(1.5, 5 * face.eye)

  return (
    <svg className="avatar-svg layered" viewBox="0 0 200 360" role="img">
      <defs>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(skin, 18)} />
          <stop offset="100%" stopColor={skinDeep} />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="344" rx="40" ry="7" fill="rgba(27,42,37,0.14)" />

      <g className="avatar-figure">
        {/* left arm */}
        <g
          className="avatar-arm left"
          transform={`translate(100 0) scale(${scale.arm} 1) translate(-100 0)`}
        >
          {armsUp ? (
            <path d="M66 145C42 122 30 120 26 134c-4 12 8 24 26 28 6-8 10-14 14-17z" fill="url(#skinGrad)" />
          ) : armsLow ? (
            <path d="M68 148C54 170 50 200 56 218c4 10 16 8 18-4 0-18-2-42-6-66z" fill="url(#skinGrad)" />
          ) : (
            <path d="M68 146C52 162 48 192 54 214c4 10 16 10 18-2-2-20-2-44-4-66z" fill="url(#skinGrad)" />
          )}
          <ellipse
            cx={armsUp ? 30 : 60}
            cy={armsUp ? 150 : armsLow ? 220 : 216}
            rx="7.5"
            ry="6.5"
            fill="url(#skinGrad)"
          />
        </g>

        <Bottoms
          style={look.bottomStyle}
          color={look.bottomColor}
          scaleX={scale.leg}
          skin={skin}
        />

        <Top style={look.topStyle} color={look.topColor} scaleX={scale.torso} />

        {/* right arm */}
        <g
          className="avatar-arm right"
          transform={`translate(100 0) scale(${scale.arm} 1) translate(-100 0)`}
        >
          {armsUp ? (
            <path d="M134 145C158 122 170 120 174 134c4 12-8 24-26 28-6-8-10-14-14-17z" fill="url(#skinGrad)" />
          ) : armsLow ? (
            <path d="M132 148C146 170 150 200 144 218c-4 10-16 8-18-4 0-18 2-42 6-66z" fill="url(#skinGrad)" />
          ) : (
            <path d="M132 146C148 162 152 192 146 214c-4 10-16 10-18-2 2-20 2-44 4-66z" fill="url(#skinGrad)" />
          )}
          <ellipse
            cx={armsUp ? 170 : 140}
            cy={armsUp ? 150 : armsLow ? 220 : 216}
            rx="7.5"
            ry="6.5"
            fill="url(#skinGrad)"
          />
        </g>

        <Tattoos style={look.tattoo} />

        {/* neck */}
        <rect x="90" y="96" width="20" height="24" rx="7" fill="url(#skinGrad)" />
        <ellipse cx="100" cy="118" rx="12" ry="6" fill="url(#skinGrad)" />

        {/* head */}
        <g className="avatar-head">
          <ellipse cx="78" cy="62" rx="5" ry="7.5" fill="url(#skinGrad)" />
          <ellipse cx="122" cy="62" rx="5" ry="7.5" fill="url(#skinGrad)" />
          <ellipse cx="100" cy="60" rx="28" ry="34" fill="url(#skinGrad)" />

          <Hair style={look.hairStyle} color={look.hairColor} />

          <path
            d={`M86 ${52 + face.brow}c3.5-2 9-2 12 0`}
            stroke={shade(look.hairColor, -40)}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M102 ${52 + face.brow}c3.5-2 9-2 12 0`}
            stroke={shade(look.hairColor, -40)}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          <ellipse cx="90" cy="62" rx="5.5" ry={eyeRy} fill="#fffef8" stroke={skinDeep} strokeWidth="0.7" />
          <ellipse cx="110" cy="62" rx="5.5" ry={eyeRy} fill="#fffef8" stroke={skinDeep} strokeWidth="0.7" />
          {face.eye >= 0.35 ? (
            <>
              <circle cx="90" cy="62" r="2.4" fill="#1f2e28" />
              <circle cx="110" cy="62" r="2.4" fill="#1f2e28" />
              <circle cx="91" cy="61" r="0.8" fill="#fff" />
              <circle cx="111" cy="61" r="0.8" fill="#fff" />
            </>
          ) : (
            <>
              <path d="M84.5 62c3.5 2.4 7.5 2.4 11 0" stroke="#1f2e28" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M104.5 62c3.5 2.4 7.5 2.4 11 0" stroke="#1f2e28" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </>
          )}

          <path d="M100 64c1 5 3.2 7.5 5 9" stroke={skinDeep} strokeWidth="1.7" strokeLinecap="round" fill="none" />

          {face.open ? (
            <path d={face.mouth.replace('M90 76', 'M93 77')} fill="#c96b4a" opacity="0.85" />
          ) : null}
          <path d={face.mouth} stroke="#8a4f3a" strokeWidth="2.1" strokeLinecap="round" fill="none" />

          <FacialHairLayer style={look.facialHair} color={look.hairColor} skin={skin} />

          <circle className="blush left" cx="82" cy="74" r="4.5" />
          <circle className="blush right" cx="118" cy="74" r="4.5" />
          <path className="sweat" d="M126 40c0 5 4 5 4 10" />
          <g className="sparks" fill="#c96b4a">
            <path d="M142 26l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2z" />
            <path d="M54 32l1.6 4.5 4.5 1.6-4.5 1.6-1.6 4.5-1.6-4.5-4.5-1.6 4.5-1.6z" />
          </g>
        </g>
      </g>
    </svg>
  )
}

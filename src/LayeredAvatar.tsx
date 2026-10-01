import { useId } from 'react'
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
      return {
        brow: -3.5,
        eye: 1.2,
        pupilY: 0,
        mouth: 'smile-tight' as const,
        cheeks: 0.15,
      }
    case 'hungry':
      return {
        brow: 2.5,
        eye: 0.92,
        pupilY: 1.2,
        mouth: 'frown' as const,
        cheeks: 0.35,
      }
    case 'energized':
      return {
        brow: -2,
        eye: 1.08,
        pupilY: -0.8,
        mouth: 'grin' as const,
        cheeks: 0.45,
      }
    case 'encouraged':
      return {
        brow: -1,
        eye: 1,
        pupilY: 0,
        mouth: 'smile' as const,
        cheeks: 0.4,
      }
    case 'proud':
      return {
        brow: -2.5,
        eye: 1.05,
        pupilY: -1,
        mouth: 'grin' as const,
        cheeks: 0.5,
      }
    case 'low':
      return {
        brow: 3,
        eye: 0.7,
        pupilY: 2,
        mouth: 'frown' as const,
        cheeks: 0.1,
      }
    case 'sleepy':
      return {
        brow: 1.5,
        eye: 0.28,
        pupilY: 1,
        mouth: 'flat' as const,
        cheeks: 0.2,
      }
    default:
      return {
        brow: 0,
        eye: 1,
        pupilY: 0,
        mouth: 'smile' as const,
        cheeks: 0.25,
      }
  }
}

function Mouth({
  kind,
  lip,
}: {
  kind: ReturnType<typeof faceFor>['mouth']
  lip: string
}) {
  if (kind === 'grin') {
    return (
      <g>
        <path d="M89 78c6 9 18 9 24 0" fill={lip} opacity="0.92" />
        <path d="M91 78c5 5 15 5 20 0" fill="#fff5ee" opacity="0.85" />
        <path
          d="M89 78c6 9 18 9 24 0"
          fill="none"
          stroke={shade(lip, -35)}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </g>
    )
  }
  if (kind === 'frown') {
    return (
      <path
        d="M92 82c4-3.2 12-3.2 16 0"
        fill="none"
        stroke={shade(lip, -20)}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    )
  }
  if (kind === 'flat') {
    return (
      <path
        d="M94 81h14"
        fill="none"
        stroke={shade(lip, -20)}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    )
  }
  if (kind === 'smile-tight') {
    return (
      <path
        d="M91 80c4 1.2 12 1.5 16-1.5"
        fill="none"
        stroke={shade(lip, -20)}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    )
  }
  return (
    <path
      d="M91 80c4 4 14 4 18 0"
      fill="none"
      stroke={shade(lip, -20)}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  )
}

function Hair({
  style,
  color,
  gid,
}: {
  style: AvatarLook['hairStyle']
  color: string
  gid: string
}) {
  const dark = shade(color, -30)
  const light = shade(color, 28)
  if (style === 'bald') {
    return (
      <ellipse cx="100" cy="42" rx="20" ry="8" fill={color} opacity="0.12" />
    )
  }

  const base =
    style === 'short' ? (
      <path d="M71 60C73 30 88 18 100 17c15-1 30 10 34 30 2 11 1 22-1 30-7-15-17-24-29-24s-23 11-31 28c-2-9-3-17-2-22z" />
    ) : style === 'bun' ? (
      <g>
        <ellipse cx="100" cy="20" rx="15" ry="13" fill={`url(#${gid}-hair)`} />
        <ellipse cx="96" cy="16" rx="6" ry="4" fill={light} opacity="0.35" />
        <path d="M71 60C73 32 88 20 100 19c15-1 30 10 34 29 1 11 0 22-2 30-7-13-16-22-28-22s-22 11-30 26c-2-9-3-16-3-23z" />
      </g>
    ) : style === 'long' ? (
      <path d="M69 58C71 26 88 14 100 13c15-1 32 11 36 32 2 14 2 28 0 42-3 18-5 38-3 54h-13c-2-18-2-36 0-48-7-13-17-20-30-20s-23 9-30 22c2 14 2 32 0 50H49c2-18-1-38-3-56-2-14-2-28 0-40 3-10 8-20 16-27z" />
    ) : (
      // wavy
      <path d="M71 58C73 24 88 14 100 13c16-1 32 12 36 32 2 13 1 26-1 37-6-15-16-24-29-24s-24 11-32 28c-3-9-4-18-4-26z" />
    )

  return (
    <g>
      <g fill={`url(#${gid}-hair)`}>{base}</g>
      {(style === 'wavy' || style === 'long') && (
        <>
          <path d="M71 72c-3 16-1 34 3 48 3-14 5-30 5-44z" fill={`url(#${gid}-hair)`} />
          <path d="M129 72c3 16 1 34-3 48-3-14-5-30-5-44z" fill={`url(#${gid}-hair)`} />
        </>
      )}
      <path
        d="M78 48c8-12 18-16 28-14 8 1 14 6 18 12"
        fill="none"
        stroke={light}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M86 40c6-4 14-5 20-2"
        fill="none"
        stroke={dark}
        strokeWidth="2"
        opacity="0.25"
      />
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
      <g opacity="0.4">
        <ellipse cx="100" cy="86" rx="17" ry="11" fill={color} />
        <ellipse cx="100" cy="78" rx="11" ry="5" fill={skin} />
      </g>
    )
  }
  if (style === 'mustache') {
    return (
      <path
        d="M87 77c7 7 11 7 13 2 2 5 6 5 13 2"
        stroke={color}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
    )
  }
  return (
    <g>
      <path
        d="M81 75c5 20 12 31 19 33 8-2 15-13 19-33-9 9-15 12-19 12s-11-3-19-12z"
        fill={color}
      />
      <path
        d="M90 92c4 6 8 8 10 8 3 0 6-2 10-8"
        fill="none"
        stroke={shade(color, 25)}
        strokeWidth="1.5"
        opacity="0.4"
      />
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
  const gid = useId().replace(/:/g, '')
  const face = faceFor(pose)
  const scale = bodyScale(look.bodyType)
  const skin = look.skinTone
  const skinDeep = shade(skin, -32)
  const skinLite = shade(skin, 22)
  const cloth = look.topColor
  const clothDeep = shade(cloth, -40)
  const clothLite = shade(cloth, 30)
  const pants = look.bottomColor
  const pantsDeep = shade(pants, -35)
  const pantsLite = shade(pants, 20)
  const hair = look.hairColor
  const lip = '#b86b5a'
  const armsUp = pose === 'proud' || pose === 'energized'
  const armsLow = pose === 'low' || pose === 'sleepy'
  const eyeRy = Math.max(1.6, 5.4 * face.eye)

  return (
    <svg className="avatar-svg layered" viewBox="0 0 200 360" role="img">
      <defs>
        <radialGradient id={`${gid}-skin`} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor={skinLite} />
          <stop offset="55%" stopColor={skin} />
          <stop offset="100%" stopColor={skinDeep} />
        </radialGradient>
        <radialGradient id={`${gid}-skinSoft`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={skinLite} />
          <stop offset="100%" stopColor={skin} />
        </radialGradient>
        <linearGradient id={`${gid}-cloth`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={clothLite} />
          <stop offset="45%" stopColor={cloth} />
          <stop offset="100%" stopColor={clothDeep} />
        </linearGradient>
        <linearGradient id={`${gid}-pants`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pantsLite} />
          <stop offset="100%" stopColor={pantsDeep} />
        </linearGradient>
        <linearGradient id={`${gid}-hair`} x1="0.2" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={shade(hair, 35)} />
          <stop offset="40%" stopColor={hair} />
          <stop offset="100%" stopColor={shade(hair, -35)} />
        </linearGradient>
        <radialGradient id={`${gid}-glow`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fffaf4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fffaf4" stopOpacity="0" />
        </radialGradient>
        <filter id={`${gid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      <ellipse cx="100" cy="346" rx="44" ry="8" fill="rgba(27,42,37,0.16)" />

      <g className="avatar-figure">
        {/* LEFT ARM */}
        <g transform={`translate(100 0) scale(${scale.arm} 1) translate(-100 0)`}>
          {armsUp ? (
            <path
              d="M67 146C44 124 31 121 27 136c-4 13 10 25 28 29 5-9 9-15 12-19z"
              fill={`url(#${gid}-skin)`}
            />
          ) : armsLow ? (
            <path
              d="M69 149C55 172 51 204 58 222c4 10 16 8 18-4-1-20-3-44-7-69z"
              fill={`url(#${gid}-skin)`}
            />
          ) : (
            <path
              d="M69 147C53 164 49 196 56 218c4 10 17 9 18-3-1-22-2-46-5-68z"
              fill={`url(#${gid}-skin)`}
            />
          )}
          <ellipse
            cx={armsUp ? 30 : 61}
            cy={armsUp ? 152 : armsLow ? 222 : 218}
            rx="8"
            ry="7"
            fill={`url(#${gid}-skinSoft)`}
          />
          {/* knuckle hint */}
          <ellipse
            cx={armsUp ? 28 : 59}
            cy={armsUp ? 150 : armsLow ? 220 : 216}
            rx="2.2"
            ry="1.4"
            fill={skinLite}
            opacity="0.45"
          />
        </g>

        {/* LEGS / BOTTOMS */}
        <g transform={`translate(100 0) scale(${scale.leg} 1) translate(-100 0)`}>
          {look.bottomStyle === 'shorts' ? (
            <>
              <path d="M78 248c-1 12-2 22-2 30h20c1-10 1-20 0-30z" fill={`url(#${gid}-pants)`} />
              <path d="M104 248c0 12 1 22 2 30h20c-1-10-2-20-2-30z" fill={`url(#${gid}-pants)`} />
              <path d="M76 278c0 10 2 20 2 28h18c0-10 0-20-1-28z" fill={`url(#${gid}-skin)`} />
              <path d="M108 278c0 10 0 20 1 28h18c0-10-1-20-2-28z" fill={`url(#${gid}-skin)`} />
              <path d="M74 304h24v8c0 2-2 4-5 4H78c-2 0-4-2-4-4z" fill="#1b2a25" />
              <path d="M106 304h24v8c0 2-2 4-5 4h-15c-2 0-4-2-4-4z" fill="#1b2a25" />
            </>
          ) : (
            <>
              <path d="M78 246c-1 24-2 52-3 76h21c2-22 2-50 1-76z" fill={`url(#${gid}-pants)`} />
              <path d="M104 246c0 24 1 52 2 76h21c-1-22-2-50-2-76z" fill={`url(#${gid}-pants)`} />
              {look.bottomStyle === 'joggers' ? (
                <>
                  <path d="M76 316h22v5H76z" fill={pantsDeep} />
                  <path d="M106 316h22v5H106z" fill={pantsDeep} />
                </>
              ) : (
                <path d="M86 270v40M114 270v40" stroke={pantsDeep} strokeWidth="1.2" opacity="0.35" />
              )}
              <path d="M70 320h28v10c0 3-2 6-6 6H76c-3 0-6-3-6-6z" fill="#1b2a25" />
              <path d="M104 320h28v10c0 3-2 6-6 6h-16c-3 0-6-3-6-6z" fill="#1b2a25" />
              <ellipse cx="82" cy="322" rx="6" ry="2" fill="#fff" opacity="0.12" />
              <ellipse cx="116" cy="322" rx="6" ry="2" fill="#fff" opacity="0.12" />
            </>
          )}
          <path d="M74 246h52c2 8-2 14-10 14H84c-8 0-12-6-10-14z" fill={pantsDeep} opacity="0.45" />
        </g>

        {/* TORSO / TOP */}
        <g transform={`translate(100 0) scale(${scale.torso} 1) translate(-100 0)`}>
          {look.topStyle === 'hoodie' ? (
            <>
              <path d="M78 110c8-9 14-11 22-11s14 2 22 11l5 10H73z" fill={clothDeep} />
              <path d="M57 136C57 120 74 112 100 112s43 8 43 24l8 94c1 14-10 24-24 24H73c-14 0-25-10-24-24z" fill={`url(#${gid}-cloth)`} />
              <path d="M86 116c5 14 23 14 28 0" stroke={clothDeep} strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M100 140v70" stroke={clothLite} strokeWidth="2" opacity="0.2" />
              <path d="M68 128c-18 10-28 30-22 54 8-4 18-10 30-14z" fill={clothDeep} opacity="0.55" />
              <path d="M132 128c18 10 28 30 22 54-8-4-18-10-30-14z" fill={clothDeep} opacity="0.55" />
            </>
          ) : look.topStyle === 'tank' ? (
            <>
              <path d="M71 130C75 116 87 110 100 110s25 6 29 20l4 104c0 12-10 20-22 20H89c-12 0-22-8-22-20z" fill={`url(#${gid}-cloth)`} />
              <path d="M78 118c0-12 8-18 14-18" stroke={skinDeep} strokeWidth="7" fill="none" strokeLinecap="round" />
              <path d="M122 118c0-12-8-18-14-18" stroke={skinDeep} strokeWidth="7" fill="none" strokeLinecap="round" />
              <path d="M90 150h20" stroke={clothLite} strokeWidth="1.5" opacity="0.25" />
            </>
          ) : look.topStyle === 'tee' ? (
            <>
              <path d="M62 134C66 118 80 112 100 112s34 6 38 22l6 98c1 12-10 22-22 22H78c-12 0-23-10-22-22z" fill={`url(#${gid}-cloth)`} />
              <path d="M62 138c-14 8-20 22-14 40 10-4 20-8 30-12z" fill={clothDeep} opacity="0.5" />
              <path d="M138 138c14 8 20 22 14 40-10-4-20-8-30-12z" fill={clothDeep} opacity="0.5" />
              <path d="M88 116c5 9 19 9 24 0" stroke={clothDeep} strokeWidth="3.2" fill="none" />
              <ellipse cx="118" cy="160" rx="10" ry="18" fill={clothLite} opacity="0.12" />
            </>
          ) : (
            <>
              <path d="M57 138C57 120 74 112 100 112s43 8 43 26l8 92c1 14-10 24-24 24H73c-14 0-25-10-24-24z" fill={`url(#${gid}-cloth)`} />
              <path d="M57 142c-12 10-18 26-10 44 8-4 18-10 30-14z" fill={clothDeep} opacity="0.45" />
              <path d="M143 142c12 10 18 26 10 44-8-4-18-10-30-14z" fill={clothDeep} opacity="0.45" />
              <path d="M88 116c5 11 19 11 24 0" stroke={clothDeep} strokeWidth="3.8" fill="none" />
              <path d="M78 170h44" stroke={clothLite} strokeWidth="1.6" opacity="0.18" />
              <ellipse cx="120" cy="155" rx="12" ry="22" fill={clothLite} opacity="0.14" />
            </>
          )}
        </g>

        {/* RIGHT ARM */}
        <g transform={`translate(100 0) scale(${scale.arm} 1) translate(-100 0)`}>
          {armsUp ? (
            <path
              d="M133 146C156 124 169 121 173 136c4 13-10 25-28 29-5-9-9-15-12-19z"
              fill={`url(#${gid}-skin)`}
            />
          ) : armsLow ? (
            <path
              d="M131 149C145 172 149 204 142 222c-4 10-16 8-18-4 1-20 3-44 7-69z"
              fill={`url(#${gid}-skin)`}
            />
          ) : (
            <path
              d="M131 147C147 164 151 196 144 218c-4 10-17 9-18-3 1-22 2-46 5-68z"
              fill={`url(#${gid}-skin)`}
            />
          )}
          <ellipse
            cx={armsUp ? 170 : 139}
            cy={armsUp ? 152 : armsLow ? 222 : 218}
            rx="8"
            ry="7"
            fill={`url(#${gid}-skinSoft)`}
          />
        </g>

        {/* TATTOOS */}
        {look.tattoo === 'armband' ? (
          <g opacity="0.8">
            <rect x="48" y="170" width="15" height="5" rx="2" fill="#243038" />
            <rect x="137" y="170" width="15" height="5" rx="2" fill="#243038" />
          </g>
        ) : null}
        {look.tattoo === 'forearm' ? (
          <g opacity="0.72" fill="none" stroke="#243038" strokeWidth="1.8">
            <path d="M52 180c4 8 6 16 4 24" />
            <path d="M57 184c5 2 7 10 5 18" />
            <path d="M145 180c-4 8-6 16-4 24" />
            <circle cx="55" cy="198" r="2.5" />
          </g>
        ) : null}
        {look.tattoo === 'chest' ? (
          <g opacity="0.55" fill="none" stroke="#243038" strokeWidth="1.7">
            <path d="M91 152c6-8 14-8 20 0" />
            <path d="M95 158c4-4 10-4 14 0" />
            <circle cx="100" cy="163" r="3" />
          </g>
        ) : null}

        {/* NECK */}
        <rect x="90" y="98" width="20" height="22" rx="7" fill={`url(#${gid}-skin)`} />
        <ellipse cx="100" cy="118" rx="12" ry="5.5" fill={skinDeep} opacity="0.25" filter={`url(#${gid}-soft)`} />

        {/* HEAD */}
        <g className="avatar-head">
          <ellipse cx="78" cy="64" rx="5.2" ry="7.8" fill={`url(#${gid}-skin)`} />
          <ellipse cx="122" cy="64" rx="5.2" ry="7.8" fill={`url(#${gid}-skin)`} />
          <ellipse cx="78" cy="64" rx="2.4" ry="4" fill={skinDeep} opacity="0.25" />
          <ellipse cx="122" cy="64" rx="2.4" ry="4" fill={skinDeep} opacity="0.25" />

          <ellipse cx="100" cy="62" rx="29" ry="35" fill={`url(#${gid}-skin)`} />
          {/* cheek / jaw soft shade */}
          <ellipse cx="100" cy="78" rx="22" ry="14" fill={skinDeep} opacity="0.12" filter={`url(#${gid}-soft)`} />
          <ellipse cx="84" cy="72" rx="7" ry="5" fill="#e0897a" opacity={face.cheeks} />
          <ellipse cx="116" cy="72" rx="7" ry="5" fill="#e0897a" opacity={face.cheeks} />

          <Hair style={look.hairStyle} color={look.hairColor} gid={gid} />

          {/* brows */}
          <path
            d={`M85 ${54 + face.brow}c4-2.4 10-2.4 13.5 0`}
            stroke={shade(hair, -45)}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M102 ${54 + face.brow}c4-2.4 10-2.4 13.5 0`}
            stroke={shade(hair, -45)}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* eyes */}
          <ellipse cx="90" cy="64" rx="6.2" ry={eyeRy} fill="#fffefb" />
          <ellipse cx="110" cy="64" rx="6.2" ry={eyeRy} fill="#fffefb" />
          {face.eye >= 0.35 ? (
            <>
              <ellipse cx="90" cy={64 + face.pupilY} rx="3.1" ry="3.3" fill="#2a1f18" />
              <ellipse cx="110" cy={64 + face.pupilY} rx="3.1" ry="3.3" fill="#2a1f18" />
              <circle cx="90" cy={64 + face.pupilY} r="1.5" fill="#5c4030" />
              <circle cx="110" cy={64 + face.pupilY} r="1.5" fill="#5c4030" />
              <circle cx="91.2" cy={63 + face.pupilY} r="1" fill="#fff" />
              <circle cx="111.2" cy={63 + face.pupilY} r="1" fill="#fff" />
              <path d="M84 59.5c3.5-2 8-2 12 0" stroke={skinDeep} strokeWidth="1.3" opacity="0.35" fill="none" />
              <path d="M104 59.5c3.5-2 8-2 12 0" stroke={skinDeep} strokeWidth="1.3" opacity="0.35" fill="none" />
            </>
          ) : (
            <>
              <path d="M84 64c4 2.6 8 2.6 12 0" stroke="#2a1f18" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M104 64c4 2.6 8 2.6 12 0" stroke="#2a1f18" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* nose with soft shade */}
          <path
            d="M100 66c1.2 6 3.8 9 6 10.5"
            stroke={skinDeep}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
          <ellipse cx="104" cy="76" rx="2.2" ry="1.3" fill={skinDeep} opacity="0.18" />

          <Mouth kind={face.mouth} lip={lip} />
          <FacialHairLayer style={look.facialHair} color={look.hairColor} skin={skin} />

          <path className="sweat" d="M128 42c0 5 4.5 5 4.5 11" />
          <g className="sparks" fill="#d4a017">
            <path d="M144 28l2.2 6 6 2.2-6 2.2-2.2 6-2.2-6-6-2.2 6-2.2z" />
            <path d="M52 34l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z" />
          </g>
        </g>
      </g>
    </svg>
  )
}

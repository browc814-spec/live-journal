import type { AvatarPose, AvatarSnapshot } from './types'
import { poseLabel } from './avatar'

function faceFor(pose: AvatarPose) {
  switch (pose) {
    case 'jittery':
      return { eyeY: 26, mouth: 'M24 36c3 1 13 1 16-2', brow: -2 }
    case 'hungry':
      return { eyeY: 28, mouth: 'M26 37c4-3 10-3 14 0', brow: 1 }
    case 'energized':
      return { eyeY: 25, mouth: 'M24 34c4 5 12 5 16 0', brow: -3 }
    case 'encouraged':
      return { eyeY: 26, mouth: 'M25 35c3 3.5 11 3.5 14 0', brow: -1 }
    case 'proud':
      return { eyeY: 25, mouth: 'M23 34c5 6 13 6 18 0', brow: -3 }
    case 'low':
      return { eyeY: 29, mouth: 'M26 38c4-2 10-2 14 0', brow: 2 }
    case 'sleepy':
      return { eyeY: 28, mouth: 'M28 37h10', brow: 2 }
    default:
      return { eyeY: 27, mouth: 'M25 35c3 2.5 11 2.5 14 0', brow: 0 }
  }
}

export function AvatarStage({
  name,
  snapshot,
}: {
  name: string
  snapshot: AvatarSnapshot
}) {
  const face = faceFor(snapshot.pose)

  return (
    <section className={`avatar-stage pose-${snapshot.pose}`} aria-live="polite">
      <div className="avatar-stage-copy">
        <p className="eyebrow">Live Journal</p>
        <h1>{name}</h1>
        <p className="avatar-headline">{snapshot.headline}</p>
        <p className="avatar-detail">{snapshot.detail}</p>
        <div className="cue-row">
          <span className="pose-chip">{poseLabel(snapshot.pose)}</span>
          {snapshot.cues.slice(0, 3).map((cue) => (
            <span className="cue" key={cue}>
              {cue}
            </span>
          ))}
        </div>
      </div>

      <div className="avatar-frame" aria-hidden="true">
        <div className="avatar-glow" />
        <svg className="avatar-svg" viewBox="0 0 160 180" role="img">
          <defs>
            <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7efe4" />
              <stop offset="100%" stopColor="#e8d5c0" />
            </linearGradient>
            <linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2f6f64" />
              <stop offset="100%" stopColor="#1f4d45" />
            </linearGradient>
          </defs>

          {/* body */}
          <path
            className="avatar-body"
            d="M40 168c8-34 72-34 80 0"
            fill="url(#shirt)"
          />
          <ellipse className="avatar-body" cx="80" cy="150" rx="34" ry="18" fill="url(#shirt)" />

          {/* head */}
          <g className="avatar-head">
            <circle cx="80" cy="78" r="42" fill="url(#skin)" />
            <ellipse cx="80" cy="48" rx="36" ry="18" fill="#24352f" />
            <path d="M44 70c6-22 66-22 72 0" fill="#24352f" />

            {/* brows */}
            <path
              d={`M58 ${58 + face.brow}c6-3 14-3 18 0`}
              stroke="#24352f"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M84 ${58 + face.brow}c6-3 14-3 18 0`}
              stroke="#24352f"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />

            {/* eyes */}
            <g className="avatar-eyes">
              <circle cx="66" cy={face.eyeY} r="4.2" fill="#1b2a25" />
              <circle cx="94" cy={face.eyeY} r="4.2" fill="#1b2a25" />
              <circle cx="67.3" cy={face.eyeY - 1.2} r="1.2" fill="#fff" />
              <circle cx="95.3" cy={face.eyeY - 1.2} r="1.2" fill="#fff" />
            </g>

            {/* mouth */}
            <path
              d={face.mouth}
              stroke="#7a4b3a"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />

            {/* blush / sweat / spark depending on pose via CSS */}
            <circle className="blush left" cx="54" cy="86" r="6" />
            <circle className="blush right" cx="106" cy="86" r="6" />
            <path className="sweat" d="M112 62c0 6 5 6 5 12" />
            <g className="sparks">
              <path d="M118 40l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
              <path d="M34 48l1.5 4.5 4.5 1.5-4.5 1.5L34 60l-1.5-4.5L28 54l4.5-1.5z" />
            </g>
          </g>
        </svg>
      </div>
    </section>
  )
}

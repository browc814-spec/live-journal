import type { AvatarLook, AvatarSnapshot } from './types'
import { poseLabel } from './avatar'
import { AccessoryOverlay } from './AccessoryOverlay'
import { avatarArtSrc, bodyTransform } from './avatarLook'

export function AvatarStage({
  name,
  snapshot,
  look,
}: {
  name: string
  snapshot: AvatarSnapshot
  look: AvatarLook
}) {
  const body = bodyTransform(look)
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
        <div className="avatar-figure" style={body}>
          <div className="avatar-stack">
            <img
              className="avatar-photo"
              src={avatarArtSrc(look, snapshot.pose)}
              alt=""
              width={480}
              height={640}
              draggable={false}
            />
            <AccessoryOverlay look={look} />
          </div>
        </div>
      </div>
    </section>
  )
}

import type { AvatarPose, AvatarSnapshot } from './types'
import { poseLabel } from './avatar'

const POSE_ART: Record<AvatarPose, string> = {
  calm: './avatar/juniper-calm.jpg',
  jittery: './avatar/juniper-jittery.jpg',
  hungry: './avatar/juniper-hungry.jpg',
  energized: './avatar/juniper-energized.jpg',
  encouraged: './avatar/juniper-proud.jpg',
  low: './avatar/juniper-low.jpg',
  sleepy: './avatar/juniper-sleepy.jpg',
  proud: './avatar/juniper-proud.jpg',
}

export function AvatarStage({
  name,
  snapshot,
}: {
  name: string
  snapshot: AvatarSnapshot
}) {
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
        <div className="avatar-figure">
          <img
            className="avatar-photo"
            src={POSE_ART[snapshot.pose]}
            alt=""
            width={480}
            height={640}
            draggable={false}
          />
        </div>
      </div>
    </section>
  )
}

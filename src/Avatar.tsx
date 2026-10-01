import { useEffect, useRef, useState, type MouseEvent } from 'react'
import type { AvatarLook, AvatarSnapshot } from './types'
import { poseLabel } from './avatar'
import { idleNudgeLine, poseSpeech, tapLine } from './avatarInteract'
import { avatarArtSrc, bodyTransform } from './avatarLook'

export type AvatarBubble = {
  text: string
  key: number
}

export function AvatarStage({
  name,
  snapshot,
  look,
  bubble,
}: {
  name: string
  snapshot: AvatarSnapshot
  look: AvatarLook
  bubble?: AvatarBubble | null
}) {
  const body = bodyTransform(look)
  const frameRef = useRef<HTMLDivElement>(null)
  const [lean, setLean] = useState({ x: 0, y: 0 })
  const [blinking, setBlinking] = useState(false)
  const [reacting, setReacting] = useState(false)
  const [localBubble, setLocalBubble] = useState<AvatarBubble | null>(null)
  const [attention, setAttention] = useState(false)
  const lastInteract = useRef(Date.now())

  const shown = localBubble

  useEffect(() => {
    if (!bubble) return
    setLocalBubble(bubble)
    lastInteract.current = Date.now()
  }, [bubble?.key])

  useEffect(() => {
    let cancelled = false
    let hideTimer: number | undefined
    const tick = () => {
      if (cancelled) return
      setBlinking(true)
      hideTimer = window.setTimeout(() => {
        if (!cancelled) setBlinking(false)
      }, 140)
    }
    const id = window.setInterval(tick, 3200 + Math.random() * 2200)
    return () => {
      cancelled = true
      window.clearInterval(id)
      if (hideTimer) window.clearTimeout(hideTimer)
    }
  }, [look.loadout, snapshot.pose])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() - lastInteract.current < 22000) return
      if (document.hidden) return
      setAttention(true)
      setLocalBubble({ text: idleNudgeLine(), key: Date.now() })
      lastInteract.current = Date.now()
      window.setTimeout(() => setAttention(false), 900)
    }, 5000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!shown) return
    const id = window.setTimeout(() => setLocalBubble(null), 4200)
    return () => window.clearTimeout(id)
  }, [shown?.key, shown?.text])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setLean({ x: x * 7, y: y * 4 })
  }

  const onLeave = () => setLean({ x: 0, y: 0 })

  const onTap = () => {
    lastInteract.current = Date.now()
    setReacting(true)
    setLocalBubble({
      text: Math.random() > 0.35 ? tapLine() : poseSpeech(snapshot.pose, name),
      key: Date.now(),
    })
    window.setTimeout(() => setReacting(false), 550)
  }

  const leanStyle = {
    ...body,
    transform: `${body.transform} translate(${lean.x.toFixed(1)}px, ${lean.y.toFixed(1)}px) rotate(${(lean.x * 0.4).toFixed(2)}deg)`,
    transition: 'transform 0.16s ease-out',
  }

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

      <div
        className={`avatar-frame ${reacting ? 'is-reacting' : ''} ${attention ? 'is-attention' : ''}`}
        ref={frameRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="avatar-glow" />
        {shown ? (
          <div className="speech-bubble" key={shown.key} role="status">
            {shown.text}
          </div>
        ) : null}
        <button
          type="button"
          className="avatar-hit"
          onClick={onTap}
          aria-label={`Talk to ${name}`}
        >
          <div className="avatar-figure">
            <div className="avatar-lean" style={leanStyle}>
              <div className={`avatar-stack ${blinking ? 'is-blinking' : ''}`}>
                <img
                  className="avatar-photo"
                  src={avatarArtSrc(look, snapshot.pose)}
                  alt=""
                  width={480}
                  height={640}
                  draggable={false}
                />
                <span className="blink-lids" aria-hidden="true" />
              </div>
            </div>
          </div>
        </button>
        <p className="avatar-hint">Tap me · I follow your cursor</p>
      </div>
    </section>
  )
}

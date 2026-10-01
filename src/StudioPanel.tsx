import type { AvatarLook, OutfitLoadout } from './types'
import {
  BODY_TYPES,
  LOADOUTS,
  avatarArtSrc,
  bodyTransform,
  createDefaultLook,
  loadoutThumbSrc,
} from './avatarLook'

function ChoiceRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { id: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="studio-row">
      <span className="studio-label">{label}</span>
      <div className="choice-row">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`choice ${value === opt.id ? 'active' : ''}`}
            onClick={() => onChange(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SliderRow({
  label,
  value,
  left,
  right,
  onChange,
}: {
  label: string
  value: number
  left: string
  right: string
  onChange: (n: number) => void
}) {
  return (
    <div className="studio-row">
      <div className="slider-head">
        <span className="studio-label">{label}</span>
        <span className="slider-value">{Math.round(value)}</span>
      </div>
      <input
        className="slider"
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="slider-ends">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  )
}

export function StudioPanel({
  look,
  name,
  onChangeLook,
  onRename,
}: {
  look: AvatarLook
  name: string
  onChangeLook: (look: AvatarLook) => void
  onRename: (name: string) => void
}) {
  const patch = (partial: Partial<AvatarLook>) => onChangeLook({ ...look, ...partial })
  const body = bodyTransform(look)

  return (
    <section className="sheet studio-sheet">
      <header className="sheet-head row">
        <div>
          <h2>Avatar Studio</h2>
          <p>
            Shape the body with sliders, then pick a preset outfit load-out — same anime soft-3D
            style, less fuss.
          </p>
        </div>
        <button
          type="button"
          className="btn ghost"
          onClick={() => onChangeLook(createDefaultLook())}
        >
          Reset look
        </button>
      </header>

      <div className="studio-layout">
        <div className="studio-preview">
          <div className="avatar-figure studio-hero-wrap" style={body}>
            <div className="avatar-stack">
              <img
                className="avatar-photo studio-hero"
                src={avatarArtSrc(look, 'calm')}
                alt=""
                width={360}
                height={480}
                draggable={false}
              />
            </div>
          </div>
          <p className="hint">Preview updates live. Mood poses still follow your logs.</p>
        </div>

        <div className="studio-controls">
          <label className="field">
            <span>Name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => onRename(e.target.value)}
              placeholder="Avatar name"
            />
          </label>

          <h3 className="studio-section">Body</h3>
          <SliderRow
            label="Height"
            value={look.height}
            left="Shorter"
            right="Taller"
            onChange={(height) => patch({ height })}
          />
          <SliderRow
            label="Weight"
            value={look.weight}
            left="Lighter"
            right="Heavier"
            onChange={(weight) => patch({ weight })}
          />
          <ChoiceRow
            label="Body type"
            value={look.bodyType}
            options={BODY_TYPES}
            onChange={(bodyType) => patch({ bodyType })}
          />

          <h3 className="studio-section">Outfit load-outs</h3>
          <div className="pack-grid">
            {LOADOUTS.map((pack) => (
              <button
                key={pack.id}
                type="button"
                className={`pack-card ${look.loadout === pack.id ? 'active' : ''}`}
                onClick={() => patch({ loadout: pack.id as OutfitLoadout })}
              >
                <img src={loadoutThumbSrc(pack.id)} alt="" width={180} height={240} draggable={false} />
                <strong>{pack.label}</strong>
                <span>{pack.blurb}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import type { AvatarLook } from './types'
import {
  CLOTH_COLORS,
  HAIR_COLORS,
  LOOK_LABELS,
  SKIN_PRESETS,
  createDefaultLook,
} from './avatarLook'
import { LayeredAvatar } from './LayeredAvatar'

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

function SwatchRow({
  label,
  value,
  swatches,
  onChange,
}: {
  label: string
  value: string
  swatches: readonly { id: string; label: string; value: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="studio-row">
      <span className="studio-label">{label}</span>
      <div className="swatch-row">
        {swatches.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`swatch ${value.toLowerCase() === s.value.toLowerCase() ? 'active' : ''}`}
            style={{ background: s.value }}
            aria-label={s.label}
            title={s.label}
            onClick={() => onChange(s.value)}
          />
        ))}
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

  return (
    <section className="sheet studio-sheet">
      <header className="sheet-head row">
        <div>
          <h2>Avatar Studio</h2>
          <p>Shape the person living in your journal — body, hair, clothes, ink.</p>
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
          <LayeredAvatar look={look} pose="calm" />
          <p className="hint">Preview updates instantly. Mood poses still react to your logs.</p>
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

          <ChoiceRow
            label="Body type"
            value={look.bodyType}
            options={(Object.keys(LOOK_LABELS.bodyType) as Array<keyof typeof LOOK_LABELS.bodyType>).map(
              (id) => ({ id, label: LOOK_LABELS.bodyType[id] }),
            )}
            onChange={(bodyType) => patch({ bodyType })}
          />

          <SwatchRow
            label="Skin"
            value={look.skinTone}
            swatches={SKIN_PRESETS}
            onChange={(skinTone) => patch({ skinTone })}
          />

          <ChoiceRow
            label="Hair"
            value={look.hairStyle}
            options={(Object.keys(LOOK_LABELS.hairStyle) as Array<keyof typeof LOOK_LABELS.hairStyle>).map(
              (id) => ({ id, label: LOOK_LABELS.hairStyle[id] }),
            )}
            onChange={(hairStyle) => patch({ hairStyle })}
          />

          <SwatchRow
            label="Hair color"
            value={look.hairColor}
            swatches={HAIR_COLORS}
            onChange={(hairColor) => patch({ hairColor })}
          />

          <ChoiceRow
            label="Facial hair"
            value={look.facialHair}
            options={(
              Object.keys(LOOK_LABELS.facialHair) as Array<keyof typeof LOOK_LABELS.facialHair>
            ).map((id) => ({ id, label: LOOK_LABELS.facialHair[id] }))}
            onChange={(facialHair) => patch({ facialHair })}
          />

          <ChoiceRow
            label="Top"
            value={look.topStyle}
            options={(Object.keys(LOOK_LABELS.topStyle) as Array<keyof typeof LOOK_LABELS.topStyle>).map(
              (id) => ({ id, label: LOOK_LABELS.topStyle[id] }),
            )}
            onChange={(topStyle) => patch({ topStyle })}
          />

          <SwatchRow
            label="Top color"
            value={look.topColor}
            swatches={CLOTH_COLORS}
            onChange={(topColor) => patch({ topColor })}
          />

          <ChoiceRow
            label="Bottoms"
            value={look.bottomStyle}
            options={(
              Object.keys(LOOK_LABELS.bottomStyle) as Array<keyof typeof LOOK_LABELS.bottomStyle>
            ).map((id) => ({ id, label: LOOK_LABELS.bottomStyle[id] }))}
            onChange={(bottomStyle) => patch({ bottomStyle })}
          />

          <SwatchRow
            label="Bottom color"
            value={look.bottomColor}
            swatches={CLOTH_COLORS}
            onChange={(bottomColor) => patch({ bottomColor })}
          />

          <ChoiceRow
            label="Tattoos"
            value={look.tattoo}
            options={(Object.keys(LOOK_LABELS.tattoo) as Array<keyof typeof LOOK_LABELS.tattoo>).map(
              (id) => ({ id, label: LOOK_LABELS.tattoo[id] }),
            )}
            onChange={(tattoo) => patch({ tattoo })}
          />
        </div>
      </div>
    </section>
  )
}

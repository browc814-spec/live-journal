import type { AvatarLook, StylePack } from './types'
import { STYLE_PACKS, avatarArtSrc, createDefaultLook } from './avatarLook'

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
  return (
    <section className="sheet studio-sheet">
      <header className="sheet-head row">
        <div>
          <h2>Avatar Studio</h2>
          <p>
            Pick a look in the anime / soft-3D style from your references. Mood poses still
            change with what you log.
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
          <img
            className="avatar-photo studio-hero"
            src={avatarArtSrc(look, 'calm')}
            alt=""
            width={360}
            height={480}
            draggable={false}
          />
          <p className="hint">Preview stays put while you scroll. Saved with your journal.</p>
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

          <div className="studio-row">
            <span className="studio-label">Style pack</span>
            <div className="pack-grid">
              {STYLE_PACKS.map((pack) => {
                const active = look.stylePack === pack.id
                return (
                  <button
                    key={pack.id}
                    type="button"
                    className={`pack-card ${active ? 'active' : ''}`}
                    onClick={() => onChangeLook({ stylePack: pack.id as StylePack })}
                  >
                    <img
                      src={avatarArtSrc({ stylePack: pack.id }, 'calm')}
                      alt=""
                      width={160}
                      height={200}
                      draggable={false}
                    />
                    <strong>{pack.label}</strong>
                    <span>{pack.blurb}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

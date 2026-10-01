import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AvatarStage } from './Avatar'
import { deriveAvatar } from './avatar'
import { createDefaultState, createId, loadState, nowISO, saveState } from './storage'
import type {
  AppState,
  DailyLog,
  DrinkKind,
  ExerciseEffort,
  FoodQuality,
  Goal,
  MoodLevel,
} from './types'

type Panel = 'log' | 'journal' | 'goals' | 'today'

function formatWhen(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function qualityLabel(q: FoodQuality) {
  return { healthy: 'Healthy', okay: 'Okay', treat: 'Treat', heavy: 'Heavy' }[q]
}

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [panel, setPanel] = useState<Panel>('log')

  useEffect(() => {
    saveState(state)
  }, [state])

  const snapshot = useMemo(() => deriveAvatar(state), [state])
  const todayLogs = useMemo(() => {
    const key = new Date().toISOString().slice(0, 10)
    return state.logs
      .filter((l) => l.createdAt.startsWith(key))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [state.logs])

  const addLog = (log: DailyLog) => {
    setState((s) => ({ ...s, logs: [log, ...s.logs] }))
    setPanel('today')
  }

  return (
    <div className="app">
      <AvatarStage name={state.avatarName} snapshot={snapshot} />

      <nav className="panels" aria-label="Journal sections">
        {(
          [
            ['log', 'Log'],
            ['today', 'Today'],
            ['journal', 'Journal'],
            ['goals', 'Goals'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`panel-tab ${panel === id ? 'active' : ''}`}
            onClick={() => setPanel(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {panel === 'log' ? (
        <LogPanel onAdd={addLog} />
      ) : panel === 'today' ? (
        <TodayPanel
          logs={todayLogs}
          onClearDemo={() => {
            if (confirm('Reset Live Journal to the demo starter state?')) {
              setState(createDefaultState())
            }
          }}
          onRename={(name) => setState((s) => ({ ...s, avatarName: name }))}
          avatarName={state.avatarName}
        />
      ) : panel === 'journal' ? (
        <JournalPanel
          entries={state.journal}
          onAdd={(title, body) =>
            setState((s) => ({
              ...s,
              journal: [
                { id: createId(), createdAt: nowISO(), title, body },
                ...s.journal,
              ],
            }))
          }
          onDelete={(id) =>
            setState((s) => ({
              ...s,
              journal: s.journal.filter((e) => e.id !== id),
            }))
          }
        />
      ) : (
        <GoalsPanel
          goals={state.goals}
          onSave={(goals) => setState((s) => ({ ...s, goals }))}
        />
      )}

      <p className="footer-note">Saved in this browser. Your avatar only knows what you log.</p>
    </div>
  )
}

function LogPanel({ onAdd }: { onAdd: (log: DailyLog) => void }) {
  const [category, setCategory] = useState<DailyLog['category']>('food')

  return (
    <section className="sheet">
      <header className="sheet-head">
        <h2>Log the day</h2>
        <p>Food, drink, movement, mood, or a sit. Each entry nudges the avatar.</p>
      </header>

      <div className="cat-row" role="tablist" aria-label="Log category">
        {(
          [
            ['food', 'Food'],
            ['drink', 'Drink'],
            ['exercise', 'Exercise'],
            ['mood', 'Mood'],
            ['meditation', 'Meditation'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={category === id}
            className={`cat-tab ${category === id ? 'active' : ''}`}
            onClick={() => setCategory(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {category === 'food' ? (
        <FoodForm onAdd={onAdd} />
      ) : category === 'drink' ? (
        <DrinkForm onAdd={onAdd} />
      ) : category === 'exercise' ? (
        <ExerciseForm onAdd={onAdd} />
      ) : category === 'mood' ? (
        <MoodForm onAdd={onAdd} />
      ) : (
        <MeditationForm onAdd={onAdd} />
      )}
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function FoodForm({ onAdd }: { onAdd: (log: DailyLog) => void }) {
  const [title, setTitle] = useState('')
  const [quality, setQuality] = useState<FoodQuality>('okay')
  const [note, setNote] = useState('')

  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault()
        if (!title.trim()) return
        onAdd({
          id: createId(),
          category: 'food',
          createdAt: nowISO(),
          title: title.trim(),
          quality,
          note: note.trim(),
        })
        setTitle('')
        setNote('')
      }}
    >
      <Field label="What did you eat?">
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Oatmeal, burger, salad…"
          required
        />
      </Field>
      <Field label="How does it land?">
        <select
          className="input"
          value={quality}
          onChange={(e) => setQuality(e.target.value as FoodQuality)}
        >
          <option value="healthy">Healthy — solid fuel</option>
          <option value="okay">Okay — fine for today</option>
          <option value="treat">Treat — enjoyed on purpose</option>
          <option value="heavy">Heavy — rich / fast food</option>
        </select>
      </Field>
      <Field label="Note (optional)">
        <input
          className="input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Shared fries, homemade, etc."
        />
      </Field>
      <button type="submit" className="btn primary">
        Log food
      </button>
    </form>
  )
}

function DrinkForm({ onAdd }: { onAdd: (log: DailyLog) => void }) {
  const [title, setTitle] = useState('Coffee')
  const [kind, setKind] = useState<DrinkKind>('coffee')
  const [cups, setCups] = useState(1)
  const [note, setNote] = useState('')

  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault()
        onAdd({
          id: createId(),
          category: 'drink',
          createdAt: nowISO(),
          title: title.trim() || kind,
          kind,
          cups: Math.max(1, Number(cups) || 1),
          note: note.trim(),
        })
        setNote('')
      }}
    >
      <Field label="Drink">
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Coffee, water, sparkling…"
        />
      </Field>
      <div className="field-row">
        <Field label="Type">
          <select
            className="input"
            value={kind}
            onChange={(e) => setKind(e.target.value as DrinkKind)}
          >
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
            <option value="soda">Soda / energy</option>
            <option value="water">Water</option>
            <option value="alcohol">Alcohol</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Cups / servings">
          <input
            className="input"
            type="number"
            min={1}
            max={12}
            value={cups}
            onChange={(e) => setCups(Number(e.target.value))}
          />
        </Field>
      </div>
      <Field label="Note (optional)">
        <input
          className="input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Third cup by noon…"
        />
      </Field>
      <button type="submit" className="btn primary">
        Log drink
      </button>
      <p className="hint">
        Tip: coffee or soda without food makes the avatar jittery until you log a meal.
      </p>
    </form>
  )
}

function ExerciseForm({ onAdd }: { onAdd: (log: DailyLog) => void }) {
  const [title, setTitle] = useState('')
  const [minutes, setMinutes] = useState(30)
  const [effort, setEffort] = useState<ExerciseEffort>('steady')
  const [note, setNote] = useState('')

  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault()
        if (!title.trim()) return
        onAdd({
          id: createId(),
          category: 'exercise',
          createdAt: nowISO(),
          title: title.trim(),
          minutes: Math.max(1, Number(minutes) || 1),
          effort,
          note: note.trim(),
        })
        setTitle('')
        setNote('')
      }}
    >
      <Field label="What did you do?">
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Walk, lift, ride, yoga…"
          required
        />
      </Field>
      <div className="field-row">
        <Field label="Minutes">
          <input
            className="input"
            type="number"
            min={1}
            max={300}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </Field>
        <Field label="Effort">
          <select
            className="input"
            value={effort}
            onChange={(e) => setEffort(e.target.value as ExerciseEffort)}
          >
            <option value="light">Light</option>
            <option value="steady">Steady</option>
            <option value="hard">Hard</option>
          </select>
        </Field>
      </div>
      <Field label="Note (optional)">
        <input
          className="input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Felt strong / short on time"
        />
      </Field>
      <button type="submit" className="btn primary">
        Log exercise
      </button>
    </form>
  )
}

function MoodForm({ onAdd }: { onAdd: (log: DailyLog) => void }) {
  const [level, setLevel] = useState<MoodLevel>('okay')
  const [note, setNote] = useState('')

  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault()
        onAdd({
          id: createId(),
          category: 'mood',
          createdAt: nowISO(),
          level,
          note: note.trim(),
        })
        setNote('')
      }}
    >
      <Field label="How are you?">
        <select
          className="input"
          value={level}
          onChange={(e) => setLevel(e.target.value as MoodLevel)}
        >
          <option value="great">Great</option>
          <option value="good">Good</option>
          <option value="okay">Okay</option>
          <option value="low">Low</option>
          <option value="rough">Rough</option>
        </select>
      </Field>
      <Field label="What’s coloring it?">
        <input
          className="input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Sleep, stress, good news…"
        />
      </Field>
      <button type="submit" className="btn primary">
        Log mood
      </button>
    </form>
  )
}

function MeditationForm({ onAdd }: { onAdd: (log: DailyLog) => void }) {
  const [minutes, setMinutes] = useState(10)
  const [note, setNote] = useState('')

  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault()
        onAdd({
          id: createId(),
          category: 'meditation',
          createdAt: nowISO(),
          minutes: Math.max(1, Number(minutes) || 1),
          note: note.trim(),
        })
        setNote('')
      }}
    >
      <Field label="Minutes">
        <input
          className="input"
          type="number"
          min={1}
          max={180}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
      </Field>
      <Field label="Note (optional)">
        <input
          className="input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Breath focus, body scan…"
        />
      </Field>
      <button type="submit" className="btn primary">
        Log meditation
      </button>
    </form>
  )
}

function TodayPanel({
  logs,
  onClearDemo,
  onRename,
  avatarName,
}: {
  logs: DailyLog[]
  onClearDemo: () => void
  onRename: (name: string) => void
  avatarName: string
}) {
  const [name, setName] = useState(avatarName)
  useEffect(() => setName(avatarName), [avatarName])

  return (
    <section className="sheet">
      <header className="sheet-head row">
        <div>
          <h2>Today</h2>
          <p>Everything logged since midnight, newest first.</p>
        </div>
        <button type="button" className="btn ghost" onClick={onClearDemo}>
          Reset demo
        </button>
      </header>

      <form
        className="rename-row"
        onSubmit={(e) => {
          e.preventDefault()
          if (name.trim()) onRename(name.trim())
        }}
      >
        <Field label="Avatar name">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <button type="submit" className="btn">
          Save name
        </button>
      </form>

      {logs.length === 0 ? (
        <p className="empty">Nothing logged yet today. Start in the Log tab.</p>
      ) : (
        <ul className="log-list">
          {logs.map((log) => (
            <li key={log.id}>
              <div>
                <strong>{logLine(log)}</strong>
                <span className="meta">
                  {log.category} · {formatWhen(log.createdAt)}
                  {log.note ? ` · ${log.note}` : ''}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function logLine(log: DailyLog) {
  switch (log.category) {
    case 'food':
      return `${log.title} (${qualityLabel(log.quality)})`
    case 'drink':
      return `${log.title} × ${log.cups}`
    case 'exercise':
      return `${log.title} · ${log.minutes}m · ${log.effort}`
    case 'mood':
      return `Mood: ${log.level}`
    case 'meditation':
      return `Meditation · ${log.minutes}m`
  }
}

function JournalPanel({
  entries,
  onAdd,
  onDelete,
}: {
  entries: AppState['journal']
  onAdd: (title: string, body: string) => void
  onDelete: (id: string) => void
}) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  return (
    <section className="sheet">
      <header className="sheet-head">
        <h2>Journal</h2>
        <p>Longer thoughts — separate from quick logs. The avatar doesn’t over-read these.</p>
      </header>

      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault()
          if (!body.trim()) return
          onAdd(title.trim() || 'Untitled', body.trim())
          setTitle('')
          setBody('')
        }}
      >
        <Field label="Title">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Optional title"
          />
        </Field>
        <Field label="Entry">
          <textarea
            className="input area"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What do you want on the page?"
            required
          />
        </Field>
        <button type="submit" className="btn primary">
          Save entry
        </button>
      </form>

      <ul className="journal-list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <div className="journal-head">
              <div>
                <strong>{entry.title}</strong>
                <span className="meta">{formatWhen(entry.createdAt)}</span>
              </div>
              <button
                type="button"
                className="btn danger"
                onClick={() => {
                  if (confirm('Delete this journal entry?')) onDelete(entry.id)
                }}
              >
                Delete
              </button>
            </div>
            <p>{entry.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function GoalsPanel({
  goals,
  onSave,
}: {
  goals: Goal[]
  onSave: (goals: Goal[]) => void
}) {
  const weight = goals.find((g) => g.kind === 'weight')
  const [currentLbs, setCurrentLbs] = useState(weight?.kind === 'weight' ? weight.currentLbs : 300)
  const [targetLbs, setTargetLbs] = useState(weight?.kind === 'weight' ? weight.targetLbs : 220)
  const [note, setNote] = useState(weight?.note ?? '')
  const [habitTitle, setHabitTitle] = useState('Workouts')
  const [habitTarget, setHabitTarget] = useState(3)

  useEffect(() => {
    const w = goals.find((g) => g.kind === 'weight')
    if (w && w.kind === 'weight') {
      setCurrentLbs(w.currentLbs)
      setTargetLbs(w.targetLbs)
      setNote(w.note)
    }
  }, [goals])

  const habits = goals.filter((g) => g.kind === 'habit')

  return (
    <section className="sheet">
      <header className="sheet-head">
        <h2>Goals</h2>
        <p>
          Weight and habit aims shape how the avatar reads food and workouts — cheering progress,
          not shaming slips.
        </p>
      </header>

      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault()
          const others = goals.filter((g) => g.kind !== 'weight')
          const next: Goal = {
            id: weight?.id ?? createId(),
            kind: 'weight',
            createdAt: weight?.createdAt ?? nowISO(),
            currentLbs: Math.max(50, Number(currentLbs) || 0),
            targetLbs: Math.max(50, Number(targetLbs) || 0),
            note: note.trim(),
          }
          onSave([next, ...others])
        }}
      >
        <h3 className="subhead">Weight goal</h3>
        <div className="field-row">
          <Field label="Where you are (lbs)">
            <input
              className="input"
              type="number"
              min={50}
              max={800}
              value={currentLbs}
              onChange={(e) => setCurrentLbs(Number(e.target.value))}
            />
          </Field>
          <Field label="Where you’re headed (lbs)">
            <input
              className="input"
              type="number"
              min={50}
              max={800}
              value={targetLbs}
              onChange={(e) => setTargetLbs(Number(e.target.value))}
            />
          </Field>
        </div>
        <Field label="Note">
          <input
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Steady progress, not perfection."
          />
        </Field>
        <button type="submit" className="btn primary">
          Save weight goal
        </button>
        <p className="hint">
          Example: 300 → 220. Healthy meals and workouts earn proud / encouraged poses; heavy days
          get a sluggish shrug, not a scolding.
        </p>
      </form>

      <form
        className="form-grid stacked"
        onSubmit={(e) => {
          e.preventDefault()
          if (!habitTitle.trim()) return
          onSave([
            {
              id: createId(),
              kind: 'habit',
              createdAt: nowISO(),
              title: habitTitle.trim(),
              targetPerWeek: Math.max(1, Number(habitTarget) || 1),
              note: '',
            },
            ...goals,
          ])
        }}
      >
        <h3 className="subhead">Habit goal</h3>
        <div className="field-row">
          <Field label="Habit">
            <input
              className="input"
              value={habitTitle}
              onChange={(e) => setHabitTitle(e.target.value)}
              placeholder="Workouts, meditations…"
            />
          </Field>
          <Field label="Times / week">
            <input
              className="input"
              type="number"
              min={1}
              max={21}
              value={habitTarget}
              onChange={(e) => setHabitTarget(Number(e.target.value))}
            />
          </Field>
        </div>
        <button type="submit" className="btn">
          Add habit
        </button>
      </form>

      {habits.length > 0 ? (
        <ul className="log-list">
          {habits.map((h) =>
            h.kind === 'habit' ? (
              <li key={h.id}>
                <div>
                  <strong>
                    {h.title} · {h.targetPerWeek}× / week
                  </strong>
                  <span className="meta">Added {formatWhen(h.createdAt)}</span>
                </div>
                <button
                  type="button"
                  className="btn danger"
                  onClick={() => onSave(goals.filter((g) => g.id !== h.id))}
                >
                  Remove
                </button>
              </li>
            ) : null,
          )}
        </ul>
      ) : null}
    </section>
  )
}

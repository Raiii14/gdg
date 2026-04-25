import { useState } from 'react'
import type { Participant } from '../App'
import './ParticipantForm.css'

interface Props {
  onResolve: (participants: Participant[]) => void
  onBack: () => void
}

const PLACEHOLDERS = [
  "kahit saan basta masarap",
  "yung malapit lang, tinatamad ako",
  "gusto ko samgyup kaso wala akong pera",
  "basta 'wag yung kahapon",
  "anything basta may rice at aircon",
  "surprise me na lang, bahala ka",
  "yung instagrammable sana hehe",
  "budget meal lang, sweldo pa next week",
]

export default function ParticipantForm({ onResolve, onBack }: Props) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [name, setName] = useState('')
  const [rawInput, setRawInput] = useState('')
  const [placeholder] = useState(() =>
    PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  )

  const handleAdd = () => {
    if (!name.trim() || !rawInput.trim()) return
    setParticipants(prev => [...prev, { name: name.trim(), rawInput: rawInput.trim() }])
    setName('')
    setRawInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim() && rawInput.trim()) handleAdd()
  }

  return (
    <div className="pform fade-in">
      <button className="btn-back" onClick={onBack}>← Balik</button>
      <h2>👥 Sino-sino kakain?</h2>
      <p className="pform-sub">I-pass ang device. Isa-isa mag-input. Be honest... or don't. 😏</p>

      <div className="pform-inputs">
        <input
          className="pform-field"
          type="text"
          placeholder="Pangalan mo"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <textarea
          className="pform-field pform-textarea"
          placeholder={placeholder}
          value={rawInput}
          onChange={e => setRawInput(e.target.value)}
          rows={3}
        />
        <button
          className="btn-primary"
          onClick={handleAdd}
          disabled={!name.trim() || !rawInput.trim()}
          style={{ width: '100%' }}
        >
          ➕ Dagdag
        </button>
      </div>

      {participants.length > 0 && (
        <div className="pform-list">
          <h3>Mga Kakain ({participants.length})</h3>
          {participants.map((p, i) => (
            <div key={i} className="pform-card">
              <div>
                <strong>{p.name}</strong>
                <span className="pform-pref">"{p.rawInput}"</span>
              </div>
              <button className="pform-remove" onClick={() => setParticipants(prev => prev.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
        </div>
      )}

      {participants.length >= 2 ? (
        <button className="btn-primary resolve-btn" onClick={() => onResolve(participants)}>
          🔥 Resolve Na! ({participants.length} tao)
        </button>
      ) : participants.length > 0 ? (
        <p className="pform-hint">Dagdag pa ng at least 1 para maging debate 'to 😤</p>
      ) : null}
    </div>
  )
}

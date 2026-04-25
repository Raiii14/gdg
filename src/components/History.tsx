import { useEffect, useState } from 'react'
import { getSessions, type SessionData } from '../lib/supabase'
import './History.css'

interface Props {
  onBack: () => void
}

export default function History({ onBack }: Props) {
  const [sessions, setSessions] = useState<(SessionData & { id: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(err => console.error('Failed to load history:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="history fade-in">
      <button className="btn-back" onClick={onBack}>← Balik</button>
      <h2>📜 Hall of Verdicts</h2>
      <p className="history-sub">Lahat ng decisions na ginawa ng AI mediator</p>

      {loading && <p className="history-loading"><span className="spinner" /> Loading...</p>}

      {!loading && sessions.length === 0 && (
        <div className="history-empty">
          <p>Wala pang verdict. Mag-start ng session! 🍽️</p>
        </div>
      )}

      <div className="history-list">
        {sessions.map(s => (
          <div key={s.id} className="history-card">
            <div className="history-card-header">
              <h3>🏆 {s.verdict?.pick || 'Unknown'}</h3>
              <span className="history-date">
                {new Date(s.createdAt).toLocaleDateString('en-PH', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
            <p className="history-reason">{s.verdict?.reason}</p>
            <div className="history-people">
              {s.participants?.map((p, i) => (
                <span key={i} className="history-tag">{p.name}</span>
              ))}
            </div>
            {s.verdict?.blame && (
              <p className="history-blame">🫵 Kasalanan ni {s.verdict.blame.who}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

import type { SessionResult } from '../App'
import './Verdict.css'

interface Props {
  result: SessionResult
  onNewSession: () => void
  onShowHistory: () => void
}

export default function Verdict({ result, onNewSession, onShowHistory }: Props) {
  const v = result.verdict

  return (
    <div className="verdict fade-in">
      <div className="verdict-header">
        <span className="verdict-emoji">⚖️</span>
        <h2>The Verdict Is In!</h2>
      </div>

      <div className="verdict-card">
        <div className="verdict-pick">
          <span className="verdict-pick-label">Kainan Na Sa:</span>
          <h1 className="verdict-pick-name">{v?.pick || 'Jollibee na lang'}</h1>
          <span className="verdict-cuisine">{v?.cuisine} · {v?.estimated_budget}/person</span>
        </div>

        <div className="verdict-section">
          <h3>📋 Bakit dito?</h3>
          <p>{v?.reason}</p>
        </div>

        {v?.blame && (
          <div className="verdict-section verdict-blame">
            <h3>🫵 Kasalanan ni {v.blame.who}</h3>
            <p>{v.blame.why}</p>
          </div>
        )}

        {v?.backup_plan && (
          <div className="verdict-section">
            <h3>🔄 Backup Plan</h3>
            <p>{v.backup_plan}</p>
          </div>
        )}

        {v?.group_message && (
          <div className="verdict-section verdict-gc">
            <h3>📱 I-paste sa GC:</h3>
            <div className="verdict-gc-msg">{v.group_message}</div>
          </div>
        )}
      </div>

      <div className="verdict-participants">
        <h3>👥 Mga Nakisali ({result.participants.length})</h3>
        <div className="verdict-names">
          {result.participants.map((p, i) => (
            <span key={i} className="verdict-name-tag">{p.name}</span>
          ))}
        </div>
      </div>

      <div className="verdict-actions">
        <button className="btn-primary" onClick={onNewSession}>🔄 Bagong Session</button>
        <button className="btn-secondary" onClick={onShowHistory}>📜 Past Verdicts</button>
      </div>
    </div>
  )
}

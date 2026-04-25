import './Landing.css'

interface LandingProps {
  onStart: () => void
  onShowHistory: () => void
}

export default function Landing({ onStart, onShowHistory }: LandingProps) {
  return (
    <div className="landing">
      <div className="landing-hero fade-in">
        <span className="landing-emoji">🍽️</span>
        <h1 className="landing-title">Saan Tayo<br />Kakain?</h1>
        <p className="landing-tagline">
          The eternal Filipino debate,<br />finally solved by AI. 🤖
        </p>
        <p className="landing-desc">
          Walang makapag-decide? I-pass ang device, mag-input kayo isa-isa,
          tapos hayaan ang AI mediator mag-decide para sa inyo.
          <br /><br />
          <strong>3 steps:</strong> Interrogation → Negotiation → Verdict ⚖️
        </p>
      </div>

      <div className="landing-actions fade-in" style={{ animationDelay: '0.2s' }}>
        <button className="btn-primary" onClick={onStart}>
          🍗 Tara, Kain Na!
        </button>
        <button className="btn-secondary" onClick={onShowHistory}>
          📜 Past Verdicts
        </button>
      </div>

      <footer className="landing-footer fade-in" style={{ animationDelay: '0.4s' }}>
        Built for GDG Manila · Build with AI 2026 🇵🇭
      </footer>
    </div>
  )
}

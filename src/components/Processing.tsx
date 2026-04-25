import { useEffect, useRef, useState } from 'react'
import type { Participant, SessionResult } from '../App'
import { parsePreferences, negotiateConflicts, deliverVerdict } from '../lib/gemini'
import { saveSession } from '../lib/firebase'
import './Processing.css'

interface Props {
  participants: Participant[]
  onComplete: (result: SessionResult) => void
}

interface StepState {
  status: 'pending' | 'loading' | 'done' | 'error'
  result?: any
  error?: string
}

const STEP_INFO = [
  { emoji: '🔍', title: 'Ano ba talaga gusto mo?', desc: 'Bina-breakdown ang chaotic preferences nyo...' },
  { emoji: '⚔️', title: 'Negotiation Phase', desc: 'Hinahanap ang conflicts at compromises...' },
  { emoji: '🏆', title: 'The Verdict', desc: 'Nagde-decide na ang AI mediator...' },
]

export default function Processing({ participants, onComplete }: Props) {
  const [steps, setSteps] = useState<StepState[]>([
    { status: 'pending' },
    { status: 'pending' },
    { status: 'pending' },
  ])
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    runWorkflow()
  }, [])

  const updateStep = (index: number, update: StepState) => {
    setSteps(prev => prev.map((s, i) => (i === index ? update : s)))
  }

  const runWorkflow = async () => {
    try {
      // Step 1
      updateStep(0, { status: 'loading' })
      const parsed = await parsePreferences(participants)
      updateStep(0, { status: 'done', result: parsed })

      // Step 2
      updateStep(1, { status: 'loading' })
      const negotiation = await negotiateConflicts(parsed)
      updateStep(1, { status: 'done', result: negotiation })

      // Step 3
      updateStep(2, { status: 'loading' })
      const verdict = await deliverVerdict(negotiation, parsed)
      updateStep(2, { status: 'done', result: verdict })

      const session: SessionResult = {
        participants,
        steps: {
          step1: { result: parsed },
          step2: { result: negotiation },
          step3: { result: verdict },
        },
        verdict,
        createdAt: Date.now(),
      }

      // Save to Firebase (don't block on failure)
      saveSession(session).catch(err => console.warn('Firebase save failed:', err))

      setTimeout(() => onComplete(session), 1200)
    } catch (err: any) {
      console.error('Workflow error:', err)
      // Mark current loading step as error
      setSteps(prev =>
        prev.map(s => (s.status === 'loading' ? { status: 'error', error: err.message || String(err) } : s))
      )
    }
  }

  return (
    <div className="processing fade-in">
      <h2>🤖 AI Mediator is Working...</h2>
      <p className="processing-sub">Sini-solve ang hindi kaya ng group chat nyo sa 45 minutes</p>

      <div className="steps">
        {STEP_INFO.map((info, i) => (
          <div key={i} className={`step step-${steps[i].status}`}>
            <div className="step-header">
              <span className="step-emoji">{info.emoji}</span>
              <div className="step-meta">
                <span className="step-label">Step {i + 1}</span>
                <h3>{info.title}</h3>
              </div>
              <span className="step-icon">
                {steps[i].status === 'pending' && '⏳'}
                {steps[i].status === 'loading' && <span className="spinner" />}
                {steps[i].status === 'done' && '✅'}
                {steps[i].status === 'error' && '❌'}
              </span>
            </div>

            {steps[i].status === 'loading' && (
              <p className="step-desc">{info.desc}</p>
            )}

            {steps[i].status === 'done' && steps[i].result && (
              <div className="step-result">
                {i === 0 && steps[i].result?.parsed?.map((p: any, j: number) => (
                  <p key={j} className="step-result-item"><strong>{p.name}:</strong> {p.summary}</p>
                ))}
                {i === 1 && (
                  <>
                    {steps[i].result?.conflicts?.map((c: string, j: number) => (
                      <p key={j} className="step-result-item">⚡ {c}</p>
                    ))}
                    {steps[i].result?.commentary && (
                      <p className="step-commentary">💬 {steps[i].result.commentary}</p>
                    )}
                  </>
                )}
                {i === 2 && <p className="step-result-item">Verdict ready! 🎉</p>}
              </div>
            )}

            {steps[i].status === 'error' && (
              <p className="step-error">Error: {steps[i].error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

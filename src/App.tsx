import { useState } from 'react'
import Landing from './components/Landing'
import ParticipantForm from './components/ParticipantForm'
import Processing from './components/Processing'
import Verdict from './components/Verdict'
import History from './components/History'
import './App.css'

export interface Participant {
  name: string
  rawInput: string
}

export interface SessionResult {
  participants: Participant[]
  steps: {
    step1: { result: any }
    step2: { result: any }
    step3: { result: any }
  }
  verdict: any
  createdAt: number
}

type Screen = 'landing' | 'input' | 'processing' | 'verdict' | 'history'

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null)

  return (
    <div className="app">
      {screen === 'landing' && (
        <Landing
          onStart={() => setScreen('input')}
          onShowHistory={() => setScreen('history')}
        />
      )}
      {screen === 'input' && (
        <ParticipantForm
          onResolve={(p) => { setParticipants(p); setScreen('processing') }}
          onBack={() => setScreen('landing')}
        />
      )}
      {screen === 'processing' && (
        <Processing
          participants={participants}
          onComplete={(result) => { setSessionResult(result); setScreen('verdict') }}
        />
      )}
      {screen === 'verdict' && sessionResult && (
        <Verdict
          result={sessionResult}
          onNewSession={() => { setParticipants([]); setSessionResult(null); setScreen('landing') }}
          onShowHistory={() => setScreen('history')}
        />
      )}
      {screen === 'history' && (
        <History onBack={() => setScreen('landing')} />
      )}
    </div>
  )
}

export default App

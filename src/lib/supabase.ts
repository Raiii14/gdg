import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('DEBUG Supabase:', {
  hasUrl: !!supabaseUrl,
  urlStart: supabaseUrl?.substring(0, 10),
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing! Check your .env.local or Vercel settings.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

export interface SessionData {
  createdAt: number;
  participants: { name: string; rawInput: string }[];
  steps: {
    step1: { result: any };
    step2: { result: any };
    step3: { result: any };
  };
  verdict: any;
}

export async function saveSession(session: SessionData): Promise<string> {
  const { data, error } = await supabase
    .from('sessions')
    .insert([
      {
        participants: session.participants,
        steps: session.steps,
        verdict: session.verdict,
        session_created_at: session.createdAt
      }
    ])
    .select()

  if (error) throw error
  return data[0].id
}

export async function getSessions(): Promise<(SessionData & { id: string })[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Supabase fetch error:', error)
    return []
  }

  return data.map(row => ({
    id: row.id,
    participants: row.participants,
    steps: row.steps,
    verdict: row.verdict,
    createdAt: row.session_created_at || new Date(row.created_at).getTime()
  }))
}

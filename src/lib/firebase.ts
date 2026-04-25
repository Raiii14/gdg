import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, query, limitToLast, orderByChild } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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
  const sessionsRef = ref(db, "sessions");
  const newRef = await push(sessionsRef, session);
  return newRef.key!;
}

export async function getSessions(): Promise<(SessionData & { id: string })[]> {
  const sessionsRef = query(ref(db, "sessions"), orderByChild("createdAt"), limitToLast(20));
  const snapshot = await get(sessionsRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data)
    .map(([id, val]) => ({ id, ...(val as SessionData) }))
    .reverse();
}

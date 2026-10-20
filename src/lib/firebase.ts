import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export function getDb(): Firestore | undefined {
  const apiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;
  const projectId = import.meta.env.PUBLIC_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) return undefined;
  if (!getApps().length) {
    app = initializeApp({
      apiKey,
      authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId,
      storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    });
  }
  if (!db) db = getFirestore();
  return db;
}

export interface RSVPData {
  nombre: string;
  asistencia: 'si' | 'no';
  grupo?: 'familia' | 'amistad' | '';
}

export async function submitRSVP(data: RSVPData): Promise<string> {
  const database = getDb();
  // Sin config de Firebase: guardado local como fallback para no bloquear la UX
  if (!database) {
    const key = `rsvp-local-${Date.now()}`;
    try {
      localStorage.setItem(key, JSON.stringify({ ...data, createdAt: new Date().toISOString() }));
    } catch { /* noop */ }
    await new Promise((r) => setTimeout(r, 600));
    return key;
  }
  const ref = await addDoc(collection(database, 'rsvps'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

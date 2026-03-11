import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtTAgtgCPSs483Gx0eZ1bpS1x8vrA2LSA",
  authDomain: "medipath-61a3d.firebaseapp.com",
  projectId: "medipath-61a3d",
  storageBucket: "medipath-61a3d.firebasestorage.app",
  messagingSenderId: "745858032358",
  appId: "1:745858032358:web:845dffbce7f3fe7a97d127",
  measurementId: "G-C6ZCEBBWEH",
};

// Initialize Firebase (client-side)
const app = initializeApp(firebaseConfig);
// Analytics will only work in browser with proper env, safe to call
getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export type UserRole = "admin" | "doctor" | "patient";

export interface AppUser {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: string;
}

const USERS_COLLECTION = "user";

export async function signInWithGooglePopup() {
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<AppUser>;
  return (data.role as UserRole | undefined) ?? null;
}

export async function saveUserWithRole(user: User, role: UserRole): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, user.uid);
  const now = new Date().toISOString();

  const payload: AppUser = {
    uid: user.uid,
    name: user.displayName ?? null,
    email: user.email ?? null,
    photoURL: user.photoURL ?? null,
    role,
    createdAt: now,
  };

  await setDoc(ref, payload, { merge: true });
}


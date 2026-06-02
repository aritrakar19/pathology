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
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase (client-side)
const app = initializeApp(firebaseConfig);
// Analytics will only work in browser with proper env, safe to call
getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export type UserRole = "admin" | "doctor" | "patient" | "user";

const VALID_ROLES: UserRole[] = ["admin", "doctor", "patient", "user"];

export function normalizeUserRole(role: string | null | undefined): UserRole {
  const normalized = role?.toLowerCase().trim() as UserRole | undefined;
  return normalized && VALID_ROLES.includes(normalized) ? normalized : "user";
}

export interface AppUser {
  uid: string;
  name: string | null;
  email: string | null;
  phone?: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: string;
}

const USERS_COLLECTION = "users";

export async function signInWithGooglePopup() {
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    console.log("[getUserRole] Fetching role for uid:", uid);
    console.log("[getUserRole] DB project:", db.app.options.projectId);
    const ref = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.log("[getUserRole] Document does not exist for uid:", uid);
      return null;
    }
    const data = snap.data() as Partial<AppUser>;
    const role = (data.role as string | undefined) ?? null;
    console.log("[getUserRole] Found role:", role);
    return role ? normalizeUserRole(role) : null;
  } catch (error) {
    console.error("[getUserRole] Error fetching user role from Firestore:", error);
    return null;
  }
}

export async function saveUserWithRole(user: User, role: UserRole, phone?: string): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, user.uid);
  const now = new Date().toISOString();

  const payload: AppUser = {
    uid: user.uid,
    name: user.displayName ?? null,
    email: user.email ?? null,
    phone: phone ?? null,
    photoURL: user.photoURL ?? null,
    role,
    createdAt: now,
  };

  await setDoc(ref, payload, { merge: true });
}


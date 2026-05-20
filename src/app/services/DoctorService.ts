import { collection, doc, getDocs, getDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export interface Doctor {
  doctorId: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  fee: number;
  available: boolean;
  active?: boolean; // some admin panels store as 'active'
  nextSlot: string;
  image: string;
  hospital: string;
  qualification: string;
  languages: string[];
}

const COLLECTION = "doctors";

export class DoctorService {
  static async getDoctors(): Promise<Doctor[]> {
    const q = query(collection(db, COLLECTION));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), doctorId: d.data().doctorId || d.id } as Doctor));
  }

  /** Returns only doctors where available===true OR active===true */
  static async getActiveDoctors(limit = 8): Promise<Doctor[]> {
    const snap = await getDocs(query(collection(db, COLLECTION)));
    const all = snap.docs.map(d => ({ ...d.data(), doctorId: d.data().doctorId || d.id } as Doctor));
    return all
      .filter(d => d.available === true || d.active === true)
      .slice(0, limit);
  }

  static subscribeToDoctors(callback: (doctors: Doctor[]) => void) {
    const q = query(collection(db, COLLECTION));
    return onSnapshot(q, (snap) => {
      const doctors = snap.docs.map(d => ({ ...d.data(), doctorId: d.data().doctorId || d.id } as Doctor));
      callback(doctors);
    });
  }

  /** Realtime subscription to active doctors only (up to `limit`) */
  static subscribeToActiveDoctors(callback: (doctors: Doctor[]) => void, limit = 8) {
    const q = query(collection(db, COLLECTION));
    return onSnapshot(q, (snap) => {
      const all = snap.docs.map(d => ({ ...d.data(), doctorId: d.data().doctorId || d.id } as Doctor));
      const active = all
        .filter(d => d.available === true || d.active === true)
        .slice(0, limit);
      callback(active);
    });
  }

  static async getDoctorById(doctorId: string): Promise<Doctor | null> {
    const docRef = doc(db, COLLECTION, doctorId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Doctor;
    }
    return null;
  }
}

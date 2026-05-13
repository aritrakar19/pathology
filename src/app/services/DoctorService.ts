import { collection, doc, getDocs, getDoc, query, onSnapshot } from "firebase/firestore";
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
    return snap.docs.map(doc => doc.data() as Doctor);
  }

  static subscribeToDoctors(callback: (doctors: Doctor[]) => void) {
    const q = query(collection(db, COLLECTION));
    return onSnapshot(q, (snap) => {
      const doctors = snap.docs.map(doc => doc.data() as Doctor);
      callback(doctors);
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

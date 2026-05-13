import { collection, doc, setDoc, getDocs, getDoc, query, where, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { db } from "../../firebase";

export interface Medicine {
  medicineId: string;
  name: string;
  genericName: string;
  manufacturer: string;
  price: number;
  originalPrice: number;
  dosage: string;
  type: string;
  inStock: boolean;
  stockCount: number;
  quantity: string;
  requiresPrescription: boolean;
  image: string;
  category: string;
}

const COLLECTION = "medicines";

export class PharmacyService {
  static async getMedicines(): Promise<Medicine[]> {
    const q = query(collection(db, COLLECTION));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as Medicine);
  }

  static subscribeToMedicines(callback: (medicines: Medicine[]) => void) {
    const q = query(collection(db, COLLECTION));
    return onSnapshot(q, (snap) => {
      const medicines = snap.docs.map(doc => doc.data() as Medicine);
      callback(medicines);
    });
  }

  static async reduceStock(medicineId: string, quantity: number): Promise<void> {
    const docRef = doc(db, COLLECTION, medicineId);
    await updateDoc(docRef, {
      stockCount: increment(-quantity)
    });
  }
}

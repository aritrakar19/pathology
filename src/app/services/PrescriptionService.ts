import { collection, doc, setDoc, getDocs, getDoc, query, where, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

export interface ExtractedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PrescriptionScan {
  scanId: string;
  userId: string;
  imageUrl: string;
  extractedText: string;
  medicines: ExtractedMedicine[];
  tests: string[];
  doctorName: string;
  hospitalClinic: string;
  diagnosis: string;
  notes: string;
  confidence: number;
  createdAt: string;
}

const COLLECTION = "prescriptionScans";

export class PrescriptionService {
  /**
   * Uploads the prescription image to Firebase Storage and returns the download URL.
   */
  static async uploadPrescriptionImage(userId: string, file: File): Promise<string> {
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `prescriptions/${userId}/${filename}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  /**
   * Saves the prescription scan details to Firestore.
   */
  static async saveScan(scan: Omit<PrescriptionScan, "scanId" | "createdAt">): Promise<PrescriptionScan> {
    const scanId = doc(collection(db, COLLECTION)).id;
    const newScan: PrescriptionScan = {
      ...scan,
      scanId,
      createdAt: new Date().toISOString(),
    };
    
    await setDoc(doc(db, COLLECTION, scanId), newScan);
    return newScan;
  }

  /**
   * Retrieves all prescription scans for a user.
   */
  static async getUserScans(userId: string): Promise<PrescriptionScan[]> {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as PrescriptionScan);
  }

  /**
   * Retrieves a specific scan by ID.
   */
  static async getScan(scanId: string): Promise<PrescriptionScan | null> {
    const docRef = doc(db, COLLECTION, scanId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as PrescriptionScan;
    }
    return null;
  }
}

import { collection, doc, setDoc, getDocs, getDoc, query, where, onSnapshot, orderBy, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";

export interface Report {
  reportId: string;
  bookingId: string;
  userId: string;
  patientName: string;
  testName: string;
  doctorId?: string;
  doctorName?: string;
  status: "Pending" | "Processing" | "Ready";
  fileUrl?: string;
  fileSize?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

const COLLECTION = "reports";

export class ReportService {
  static async createReport(data: Omit<Report, "reportId" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = doc(collection(db, COLLECTION));
    const now = new Date().toISOString();
    
    const newReport: Report = {
      ...data,
      reportId: docRef.id,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(docRef, newReport);
    return docRef.id;
  }

  static async getUserReports(userId: string): Promise<Report[]> {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as Report);
  }

  static subscribeToUserReports(userId: string, callback: (reports: Report[]) => void) {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
      const reports = snap.docs.map(doc => doc.data() as Report);
      callback(reports);
    });
  }

  static async getReportById(reportId: string): Promise<Report | null> {
    const docRef = doc(db, COLLECTION, reportId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Report;
    }
    return null;
  }

  static async uploadReportFile(file: File): Promise<string> {
    const storage = getStorage();
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `reports/${fileName}`);
    
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  static subscribeToAllReports(callback: (reports: Report[]) => void) {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      const reports = snap.docs.map(doc => doc.data() as Report);
      callback(reports);
    });
  }
}

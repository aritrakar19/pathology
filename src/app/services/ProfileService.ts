import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export interface UserProfile {
  uid: string;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
  role: string;
  photoURL?: string | null;
}

export class ProfileService {
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid: data.uid || uid,
        fullName: data.name || data.fullName || "User",
        phone: data.phone || "",
        email: data.email || "",
        createdAt: data.createdAt || new Date().toISOString(),
        role: data.role || "user",
        photoURL: data.photoURL || null,
      };
    }
    return null;
  }

  static async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, "users", uid);
    
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    if (data.fullName !== undefined) updateData.name = data.fullName; // Because firebase.ts saves it as `name`
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.photoURL !== undefined) updateData.photoURL = data.photoURL;

    await updateDoc(docRef, updateData);
  }
}

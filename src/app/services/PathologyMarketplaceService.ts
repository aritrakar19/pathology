import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  deleteDoc,
  collectionGroup,
} from "firebase/firestore";
import { db } from "../../firebase";

export interface PathologyCenter {
  id: string; // Typically matches admin user UID (pathologyId)
  name: string;
  logo?: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contact_number: string;
  whatsapp_number?: string;
  email: string;
  map_location?: string;
  home_collection_available: boolean;
  rating?: number;
  review_count?: number;
  created_at?: Date;
}

export interface DiagnosticTest {
  id: string;
  pathology_id: string; // Replaces center_id
  name: string;
  category: string;
  description: string;
  prep_instructions: string;
  report_delivery_time: string;
  original_price: number;
  discounted_price: number;
  home_collection_available: boolean;
  is_active: boolean;
  created_at?: Date;
}

export interface BookingSlot {
  id: string;
  pathology_id: string; // Replaces center_id
  time: string;
  bookingType: "center" | "home";
  capacity: number;
  booked: number;
  isActive: boolean;
  createdAt?: any;
}

export interface TestSlot {
  id?: string;
  time: string;
  bookingType: "center" | "home";
  capacity: number;
  booked: number;
  isActive: boolean;
}

const PATHOLOGIES_COL = "pathologies";
const TESTS_SUBCOL = "tests";
const SLOTS_SUBCOL = "slots";
const TEST_SLOTS_SUBCOL = "slots";

// ==============================
// PATHOLOGIES (Centers)
// ==============================

export async function getPathologyProfile(pathologyId: string): Promise<PathologyCenter | null> {
  const ref = doc(db, PATHOLOGIES_COL, pathologyId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    created_at: data.created_at?.toDate(),
  } as PathologyCenter;
}

export async function savePathologyProfile(pathologyId: string, center: Partial<PathologyCenter>): Promise<void> {
  const ref = doc(db, PATHOLOGIES_COL, pathologyId);
  await setDoc(ref, {
    ...center,
    id: pathologyId,
    created_at: center.created_at || serverTimestamp(),
  }, { merge: true });
}

export async function getAllPathologies(): Promise<PathologyCenter[]> {
  const snap = await getDocs(collection(db, PATHOLOGIES_COL));
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      created_at: data.created_at?.toDate(),
    } as PathologyCenter;
  });
}

// ==============================
// TESTS
// ==============================

export async function getTestsByPathology(pathologyId: string): Promise<DiagnosticTest[]> {
  const snap = await getDocs(collection(db, PATHOLOGIES_COL, pathologyId, TESTS_SUBCOL));
  return snap.docs.map(d => ({ ...d.data(), id: d.id }) as DiagnosticTest);
}

export async function getTestById(testId: string): Promise<DiagnosticTest | null> {
  // Using collectionGroup to find the test globally by ID
  const q = query(collectionGroup(db, TESTS_SUBCOL), where("id", "==", testId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { ...snap.docs[0].data(), id: snap.docs[0].id } as DiagnosticTest;
}

export async function saveDiagnosticTest(pathologyId: string, test: Omit<DiagnosticTest, "id" | "pathology_id">, testId?: string): Promise<void> {
  const id = testId || `TEST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const ref = doc(db, PATHOLOGIES_COL, pathologyId, TESTS_SUBCOL, id);
  await setDoc(ref, {
    ...test,
    id,
    pathology_id: pathologyId,
    created_at: serverTimestamp()
  }, { merge: true });
}

export async function deleteDiagnosticTest(pathologyId: string, testId: string): Promise<void> {
  await deleteDoc(doc(db, PATHOLOGIES_COL, pathologyId, TESTS_SUBCOL, testId));
}

// ==============================
// TEST SLOTS (pathologies/{pathologyId}/tests/{testId}/slots/{slotId})
// ==============================

export async function getTestSlots(pathologyId: string, testId: string): Promise<TestSlot[]> {
  const q = query(collection(db, PATHOLOGIES_COL, pathologyId, TESTS_SUBCOL, testId, TEST_SLOTS_SUBCOL));
  const snap = await getDocs(q);
  const slots = snap.docs.map(d => ({ ...d.data(), id: d.id }) as TestSlot);
  slots.sort((a, b) => a.time.localeCompare(b.time));
  return slots;
}

export async function saveTestSlot(pathologyId: string, testId: string, slot: Omit<TestSlot, "id">, slotId?: string): Promise<void> {
  const id = slotId || `TSLOT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const ref = doc(db, PATHOLOGIES_COL, pathologyId, TESTS_SUBCOL, testId, TEST_SLOTS_SUBCOL, id);
  await setDoc(ref, {
    ...slot,
    id,
  }, { merge: true });
}

export async function updateTestSlot(pathologyId: string, testId: string, slotId: string, updates: Partial<TestSlot>): Promise<void> {
  const ref = doc(db, PATHOLOGIES_COL, pathologyId, TESTS_SUBCOL, testId, TEST_SLOTS_SUBCOL, slotId);
  await updateDoc(ref, updates);
}

export async function deleteTestSlot(pathologyId: string, testId: string, slotId: string): Promise<void> {
  await deleteDoc(doc(db, PATHOLOGIES_COL, pathologyId, TESTS_SUBCOL, testId, TEST_SLOTS_SUBCOL, slotId));
}

export async function searchTestsGlobal(searchQuery: string): Promise<(DiagnosticTest & { center?: PathologyCenter })[]> {
  const q = query(collectionGroup(db, TESTS_SUBCOL), where("is_active", "==", true));
  const snap = await getDocs(q);
  
  let tests = snap.docs.map(d => ({ ...d.data(), id: d.id }) as DiagnosticTest);
  
  if (searchQuery) {
    const qL = searchQuery.toLowerCase();
    tests = tests.filter(t => t.name.toLowerCase().includes(qL) || t.category.toLowerCase().includes(qL));
  }

  // Fetch pathology profiles for these tests
  const pathologyIds = [...new Set(tests.map(t => t.pathology_id))];
  const pathologyMap: Record<string, PathologyCenter> = {};
  
  if (pathologyIds.length > 0) {
    // Note: Firestore 'in' query has a limit of 10. For scale, we'd chunk it.
    const chunks = [];
    for (let i = 0; i < pathologyIds.length; i += 10) {
        chunks.push(pathologyIds.slice(i, i + 10));
    }
    
    for (const chunk of chunks) {
        const cQ = query(collection(db, PATHOLOGIES_COL), where("id", "in", chunk));
        const cSnap = await getDocs(cQ);
        cSnap.docs.forEach(d => {
            pathologyMap[d.id] = d.data() as PathologyCenter;
        });
    }
  }

  // Optionally filter by center name if search matches center
  if (searchQuery) {
    const qL = searchQuery.toLowerCase();
    tests = tests.filter(t => {
      const p = pathologyMap[t.pathology_id];
      const pName = p ? p.name.toLowerCase() : "";
      return t.name.toLowerCase().includes(qL) || t.category.toLowerCase().includes(qL) || pName.includes(qL);
    });
  }

  return tests.map(t => ({
    ...t,
    center: pathologyMap[t.pathology_id]
  }));
}

// ==============================
// SLOTS
// ==============================

export async function getSlotsByPathology(pathologyId: string): Promise<BookingSlot[]> {
  const q = query(collection(db, PATHOLOGIES_COL, pathologyId, SLOTS_SUBCOL));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id }) as BookingSlot);
}

export async function saveSlot(pathologyId: string, slot: Omit<BookingSlot, "id" | "pathology_id" | "createdAt">, slotId?: string): Promise<void> {
  const id = slotId || `SLOT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const ref = doc(db, PATHOLOGIES_COL, pathologyId, SLOTS_SUBCOL, id);
  await setDoc(ref, {
    ...slot,
    id,
    pathology_id: pathologyId,
    createdAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateSlot(pathologyId: string, slotId: string, updates: Partial<BookingSlot>): Promise<void> {
  const ref = doc(db, PATHOLOGIES_COL, pathologyId, SLOTS_SUBCOL, slotId);
  await updateDoc(ref, updates);
}

export async function deleteSlot(pathologyId: string, slotId: string): Promise<void> {
  await deleteDoc(doc(db, PATHOLOGIES_COL, pathologyId, SLOTS_SUBCOL, slotId));
}

export async function decrementSlotCapacity(pathologyId: string, slotId: string): Promise<void> {
    const ref = doc(db, PATHOLOGIES_COL, pathologyId, SLOTS_SUBCOL, slotId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        const data = snap.data();
        if (data.capacity > 0) {
            await updateDoc(ref, { capacity: data.capacity - 1 });
        }
    }
}

export async function incrementSlotBooking(pathologyId: string, slotId: string): Promise<void> {
    const ref = doc(db, PATHOLOGIES_COL, pathologyId, SLOTS_SUBCOL, slotId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        const data = snap.data();
        if (data.booked < data.capacity) {
            await updateDoc(ref, { booked: data.booked + 1 });
        }
    }
}

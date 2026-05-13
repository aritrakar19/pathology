// ─── Mock Data for User Application ─────────────────────────────────────────

export interface TestPackage {
  id: string;
  name: string;
  description: string;
  testCount: number;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  popular: boolean;
  turnaround: string;
  image: string;
  testsIncluded: string[];
}

export interface Doctor {
  id: string;
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

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  price: number;
  originalPrice: number;
  dosage: string;
  type: string;
  inStock: boolean;
  quantity: string;
  requiresPrescription: boolean;
  image: string;
  category: string;
}

export interface HealthCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  testCount: number;
}

export interface UserBooking {
  id: string;
  testName: string;
  status: "Confirmed" | "Sample Collected" | "Processing" | "Report Ready" | "Delivered";
  date: string;
  time: string;
  type: "test" | "doctor" | "medicine";
  amount: number;
}

export interface Report {
  id: string;
  testName: string;
  date: string;
  status: "Ready" | "Processing" | "Pending";
  doctor: string;
  fileSize: string;
}

export interface HealthDataPoint {
  date: string;
  value: number;
}

export interface HealthTimeline {
  metric: string;
  unit: string;
  data: HealthDataPoint[];
  normal: { min: number; max: number };
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  icon: string;
}

// ─── Health Categories ──────────────────────────────────────────────────────

export const healthCategories: HealthCategory[] = [
  { id: "cat-1", name: "Blood Test", icon: "🩸", color: "#FF6B6B", testCount: 45 },
  { id: "cat-2", name: "Diabetes", icon: "💉", color: "#4ECDC4", testCount: 12 },
  { id: "cat-3", name: "Thyroid", icon: "🦋", color: "#45B7D1", testCount: 8 },
  { id: "cat-4", name: "Heart Health", icon: "❤️", color: "#FF8A65", testCount: 15 },
  { id: "cat-5", name: "Vitamin", icon: "☀️", color: "#FFD93D", testCount: 10 },
  { id: "cat-6", name: "Full Body", icon: "🏥", color: "#6C5CE7", testCount: 6 },
  { id: "cat-7", name: "Liver", icon: "🫁", color: "#A8E6CF", testCount: 9 },
  { id: "cat-8", name: "Kidney", icon: "🫘", color: "#DDA0DD", testCount: 7 },
];

// ─── Featured Test Packages ─────────────────────────────────────────────────

export const testPackages: TestPackage[] = [
  {
    id: "pkg-1",
    name: "Complete Health Checkup",
    description: "Comprehensive full body health screening with 70+ parameters covering vital organs, blood, urine, and more.",
    testCount: 72,
    price: 1499,
    originalPrice: 3999,
    discount: 63,
    category: "Full Body",
    popular: true,
    turnaround: "24-48 hours",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop",
    testsIncluded: ["CBC", "Lipid Profile", "Liver Function", "Kidney Function", "Thyroid", "Blood Sugar", "Urine Routine", "Iron Studies"],
  },
  {
    id: "pkg-2",
    name: "Diabetes Care Package",
    description: "Complete diabetes monitoring panel including HbA1c, fasting glucose, and post-prandial sugar levels.",
    testCount: 15,
    price: 699,
    originalPrice: 1499,
    discount: 53,
    category: "Diabetes",
    popular: true,
    turnaround: "12-24 hours",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop",
    testsIncluded: ["HbA1c", "Fasting Glucose", "Post Prandial Sugar", "Insulin", "C-Peptide"],
  },
  {
    id: "pkg-3",
    name: "Heart Health Package",
    description: "Advanced cardiac risk assessment with lipid profile, homocysteine, and hs-CRP markers.",
    testCount: 22,
    price: 1299,
    originalPrice: 2999,
    discount: 57,
    category: "Heart Health",
    popular: false,
    turnaround: "24-48 hours",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&h=300&fit=crop",
    testsIncluded: ["Lipid Profile", "Homocysteine", "hs-CRP", "Troponin", "BNP", "ECG"],
  },
  {
    id: "pkg-4",
    name: "Thyroid Profile",
    description: "Complete thyroid function assessment with T3, T4, TSH, and anti-thyroid antibodies.",
    testCount: 8,
    price: 499,
    originalPrice: 999,
    discount: 50,
    category: "Thyroid",
    popular: true,
    turnaround: "6-12 hours",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
    testsIncluded: ["T3", "T4", "TSH", "Anti-TPO", "Anti-TG"],
  },
  {
    id: "pkg-5",
    name: "Vitamin Deficiency Panel",
    description: "Check for essential vitamin and mineral deficiencies including Vitamin D, B12, Iron, and Calcium.",
    testCount: 12,
    price: 899,
    originalPrice: 1999,
    discount: 55,
    category: "Vitamin",
    popular: false,
    turnaround: "24-48 hours",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop",
    testsIncluded: ["Vitamin D", "Vitamin B12", "Iron", "Calcium", "Folate", "Zinc"],
  },
  {
    id: "pkg-6",
    name: "Women's Wellness Package",
    description: "Specialized health screening designed for women covering hormonal, thyroid, and reproductive health.",
    testCount: 35,
    price: 1799,
    originalPrice: 4499,
    discount: 60,
    category: "Full Body",
    popular: true,
    turnaround: "24-48 hours",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
    testsIncluded: ["CBC", "Thyroid", "Hormone Panel", "Pap Smear", "Calcium", "Vitamin D", "Iron"],
  },
];

// ─── Top Doctors ────────────────────────────────────────────────────────────

export const doctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Priya Sharma",
    specialty: "General Physician",
    experience: 12,
    rating: 4.8,
    reviewCount: 420,
    fee: 500,
    available: true,
    nextSlot: "Today, 3:00 PM",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    hospital: "MediPath City Hospital",
    qualification: "MBBS, MD",
    languages: ["English", "Hindi"],
  },
  {
    id: "doc-2",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    experience: 18,
    rating: 4.9,
    reviewCount: 680,
    fee: 800,
    available: true,
    nextSlot: "Today, 5:00 PM",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    hospital: "Heart Care Institute",
    qualification: "MBBS, MD, DM Cardiology",
    languages: ["English", "Hindi", "Tamil"],
  },
  {
    id: "doc-3",
    name: "Dr. Anita Desai",
    specialty: "Dermatologist",
    experience: 10,
    rating: 4.7,
    reviewCount: 350,
    fee: 600,
    available: false,
    nextSlot: "Tomorrow, 10:00 AM",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964f137?w=200&h=200&fit=crop&crop=face",
    hospital: "Skin & Care Clinic",
    qualification: "MBBS, MD Dermatology",
    languages: ["English", "Hindi", "Marathi"],
  },
  {
    id: "doc-4",
    name: "Dr. Vikram Singh",
    specialty: "Orthopedic",
    experience: 15,
    rating: 4.6,
    reviewCount: 290,
    fee: 700,
    available: true,
    nextSlot: "Today, 4:30 PM",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face",
    hospital: "Bone & Joint Center",
    qualification: "MBBS, MS Orthopedics",
    languages: ["English", "Hindi", "Punjabi"],
  },
  {
    id: "doc-5",
    name: "Dr. Meera Patel",
    specialty: "Pediatrician",
    experience: 8,
    rating: 4.9,
    reviewCount: 510,
    fee: 450,
    available: true,
    nextSlot: "Today, 6:00 PM",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=200&h=200&fit=crop&crop=face",
    hospital: "Children's Medical Center",
    qualification: "MBBS, MD Pediatrics",
    languages: ["English", "Hindi", "Gujarati"],
  },
  {
    id: "doc-6",
    name: "Dr. Arjun Reddy",
    specialty: "Neurologist",
    experience: 20,
    rating: 4.8,
    reviewCount: 380,
    fee: 1000,
    available: false,
    nextSlot: "Tomorrow, 11:00 AM",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face",
    hospital: "Neuro Sciences Institute",
    qualification: "MBBS, MD, DM Neurology",
    languages: ["English", "Hindi", "Telugu"],
  },
];

// ─── Medicines ──────────────────────────────────────────────────────────────

export const medicines: Medicine[] = [
  {
    id: "med-1",
    name: "Dolo 650",
    genericName: "Paracetamol 650mg",
    manufacturer: "Micro Labs",
    price: 35,
    originalPrice: 42,
    dosage: "650mg",
    type: "Tablet",
    inStock: true,
    quantity: "15 Tablets",
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
    category: "Pain Relief",
  },
  {
    id: "med-2",
    name: "Azithral 500",
    genericName: "Azithromycin 500mg",
    manufacturer: "Alembic Pharma",
    price: 98,
    originalPrice: 120,
    dosage: "500mg",
    type: "Tablet",
    inStock: true,
    quantity: "5 Tablets",
    requiresPrescription: true,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
    category: "Antibiotics",
  },
  {
    id: "med-3",
    name: "Pantop 40",
    genericName: "Pantoprazole 40mg",
    manufacturer: "Aristo Pharma",
    price: 65,
    originalPrice: 80,
    dosage: "40mg",
    type: "Tablet",
    inStock: true,
    quantity: "15 Tablets",
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=200&h=200&fit=crop",
    category: "Gastro",
  },
  {
    id: "med-4",
    name: "Shelcal 500",
    genericName: "Calcium + Vitamin D3",
    manufacturer: "Torrent Pharma",
    price: 155,
    originalPrice: 185,
    dosage: "500mg",
    type: "Tablet",
    inStock: true,
    quantity: "30 Tablets",
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop",
    category: "Supplements",
  },
  {
    id: "med-5",
    name: "Crocin Advance",
    genericName: "Paracetamol 500mg",
    manufacturer: "GSK",
    price: 28,
    originalPrice: 32,
    dosage: "500mg",
    type: "Tablet",
    inStock: false,
    quantity: "20 Tablets",
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&h=200&fit=crop",
    category: "Pain Relief",
  },
  {
    id: "med-6",
    name: "Metformin 500",
    genericName: "Metformin HCL 500mg",
    manufacturer: "USV Pharma",
    price: 45,
    originalPrice: 55,
    dosage: "500mg",
    type: "Tablet",
    inStock: true,
    quantity: "10 Tablets",
    requiresPrescription: true,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=200&h=200&fit=crop",
    category: "Diabetes",
  },
];

// ─── User Bookings ──────────────────────────────────────────────────────────

export const userBookings: UserBooking[] = [
  {
    id: "UB-001",
    testName: "Complete Blood Count",
    status: "Report Ready",
    date: "2026-05-12",
    time: "09:00 AM",
    type: "test",
    amount: 450,
  },
  {
    id: "UB-002",
    testName: "Thyroid Profile",
    status: "Processing",
    date: "2026-05-13",
    time: "10:30 AM",
    type: "test",
    amount: 499,
  },
  {
    id: "UB-003",
    testName: "Dr. Priya Sharma - Consultation",
    status: "Confirmed",
    date: "2026-05-14",
    time: "03:00 PM",
    type: "doctor",
    amount: 500,
  },
  {
    id: "UB-004",
    testName: "Medicines Order #4521",
    status: "Delivered",
    date: "2026-05-10",
    time: "11:00 AM",
    type: "medicine",
    amount: 340,
  },
];

// ─── Reports ────────────────────────────────────────────────────────────────

export const reports: Report[] = [
  { id: "RPT-001", testName: "Complete Blood Count", date: "2026-05-12", status: "Ready", doctor: "Dr. Priya Sharma", fileSize: "2.4 MB" },
  { id: "RPT-002", testName: "Lipid Profile", date: "2026-05-08", status: "Ready", doctor: "Dr. Rajesh Kumar", fileSize: "1.8 MB" },
  { id: "RPT-003", testName: "Thyroid Profile", date: "2026-05-13", status: "Processing", doctor: "Dr. Anita Desai", fileSize: "-" },
  { id: "RPT-004", testName: "Liver Function Test", date: "2026-05-05", status: "Ready", doctor: "Dr. Priya Sharma", fileSize: "3.1 MB" },
  { id: "RPT-005", testName: "Vitamin D Test", date: "2026-05-01", status: "Ready", doctor: "Dr. Meera Patel", fileSize: "1.2 MB" },
  { id: "RPT-006", testName: "HbA1c Test", date: "2026-05-14", status: "Pending", doctor: "Dr. Vikram Singh", fileSize: "-" },
];

// ─── Health Timeline ────────────────────────────────────────────────────────

export const healthTimelines: HealthTimeline[] = [
  {
    metric: "Blood Sugar (Fasting)",
    unit: "mg/dL",
    data: [
      { date: "Jan", value: 110 },
      { date: "Feb", value: 105 },
      { date: "Mar", value: 98 },
      { date: "Apr", value: 102 },
      { date: "May", value: 95 },
    ],
    normal: { min: 70, max: 100 },
  },
  {
    metric: "Hemoglobin",
    unit: "g/dL",
    data: [
      { date: "Jan", value: 13.2 },
      { date: "Feb", value: 13.5 },
      { date: "Mar", value: 14.0 },
      { date: "Apr", value: 13.8 },
      { date: "May", value: 14.2 },
    ],
    normal: { min: 13.0, max: 17.0 },
  },
];

// ─── Health Banners ─────────────────────────────────────────────────────────

export const banners: Banner[] = [
  {
    id: "ban-1",
    title: "Full Body Checkup",
    subtitle: "Get 63% off on comprehensive health screening",
    gradient: "from-[#1FAF9A] to-[#0E7C6B]",
    icon: "🏥",
  },
  {
    id: "ban-2",
    title: "Diabetes Screening",
    subtitle: "Early detection saves lives — Book now at ₹699",
    gradient: "from-[#45B7D1] to-[#2980B9]",
    icon: "💉",
  },
  {
    id: "ban-3",
    title: "Preventive Care",
    subtitle: "Stay healthy with regular checkups — 50% off",
    gradient: "from-[#6C5CE7] to-[#4834D4]",
    icon: "🛡️",
  },
];

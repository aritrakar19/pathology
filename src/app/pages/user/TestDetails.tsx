import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { auth, db } from "../../../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getSlotsByPathology, incrementSlotBooking, PathologyCenter, BookingSlot } from "../../services/PathologyMarketplaceService";
import { createBooking } from "../../services/firebaseBookingService";
import { MapPin, Clock, ArrowLeft, Home, Building, Star, CheckCircle, Info } from "lucide-react";

// Interface for pathologyTests
interface PathologyTest {
  id: string;
  tenantId?: string;
  branchId?: string;
  name: string;
  price: number;
  offerPrice: number;
  category: string;
  description: string;
  homeCollectionAvailable: boolean;
  prep_instructions?: string;
  report_delivery_time?: string;
}

export function TestDetails() {
  const { id: testId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [center, setCenter] = useState<PathologyCenter | null>(null);
  const [test, setTest] = useState<PathologyTest | null>(null);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [bookingType, setBookingType] = useState<"center" | "home">("center");
  
  // Patient Details
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!testId) return;
      console.log("Received testId:", testId);
      try {
        // Fetch test from pathologyTests
        const testRef = doc(db, "pathologyTests", testId);
        const testSnap = await getDoc(testRef);
        
        if (testSnap.exists()) {
            const testData = { id: testSnap.id, ...testSnap.data() } as PathologyTest;
            console.log("Fetched test document:", testData);
            setTest(testData);

            // Attempt to resolve center using tenantId
            let c: PathologyCenter | null = null;
            if (testData.tenantId) {
                // Try fetching directly by tenantId
                const centerRef = doc(db, "pathologies", testData.tenantId);
                const centerSnap = await getDoc(centerRef);
                if (centerSnap.exists()) {
                    c = { id: centerSnap.id, ...centerSnap.data() } as PathologyCenter;
                    console.log("Fetched center document (by tenantId directly):", c);
                } else {
                    // Try querying just in case tenantId is a field
                    const q = query(collection(db, "pathologies"), where("id", "==", testData.tenantId));
                    const qSnap = await getDocs(q);
                    if (!qSnap.empty) {
                        c = { id: qSnap.docs[0].id, ...qSnap.docs[0].data() } as PathologyCenter;
                        console.log("Fetched center document (by query):", c);
                    } else {
                        // Fallback: Check tenants collection
                        const tenantRef = doc(db, "tenants", testData.tenantId);
                        const tenantSnap = await getDoc(tenantRef);
                        if (tenantSnap.exists()) {
                            let centerData = tenantSnap.data();
                            
                            // Check if branchId exists and fetch branch details
                            if (testData.branchId) {
                                const branchRef = doc(db, "tenants", testData.tenantId, "branches", testData.branchId);
                                const branchSnap = await getDoc(branchRef);
                                if (branchSnap.exists()) {
                                    centerData = { ...centerData, ...branchSnap.data() };
                                }
                            }
                            
                            c = { id: testData.tenantId, ...centerData } as PathologyCenter;
                            console.log("Fetched center document from tenants/branches:", c);
                        } else {
                            // Check users collection just in case
                            const userRef = doc(db, "users", testData.tenantId);
                            const userSnap = await getDoc(userRef);
                            if (userSnap.exists()) {
                                c = { id: userSnap.id, ...userSnap.data() } as PathologyCenter;
                                console.log("Fetched center document from users:", c);
                            } else {
                                console.log("Center document not found for tenantId:", testData.tenantId);
                            }
                        }
                    }
                }
            }
            
            setCenter(c);

            // Load slots using tenantId if available
            if (testData.tenantId) {
                try {
                    const s = await getSlotsByPathology(testData.tenantId);
                    // Only show active and available slots
                    const available = s.filter(slot => slot.isActive === true && slot.capacity > (slot.booked || 0));
                    // Sort by time (since date was removed from interface by user)
                    available.sort((a, b) => a.time.localeCompare(b.time));
                    setSlots(available);
                } catch (slotErr) {
                    console.error("Could not fetch slots", slotErr);
                }
            }
        } else {
            console.log("Test not found in pathologyTests collection");
        }
      } catch (err) {
        console.error("Error loading test details", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [testId]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !test || !center) return;
    setIsBooking(true);
    
    try {
      const patientId = auth.currentUser?.uid || "guest";
      
      const bookingId = await createBooking({
        tenantId: center.id,
        patientId,
        serviceType: "test",
        testId: test.id,
        patientName,
        serviceName: test.name,
        bookingDate: new Date().toISOString().split("T")[0], // Assuming today since date was removed
        bookingTime: selectedSlot.time,
        amount: test.offerPrice,
        centerName: center.name,
        testName: test.name,
        bookingType: bookingType === "home" ? "home_collection" : "center_visit",
        slotId: selectedSlot.id,
        patientDetails: { age: patientAge, gender: patientGender }
      });
      
      await incrementSlotBooking(center.id, selectedSlot.id);
      
      navigate("/user/booking-success");
    } catch (err) {
      console.error("Booking failed", err);
      alert("Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-[#6B7C7B]">Loading details...</div>;
  if (!test) return <div className="p-10 text-center text-red-500">Test not found.</div>;
  
  // If center is missing, we still show test details but cannot book slots (since slots are tied to center).
  if (!center) {
      return (
          <div className="max-w-4xl mx-auto space-y-6 pb-20 p-6">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors mb-4">
                  <ArrowLeft className="w-4 h-4" /> Back to Search
              </button>
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">
                  Test found, but Center profile could not be resolved for booking.
              </div>
              <h1 className="text-2xl font-bold">{test.name}</h1>
              <p>{test.description}</p>
          </div>
      );
  }

  const filteredSlots = slots.filter(s => s.bookingType === bookingType);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      {/* Center Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E6F0EE] flex flex-col md:flex-row gap-6 items-start shadow-sm">
        <div className="w-24 h-24 bg-[#F4F8F7] rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#E6F0EE]">
          {center.logo ? (
            <img src={center.logo} alt={center.name} className="w-full h-full object-contain rounded-2xl p-2" />
          ) : (
            <Building className="w-10 h-10 text-[#1FAF9A] opacity-50" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-[#1C2B2A]">{center.name}</h1>
            {center.rating && (
              <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md text-sm font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> {center.rating}
              </span>
            )}
          </div>
          <p className="text-[#6B7C7B] text-sm mb-3">{center.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-[#6B7C7B]">
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {center.address}, {center.city}</div>
            <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Certified Lab</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Test Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E6F0EE] shadow-sm">
            <div className="mb-4">
              <span className="text-xs font-semibold text-[#1FAF9A] uppercase tracking-wider bg-[#1FAF9A]/10 px-3 py-1 rounded-full">{test.category}</span>
            </div>
            <h2 className="text-xl font-bold text-[#1C2B2A] mb-2">{test.name}</h2>
            <p className="text-[#6B7C7B] text-sm mb-6">{test.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F4F8F7] p-4 rounded-2xl border border-[#E6F0EE]">
                <Clock className="w-5 h-5 text-[#1FAF9A] mb-2" />
                <p className="text-xs text-[#6B7C7B] uppercase tracking-wider">Report in</p>
                <p className="font-semibold text-[#1C2B2A]">{test.report_delivery_time || "24 hrs"}</p>
              </div>
              <div className="bg-[#F4F8F7] p-4 rounded-2xl border border-[#E6F0EE]">
                <Info className="w-5 h-5 text-blue-500 mb-2" />
                <p className="text-xs text-[#6B7C7B] uppercase tracking-wider">Preparation</p>
                <p className="font-semibold text-[#1C2B2A] line-clamp-1" title={test.prep_instructions}>{test.prep_instructions || "No special prep"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#1C2B2A]">Select Booking Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer flex flex-col p-4 rounded-2xl border-2 transition-all ${bookingType === "center" ? "border-[#1FAF9A] bg-[#1FAF9A]/5" : "border-[#E6F0EE] hover:border-[#1FAF9A]/30"}`}>
                  <input type="radio" name="bType" className="hidden" checked={bookingType === "center"} onChange={() => { setBookingType("center"); setSelectedSlot(null); }} />
                  <Building className={`w-6 h-6 mb-2 ${bookingType === "center" ? "text-[#1FAF9A]" : "text-[#6B7C7B]"}`} />
                  <span className="font-semibold text-[#1C2B2A]">Center Visit</span>
                  <span className="text-xs text-[#6B7C7B]">Visit the lab</span>
                </label>

                {test.homeCollectionAvailable && center.home_collection_available ? (
                  <label className={`cursor-pointer flex flex-col p-4 rounded-2xl border-2 transition-all ${bookingType === "home" ? "border-[#1FAF9A] bg-[#1FAF9A]/5" : "border-[#E6F0EE] hover:border-[#1FAF9A]/30"}`}>
                    <input type="radio" name="bType" className="hidden" checked={bookingType === "home"} onChange={() => { setBookingType("home"); setSelectedSlot(null); }} />
                    <Home className={`w-6 h-6 mb-2 ${bookingType === "home" ? "text-[#1FAF9A]" : "text-[#6B7C7B]"}`} />
                    <span className="font-semibold text-[#1C2B2A]">Home Collection</span>
                    <span className="text-xs text-[#6B7C7B]">Sample collected at home</span>
                  </label>
                ) : (
                  <div className="flex flex-col p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed">
                    <Home className="w-6 h-6 mb-2 text-gray-400" />
                    <span className="font-semibold text-gray-500">Home Collection</span>
                    <span className="text-xs text-gray-400">Not Available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-bold text-[#1C2B2A]">Select Slot</h3>
              {filteredSlots.length === 0 ? (
                <div className="p-6 text-center bg-orange-50 text-orange-600 rounded-2xl border border-orange-100">
                  No slots available
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredSlots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-left transition-all ${selectedSlot?.id === slot.id ? "border-[#1FAF9A] bg-[#1FAF9A] text-white shadow-md" : "border-[#E6F0EE] hover:border-[#1FAF9A]/50 bg-white"}`}
                    >
                      <div className={`text-xs mb-1 opacity-80 font-medium`}>Today</div>
                      <div className={`font-bold`}>{slot.time}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E6F0EE] shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-[#1C2B2A] mb-4 border-b border-[#E6F0EE] pb-3">Booking Summary</h3>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#6B7C7B]">Test Price</span>
              <span className="line-through text-sm text-gray-400">₹{test.price}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-[#1C2B2A]">Discounted Price</span>
              <span className="text-xl font-bold text-[#1FAF9A]">₹{test.offerPrice}</span>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div className="space-y-3">
                <input 
                  type="text" placeholder="Patient Name" required
                  value={patientName} onChange={e => setPatientName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:ring-2 focus:ring-[#1FAF9A] text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" placeholder="Age" required
                    value={patientAge} onChange={e => setPatientAge(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:ring-2 focus:ring-[#1FAF9A] text-sm"
                  />
                  <select 
                    required value={patientGender} onChange={e => setPatientGender(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:ring-2 focus:ring-[#1FAF9A] text-sm"
                  >
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!selectedSlot || isBooking || !patientName || !patientAge || !patientGender}
                className="w-full py-3.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-bold shadow-lg shadow-[#1FAF9A]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isBooking ? "Confirming..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

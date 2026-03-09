import { Star, Clock, DollarSign, Award, Users, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { BookingProgress } from "../../components/BookingProgress";
import { useNavigate, useSearchParams } from "react-router";

const steps = ["Service", "Search", "Details", "Slot", "Patient Info", "Payment", "Confirm"];

export function DetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service") || "pathology";
  const id = searchParams.get("id") || "1";

  // Mock data based on service and id
  const getDetails = () => {
    if (service === "pathology") {
      return {
        name: "Complete Blood Count (CBC)",
        category: "Blood Test",
        price: "$25",
        duration: "4-6 hours",
        rating: 4.8,
        reviews: 1250,
        description: "A Complete Blood Count (CBC) is a comprehensive blood test that measures different components of blood including red blood cells, white blood cells, hemoglobin, hematocrit, and platelets. This test helps diagnose a variety of conditions including anemia, infection, and many other disorders.",
        preparation: [
          "Fasting is not required for this test",
          "Inform your doctor about any medications you're taking",
          "Wear a short-sleeved shirt for easy access to your arm",
          "Stay hydrated before the test",
        ],
        includes: [
          "Red Blood Cell Count",
          "White Blood Cell Count",
          "Hemoglobin",
          "Hematocrit",
          "Platelet Count",
          "Mean Corpuscular Volume",
        ],
        reportTime: "Results available within 4-6 hours",
      };
    } else if (service === "doctor") {
      return {
        name: "Dr. Sarah Johnson",
        category: "Cardiologist",
        price: "$80",
        duration: "30 min",
        rating: 4.9,
        reviews: 450,
        experience: "15 years",
        education: "MD, Cardiology - Harvard Medical School",
        description: "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology, heart disease management, and advanced diagnostic procedures.",
        specializations: [
          "Preventive Cardiology",
          "Heart Disease Management",
          "Hypertension Treatment",
          "Lipid Disorders",
          "Cardiac Risk Assessment",
          "ECG & Echocardiography",
        ],
        languages: ["English", "Spanish"],
        location: "Downtown Medical Center",
      };
    } else {
      return {
        name: "Downtown Medical Center",
        category: "Full Service",
        price: "$100",
        duration: "1-2 hours",
        rating: 4.8,
        reviews: 2100,
        location: "123 Main Street, Downtown",
        description: "State-of-the-art medical facility offering comprehensive diagnostic services, consultation rooms, and modern equipment for all your healthcare needs.",
        services: [
          "Pathology Lab",
          "Imaging Center",
          "Consultation Rooms",
          "Pharmacy",
          "Emergency Care",
          "Health Checkups",
        ],
        timing: "Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM",
      };
    }
  };

  const details = getDetails();

  const handleBookAppointment = () => {
    navigate(`/booking/slots?service=${service}&id=${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F7]">
      <BookingProgress currentStep={3} steps={steps} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center flex-shrink-0">
                  {service === "doctor" ? (
                    <span className="text-2xl font-bold text-white">
                      {details.name.split(" ")[1]?.[0] || "D"}
                    </span>
                  ) : (
                    <CheckCircle className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-[#1C2B2A] mb-2">
                    {details.name}
                  </h1>
                  <p className="text-lg text-[#6B7C7B]">{details.category}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[#FFC107] text-[#FFC107]" />
                  <span className="font-semibold text-[#1C2B2A] text-base">{details.rating}</span>
                  <span className="text-[#6B7C7B]">({details.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-[#6B7C7B]">
                  <Clock className="w-4 h-4" />
                  <span>{details.duration}</span>
                </div>
                {service === "doctor" && "experience" in details && (
                  <div className="flex items-center gap-1 text-[#6B7C7B]">
                    <Award className="w-4 h-4" />
                    <span>{details.experience} experience</span>
                  </div>
                )}
                {(service === "doctor" || service === "clinic") && "location" in details && (
                  <div className="flex items-center gap-1 text-[#6B7C7B]">
                    <MapPin className="w-4 h-4" />
                    <span>{details.location}</span>
                  </div>
                )}
              </div>

              {service === "doctor" && "education" in details && (
                <p className="text-[#6B7C7B] mb-4">
                  <span className="font-semibold text-[#1C2B2A]">Education:</span> {details.education}
                </p>
              )}

              <p className="text-[#6B7C7B] leading-relaxed">{details.description}</p>
            </div>

            {/* Price Card */}
            <div className="md:w-64 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl p-6 text-white flex-shrink-0">
              <div className="text-center mb-6">
                <p className="text-white/80 mb-2">Consultation Fee</p>
                <p className="text-4xl font-bold">{details.price}</p>
              </div>
              <button
                onClick={handleBookAppointment}
                className="w-full px-6 py-3 bg-white text-[#1FAF9A] rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {service === "pathology" && "preparation" in details && (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-[#1C2B2A] mb-4">
                  Test Preparation
                </h3>
                <div className="space-y-3">
                  {details.preparation.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#1FAF9A] flex-shrink-0 mt-0.5" />
                      <span className="text-[#6B7C7B]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service === "doctor" && "languages" in details && (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-[#1C2B2A] mb-4">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {details.languages.map((lang: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#E6F0EE] text-[#1C2B2A] rounded-lg"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {service === "clinic" && "timing" in details && (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-[#1C2B2A] mb-4">
                  Timings
                </h3>
                <p className="text-[#6B7C7B]">{details.timing}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {service === "pathology" && "includes" in details && (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-[#1C2B2A] mb-4">
                  Test Includes
                </h3>
                <div className="space-y-3">
                  {details.includes.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#1FAF9A]" />
                      <span className="text-[#6B7C7B]">{item}</span>
                    </div>
                  ))}
                </div>
                {"reportTime" in details && (
                  <div className="mt-6 pt-6 border-t border-[#E6F0EE]">
                    <p className="text-sm text-[#6B7C7B]">
                      <Clock className="w-4 h-4 inline mr-2" />
                      {details.reportTime}
                    </p>
                  </div>
                )}
              </div>
            )}

            {service === "doctor" && "specializations" in details && (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-[#1C2B2A] mb-4">
                  Specializations
                </h3>
                <div className="space-y-3">
                  {details.specializations.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#1FAF9A]" />
                      <span className="text-[#6B7C7B]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service === "clinic" && "services" in details && (
              <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-[#1C2B2A] mb-4">
                  Services Available
                </h3>
                <div className="space-y-3">
                  {details.services.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#1FAF9A]" />
                      <span className="text-[#6B7C7B]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#1C2B2A]">
              Patient Reviews
            </h3>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-[#FFC107] text-[#FFC107]" />
              <span className="font-semibold text-[#1C2B2A]">{details.rating}</span>
              <span className="text-[#6B7C7B]">({details.reviews} reviews)</span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { name: "John Doe", rating: 5, comment: "Excellent service! Very professional and thorough.", date: "2 days ago" },
              { name: "Jane Smith", rating: 5, comment: "Highly recommended. Great experience from start to finish.", date: "1 week ago" },
              { name: "Mike Johnson", rating: 4, comment: "Good service, but waiting time could be improved.", date: "2 weeks ago" },
            ].map((review, index) => (
              <div key={index} className="pb-4 border-b border-[#E6F0EE] last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-[#1C2B2A]">{review.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-[#FFC107] text-[#FFC107]"
                              : "text-[#E6F0EE]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-[#6B7C7B]">{review.date}</span>
                </div>
                <p className="text-[#6B7C7B]">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

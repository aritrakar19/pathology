import { TestTube, Stethoscope, Building2, ArrowRight } from "lucide-react";
import { BookingProgress } from "../../components/BookingProgress";
import { useNavigate } from "react-router";

const steps = ["Service", "Search", "Details", "Slot", "Patient Info", "Payment", "Confirm"];

export function ServiceSelectionPage() {
  const navigate = useNavigate();

  const services = [
    {
      id: "pathology",
      title: "Pathology Test",
      description: "Book diagnostic tests like blood work, imaging, and health screenings",
      icon: TestTube,
      color: "from-[#1FAF9A] to-[#0E7C6B]",
      features: ["200+ Tests Available", "Home Sample Collection", "Reports in 24hrs"],
    },
    {
      id: "doctor",
      title: "Doctor Appointment",
      description: "Consult with our experienced doctors across various specializations",
      icon: Stethoscope,
      color: "from-[#0E7C6B] to-[#1FAF9A]",
      features: ["30+ Specialists", "Video Consultation", "Same Day Booking"],
    },
    {
      id: "clinic",
      title: "Clinic Visit",
      description: "Schedule a visit to our diagnostic center for comprehensive care",
      icon: Building2,
      color: "from-[#1FAF9A] to-[#0E7C6B]",
      features: ["5 Locations", "Walk-in Available", "Full Health Checkups"],
    },
  ];

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/booking/search?service=${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F7]">
      <BookingProgress currentStep={1} steps={steps} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1C2B2A] mb-4">
            Choose Your Service
          </h1>
          <p className="text-lg text-[#6B7C7B] max-w-2xl mx-auto">
            Select the type of healthcare service you need to get started
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white border-2 border-[#E6F0EE] rounded-2xl p-8 hover:border-[#1FAF9A] hover:shadow-xl transition-all group cursor-pointer"
                onClick={() => handleServiceSelect(service.id)}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-[#1C2B2A] mb-3">
                  {service.title}
                </h3>

                <p className="text-[#6B7C7B] mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-[#6B7C7B]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1FAF9A]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center justify-center gap-2 group-hover:gap-4">
                  Select
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6 text-center">
          <p className="text-[#6B7C7B] mb-4">
            Not sure which service you need?
          </p>
          <button className="px-6 py-3 bg-[#E6F0EE] text-[#1FAF9A] rounded-xl hover:bg-[#1FAF9A] hover:text-white transition-all font-semibold">
            Talk to Our Health Advisor
          </button>
        </div>
      </div>
    </div>
  );
}

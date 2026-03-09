import { Target, Users, Award, Heart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#1C2B2A] mb-4">About MediPath</h1>
          <p className="text-xl text-[#6B7C7B] max-w-3xl mx-auto">
            Leading the way in modern pathology and diagnostic services with a commitment 
            to accuracy, speed, and patient care
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1706777280252-5de52771cf13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVjaG5vbG9neSUyMGlubm92YXRpb258ZW58MXx8fHwxNzcyNDgxNjk0fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Medical Technology"
              className="w-full h-auto"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#1C2B2A] mb-6">Our Story</h2>
            <p className="text-[#6B7C7B] mb-4">
              Founded in 2011, MediPath has grown from a small diagnostic center to one of 
              the most trusted names in pathology services. Our journey has been driven by 
              a singular mission: to provide accurate, fast, and accessible diagnostic 
              services to everyone.
            </p>
            <p className="text-[#6B7C7B] mb-4">
              With state-of-the-art technology and a team of highly qualified professionals, 
              we've conducted over 5 million tests, serving more than 50,000 patients across 
              multiple locations.
            </p>
            <p className="text-[#6B7C7B]">
              Today, we continue to innovate with digital health solutions, making healthcare 
              more accessible and convenient for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1C2B2A] mb-4">Our Core Values</h2>
            <p className="text-lg text-[#6B7C7B] max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Accuracy",
                description: "Precision in every test with 98% accuracy rate",
              },
              {
                icon: Users,
                title: "Patient First",
                description: "Your health and comfort are our top priorities",
              },
              {
                icon: Award,
                title: "Excellence",
                description: "Committed to the highest standards of quality",
              },
              {
                icon: Heart,
                title: "Care",
                description: "Compassionate service with a personal touch",
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1C2B2A] mb-2">{value.title}</h3>
                  <p className="text-[#6B7C7B]">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1C2B2A] mb-4">Our Expert Team</h2>
            <p className="text-lg text-[#6B7C7B] max-w-2xl mx-auto">
              Meet the professionals dedicated to your health
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Williams",
                role: "Chief Pathologist",
                credentials: "MD, PhD - 20+ years experience",
              },
              {
                name: "Dr. Michael Chen",
                role: "Head of Radiology",
                credentials: "MD, FRCR - 15+ years experience",
              },
              {
                name: "Dr. Emily Brown",
                role: "Laboratory Director",
                credentials: "PhD in Biochemistry - 18+ years experience",
              },
            ].map((member, index) => (
              <div key={index} className="bg-white border border-[#E6F0EE] rounded-2xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-24 h-24 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                  {member.name.charAt(3)}
                </div>
                <h3 className="text-xl font-semibold text-[#1C2B2A] mb-1">{member.name}</h3>
                <p className="text-[#1FAF9A] font-medium mb-2">{member.role}</p>
                <p className="text-sm text-[#6B7C7B]">{member.credentials}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-white/90">Years of Service</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-white/90">Happy Patients</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5M+</div>
              <div className="text-white/90">Tests Conducted</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-white/90">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1C2B2A] mb-4">Certifications & Accreditations</h2>
            <p className="text-lg text-[#6B7C7B] max-w-2xl mx-auto">
              Recognized by leading healthcare organizations
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {["NABL Accredited", "ISO 9001:2015", "CAP Certified", "HIPAA Compliant"].map(
              (cert, index) => (
                <div
                  key={index}
                  className="bg-[#F4F8F7] rounded-2xl p-6 text-center border-2 border-[#E6F0EE] hover:border-[#1FAF9A] transition-all"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold text-[#1C2B2A]">{cert}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

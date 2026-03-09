import { Link } from "react-router";
import {
  Activity,
  TestTube,
  FileText,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1C2B2A] leading-tight mb-6">
              Your Health, Our{" "}
              <span className="text-[#1FAF9A]">Priority</span>
            </h1>
            <p className="text-lg text-[#6B7C7B] mb-8">
              Advanced pathology and diagnostic services with fast, accurate results. 
              Book your tests online and access reports anytime, anywhere.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking/service-selection"
                className="px-8 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-xl hover:shadow-[#1FAF9A]/25 transition-all flex items-center gap-2"
              >
                Book Test Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/track-report"
                className="px-8 py-4 bg-white border-2 border-[#E6F0EE] text-[#1FAF9A] rounded-xl hover:border-[#1FAF9A] hover:shadow-lg transition-all"
              >
                Track Report
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <div className="text-3xl font-bold text-[#1FAF9A] mb-1">500+</div>
                <div className="text-sm text-[#6B7C7B]">Tests Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1FAF9A] mb-1">50K+</div>
                <div className="text-sm text-[#6B7C7B]">Happy Patients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1FAF9A] mb-1">24/7</div>
                <div className="text-sm text-[#6B7C7B]">Support</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1747224317356-6dd1a4a078fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwdGVjaG5vbG9neSUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NzI1MzA1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medical Dashboard"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-[#E6F0EE]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-[#6B7C7B]">Report in</div>
                  <div className="text-xl font-semibold text-[#1C2B2A]">4-6 Hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1C2B2A] mb-4">Our Services</h2>
            <p className="text-lg text-[#6B7C7B] max-w-2xl mx-auto">
              Comprehensive diagnostic solutions with state-of-the-art technology
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Blood Tests",
                description: "Complete blood count, lipid profile, diabetes screening, and more",
                image: "https://images.unsplash.com/photo-1656337426914-5e5ba162d606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMHRlc3QlMjBsYWJvcmF0b3J5JTIwZXF1aXBtZW50fGVufDF8fHx8MTc3MjUzMDUxMnww&ixlib=rb-4.1.0&q=80&w=1080",
                icon: TestTube,
              },
              {
                title: "X-Ray Imaging",
                description: "Digital radiography for accurate bone and tissue imaging",
                image: "https://images.unsplash.com/photo-1587010580103-fd86b8ea14ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHh4cmF5JTIwbWVkaWNhbCUyMGltYWdpbmd8ZW58MXx8fHwxNzcyNDcyNTMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
                icon: FileText,
              },
              {
                title: "MRI Scans",
                description: "Advanced magnetic resonance imaging for detailed diagnostics",
                image: "https://images.unsplash.com/photo-1620423855978-e5d74a7bef30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtcmklMjBzY2FubmVyJTIwbWFjaGluZXxlbnwxfHx8fDE3NzI1MzA1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
                icon: Activity,
              },
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-[#F4F8F7] rounded-2xl overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1C2B2A] mb-2">{service.title}</h3>
                    <p className="text-[#6B7C7B]">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1C2B2A] mb-4">Why Choose Us</h2>
            <p className="text-lg text-[#6B7C7B] max-w-2xl mx-auto">
              Experience the future of healthcare diagnostics
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Fast Reports",
                description: "Get your test results within 4-6 hours with our rapid processing",
              },
              {
                icon: Shield,
                title: "Secure Data",
                description: "Your health data is protected with bank-level encryption",
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "Certified pathologists and technicians with years of experience",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl border border-[#E6F0EE] hover:shadow-xl hover:border-[#1FAF9A] transition-all"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1C2B2A] mb-3">{feature.title}</h3>
                  <p className="text-[#6B7C7B]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-white/90">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-white/90">Types of Tests</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-white/90">Happy Patients</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-white/90">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1C2B2A] mb-4">What Our Patients Say</h2>
            <p className="text-lg text-[#6B7C7B] max-w-2xl mx-auto">
              Read experiences from our satisfied patients
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "John Anderson",
                role: "Patient",
                text: "Excellent service! Got my blood test results within 4 hours. The online booking system is so convenient.",
              },
              {
                name: "Maria Garcia",
                role: "Patient",
                text: "Very professional staff and state-of-the-art facilities. I highly recommend MediPath for all diagnostic needs.",
              },
              {
                name: "David Chen",
                role: "Patient",
                text: "The online report tracking feature is amazing. I can access my reports anytime from my phone.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#F4F8F7] p-8 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#1FAF9A] text-[#1FAF9A]" />
                  ))}
                </div>
                <p className="text-[#6B7C7B] mb-6">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-full flex items-center justify-center text-white text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1C2B2A]">{testimonial.name}</div>
                    <div className="text-sm text-[#6B7C7B]">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-white/90">
              Book your test today and experience premium healthcare services
            </p>
            <Link
              to="/book-test"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1FAF9A] rounded-xl hover:shadow-xl transition-all"
            >
              Book Test Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

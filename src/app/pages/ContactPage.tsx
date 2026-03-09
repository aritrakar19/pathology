import * as React from "react";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for contacting us! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1C2B2A] mb-4">Contact Us</h1>
          <p className="text-lg text-[#6B7C7B] max-w-2xl mx-auto">
            Have a question? We're here to help. Reach out to us anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white border border-[#E6F0EE] rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-[#1C2B2A] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#1C2B2A] mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1C2B2A] mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#1C2B2A] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1C2B2A] mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label className="block text-[#1C2B2A] mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg hover:shadow-[#1FAF9A]/25 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1C2B2A] mb-2">Phone</h3>
                  <p className="text-[#6B7C7B] mb-1">+1 (555) 123-4567</p>
                  <p className="text-[#6B7C7B]">+1 (555) 123-4568</p>
                  <p className="text-sm text-[#1FAF9A] mt-2">Available 24/7</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1C2B2A] mb-2">Email</h3>
                  <p className="text-[#6B7C7B] mb-1">support@medipath.com</p>
                  <p className="text-[#6B7C7B]">info@medipath.com</p>
                  <p className="text-sm text-[#1FAF9A] mt-2">Response within 2 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1C2B2A] mb-2">Address</h3>
                  <p className="text-[#6B7C7B] mb-1">123 Healthcare Avenue</p>
                  <p className="text-[#6B7C7B] mb-1">Medical District</p>
                  <p className="text-[#6B7C7B]">New York, NY 10001</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1C2B2A] mb-2">Working Hours</h3>
                  <p className="text-[#6B7C7B] mb-1">Monday - Friday: 7:00 AM - 10:00 PM</p>
                  <p className="text-[#6B7C7B] mb-1">Saturday: 8:00 AM - 8:00 PM</p>
                  <p className="text-[#6B7C7B]">Sunday: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-[#1FAF9A] mt-2">Emergency services 24/7</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-[#F4F8F7] border border-[#E6F0EE] rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[#1FAF9A] mx-auto mb-2" />
                <p className="text-[#6B7C7B]">Map View</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-semibold mb-4">Medical Emergency?</h3>
          <p className="text-white/90 mb-6">For urgent medical situations, please call our emergency hotline</p>
          <a
            href="tel:911"
            className="inline-block px-8 py-4 bg-white text-[#1FAF9A] rounded-xl hover:shadow-xl transition-all"
          >
            Emergency: 911
          </a>
        </div>
      </div>
    </div>
  );
}

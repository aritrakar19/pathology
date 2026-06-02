import React, { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import { getPathologyProfile, savePathologyProfile, PathologyCenter } from "../../services/PathologyMarketplaceService";
import { Building, Save, MapPin, Phone, Mail } from "lucide-react";

export function CenterProfile() {
  const [profile, setProfile] = useState<Partial<PathologyCenter>>({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contact_number: "",
    email: "",
    home_collection_available: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      // In production, use auth.currentUser?.uid
      const adminId = auth.currentUser?.uid || "tenant_001";
      const data = await getPathologyProfile(adminId);
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const adminId = auth.currentUser?.uid || "tenant_001";
      await savePathologyProfile(adminId, profile);
      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B2A]">Pathology Center Profile</h1>
          <p className="text-[#6B7C7B]">Manage your diagnostic center details for the marketplace.</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Building className="w-6 h-6 text-indigo-600" />
        </div>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1C2B2A]">Center Name</label>
              <input 
                type="text" name="name" required
                value={profile.name || ""} onChange={handleChange}
                className="w-full px-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1C2B2A]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7B]" />
                <input 
                  type="email" name="email" required
                  value={profile.email || ""} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1C2B2A]">Description</label>
            <textarea 
              name="description" rows={3}
              value={profile.description || ""} onChange={handleChange}
              className="w-full px-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]"
            ></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1C2B2A]">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7B]" />
                <input 
                  type="text" name="contact_number" required
                  value={profile.contact_number || ""} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1C2B2A]">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7B]" />
                <input 
                  type="text" name="whatsapp_number"
                  value={profile.whatsapp_number || ""} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1C2B2A] flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Location Details
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1C2B2A]">Address</label>
              <input 
                type="text" name="address" required
                value={profile.address || ""} onChange={handleChange}
                className="w-full px-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1C2B2A]">City</label>
                <input 
                  type="text" name="city" required
                  value={profile.city || ""} onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1C2B2A]">State</label>
                <input 
                  type="text" name="state" required
                  value={profile.state || ""} onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1C2B2A]">Pincode</label>
                <input 
                  type="text" name="pincode" required
                  value={profile.pincode || ""} onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#F4F8F7] border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[#E6F0EE]">
            <input 
              type="checkbox" 
              id="home_collection"
              name="home_collection_available"
              checked={profile.home_collection_available || false}
              onChange={handleChange}
              className="w-5 h-5 text-[#1FAF9A] rounded focus:ring-[#1FAF9A]"
            />
            <label htmlFor="home_collection" className="text-sm font-medium text-[#1C2B2A]">
              We offer Home Collection services
            </label>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

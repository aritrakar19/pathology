import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Camera,
  Plus,
  Trash2,
  Shield,
  Loader2,
  Save,
  X,
  ChevronRight,
  Heart,
  FileText,
  CreditCard,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { useUserProfile } from "../../context/ProfileContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router";

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
}

export function Profile() {
  const { profile, loadingProfile, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
  });

  const [familyMembers] = useState<FamilyMember[]>([
    { id: "fm-1", name: "Raj Johnson", relation: "Husband", age: 35, gender: "Male" },
    { id: "fm-2", name: "Arya Johnson", relation: "Daughter", age: 8, gender: "Female" },
  ]);

  const handleEditClick = () => {
    if (profile) {
      setEditForm({ fullName: profile.fullName || "", phone: profile.phone || "" });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateProfile(editForm);
    if (success) setIsEditing(false);
    setIsSaving(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/user-login");
    } catch {
      toast.error("Failed to log out");
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 bg-[#1FAF9A]/10 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#1FAF9A]" />
        </div>
        <p className="text-sm text-[#6B7C7B]">Loading your profile...</p>
      </div>
    );
  }

  const creationDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const menuSections = [
    {
      title: "Health",
      items: [
        { icon: FileText, label: "My Reports", sub: "View all test reports", path: "/user/reports", color: "text-[#1FAF9A]", bg: "bg-[#1FAF9A]/10" },
        { icon: Heart, label: "Lab Bookings", sub: "Track test orders", path: "/user/tracking", color: "text-blue-500", bg: "bg-blue-50" },
        { icon: Stethoscope, label: "My Appointments", sub: "Doctor appointments", path: "/user/my-appointments", color: "text-purple-500", bg: "bg-purple-50" },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: CreditCard, label: "Payment History", sub: "Past transactions", path: "/user/tracking", color: "text-purple-500", bg: "bg-purple-50" },
        { icon: Bell, label: "Notifications", sub: "Manage alerts", path: "/user/settings", color: "text-amber-500", bg: "bg-amber-50" },
        { icon: Settings, label: "Settings", sub: "App preferences", path: "/user/settings", color: "text-slate-500", bg: "bg-slate-100" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & Support", sub: "Get assistance", path: "/user/settings", color: "text-teal-500", bg: "bg-teal-50" },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-8">

      {/* ── PROFILE HEADER CARD ─────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-3xl p-6 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold text-white uppercase border-2 border-white/30">
              {profile?.fullName?.charAt(0) || "U"}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#1FAF9A] shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{profile?.fullName || "User"}</h1>
            <p className="text-white/70 text-xs mt-0.5 truncate">{profile?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Shield className="w-3.5 h-3.5 text-green-300" />
              <span className="text-xs text-green-200 font-semibold">Verified Account</span>
            </div>
            <p className="text-white/60 text-[11px] mt-1">ID: MP-{profile?.uid?.substring(0, 8)}</p>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="flex-shrink-0 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-all"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── EDIT FORM (when editing) ─────────────────────────────────── */}
      {isEditing && (
        <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#1C2B2A]">Edit Profile</h3>
            <button onClick={() => setIsEditing(false)} className="w-8 h-8 flex items-center justify-center text-[#6B7C7B] hover:bg-[#F4F8F7] rounded-xl transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full border-2 border-[#E6F0EE] focus:border-[#1FAF9A] rounded-xl px-4 py-3 text-sm text-[#1C2B2A] focus:outline-none transition-all"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7C7B] uppercase tracking-wider mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full border-2 border-[#E6F0EE] focus:border-[#1FAF9A] rounded-xl px-4 py-3 text-sm text-[#1C2B2A] focus:outline-none transition-all"
                placeholder="+91 00000 00000"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 border-2 border-[#E6F0EE] text-[#6B7C7B] rounded-2xl font-semibold text-sm hover:bg-[#F4F8F7] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-[#1FAF9A]/25 disabled:opacity-50 transition-all"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ── PERSONAL INFO ROWS ────────────────────────────────────────── */}
      {!isEditing && (
        <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E6F0EE]">
            <h3 className="font-bold text-[#1C2B2A] text-sm">Personal Information</h3>
          </div>
          {[
            { icon: User, label: "Full Name", value: profile?.fullName || "Not provided" },
            { icon: Mail, label: "Email", value: profile?.email || "Not provided" },
            { icon: Phone, label: "Phone", value: profile?.phone || "Not provided" },
            { icon: Calendar, label: "Member Since", value: creationDate },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-4 py-4 border-b border-[#E6F0EE]/50 last:border-0">
              <div className="w-9 h-9 bg-[#F4F8F7] rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#1FAF9A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#6B7C7B] font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-[#1C2B2A] mt-0.5 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── FAMILY MEMBERS ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E6F0EE] flex items-center justify-between">
          <h3 className="font-bold text-[#1C2B2A] text-sm">Family Members</h3>
          <span className="text-xs text-[#6B7C7B]">{familyMembers.length} added</span>
        </div>
        {familyMembers.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-4 px-4 py-4 border-b border-[#E6F0EE]/50 last:border-0"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-[#1FAF9A]/15 to-[#0E7C6B]/10 rounded-xl flex items-center justify-center text-base font-bold text-[#1FAF9A] flex-shrink-0">
              {m.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#1C2B2A] text-sm">{m.name}</h4>
              <p className="text-xs text-[#6B7C7B] mt-0.5">{m.relation} · {m.age} yrs · {m.gender}</p>
            </div>
            <button className="w-9 h-9 flex items-center justify-center text-[#6B7C7B] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button className="w-full flex items-center justify-center gap-2 py-4 text-sm text-[#1FAF9A] font-semibold hover:bg-[#F4F8F7] transition-colors border-t border-dashed border-[#E6F0EE]">
          <Plus className="w-4 h-4" /> Add Family Member
        </button>
      </div>

      {/* ── MENU SECTIONS ─────────────────────────────────────────────── */}
      {menuSections.map((section) => (
        <div key={section.title} className="bg-white rounded-2xl border border-[#E6F0EE] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E6F0EE]">
            <h3 className="font-bold text-[#6B7C7B] text-xs uppercase tracking-wider">{section.title}</h3>
          </div>
          {section.items.map(({ icon: Icon, label, sub, path, color, bg }) => (
            <Link
              key={label}
              to={path}
              className="flex items-center gap-4 px-4 py-4 border-b border-[#E6F0EE]/50 last:border-0 hover:bg-[#F4F8F7] transition-colors active:bg-[#F4F8F7]"
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1C2B2A] text-sm">{label}</p>
                <p className="text-xs text-[#6B7C7B] mt-0.5">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6B7C7B] flex-shrink-0" />
            </Link>
          ))}
        </div>
      ))}

      {/* ── LOGOUT ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-50 transition-colors active:bg-red-50"
        >
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-red-500 text-sm">Log Out</p>
            <p className="text-xs text-red-400 mt-0.5">Sign out of your account</p>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0" />
        </button>
      </div>

      {/* App version */}
      <p className="text-center text-xs text-[#6B7C7B] pb-2">MediPath v2.0 · Healthcare Platform</p>
    </div>
  );
}

import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit3, Camera, Plus, Trash2, Shield, Loader2, Save, X } from "lucide-react";
import { useUserProfile } from "../../context/ProfileContext";

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
}

export function Profile() {
  const { profile, loadingProfile, updateProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<"personal" | "family">("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
  });

  const [familyMembers] = useState<FamilyMember[]>([
    { id: "fm-1", name: "Raj Johnson", relation: "Husband", age: 35, gender: "Male" },
    { id: "fm-2", name: "Arya Johnson", relation: "Daughter", age: 8, gender: "Female" },
  ]);

  // Sync form when editing starts
  const handleEditClick = () => {
    if (profile) {
      setEditForm({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateProfile(editForm);
    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#1FAF9A]" />
      </div>
    );
  }

  const creationDate = profile?.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center text-3xl text-white font-bold uppercase">
              {profile?.fullName?.charAt(0) || "U"}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-[#E6F0EE] rounded-full flex items-center justify-center text-[#6B7C7B] hover:text-[#1FAF9A] shadow-sm">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-[#1C2B2A]">{profile?.fullName || "User"}</h1>
            <p className="text-sm text-[#6B7C7B]">Patient ID: MP-{profile?.uid?.substring(0, 8)}</p>
            <div className="flex items-center gap-1 mt-1 justify-center sm:justify-start">
              <Shield className="w-3.5 h-3.5 text-[#1FAF9A]" />
              <span className="text-xs text-[#1FAF9A] font-medium">Verified Account</span>
            </div>
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-[#E6F0EE] text-[#6B7C7B] rounded-xl text-sm font-medium hover:bg-[#F4F8F7] transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                Save
              </button>
            </div>
          ) : (
            <button 
              onClick={handleEditClick}
              className="px-4 py-2 border border-[#E6F0EE] text-[#1FAF9A] rounded-xl text-sm font-medium hover:border-[#1FAF9A] transition-all flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab("personal")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "personal" ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white" : "bg-white border border-[#E6F0EE] text-[#6B7C7B]"}`}>
          Personal Info
        </button>
        <button onClick={() => setActiveTab("family")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "family" ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white" : "bg-white border border-[#E6F0EE] text-[#6B7C7B]"}`}>
          Family Members
        </button>
      </div>

      {activeTab === "personal" ? (
        <div className="bg-white rounded-2xl border border-[#E6F0EE] p-6 space-y-5">
          {[
            { id: "fullName", icon: User, label: "Full Name", value: profile?.fullName || "", editable: true },
            { id: "email", icon: Mail, label: "Email Address", value: profile?.email || "", editable: false },
            { id: "phone", icon: Phone, label: "Phone Number", value: profile?.phone || "", editable: true },
            { id: "createdAt", icon: Calendar, label: "Account Created", value: creationDate, editable: false },
          ].map((item) => {
            const Icon = item.icon;
            const canEdit = isEditing && item.editable;
            
            return (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-[#E6F0EE] last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-[#F4F8F7] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#1FAF9A]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#6B7C7B]">{item.label}</p>
                  {canEdit ? (
                    <input 
                      type="text"
                      value={editForm[item.id as keyof typeof editForm]}
                      onChange={(e) => setEditForm(prev => ({ ...prev, [item.id]: e.target.value }))}
                      className="w-full mt-1 border border-[#1FAF9A] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAF9A]/20"
                    />
                  ) : (
                    <p className={`text-sm font-medium ${!item.value ? "text-gray-400 italic" : "text-[#1C2B2A]"}`}>
                      {item.value || "Not provided"}
                      {!item.editable && isEditing && (
                        <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Read Only</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {familyMembers.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-[#E6F0EE] p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A]/20 to-[#0E7C6B]/20 rounded-xl flex items-center justify-center text-lg font-bold text-[#1FAF9A]">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1C2B2A] text-sm">{m.name}</h3>
                  <p className="text-xs text-[#6B7C7B]">{m.relation} • {m.age} yrs • {m.gender}</p>
                </div>
              </div>
              <button className="p-2 text-[#6B7C7B] hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button className="w-full py-4 border-2 border-dashed border-[#E6F0EE] rounded-2xl text-sm text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Family Member
          </button>
        </div>
      )}
    </div>
  );
}

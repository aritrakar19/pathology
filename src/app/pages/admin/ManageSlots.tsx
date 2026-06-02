import React, { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import { getSlotsByPathology, saveSlot, updateSlot, deleteSlot, BookingSlot } from "../../services/PathologyMarketplaceService";
import { Plus, Trash2, Clock, Users, Edit, Home, Building2, ChevronUp, ChevronDown, Activity } from "lucide-react";

export function ManageSlots() {
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  
  const [newSlot, setNewSlot] = useState<Partial<BookingSlot>>({
    time: "09:00",
    bookingType: "center",
    capacity: 10,
    booked: 0,
    isActive: true,
  });

  const loadSlots = async () => {
    setLoading(true);
    const adminId = auth.currentUser?.uid || "tenant_001";
    const data = await getSlotsByPathology(adminId);
    // Sort by time
    data.sort((a, b) => a.time.localeCompare(b.time));
    setSlots(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setNewSlot(prev => ({ ...prev, [name]: checked }));
    } else {
      setNewSlot(prev => ({
        ...prev,
        [name]: name === "capacity" || name === "booked" ? Number(value) : value
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminId = auth.currentUser?.uid || "tenant_001";
    
    if (editingSlotId) {
      await updateSlot(adminId, editingSlotId, newSlot);
    } else {
      const slotToSave = {
        ...newSlot,
        pathology_id: adminId,
        booked: 0,
        isActive: newSlot.isActive ?? true,
      } as Omit<BookingSlot, "id" | "createdAt">;
      await saveSlot(adminId, slotToSave);
    }
    
    setIsModalOpen(false);
    setEditingSlotId(null);
    loadSlots();
  };

  const handleEdit = (slot: BookingSlot) => {
    setNewSlot(slot);
    setEditingSlotId(slot.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this slot?")) {
      const adminId = auth.currentUser?.uid || "tenant_001";
      await deleteSlot(adminId, id);
      loadSlots();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const adminId = auth.currentUser?.uid || "tenant_001";
    await updateSlot(adminId, id, { isActive: !currentStatus });
    setSlots(slots.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
  };

  const updateCapacity = async (id: string, currentCapacity: number, change: number) => {
    const newCapacity = currentCapacity + change;
    if (newCapacity < 1) return;
    const adminId = auth.currentUser?.uid || "tenant_001";
    await updateSlot(adminId, id, { capacity: newCapacity });
    setSlots(slots.map(s => s.id === id ? { ...s, capacity: newCapacity } : s));
  };

  if (loading) return <div className="p-6">Loading slots...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B2A]">Slot Management</h1>
          <p className="text-[#6B7C7B]">Create and manage booking slots for your center and home collection.</p>
        </div>
        <button 
          onClick={() => {
            setNewSlot({ time: "09:00", bookingType: "center", capacity: 10, isActive: true });
            setEditingSlotId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> Add Slot
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white border border-[#E6F0EE] rounded-2xl">
            <Clock className="w-12 h-12 text-[#6B7C7B] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-[#1C2B2A]">No slots configured</h3>
            <p className="text-[#6B7C7B]">Add your available timings to start receiving bookings.</p>
          </div>
        ) : slots.map(slot => (
          <div key={slot.id} className={`bg-white border rounded-2xl p-5 hover:shadow-md transition-shadow relative overflow-hidden ${slot.isActive ? 'border-[#E6F0EE]' : 'border-gray-200 opacity-75'}`}>
            {/* Status indicator bar on the left edge */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${slot.isActive ? 'bg-[#1FAF9A]' : 'bg-gray-300'}`}></div>
            
            <div className="flex items-start justify-between mb-4 pl-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${slot.bookingType === 'home' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  {slot.bookingType === 'home' ? <Home className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-[#1C2B2A]">{slot.time}</h3>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${slot.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {slot.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(slot)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(slot.id!)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="pl-2 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="px-2.5 py-1 bg-[#F4F8F7] text-[#6B7C7B] rounded-lg font-medium flex items-center gap-1.5">
                  {slot.bookingType === 'center' ? 'Center Visit' : 'Home Collection'}
                </span>
                <button 
                  onClick={() => toggleActive(slot.id!, slot.isActive)}
                  className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded-md transition-colors ${slot.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  {slot.isActive ? 'Disable' : 'Enable'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Booked</span>
                  <span className="text-lg font-bold text-[#1C2B2A]">{slot.booked}</span>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Capacity</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCapacity(slot.id!, slot.capacity, -1)} className="p-1 text-gray-400 hover:text-gray-700 bg-white rounded shadow-sm border border-gray-100"><ChevronDown className="w-4 h-4" /></button>
                    <span className="text-lg font-bold text-[#1C2B2A] w-6 text-center">{slot.capacity}</span>
                    <button onClick={() => updateCapacity(slot.id!, slot.capacity, 1)} className="p-1 text-gray-400 hover:text-gray-700 bg-white rounded shadow-sm border border-gray-100"><ChevronUp className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-[#E6F0EE] h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${slot.booked >= slot.capacity ? 'bg-red-500' : 'bg-[#1FAF9A] transition-all duration-500'}`}
                  style={{ width: `${Math.min((slot.booked / slot.capacity) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-[#1C2B2A] mb-4">{editingSlotId ? 'Edit Slot' : 'Add New Slot'}</h2>
            <form onSubmit={handleSave} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="time" name="time" required value={newSlot.time} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 focus:border-[#1FAF9A] focus:ring-1 focus:ring-[#1FAF9A] rounded-xl outline-none transition-all" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Booking Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 py-2.5 border rounded-xl cursor-pointer transition-all ${newSlot.bookingType === 'center' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" name="bookingType" value="center" checked={newSlot.bookingType === 'center'} onChange={handleChange} className="hidden" />
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium text-sm">Center Visit</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 py-2.5 border rounded-xl cursor-pointer transition-all ${newSlot.bookingType === 'home' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" name="bookingType" value="home" checked={newSlot.bookingType === 'home'} onChange={handleChange} className="hidden" />
                    <Home className="w-4 h-4" />
                    <span className="font-medium text-sm">Home</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Capacity (Total seats)</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" name="capacity" min="1" required value={newSlot.capacity} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 focus:border-[#1FAF9A] focus:ring-1 focus:ring-[#1FAF9A] rounded-xl outline-none transition-all" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="space-y-0.5">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <p className="text-xs text-gray-500">Enable or disable this slot</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isActive" checked={newSlot.isActive} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1FAF9A]"></div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingSlotId(null); }} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-medium hover:shadow-lg transition-all">{editingSlotId ? 'Save Changes' : 'Create Slot'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import { getTestsByPathology, saveDiagnosticTest, deleteDiagnosticTest, DiagnosticTest, TestSlot, getTestSlots, saveTestSlot, deleteTestSlot } from "../../services/PathologyMarketplaceService";
import { Plus, Edit2, Trash2, TestTube, Clock, Users, Home, Building2, ChevronUp, ChevronDown, Activity, X } from "lucide-react";

export function ManageTests() {
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingTest, setEditingTest] = useState<Partial<DiagnosticTest>>({
    name: "",
    category: "",
    description: "",
    prep_instructions: "",
    report_delivery_time: "",
    original_price: 0,
    discounted_price: 0,
    home_collection_available: false,
    is_active: true,
  });

  const [testSlots, setTestSlots] = useState<TestSlot[]>([]);
  const [deletedSlotIds, setDeletedSlotIds] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState<Partial<TestSlot>>({
    time: "09:00",
    bookingType: "center",
    capacity: 10,
    booked: 0,
    isActive: true,
  });
  const [isAddingSlot, setIsAddingSlot] = useState(false);

  const loadTests = async () => {
    setLoading(true);
    const adminId = auth.currentUser?.uid || "tenant_001";
    const data = await getTestsByPathology(adminId);
    setTests(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleOpenModal = async (test?: DiagnosticTest) => {
    if (test) {
      setEditingTest(test);
      const adminId = auth.currentUser?.uid || "tenant_001";
      const slots = await getTestSlots(adminId, test.id);
      setTestSlots(slots);
    } else {
      setEditingTest({
        name: "", category: "", description: "", prep_instructions: "",
        report_delivery_time: "", original_price: 0, discounted_price: 0,
        home_collection_available: false, is_active: true,
      });
      setTestSlots([]);
    }
    setDeletedSlotIds([]);
    setIsAddingSlot(false);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setEditingTest(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
              type === "number" ? Number(value) : value
    }));
  };

  const handleAddSlot = () => {
    if (!newSlot.time || !newSlot.capacity) return;
    const slotToAdd: TestSlot = {
      id: `TEMP-${Date.now()}`,
      time: newSlot.time!,
      bookingType: newSlot.bookingType as any,
      capacity: Number(newSlot.capacity),
      booked: 0,
      isActive: newSlot.isActive ?? true,
    };
    setTestSlots(prev => [...prev, slotToAdd].sort((a, b) => a.time.localeCompare(b.time)));
    setIsAddingSlot(false);
    setNewSlot({ time: "09:00", bookingType: "center", capacity: 10, booked: 0, isActive: true });
  };

  const handleRemoveSlot = (id: string) => {
    if (!id.startsWith("TEMP-")) {
      setDeletedSlotIds(prev => [...prev, id]);
    }
    setTestSlots(prev => prev.filter(s => s.id !== id));
  };

  const updateSlotInline = (id: string, updates: Partial<TestSlot>) => {
    setTestSlots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminId = auth.currentUser?.uid || "tenant_001";
    
    // If the user has a slot partially typed but hasn't clicked "Add", auto-add it before saving
    let finalSlots = [...testSlots];
    if (isAddingSlot && newSlot.time && newSlot.capacity) {
      finalSlots.push({
        id: `TEMP-${Date.now()}`,
        time: newSlot.time,
        bookingType: newSlot.bookingType as any,
        capacity: Number(newSlot.capacity),
        booked: 0,
        isActive: newSlot.isActive ?? true,
      });
    }

    // Generate an ID if it's a new test so we can link slots
    const testId = editingTest.id || `TEST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 1. Save Test
    await saveDiagnosticTest(adminId, {
      ...editingTest as DiagnosticTest
    }, testId);

    // 2. Process Slots (Save/Update)
    for (const slot of finalSlots) {
      const isNew = slot.id?.startsWith("TEMP-");
      const slotDataToSave = { ...slot };
      if (isNew) delete slotDataToSave.id;
      
      await saveTestSlot(adminId, testId, slotDataToSave, isNew ? undefined : slot.id);
    }

    // 3. Delete removed slots
    for (const id of deletedSlotIds) {
      await deleteTestSlot(adminId, testId, id);
    }

    setIsModalOpen(false);
    loadTests();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this test? All its slots will also be permanently inaccessible.")) {
      const adminId = auth.currentUser?.uid || "tenant_001";
      await deleteDiagnosticTest(adminId, id);
      loadTests();
    }
  };

  if (loading) return <div className="p-6">Loading tests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B2A]">Marketplace Tests</h1>
          <p className="text-[#6B7C7B]">Manage diagnostic tests available at your center.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> Add Test
        </button>
      </div>

      <div className="bg-white border border-[#E6F0EE] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-[#6B7C7B]">
          <thead className="bg-[#F4F8F7] text-[#1C2B2A] uppercase text-xs font-semibold border-b border-[#E6F0EE]">
            <tr>
              <th className="px-6 py-4">Test Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6F0EE]">
            {tests.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No tests added yet.</td></tr>
            ) : tests.map(test => (
              <tr key={test.id} className="hover:bg-[#F4F8F7]/50 transition-colors">
                <td className="px-6 py-4 font-medium text-[#1C2B2A] flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <TestTube className="w-4 h-4 text-purple-600" />
                  </div>
                  {test.name}
                </td>
                <td className="px-6 py-4">{test.category}</td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-[#1C2B2A]">₹{test.discounted_price}</span>
                  {test.original_price > test.discounted_price && (
                    <span className="text-xs line-through ml-2 text-gray-400">₹{test.original_price}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {test.is_active ? (
                    <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs font-medium border border-green-100">Active</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-200">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button onClick={() => handleOpenModal(test)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(test.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-8 shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-[#1C2B2A]">{editingTest.id ? "Edit Pathology Test" : "Create Pathology Test"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="test-form" onSubmit={handleSave} className="space-y-8">
                
                {/* 1. Basic Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1C2B2A] border-b pb-2">1. Test Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Test Name</label>
                      <input type="text" name="name" required value={editingTest.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 focus:border-[#1FAF9A] focus:ring-1 focus:ring-[#1FAF9A] rounded-xl outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Category</label>
                      <select name="category" required value={editingTest.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 focus:border-[#1FAF9A] focus:ring-1 focus:ring-[#1FAF9A] rounded-xl outline-none transition-all">
                        <option value="">Select Category</option>
                        <option value="Blood Test">Blood Test</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Thyroid">Thyroid</option>
                        <option value="Full Body">Full Body Checkup</option>
                        <option value="Women Health">Women Health</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Description</label>
                    <textarea name="description" required rows={2} value={editingTest.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 focus:border-[#1FAF9A] focus:ring-1 focus:ring-[#1FAF9A] rounded-xl outline-none transition-all"></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Preparation Instructions</label>
                    <textarea name="prep_instructions" rows={2} value={editingTest.prep_instructions} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 focus:border-[#1FAF9A] focus:ring-1 focus:ring-[#1FAF9A] rounded-xl outline-none transition-all" placeholder="e.g. Fasting for 10-12 hours required"></textarea>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Report Time</label>
                      <input type="text" name="report_delivery_time" required value={editingTest.report_delivery_time} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 focus:border-[#1FAF9A] focus:ring-1 focus:ring-[#1FAF9A] rounded-xl outline-none transition-all" placeholder="e.g. 24 Hours" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Original Price (₹)</label>
                      <input type="number" name="original_price" required value={editingTest.original_price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 focus:border-[#1FAF9A] focus:ring-1 focus:ring-[#1FAF9A] rounded-xl outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Discount Price (₹)</label>
                      <input type="number" name="discounted_price" required value={editingTest.discounted_price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 focus:border-[#1FAF9A] focus:ring-1 focus:ring-[#1FAF9A] rounded-xl outline-none transition-all" />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <input type="checkbox" name="home_collection_available" checked={editingTest.home_collection_available} onChange={handleChange} className="w-4 h-4 text-[#1FAF9A] rounded focus:ring-[#1FAF9A]" />
                      Home Collection Available
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <input type="checkbox" name="is_active" checked={editingTest.is_active} onChange={handleChange} className="w-4 h-4 text-[#1FAF9A] rounded focus:ring-[#1FAF9A]" />
                      Test Is Active
                    </label>
                  </div>
                </div>

                {/* 2. Slot Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-semibold text-[#1C2B2A]">2. Slot Configuration</h3>
                    {!isAddingSlot && (
                      <button type="button" onClick={() => setIsAddingSlot(true)} className="text-sm flex items-center gap-1 text-[#1FAF9A] hover:bg-[#F4F8F7] px-3 py-1.5 rounded-lg font-medium transition-colors">
                        <Plus className="w-4 h-4" /> Add Slot
                      </button>
                    )}
                  </div>

                  {/* Add Slot Form Inline */}
                  {isAddingSlot && (
                    <div className="bg-[#F4F8F7] border border-[#E6F0EE] p-4 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                      <h4 className="font-semibold text-sm text-[#1C2B2A]">New Slot Details</h4>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Time</label>
                          <div className="relative">
                            <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="time" value={newSlot.time} onChange={(e) => setNewSlot({...newSlot, time: e.target.value})} className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1FAF9A]" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Type</label>
                          <select value={newSlot.bookingType} onChange={(e) => setNewSlot({...newSlot, bookingType: e.target.value as any})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1FAF9A]">
                            <option value="center">Center Visit</option>
                            <option value="home">Home Collection</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Capacity</label>
                          <div className="relative">
                            <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="number" min="1" value={newSlot.capacity} onChange={(e) => setNewSlot({...newSlot, capacity: Number(e.target.value)})} className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1FAF9A]" />
                          </div>
                        </div>
                        <div className="space-y-1 flex items-end">
                          <div className="flex gap-2 w-full">
                            <button type="button" onClick={handleAddSlot} className="flex-1 bg-[#1FAF9A] text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition-shadow">Add</button>
                            <button type="button" onClick={() => setIsAddingSlot(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">Cancel</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* List of Configured Slots */}
                  {testSlots.length === 0 && !isAddingSlot ? (
                    <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-gray-500 font-medium">No slots configured for this test.</p>
                      <p className="text-xs text-gray-400 mt-1">Users won't be able to book this test until slots are added.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {testSlots.map(slot => (
                        <div key={slot.id} className={`border rounded-xl p-4 bg-white relative overflow-hidden transition-all ${slot.isActive ? 'border-gray-200' : 'border-gray-200 opacity-70'}`}>
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${slot.isActive ? 'bg-[#1FAF9A]' : 'bg-gray-300'}`}></div>
                          
                          <div className="flex items-start justify-between mb-3 pl-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${slot.bookingType === 'home' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                {slot.bookingType === 'home' ? <Home className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                              </div>
                              <div>
                                <h4 className="font-bold text-[#1C2B2A] text-sm">{slot.time}</h4>
                                <span className={`text-[10px] uppercase font-bold tracking-wider ${slot.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                  {slot.isActive ? 'Active' : 'Disabled'}
                                </span>
                              </div>
                            </div>
                            <button type="button" onClick={() => handleRemoveSlot(slot.id!)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="pl-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                {slot.bookingType === 'center' ? 'Center Visit' : 'Home Collection'}
                              </span>
                              <button 
                                type="button"
                                onClick={() => updateSlotInline(slot.id!, { isActive: !slot.isActive })}
                                className={`text-[11px] flex items-center gap-1 font-semibold px-2 py-1 rounded-md transition-colors ${slot.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                              >
                                <Activity className="w-3 h-3" />
                                {slot.isActive ? 'Disable' : 'Enable'}
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Booked</span>
                                <span className="text-sm font-bold text-[#1C2B2A]">{slot.booked}</span>
                              </div>
                              <div className="h-6 w-px bg-gray-200"></div>
                              <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Capacity</span>
                                <div className="flex items-center gap-1">
                                  <button type="button" onClick={() => updateSlotInline(slot.id!, { capacity: Math.max(1, slot.capacity - 1) })} className="p-0.5 text-gray-400 hover:text-gray-700 bg-white rounded shadow-sm border border-gray-100"><ChevronDown className="w-3 h-3" /></button>
                                  <span className="text-sm font-bold text-[#1C2B2A] w-5 text-center">{slot.capacity}</span>
                                  <button type="button" onClick={() => updateSlotInline(slot.id!, { capacity: slot.capacity + 1 })} className="p-0.5 text-gray-400 hover:text-gray-700 bg-white rounded shadow-sm border border-gray-100"><ChevronUp className="w-3 h-3" /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl z-10">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancel</button>
              <button type="submit" form="test-form" className="px-5 py-2.5 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-medium hover:shadow-lg transition-all shadow-[#1FAF9A]/20">Save Test & Slots</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

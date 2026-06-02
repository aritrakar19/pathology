import React, { useState, useRef } from "react";
import { UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import { extractPrescriptionData } from "../../../services/ocrService";
import { PrescriptionService } from "../../services/PrescriptionService";
import { useAuth } from "../../context/AuthContext";
import { PrescriptionScan } from "../../services/PrescriptionService";

interface PrescriptionUploadProps {
  onUploadSuccess?: (scan: PrescriptionScan) => void;
}

export function PrescriptionUpload({ onUploadSuccess }: PrescriptionUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!user) {
      setError("Please login to upload prescriptions.");
      return;
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid JPG, PNG, or PDF file.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. AI Extraction
      const extractedData = await extractPrescriptionData(file);
      
      // 2. Upload to Storage
      const imageUrl = await PrescriptionService.uploadPrescriptionImage(user.uid, file);
      
      // 3. Save to Firestore
      const scanDoc = await PrescriptionService.saveScan({
        userId: user.uid,
        imageUrl,
        extractedText: JSON.stringify(extractedData),
        medicines: extractedData.medicines || [],
        tests: extractedData.tests || [],
        doctorName: extractedData.doctorName || "",
        hospitalClinic: extractedData.hospitalClinic || "",
        diagnosis: extractedData.diagnosis || "",
        notes: extractedData.notes || "",
        confidence: extractedData.confidence || 0,
      });

      if (onUploadSuccess) {
        onUploadSuccess(scanDoc);
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActive ? "border-[#1FAF9A] bg-[#1FAF9A]/5" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".jpg,.jpeg,.png,.pdf" 
          onChange={handleChange}
          className="hidden"
        />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#1FAF9A]/20 blur-xl rounded-full"></div>
              <Loader2 className="w-12 h-12 text-[#1FAF9A] animate-spin relative" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#1C2B2A]">Analyzing Prescription...</h3>
              <p className="text-sm text-[#6B7C7B]">Our AI is extracting medicines and tests</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="w-16 h-16 bg-[#E6F0EE] rounded-full flex items-center justify-center text-[#1FAF9A]">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="font-semibold text-[#1C2B2A] text-lg">Drag & Drop your prescription</p>
              <p className="text-sm text-[#6B7C7B] mt-1">or click to browse files (JPG, PNG, PDF)</p>
            </div>
            <button 
              onClick={() => inputRef.current?.click()}
              className="mt-4 px-6 py-2.5 bg-[#1FAF9A] hover:bg-[#0E7C6B] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#1FAF9A]/25 flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              Select Image
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import Button from "../ui/Button";
import { Reimbursement } from "@/types/reimbursement";
import FileUpload from "../FileUpload";

interface CompletionModalProps {
  reimbursement: Reimbursement;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (formData: FormData) => Promise<void>;
}

export default function CompletionModal({
  reimbursement,
  isOpen,
  onClose,
  onConfirm,
}: Readonly<CompletionModalProps>) {
  const [amount, setAmount] = useState<string>("");
  const [certFiles, setCertFiles] = useState<File[]>([]);
  const [invoiceFiles, setInvoiceFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const inputClasses = (hasError: boolean) => `
    w-full border rounded-lg px-3 py-2.5 outline-none transition-all text-gray-900
    ${hasError 
      ? "border-red-500 focus:ring-red-100" 
      : "border-gray-300 focus:ring-[#009A74]/20 focus:border-[#009A74]"}
  `;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid final amount.");
      return;
    }

    if (certFiles.length === 0 || invoiceFiles.length === 0) {
      setError("Both the Completion Certificate and Final Invoice are required.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("finalAmount", amount);
    certFiles.forEach((file) => formData.append("certificate", file));
    invoiceFiles.forEach((file) => formData.append("files", file)); 

    try {
      await onConfirm(formData);
      onClose();
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Changed div to form and added onSubmit */}
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[95vh]"
      >
        
        {/* Header Section */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Claim Payout</h2>
            <p className="text-sm text-gray-500 font-medium">
              Settling: <span className="text-gray-700">{reimbursement.title}</span>
            </p>
          </div>
          <button
            type="button" // Explicitly button to prevent form submission
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Final Invoice Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="0.00"
                className={`${inputClasses(!!error)} pl-7 font-semibold`}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">1. Completion Certificate</label>
              <FileUpload
                files={certFiles}
                onFilesChange={setCertFiles}
                label="Upload Certificate"
                maxSizeMB={5}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">2. Final Invoice / Receipt</label>
              <FileUpload
                files={invoiceFiles}
                onFilesChange={setInvoiceFiles}
                label="Upload Final Invoices"
                maxSizeMB={5}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium animate-in slide-in-from-top-1">
              {error}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="px-6 py-4 bg-gray-50 border-t flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button
            variant="secondary"
            type="submit" 
            isLoading={isLoading}
            rightIcon={!isLoading && <Send size={18} />}
            disabled={certFiles.length === 0 || invoiceFiles.length === 0 || !amount || isLoading}
            className="px-8 min-w-[160px]"
          >
            {isLoading ? "Processing..." : "Submit Payout"}
          </Button>
        </div>
      </form>
    </div>
  );
}
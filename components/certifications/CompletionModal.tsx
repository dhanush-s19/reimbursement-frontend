"use client";

import { useState } from "react";
import { X, CheckCircle2, FileText, IndianRupee } from "lucide-react";
import Button from "../ui/Button";
import { Reimbursement } from "@/types/reimbursement";

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
  const [certFile, setCertFile] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!certFile || !invoiceFile || !amount || parseFloat(amount) <= 0) {
      return alert(
        "Please enter the final amount and upload both required documents.",
      );
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("files", certFile);
    formData.append("files", invoiceFile);
    formData.append("finalAmount", amount);

    try {
      await onConfirm(formData);
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl space-y-6 relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
        >
          <X size={20} />
        </button>

        <div className="space-y-1">
          <h3 className="text-2xl font-black text-gray-900 leading-tight">
            Claim Payout
          </h3>
          <p className="text-gray-500 font-medium truncate">
            {reimbursement.title}
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="invoice"
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 ml-1"
            >
              Invoice Amount (₹)
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <IndianRupee size={16} />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900 shadow-inner"
                placeholder="Enter actual amount paid"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="upload"
                className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 ml-1"
              >
                1. Completion Certificate
              </label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${certFile ? "border-emerald-200 bg-emerald-50" : "border-gray-200 hover:border-blue-300"}`}
              >
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${certFile ? "bg-emerald-500 text-white" : "bg-white text-gray-400 border border-gray-100"}`}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-sm font-semibold truncate text-gray-700">
                    {certFile ? certFile.name : "Upload Certificate"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="upload"
                className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 ml-1"
              >
                2. Final Invoice
              </label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${invoiceFile ? "border-emerald-200 bg-emerald-50" : "border-gray-200 hover:border-blue-300"}`}
              >
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${invoiceFile ? "bg-emerald-500 text-white" : "bg-white text-gray-400 border border-gray-100"}`}
                  >
                    <FileText size={18} />
                  </div>
                  <span className="text-sm font-semibold truncate text-gray-700">
                    {invoiceFile ? invoiceFile.name : "Upload Invoice"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          className="py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
          isLoading={isUploading}
          onClick={handleSubmit}
          disabled={!certFile || !invoiceFile || !amount}
        >
          Submit for Payout
        </Button>
      </div>
    </div>
  );
}

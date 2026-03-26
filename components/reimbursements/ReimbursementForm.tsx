"use client";

import { apiFetch } from "@/lib/api";
import { useState, useRef } from "react";
import Button from "@/components/ui/Button"; 
import { X, UploadCloud, FileText, Send } from "lucide-react";

export default function ReimbursementForm({
  employeeId,
  name,
}: Readonly<{
  employeeId: string;
  name: string;
}>) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [noInvoice, setNoInvoice] = useState(false);
  const [invoiceNote, setInvoiceNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDescription("");
    setFiles([]);
    setNoInvoice(false);
    setInvoiceNote("");
  };

  const handleSubmit = async (e: React.SubmitEvent) => { 
    e.preventDefault();
    
    if (!title || !amount) return alert("Title and amount are required");
    
    if (files.length === 0) {
      return alert(noInvoice ? "Please upload the voucher" : "Please upload the invoice");
    }
    
    if (noInvoice && invoiceNote.trim() === "") {
      return alert("Please provide an explanation note for the missing invoice");
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("amount", amount.toString());
    formData.append("submittedBy", employeeId);
    formData.append("name", name);
    formData.append("type", "NORMAL"); 
    formData.append("description", description);
    formData.append("noInvoice", String(noInvoice));
    formData.append("invoiceNote", invoiceNote);

    files.forEach((file) => formData.append("files", file));

    try {
      await apiFetch("/api/reimbursements/submit", { method: "POST", body: formData });
      alert("Claim submitted successfully!");
      resetForm();
    } catch (err) {
      console.error("Reimbursement submission error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      alert(`Submission failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Submit Claim
          </h1>
          <p className="text-gray-500">Submit your expense claims for processing.</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 p-6 sm:p-10 flex flex-col gap-6"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="form-title" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Title</label>
              <input
                id="form-title"
                type="text"
                placeholder="e.g. Travel Expenses"
                className="w-full px-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="form-amount" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium" aria-hidden="true">$</span>
                <input
                  id="form-amount"
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="form-desc" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Description</label>
              <textarea
                id="form-desc"
                rows={3}
                placeholder="Provide context for this reimbursement..."
                className="w-full px-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <input
              type="checkbox"
              id="noInvoice"
              className="w-5 h-5 rounded-md text-blue-600 border-gray-300 focus:ring-blue-500"
              checked={noInvoice}
              onChange={(e) => setNoInvoice(e.target.checked)}
            />
            <label htmlFor="noInvoice" className="text-sm font-medium text-blue-900 cursor-pointer">
              I don't have an invoice/receipt (will upload a voucher)
            </label>
          </div>

          <div className="space-y-4">
            <label id="upload-label" className="block text-sm font-medium text-gray-700 ml-1">
              {noInvoice ? "Upload Voucher" : "Upload Invoices"}
            </label>
            
            <Button
              type="button"
              variant="ghost"
              aria-labelledby="upload-label"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
              }}
              className="group relative w-full h-auto border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center gap-0 shadow-none focus:ring-2 focus:ring-blue-500"
            >
              <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-3 transition-colors" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-600">
                <span className="text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG (max 10MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </Button>

            {files.length > 0 && (
              <ul className="grid grid-cols-1 gap-2" aria-label="Uploaded files">
                {files.map((file) => (
                  <li 
                    key={`${file.name}-${file.lastModified}`} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
                      <span className="text-xs font-medium text-gray-700 truncate">{file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file)}
                      aria-label={`Remove ${file.name}`}
                      className="p-1 h-auto w-auto hover:bg-gray-200 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {noInvoice && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="invoiceNote" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Explanation Note</label>
              <textarea
                id="invoiceNote"
                placeholder="Explain why the invoice is missing..."
                className="w-full px-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900 shadow-inner"
                value={invoiceNote}
                onChange={(e) => setInvoiceNote(e.target.value)}
              />
            </div>
          )}

          <div className="pt-4">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              type="submit"
              isLoading={isSubmitting}
              rightIcon={!isSubmitting && <Send size={18} />}
              className="py-4 rounded-2xl font-bold text-lg shadow-lg shadow-gray-200 transition-transform active:scale-[0.98]"
            >
              Submit Claim
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
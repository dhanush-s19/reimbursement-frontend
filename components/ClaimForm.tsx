"use client";

import { useState, useEffect } from "react";
import { Reimbursement } from "@/types/reimbursement";
import Button from "./ui/Button";
import FileUpload from "./FileUpload";
import { IndianRupee, Users, User, Award, ChevronDown } from "lucide-react";
import { FormField, inputClasses } from "./ui/Form";
import { apiFetch } from "@/lib/api";

export type ClaimType = "NORMAL" | "TEAM_EVENTS" | "CERTIFICATION";

export interface ClaimFormProps {
  onSubmit: (formData: FormData, type: ClaimType) => Promise<void>;
  isLoading: boolean;
  employeeId: string;
  employeeName: string;
  userRole: string;
  isEdit?: boolean;
  initialData?: Reimbursement;
  onCancel?: () => void;
}

interface Manager {
  id: string;
  name: string;
}

export default function ClaimForm({
  onSubmit,
  isLoading,
  employeeId,
  employeeName,
  userRole,
  onCancel,
  isEdit,
  initialData
}: Readonly<ClaimFormProps>) {
  const [type, setType] = useState<ClaimType>("NORMAL");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [noInvoice, setNoInvoice] = useState(false);
  const [invoiceNote, setInvoiceNote] = useState("");
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [approvedCerts, setApprovedCerts] = useState<Reimbursement[]>([]);
  const [selectedCertId, setSelectedCertId] = useState("");


  const [files, setFiles] = useState<File[]>([]);
  const [certFiles, setCertFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isManager = userRole === "MANAGER";

  useEffect(() => {
    if (!isEdit) {
      setTitle("");
      setAmount("");
      setDescription("");
      setNoInvoice(false);
      setInvoiceNote("");
      setSelectedManagerId("");
      setSelectedCertId("");
      setFiles([]);
      setCertFiles([]);
      setError(null);
    }
  }, [type, isEdit]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const managersData = await apiFetch("/api/users/managers");
        setManagers(managersData);

        if (type === "CERTIFICATION" && employeeId) {
          const res = await apiFetch(`/api/reimbursements/employee/${employeeId}?size=100`);
          const pending = res.content.filter(
            (r: Reimbursement) => r.type === "CERTIFICATE" && r.status === "HR_APPROVED"
          );
          setApprovedCerts(pending);
        }
      } catch (err) {
        console.error("Error loading form data", err);
      }
    };
    loadInitialData();
  }, [type, employeeId]);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type as ClaimType);
      setTitle(initialData.title || "");
      setAmount(initialData.amount?.toString() || "");
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleAmountChange = (val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEdit) {
      if (type === "CERTIFICATION") {
        if (certFiles.length === 0) {
          return setError("Please upload your completed certificate");
        }
        if (files.length === 0) {
          return setError("Please upload the final invoice/bill");
        }
      } else {
        if (!noInvoice && files.length === 0) {
          return setError("Please upload an invoice or receipt");
        }
        if (noInvoice && files.length === 0) {
          return setError("Please upload a voucher since the invoice is missing");
        }
      }
    }


    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("title", title);
    if (description) formData.append("description", description);
    if (invoiceNote) formData.append("invoiceNote", invoiceNote);
    formData.append("type", type);

    if (type === "TEAM_EVENTS") {
      if (!isManager && !selectedManagerId) {
        return setError("Please select an approving manager");
      }

      if (isManager) {
        formData.append("managerId", employeeId);
        formData.append("managerName", employeeName);
      } else if (selectedManagerId) {
        const selectedManager = managers.find(m => m.id === selectedManagerId);
        formData.append("managerId", selectedManagerId);
        if (selectedManager) {
          formData.append("managerName", selectedManager.name);
        }
      }
      formData.append("name", employeeName);
    }

    if (type === "CERTIFICATION") {
      if (!selectedCertId) return setError("Please select a certification");
      formData.append("reimbursementId", selectedCertId);
      certFiles.forEach((f) => formData.append("files", f));
    }

    files.forEach((f) => formData.append("files", f));
    await onSubmit(formData, type);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isEdit && (
        <div className="grid grid-cols-3 gap-3">
          <TypeButton active={type === "NORMAL"} onClick={() => setType("NORMAL")} icon={<User size={18} />} label="Individual" />
          <TypeButton active={type === "TEAM_EVENTS"} onClick={() => setType("TEAM_EVENTS")} icon={<Users size={18} />} label="Team" />
          <TypeButton active={type === "CERTIFICATION"} onClick={() => setType("CERTIFICATION")} icon={<Award size={18} />} label="Certification" />
        </div>
      )}

      {type === "TEAM_EVENTS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!isManager && (
            <FormField label="Select Manager" required>
              <div className="relative">
                <select
                  value={selectedManagerId}
                  onChange={(e) => setSelectedManagerId(e.target.value)}
                  className={`${inputClasses(false)} appearance-none pr-10`}
                  required
                >
                  <option value="">-- Select Approving Manager --</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </FormField>
          )}
        </div>
      )}

      {type === "CERTIFICATION" && (
        <FormField label="Select Approved Certification" required>
          <div className="relative">
            <select
              value={selectedCertId}
              onChange={(e) => {
                const cert = approvedCerts.find((c) => c.id === e.target.value);
                setSelectedCertId(e.target.value);
                if (cert) {
                  setTitle(cert.title);
                  setAmount(cert.amount.toString());
                }
              }}
              className={`${inputClasses(false)} appearance-none pr-10`}
              required
            >
              <option value="">-- Select Pending Certification --</option>
              {approvedCerts.map((cert) => (
                <option key={cert.id} value={cert.id}>{cert.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
        </FormField>
      )}

      {type !== "CERTIFICATION" && (
        <>
          <FormField label="Expense Title" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses(false)}
              placeholder="Provide the Expense Title"
              required
            />
          </FormField>
          <FormField label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClasses(false)} min-h-[100px] py-2 resize-none`}
              placeholder="Provide more details about this expense..."
            />
          </FormField>
        </>
      )}

      <FormField label={type === "CERTIFICATION" ? "Final Invoice Amount" : "Amount"} required>
        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className={`${inputClasses(false)} pl-9`}
            placeholder="0.00"
            required
          />
        </div>
      </FormField>

      {type === "CERTIFICATION" && (
        <FormField label="Upload Completed Certificate" required>
          <FileUpload files={certFiles} onFilesChange={setCertFiles} />
        </FormField>
      )}

      {type !== "CERTIFICATION" && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <input
            type="checkbox"
            id="noInvoice"
            className="w-5 h-5 text-[#009A74]"
            checked={noInvoice}
            onChange={(e) => {
              setNoInvoice(e.target.checked);
              if (e.target.checked) setFiles([]);
            }}
          />
          <label htmlFor="noInvoice" className="text-sm font-medium text-gray-700">
            I don't have an invoice/receipt (Upload Voucher instead)
          </label>
        </div>
      )}

      <FormField
        label={
          type === "CERTIFICATION"
            ? "Upload Final Invoice/Bill"
            : noInvoice
              ? "Upload Voucher"
              : "Attachments (Invoice/Receipt)"
        }
        required={!noInvoice || type === "CERTIFICATION"}
      >
        <FileUpload files={files} onFilesChange={setFiles} />
      </FormField>

      {noInvoice && type !== "CERTIFICATION" && (
        <FormField label="Explanation Note" required>
          <textarea
            className={inputClasses(false)}
            value={invoiceNote}
            onChange={(e) => setInvoiceNote(e.target.value)}
            placeholder="Why is the invoice missing?"
            required
          />
        </FormField>
      )}

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold">{error}</div>}

      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>}
        <Button variant="secondary" type="submit" isLoading={isLoading} className="min-w-[140px]">
          {isEdit ? "Update Claim" : (type === "CERTIFICATION" ? "Complete Payout" : "Submit Claim")}
        </Button>
      </div>
    </form>
  );
}

function TypeButton({ active, onClick, icon, label }: Readonly<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${active ? "bg-emerald-50 border-emerald-600 text-emerald-700 shadow-sm" : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
        }`}
    >
      {icon}
      <span className="font-bold text-[10px] uppercase tracking-wider">{label}</span>
    </button>
  );
}
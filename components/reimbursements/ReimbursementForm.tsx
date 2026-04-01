"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";
import ClaimForm, { ClaimType } from "../ClaimForm";
import Toast, { ToastType } from "../ui/Toast";


export default function ReimbursementPage({ 
  employeeId, 
  name, 
  role 
}: Readonly<{ employeeId: string; name: string; role: string }>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleReimbursementSubmit = async (formData: FormData, type: ClaimType) => {
    setIsSubmitting(true);

    let url = "";
    let method = "POST";

    if (type === "TEAM_EVENTS") {
      url = "/api/reimbursements/team";
      formData.append("submittedById", employeeId);
      formData.append("userRole", role);
      formData.set("type", "TEAM_EVENTS");
      if (!formData.has("name")) formData.append("name", name);
    } 
    else if (type === "CERTIFICATION") {
      const certId = formData.get("reimbursementId");
      if (!certId || certId === "undefined") {
        showToast("Please select a valid certification.", "error");
        setIsSubmitting(false);
        return;
      }

      url = `/api/reimbursements/${certId}/complete-certification`;
      method = "PUT";
      const amountValue = formData.get("amount");
      formData.append("finalAmount", amountValue as string);
    } 
    else {
      url = "/api/reimbursements/submit";
      formData.append("submittedBy", employeeId);
      formData.set("type", "NORMAL");
      if (!formData.has("name")) formData.append("name", name);
    }

    try {
      await apiFetch(url, {
        method: method,
        body: formData,
      });
      
      showToast("Claim submitted successfully!", "success");
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      console.error("Submission Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Submission failed.";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Submit Claim</h1>
          <p className="text-gray-500">Select the type of reimbursement you wish to claim.</p>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <ClaimForm
            onSubmit={handleReimbursementSubmit}
            isLoading={isSubmitting}
            employeeId={employeeId}
            employeeName={name}
            userRole={role}
          />
        </div>
      </div>
    </div>
  );
}
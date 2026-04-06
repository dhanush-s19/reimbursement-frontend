"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Reimbursement } from "@/types/reimbursement";
import Modal from "./ui/Modal";
import ClaimForm from "./ClaimForm";
import Toast, { ToastType } from "./ui/Toast"; 
interface EditClaimModalProps {
  reimbursement: Reimbursement;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: { id: string; name: string; role: string };
}

export default function EditClaimModal({ reimbursement, isOpen, onClose, onSuccess, user }: Readonly<EditClaimModalProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };
  const handleUpdate = async (formData: FormData) => {
    setIsSubmitting(true);
    reimbursement.fileUrls?.forEach(url => {
      formData.append("existingFileUrls", url);
    });
    formData.append("id", reimbursement.id);
    try {
      await apiFetch(`/api/reimbursements/${reimbursement.id}`, {
        method: "PUT",
        body: formData,
      });
      
      showToast("Claim updated successfully!", "success");
      setTimeout(() => {
        onSuccess(); 
        onClose();
      }, 1500);

    } catch (err) {
      console.error("Update failed:", err);
      showToast("Update failed. Please check your connection.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} title="Edit & Resubmit Request">
        <ClaimForm
          initialData={reimbursement}
          onSubmit={handleUpdate}
          isLoading={isSubmitting}
          isEdit={true}
          employeeId={user.id}
          employeeName={user.name}
          userRole={user.role}
          onCancel={onClose}
        />
      </Modal>
    </>
  );
}
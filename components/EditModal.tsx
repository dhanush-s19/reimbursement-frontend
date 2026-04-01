"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Reimbursement } from "@/types/reimbursement";
import Modal from "./ui/Modal";
import ClaimForm from "./ClaimForm";

interface EditClaimModalProps {
  reimbursement: Reimbursement;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: { id: string; name: string; role: string };
}

export default function EditClaimModal({ reimbursement, isOpen, onClose, onSuccess, user }: Readonly<EditClaimModalProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      onSuccess(); 
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}
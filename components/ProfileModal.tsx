'use client';

import { useState } from "react"; 
import { apiFetch } from "@/lib/api";
import ModalForm, { FormField } from "./ModalForm";
import { useSession } from "next-auth/react";
import Toast, { ToastType } from "./ui/Toast";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  userId?: string;
};

interface ProfileFormValues {
  name: string;
  oldPassword?: string;
  newPassword?: string;
}

const FIELDS: FormField[] = [
  { name: "name", label: "Full Name", type: "text", gridCols: 2, placeholder: "Your name" },
  { name: "oldPassword", label: "Current Password", type: "password", gridCols: 2, placeholder: "••••••••" },
  { name: "newPassword", label: "New Password", type: "password", gridCols: 2, placeholder: "Leave blank to keep current" },
];

export default function ProfileModal({
  isOpen,
  onClose,
  initialName,
  userId,
}: Readonly<ProfileModalProps>) {
  const { update } = useSession();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };
  const handleSave = async (values: ProfileFormValues) => {
    try {
      if (values.name !== initialName) {
        await apiFetch(`/api/users/${userId}`, {
          method: "PUT",
          body: JSON.stringify({ name: values.name }),
        });
        await update({ name: values.name });
      }
      if (values.newPassword && values.newPassword.trim() !== "") {
        await apiFetch(`/api/users/${userId}/password`, {
          method: "PATCH",
          body: JSON.stringify({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          }),
        });
      }
      showToast("Profile updated successfully!", "success");
      setTimeout(onClose, 2000); 
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      showToast(error.message || "Failed to update profile. Please try again.", "error");
    }
  };

  const validate = (values: ProfileFormValues) => {
    const errors: Record<string, string> = {};
    if (!values.name) errors.name = "Name is required";
    if (values.newPassword && !values.oldPassword) {
      errors.oldPassword = "Current password is required to set a new one.";
    }
    if (values.oldPassword && !values.newPassword) {
      errors.newPassword = "Please enter a new password.";
    }
    return errors;
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
      <ModalForm<ProfileFormValues>
        open={isOpen}
        onClose={onClose}
        onSave={handleSave}
        title="Account Settings"
        description="Update your profile information and security settings."
        initialData={{ name: initialName, oldPassword: "", newPassword: "" }}
        fields={FIELDS}
        validationRules={validate}
        submitText="Save Changes"
      />
    </>
  );
}
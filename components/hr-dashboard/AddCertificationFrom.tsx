"use client";

import { apiFetch } from "@/lib/api";
import { Certification } from "@/types/certification";
import ModalForm, { FormField } from "../ModalForm";

interface AddCertificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

const CERT_FIELDS: FormField[] = [
  {
    name: "certification",
    label: "Certification Name",
    type: "text",
    placeholder: "e.g. Microsoft Azure Fundamentals - AZ-900",
    gridCols: 2,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Cloud", value: "Cloud" },
      { label: "AI", value: "AI" },
      { label: "Data", value: "Data" },
      { label: "Security", value: "Security" },
    ],
    gridCols: 1,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "On Hold", value: "On Hold" },
      { label: "Pending", value: "Pending" },
    ],
    gridCols: 1,
  },
];

export default function AddCertificationForm({
  isOpen,
  onClose,
  onAdded,
}: Readonly<AddCertificationFormProps>) {
  
  const initialData: Partial<Certification> = {
    category: "Cloud",
    certification: "",
    status: "Active",
    recommendedRoles: [], 
  };

  const handleSave = async (data: Certification) => {
    try {
      await apiFetch("/api/certifications/add", {
        method: "POST",
        body: JSON.stringify(data),
      });
      onAdded?.();
      onClose(); 
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  const validate = (values: Certification) => {
    const errors: Record<string, string> = {};
    if (!values.certification) {
      errors.certification = "Certification name is required";
    }
    return errors;
  };

  return (
    <ModalForm<Certification>
      open={isOpen}
      onClose={onClose}
      onSave={handleSave}
      initialData={initialData as Certification}
      title="Add Certification"
      description="Enter the details for the new professional certification."
      fields={CERT_FIELDS}
      validationRules={validate}
    />
  );
}
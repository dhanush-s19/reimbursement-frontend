"use client";

import { apiFetch } from "@/lib/api";
import { Certification } from "@/types/certification";
import ModalForm, { FormField } from "../ModalForm";

interface AddCertificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

const ROLES = [
  "Cloud Engineer",
  "Data Scientist",
  "AI Engineer",
  "Solutions Architect",
  "Security Analyst",
  "DevOps Engineer",
  "Developer",
];

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
      { label: "Mobile", value: "Mobile" },
      { label: "Java", value: "Java" },
      { label: "Database", value: "Database" },
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
    ],
    gridCols: 1,
  },
  {
    name: "recommendedRoles",
    label: "Recommended Roles",
    type: "checkbox-group",
    options: ROLES.map((role) => ({ label: role, value: role })),
    gridCols: 2,
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
    if (!values.recommendedRoles || values.recommendedRoles.length === 0) {
      errors.recommendedRoles = "Please select at least one role";
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
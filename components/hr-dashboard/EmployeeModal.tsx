"use client";

import { Employee } from "@/types/employee";
import ModalForm, { FormField } from "../ModalForm";


interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => Promise<void>;
  employee?: Employee | null;
}

export default function EmployeeFormModal({ open, onClose, employee, onSave }: Readonly<Props>) {
  
  const fields: FormField[] = [
    { name: "employeeId", label: "Employee ID", type: "text", placeholder: "e.g. EMP-001", gridCols: 2 },
    { name: "name", label: "Full Name", type: "text", placeholder: "Enter name", gridCols: 2 },
    { name: "email", label: "Email Address", type: "email", placeholder: "email@valoriz.com", gridCols: 2 },
    ...(!employee ? [{ name: "password", label: "Password", type: "password", placeholder: "Min 6 characters", gridCols: 2 } as FormField] : []),
    { 
      name: "role", label: "Role", type: "select", gridCols: 1,
      options: [
        { value: "HR", label: "HR" },
        { value: "EMPLOYEE", label: "Employee" },
        { value: "MANAGER", label: "Manager" },
        { value: "ACCOUNTANT", label: "Accountant" },
      ]
    },
    { 
      name: "department", label: "Department", type: "select", gridCols: 1,
      options: [
        { value: "DEVELOPMENT", label: "Development" },
        { value: "QA", label: "QA" },
        { value: "BA", label: "BA" },
        { value: "FINANCE", label: "Finance" },
        { value: "UI_UX", label: "UI/UX" },
      ]
    },
  ];

  const validate = (form: any) => {
    const newErrors: Record<string, string> = {};
    if (!form.employeeId?.trim()) newErrors.employeeId = "Required";
    if (!form.name?.trim()) newErrors.name = "Required";
    if (!form.email?.includes("@")) newErrors.email = "Invalid email";
    if (!employee && (!form.password || form.password.length < 6)) {
      newErrors.password = "Must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSave = async (data: any) => {
    const payload = { ...data };
    if (employee) delete payload.password;
    await onSave(payload as Employee);
  };

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      onSave={handleSave}
      initialData={employee ? { ...employee, password: "" } : null}
      title={employee ? "Edit Employee" : "Add New Employee"}
      description="Fill in the professional details for the staff member."
      fields={fields}
      validationRules={validate}
      submitText={employee ? "Update Employee" : "Register Employee"}
    />
  );
}
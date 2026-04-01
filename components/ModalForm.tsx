"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Button from "./ui/Button";
import Dropdown from "./ui/Dropdown";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "password" | "email" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  gridCols?: 1 | 2;
}

interface Props<T> {
  open: boolean;
  onClose: () => void;
  onSave: (data: T) => Promise<void>;
  initialData?: T | null;
  title: string;
  description?: string;
  fields: FormField[];
  validationRules?: (values: T) => Record<string, string>;
  submitText?: string;
}

export default function ModalForm<T extends Record<string, any>>({
  open,
  onClose,
  onSave,
  initialData,
  title,
  description,
  fields,
  validationRules,
}: Readonly<Props<T>>) {
  const [form, setForm] = useState<T>({} as T);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setForm(initialData || ({} as T));
      setErrors({});

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, initialData]);

  const handleUpdateField = useCallback((name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = async () => {
    if (validationRules) {
      const newErrors = validationRules(form);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div
                key={field.name}
                className={`flex flex-col gap-1.5 ${
                  field.gridCols === 2
                    ? "col-span-2"
                    : "col-span-2 sm:col-span-1"
                }`}
              >
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                </label>

                {field.type === "select" ? (
                  <Dropdown
                    options={field.options || []}
                    value={form[field.name] || ""}
                    onChange={(val) => handleUpdateField(field.name, val)}
                    className={
                      errors[field.name] ? "ring-1 ring-red-500 rounded-lg" : ""
                    }
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name] || ""}
                    onChange={(e) =>
                      handleUpdateField(field.name, e.target.value)
                    }
                    placeholder={field.placeholder}
                    className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${
                      errors[field.name]
                        ? "border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:ring-[#009A74]/20 focus:border-[#009A74]"
                    }`}
                  />
                )}
                {errors[field.name] && (
                  <span className="text-xs text-red-500">
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 min-w-[120px]"
          >
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

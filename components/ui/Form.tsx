import React from "react";

interface FormFieldProps {
  label: string;
  error?: boolean;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField = ({ 
  label, 
  error, 
  required, 
  children, 
  className = "" 
}: FormFieldProps) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
};

export const inputClasses = (hasError: boolean) => `
  w-full border rounded-lg px-3 py-2.5 outline-none transition-all text-gray-900
  ${hasError 
    ? "border-red-500 focus:ring-red-100" 
    : "border-gray-300 focus:ring-[#009A74]/20 focus:border-[#009A74]"}
`;
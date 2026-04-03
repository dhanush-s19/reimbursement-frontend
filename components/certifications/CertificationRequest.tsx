"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Button from "@/components/ui/Button";
import { Send, ArrowLeft, Info, FileText } from "lucide-react";
import { FormField, inputClasses } from "../ui/Form";
import Toast, { ToastType } from "@/components/ui/Toast"; 

interface EnrollmentProps {
  name: string;
  id: string;
}

export function EnrollmentFormContent({ name, id }: Readonly<EnrollmentProps>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const certName = searchParams.get("name") || "Certification";
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", certName);
    formData.append("amount", "0");
    formData.append("description", description);
    formData.append("type", "CERTIFICATE");
    formData.append("submittedBy", id);
    formData.append("name", name);
    formData.append("noInvoice", "true");

    try {
      await apiFetch("/api/reimbursements/submit", {
        method: "POST",
        body: formData,
      });

      setToast({
        message: "Enrollment request sent to HR for approval!",
        type: "success",
      });

      setTimeout(() => {
        router.push("/reimbursement");
      }, 2000);
    } catch (err) {
      console.error(err);
      setToast({
        message: "Failed to submit request. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors group"
      >
        <ArrowLeft
          size={16}
          className="mr-2 group-hover:-translate-x-1 transition-transform"
        />
        Back to Certifications
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Request Enrollment
        </h1>
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <p>
            Requesting as:{" "}
            <span className="font-semibold text-gray-800">{name}</span>
          </p>
          <p>
            Certification:{" "}
            <span className="font-bold text-black">{certName}</span>
          </p>
        </div>
      </div>

      <div className="bg-green-50 border border-blue-100 rounded-2xl p-4 mb-8 flex gap-3">
        <Info className="text-black-500 shrink-0" size={20} />
        <p className="text-sm text-black-800 leading-relaxed">
          HR approval is required <strong>before</strong> payment. You will
          upload your invoice for reimbursement after completing the course.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b bg-gray-50/50">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-gray-400" />
            <h2 className="font-bold text-gray-800">Statement of Purpose</h2>
          </div>
        </div>

        <div className="p-6">
          <FormField
            label="Why do you want to take this certification?"
            required
          >
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how this helps your performance or the team..."
              className={`${inputClasses(false)} h-44 resize-none`}
            />
          </FormField>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <Button
            variant="secondary"
            type="submit"
            isLoading={isSubmitting}
            rightIcon={!isSubmitting && <Send size={18} />}
            className="px-8 min-w-[200px] rounded-xl"
          >
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
}

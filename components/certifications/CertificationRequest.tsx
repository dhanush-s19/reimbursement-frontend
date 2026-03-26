"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Button from "@/components/ui/Button";
import { Send, ArrowLeft, Info } from "lucide-react";

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
    try {
      const url = "/api/reimbursements/submit";

      await apiFetch(url, {
        method: "POST",
        body: formData,
      });

      alert("Enrollment request sent to HR for approval!");
      router.push("/my-reimbursements");
    } catch (err) {
      console.error(err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Certifications
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Request Enrollment
        </h1>
        <p className="text-gray-600">
          Requesting as:{" "}
          <span className="font-semibold text-gray-800">
            {name} ({id})
          </span>
        </p>
        <p className="text-gray-600 mt-1">
          For certification:{" "}
          <span className="font-bold text-black">{certName}</span>
        </p>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6 flex gap-3">
        <Info className="text-green-500 shrink-0" size={20} />
        <p className="text-sm text-green-800 font-medium leading-relaxed">
          HR approval is required before you pay for this course. Once approved,
          you can later upload your invoice for payout.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100"
      >
        <div>
          <label
            htmlFor="text"
            className="block text-sm font-semibold text-gray-700 mb-2 ml-1"
          >
            Statement of Purpose
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="How will this certification help your performance or the team?"
            className="w-full p-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900 h-40 resize-none shadow-inner"
          />
        </div>

        <div className="pt-2">
          <Button
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            rightIcon={!isSubmitting && <Send size={18} />}
            className="rounded-2xl py-4 font-bold shadow-lg"
            variant="secondary"
          >
            Submit Enrollment Request
          </Button>
        </div>
      </form>
    </div>
  );
}

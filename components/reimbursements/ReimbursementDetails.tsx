"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ReimbursementDetailView from "./ReimbursementDetailView";
import Toast, { ToastType } from "../ui/Toast";


interface ReimbursementDetailProps {
  readonly employeeId: string;
  readonly employeeRole: string;
}

export default function ReimbursementDetail({
  employeeId,
  employeeRole
}: ReimbursementDetailProps) {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("");
  const [reason, setReason] = useState(""); 
  const [approvedAmount, setApprovedAmount] = useState<number | "">("");
  const [allowedNextStatuses, setAllowedNextStatuses] = useState<string[]>([]);

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/reimbursements/${id}?role=${employeeRole}`);
        if (!res?.reimbursement) throw new Error("Reimbursement not found");

        setData(res);
        setAllowedNextStatuses(res.allowedNextStatuses || []);
        
        if (res.allowedNextStatuses?.length > 0) {
          setStatus(res.allowedNextStatuses[0]);
        } else {
          setStatus(res.reimbursement.status);
        }

        setApprovedAmount(res.reimbursement.approvedAmount ?? "");
        setReason(res.reimbursement.reason ?? "");

      } catch (err: any) {
        setError(err.message || "Failed to load data");
        showToast(err.message || "Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id && employeeRole) fetchData();
  }, [id, employeeRole]);

  const handleSubmit = async () => {
    if (allowedNextStatuses.length === 0) return;

    if (status === "ACCOUNTANT_FINAL_APPROVED" && (!approvedAmount || Number(approvedAmount) <= 0)) {
      showToast("Please enter a valid approved amount.", "error");
      return;
    }
    
    if (status.includes("REJECTED") && !reason.trim()) {
      showToast("Please provide a reason for rejection.", "error");
      return;
    }

    try {
      const payload = {
        status,
        reason: reason.trim(), 
        processedById: employeeId,
        approvedAmount: approvedAmount === "" ? null : Number(approvedAmount),
      };

      await apiFetch(`/api/reimbursements/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      showToast("Update successful!", "success");
      
      setTimeout(() => {
        router.push("/reimbursement-request");
        router.refresh();
      }, 1500);

    } catch (err: any) {
      showToast(err.message || "An error occurred", "error");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>{error}</div>;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <ReimbursementDetailView
        reimbursement={data.reimbursement}
        allowedNextStatuses={allowedNextStatuses}
        showApprovedAmountField={data.showApprovedAmountField}
        showReasonField={data.showReasonField}
        status={status}
        reason={reason}
        approvedAmount={approvedAmount}
        onStatusChange={setStatus}
        onReasonChange={setReason} 
        onAmountChange={setApprovedAmount}
        onSubmit={handleSubmit}
        isLocked={allowedNextStatuses.length === 0}
      />
    </>
  );
}
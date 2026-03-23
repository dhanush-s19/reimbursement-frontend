"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ReimbursementDetailView from "./ReimbursementDetailView";


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
      } finally {
        setLoading(false);
      }
    };

    if (id && employeeRole) fetchData();
  }, [id, employeeRole]);

  const handleSubmit = async () => {
    if (allowedNextStatuses.length === 0) return;

    
    if (status === "ACCOUNTANT_FINAL_APPROVED" && (!approvedAmount || Number(approvedAmount) <= 0)) {
      alert("Please enter a valid approved amount.");
      return;
    }
    
  
    if ((status.includes("REJECTED")) && !reason.trim()) {
        alert("Please provide a reason for rejection.");
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

      router.push("/reimbursement-request");
      router.refresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>{error}</div>;

  return (
    <ReimbursementDetailView
      reimbursement={data.reimbursement}
      allowedNextStatuses={allowedNextStatuses}
      showApprovedAmountField={data.showApprovedAmountField}
      showReasonField={data.showReasonField}
      status={status}
      reason={reason}
      approvedAmount={approvedAmount}
      onStatusChange={setStatus}
      onReasonChange={setReason} // Updates the 'reason' state in this component
      onAmountChange={setApprovedAmount}
      onSubmit={handleSubmit}
      isLocked={allowedNextStatuses.length === 0}
    />
  );
}
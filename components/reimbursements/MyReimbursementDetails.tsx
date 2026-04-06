"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Reimbursement } from "@/types/reimbursement";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ChevronLeft, Loader2, Info, MessageSquare, RotateCcw, Edit3, AlertCircle } from "lucide-react";
import EditClaimModal from "../EditModal";

interface MyReimbursementPageProps {
  role: string;
  user: { id: string; name: string; role: string };
}

export default function MyReimbursementPage({ role, user }: Readonly<MyReimbursementPageProps>) {
  const { id } = useParams();
  const router = useRouter();

  const [reimbursement, setReimbursement] = useState<Reimbursement | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await apiFetch(`/api/reimbursements/${id}?role=${role}`);
      setReimbursement(data.reimbursement);
    } catch (err) {
      console.error("Failed to load reimbursement:", err);
    } finally {
      setLoading(false);
    }
  }, [id, role]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusStyles = (status: string) => {
    const s = status?.toUpperCase() || "";
    if (s.includes("PAID") || s.includes("APPROVED")) return "bg-green-50 text-green-700 border-green-200";
    if (s.includes("REJECTED")) return "bg-red-50 text-red-700 border-red-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
      <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
      <div className="text-gray-400 font-medium">Loading details...</div>
    </div>
  );

  if (!reimbursement) return (
    <div className="p-10 text-center min-h-screen bg-[#F9FAFB]">
      <p className="text-gray-500 mb-4">Reimbursement record not found.</p>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  const isRejected = reimbursement.status.toUpperCase().includes("REJECTED");
  const submissionCount = reimbursement.submissionCount ?? 0;
  const canResubmit = isRejected && submissionCount < 1;

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-10">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <Button
          variant="ghost" size="sm" onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={16} /> Back to List
        </Button>

        <Card className={isRejected ? "border-red-100 shadow-md" : ""}>
          <Card.Header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Card.Title className="flex items-center gap-2">
                Reimbursement Summary
                {submissionCount > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded text-[10px] font-bold uppercase tracking-tighter">
                    <RotateCcw size={10} /> Resubmitted
                  </span>
                )}
              </Card.Title>
              <Card.Description>Reference: #{id?.toString().slice(-8)}</Card.Description>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyles(reimbursement.status)}`}>
              {reimbursement.status.replace("_", " ")}
            </div>
          </Card.Header>

          <Card.Content className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Info size={14} /> Description
              </label>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {reimbursement.description || "No description provided."}
              </p>
            </div>

            {reimbursement.reason && (
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-red-500">
                  <MessageSquare size={14} /> Reviewer Feedback
                </label>
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                  <p className="text-red-900 text-sm leading-relaxed italic">
                    {reimbursement.reason}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-xs font-medium text-gray-500 block mb-1 uppercase">Requested</span>
                <span className="text-xl font-bold text-gray-900">${reimbursement.amount?.toLocaleString()}</span>
              </div>
              <div className={`p-4 rounded-2xl border ${reimbursement.approvedAmount != null ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"}`}>
                <span className="text-xs font-medium text-gray-500 block mb-1 uppercase">Approved Amount</span>
                <span className={`text-xl font-bold ${reimbursement.approvedAmount != null ? "text-green-700" : "text-gray-400"}`}>
                  {reimbursement.approvedAmount != null ? `$${reimbursement.approvedAmount.toLocaleString()}` : "Pending"}
                </span>
              </div>
            </div>

            {isRejected && (
              <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm">
                  {canResubmit ? (
                    <span className="text-gray-500 flex items-center gap-2">
                      <AlertCircle size={14} className="text-amber-500" />
                      Record is rejected. You have <b>one</b> resubmission attempt remaining.
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold flex items-center gap-2">
                      <AlertCircle size={14} />
                      Maximum resubmission limit reached. No further edits allowed.
                    </span>
                  )}
                </div>
                
                {canResubmit && (
                  <Button 
                    variant="secondary"
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full sm:w-auto flex items-center gap-2 text-white px-6"
                  >
                    <Edit3 size={16} /> Edit & Resubmit
                  </Button>
                )}
              </div>
            )}
          </Card.Content>

          <Card.Footer className="flex items-center justify-between text-gray-400 text-xs">
            <span>Last Updated: {new Date(reimbursement.updatedAt || "").toLocaleDateString()}</span>
          </Card.Footer>
        </Card>
        
        {reimbursement && (
          <EditClaimModal
            reimbursement={reimbursement}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={loadData} 
            user={user}
          />
        )}
      </div>
    </div>
  );
}
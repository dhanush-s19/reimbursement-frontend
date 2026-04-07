"use client";

import React, { useState } from "react";
import {
  Maximize2,
  FileText,
  IndianRupee,
  Clock,
  Tag,
  ChevronRight,
  Users,
  Award,
  RotateCcw,
  AlertCircle,
  History,
  UserCheck
} from "lucide-react";
import Card from "../ui/Card";
import { ReimbursementActionCard } from "./ReimbursementActionCard";
import Button from "../ui/Button";

type Props = {
  readonly reimbursement: any;
  readonly allowedNextStatuses: string[];
  readonly showApprovedAmountField: boolean;
  readonly showReasonField: boolean;
  readonly status: string;
  readonly reason: string;
  readonly approvedAmount: number | "";
  readonly onStatusChange: (val: string) => void;
  readonly onReasonChange: (val: string) => void;
  readonly onAmountChange: (val: number | "") => void;
  readonly onSubmit: () => void;
  readonly isLocked: boolean;
};

export default function ReimbursementDetailView(props: Readonly<Props>) {
  const { reimbursement } = props;
  const invoiceUrl = reimbursement.fileUrls?.[0] || null;
  const certificateUrl = reimbursement.fileUrls?.[1] || null;
  const [activeView, setActiveView] = useState<"invoice" | "certificate">("invoice");
  const invoiceNote = reimbursement.invoiceNote;
  const currentUrl = activeView === "invoice" ? invoiceUrl : certificateUrl;
  const hasCertificate = !!certificateUrl;
  const isPdf = currentUrl?.toLowerCase().endsWith(".pdf");
  const openFullScreen = () => {
    if (currentUrl) window.open(currentUrl, "_blank", "noopener,noreferrer");
  };
  const renderAttachment = (url: string | null) => {
    if (!url) {
      return (
        <div className="text-center p-12">
          <FileText className="text-slate-300 mx-auto mb-4" size={32} />
          <p className="text-slate-500 text-sm font-medium">No file provided.</p>
        </div>
      );
    }
    return (
      <div className="w-full flex flex-col gap-4">
        {activeView === "invoice" && invoiceNote && (
          <div className="mx-4 mt-4 p-4 bg--50 border-l-4 border-green-400 rounded-r-lg shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={14} className="text-green-600" />
              <span className="text-[10px] font-black uppercase text-black-800 tracking-tight">
                Invoice Note
              </span>
            </div>
            <p className="text-sm text-black-900 font-medium leading-relaxed">
              {invoiceNote}
            </p>
          </div>
        )}

        <div className="p-4 flex justify-center">
          {isPdf ? (
            <iframe
              src={`${url}#toolbar=0`}
              className="w-full h-[600px] rounded border border-slate-200 bg-white"
              title="Document Preview"
            />
          ) : (
            <button onClick={openFullScreen} className="cursor-zoom-in">
              <img src={url} alt="Evidence" className="max-w-full h-auto rounded border border-slate-200" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const isTeamEvent = reimbursement.type === "TEAM_EVENTS";
  const forwardedByName = reimbursement.managerName;

  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans antialiased text-slate-900">

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            <span>Reimbursements</span>
            <ChevronRight size={12} />
            <span>{reimbursement.name || "N/A"}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {reimbursement.title || "Expense Claim"}
            </h1>

            {reimbursement.resubmitted && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-[10px] font-black uppercase tracking-tight">
                <RotateCcw size={12} /> Resubmitted
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Card>
            <Card.Header className="space-y-4">
              <div className="flex justify-between items-center">
                <Card.Title className="text-sm flex items-center gap-2">
                  <FileText size={18} className="text-slate-400" /> Evidence
                </Card.Title>
                {currentUrl && (
                  <button onClick={openFullScreen} className="text-xs font-bold flex items-center gap-1 hover:text-slate-600">
                    <Maximize2 size={14} /> Fullscreen
                  </button>
                )}
              </div>

              <div className="flex bg-slate-100 p-1 rounded-lg w-fit border border-slate-200 gap-1">
                <Button
                  size="sm"
                  variant={activeView === "invoice" ? "secondary" : "ghost"}
                  onClick={() => setActiveView("invoice")}
                  className={`text-xs font-bold px-4 py-1.5 ${activeView === "invoice" ? " shadow-sm" : "text-slate-500"}`}
                >
                  Invoice
                </Button>

                {hasCertificate && (
                  <Button
                    size="sm"
                    variant={activeView === "certificate" ? "secondary" : "ghost"}
                    onClick={() => setActiveView("certificate")}
                    className={`text-xs font-bold px-4 py-1.5 flex items-center gap-1.5 ${activeView === "certificate" ? "shadow-sm" : "text-slate-500"}`}
                  >
                    <Award size={14} />
                    Certificate
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Content className="bg-slate-50 flex items-center justify-center min-h-[400px]">
              {renderAttachment(currentUrl)}
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {reimbursement.rejectionHistory && reimbursement.rejectionHistory.length > 0 && (
            <Card className="border-rose-100 bg-rose-50/20">
              <Card.Content>
                <div className="flex items-center gap-2 mb-4 text-rose-900">
                  <History size={18} className="text-rose-500 shrink-0" />
                  <h3 className="text-sm font-bold">Audit History (Previous Rejections)</h3>
                </div>

                <div className="space-y-4">
                  {reimbursement.rejectionHistory.map((history: any, index: number) => (
                    <div key={index} className="relative pl-6 border-l-2 border-rose-200 pb-2 last:pb-0">
                      <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-rose-300 border-2 border-white" />
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold uppercase text-rose-600 tracking-wider">
                          {history.previousStatus?.replaceAll("_", " ")}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(history.rejectedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium italic">
                        "{history.reason || "No comment provided."}"
                      </p>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}
          {reimbursement.resubmitted && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 shadow-sm">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-0.5">Updated Submission</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  This claim was previously rejected and has been updated by the employee.
                  Check the latest notes below.
                </p>
              </div>
            </div>
          )}

          <Card>
            <Card.Content>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Financial Summary</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5"><IndianRupee size={14} /> Requested</p>
                  <p className="text-2xl font-mono font-bold text-slate-900">₹{reimbursement.amount?.toLocaleString()}</p>
                </div>

                <div className="border-l border-slate-100 pl-6">
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <UserCheck size={14} className="text-emerald-600" /> Approved 
                  </p>
                  <p className={`text-2xl font-mono font-bold ${reimbursement.approvedAmount ? "text-emerald-600" : "text-slate-300"
                    }`}>
                    ₹{reimbursement.approvedAmount?.toLocaleString() ?? "0"}
                  </p>
                </div>
                <div className="border-l border-slate-100 pl-6">
                  <p className="text-sm text-slate-500 flex items-center gap-1.5"><Tag size={14} /> Category</p>
                  <p className="text-sm font-bold uppercase text-slate-700">{reimbursement.type?.replaceAll("_", " ")}</p>
                </div>

                {isTeamEvent && (
                  <div className="col-span-2 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                    {forwardedByName && (
                      <div className="border-l border-slate-100 pl-6">
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                          <UserCheck size={14} className="text-emerald-600" /> Manager Handled
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {forwardedByName}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <div className="flex items-center gap-2 mb-4 text-slate-900">
                <Clock size={18} className="text-slate-400 shrink-0 translate-y-[1px]" />
                <h3 className="text-sm font-bold">Request Context</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-lg">
                {reimbursement.description || "No description provided."}
              </p>

              {reimbursement.resubmitted && (
                <div className="mt-3 p-3 bg-amber-50/50 rounded border border-amber-100 border-dashed">
                  <p className="text-[10px] font-bold text-amber-800 uppercase tracking-tight mb-1">
                    Latest Remarks:
                  </p>
                  <p className="text-[11px] text-slate-500 italic leading-snug">
                    {reimbursement.reason || "No specific feedback provided."}
                  </p>
                </div>
              )}
            </Card.Content>
          </Card>

          <ReimbursementActionCard {...props} />
        </div>
      </div>
    </div>
  );
}
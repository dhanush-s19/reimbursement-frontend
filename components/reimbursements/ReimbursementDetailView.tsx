import React from "react";
import { Maximize2, FileText, IndianRupee, Clock, Tag, ChevronRight, Users } from "lucide-react";
import Card from "../ui/Card";
import { ReimbursementActionCard } from "./ReimbursementActionCard";

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
  const isPdf = invoiceUrl?.toLowerCase().endsWith(".pdf");
  const hasInvoice = !!invoiceUrl;

  // Logic for Team Member count
  const isTeamEvent = reimbursement.type === "TEAM_EVENTS";
  const teamCount = reimbursement.teamMemberIds?.length || 0;

  const openFullScreen = () => {
    if (invoiceUrl) window.open(invoiceUrl, "_blank", "noopener,noreferrer");
  };

  const renderAttachment = () => {
    if (!hasInvoice) {
      return (
        <div className="text-center p-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-500 text-sm font-medium">No attachment provided.</p>
        </div>
      );
    }

    if (isPdf) {
      return (
        <iframe
          src={`${invoiceUrl}#toolbar=0`}
          className="w-full h-[600px] rounded border border-slate-200"
          title="Invoice Preview"
        />
      );
    }

    return (
      <button onClick={openFullScreen} className="cursor-zoom-in">
        <img src={invoiceUrl} alt="Invoice" className="max-w-full h-auto rounded border border-slate-200" />
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans antialiased text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            <span>Reimbursements</span>
            <ChevronRight size={12} />
            <span>{reimbursement.name || "N/A"}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {reimbursement.title || "Expense Claim"}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Evidence Column */}
        <div className="lg:col-span-7">
          <Card>
            <Card.Header className="flex justify-between items-center">
              <Card.Title className="text-sm flex items-center gap-2">
                <FileText size={18} className="text-slate-400" /> Evidence
              </Card.Title>
              {hasInvoice && (
                <button onClick={openFullScreen} className="text-xs font-bold flex items-center gap-1">
                  <Maximize2 size={14} /> Fullscreen
                </button>
              )}
            </Card.Header>
            <Card.Content className="bg-slate-50 flex items-center justify-center">
              {renderAttachment()}
            </Card.Content>
          </Card>
        </div>

        {/* Actions Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <Card.Content>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Financial Summary</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5"><IndianRupee size={14} /> Requested</p>
                  <p className="text-2xl font-mono font-bold text-slate-900">₹{reimbursement.amount?.toLocaleString()}</p>
                </div>
                <div className="border-l border-slate-100 pl-6">
                  <p className="text-sm text-slate-500 flex items-center gap-1.5"><Tag size={14} /> Category</p>
                  <p className="text-sm font-bold uppercase text-slate-700">{reimbursement.type?.replaceAll("_", " ")}</p>
                </div>

                {/* Team Members Count Section */}
                {isTeamEvent && (
                  <div className="col-span-2 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <Users size={14} /> Team Size
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {teamCount} {teamCount === 1 ? 'Member' : 'Members'}
                    </p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <div className="flex items-center gap-2 mb-4 text-slate-900">
                <Clock size={18} className="text-slate-400" />
                <h3 className="text-sm font-bold">Request Context</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-lg">
                {reimbursement.description || "No description provided."}
              </p>
            </Card.Content>
          </Card>

          <ReimbursementActionCard {...props} />
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

type ActionCardProps = {
  readonly isLocked: boolean;
  readonly status: string;
  readonly allowedNextStatuses: string[];
  readonly showApprovedAmountField: boolean;
  readonly approvedAmount: number | "";
  readonly showReasonField: boolean;
  readonly reason: string;
  readonly onStatusChange: (val: string) => void;
  readonly onAmountChange: (val: number | "") => void;
  readonly onReasonChange: (val: string) => void;
  readonly onSubmit: () => void;
};

export const ReimbursementActionCard = ({
  isLocked,
  status,
  allowedNextStatuses,
  showApprovedAmountField,
  approvedAmount,
  showReasonField,
  reason,
  onStatusChange,
  onAmountChange,
  onReasonChange,
  onSubmit,
}: ActionCardProps) => {


  if (isLocked) {
    return (
      <Card className="border-gray-200 bg-gray-50/50">
        <Card.Content className="py-8 text-center">
          <div className="bg-white p-3 rounded-full w-fit mx-auto mb-4 shadow-sm border border-gray-100">
            <Lock className="text-gray-400" size={24} />
          </div>
          <Card.Title className="text-gray-900 text-base">Action Restricted</Card.Title>
          <Card.Description className="text-xs text-gray-500 mt-1">
            This record is currently archived or awaiting a previous step.
            No modifications are permitted at this stage.
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <Card.Header className="bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-black" />
          <Card.Title className="text-gray-800 text-sm font-semibold">Review Decision</Card.Title>
        </div>
      </Card.Header>

      <Card.Content className="p-5 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="status-select" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Update Status
          </label>
          <select
            id="status-select"
            className="w-full bg-white border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="" disabled>Select next action...</option>
            {allowedNextStatuses.map((s) => (
              <option key={s} value={s}>
                {s.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
              </option>
            ))}
          </select>
        </div>
        {showApprovedAmountField && (
          <div className="space-y-1.5">
            <label htmlFor="approved-amount" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Approved Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium">₹</span>
              <input
                id="approved-amount"
                type="number"
                className="w-full border border-gray-300 text-gray-900 rounded-md pl-8 pr-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="0.00"
                value={approvedAmount}
                onChange={(e) => onAmountChange(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
          </div>
        )}
        {showReasonField && (
          <div className="space-y-1.5">
            <label htmlFor="internal-note" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Internal Note / Remarks
            </label>
            <textarea
              id="internal-note"
              rows={3}
              className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Provide a reason for this decision..."
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
            />
          </div>
        )}
      </Card.Content>

      <Card.Footer className="bg-gray-50/50 border-t border-gray-100 p-4">
        <Button
          variant="secondary"
          fullWidth
          onClick={onSubmit}
          className="hover:bg-gray-700 text-white font-semibold py-2.5 shadow-sm"
        >
          Finalize Review
        </Button>
      </Card.Footer>
    </Card>
  );
};
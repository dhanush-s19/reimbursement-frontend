export type ReimbursementStatus =
  | "SUBMITTED"
  | "FORWARDED_TO_HR"
  | "HR_APPROVED"
  | "HR_REJECTED"
  | "BACK_TO_ACCOUNTANT"
  | "ACCOUNTANT_FINAL_APPROVED"
  | "ACCOUNTANT_REJECTED"
  | "PAID";

export interface Reimbursement {
  id: string;
  employeeId: string;
  name: string;
  title: string;
  amount: number;
  description: string;
  noInvoice: boolean;
  invoiceNote?: string;
  fileUrls?: string[];

  submittedBy: string;
  processedById?: string;

  status: ReimbursementStatus;
  reason?: string;

  createdAt: string;
  updatedAt: string;

  type: "NORMAL" | "CERTIFICATE" | "TEAM_EVENTS";
  requiresHrApproval?: boolean;
  approvedAmount?: number;
  
  resubmitted?:boolean
  submissionCount?:number
}

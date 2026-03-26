export type CertificationStatus = "Active" | "On Hold" | "Pending";

export interface Certification {
  id?: string;
  category: string;
  certification: string;
  recommendedRoles: string[];
  status: CertificationStatus;
}

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReimbursementForm from "@/components/reimbursements/ReimbursementForm";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Request Reimbusrement",
};

export default async function EmployeePage() {
  const session = await getServerSession(authOptions);
  const employeeId = session?.user?.employeeId;
  const name = session?.user?.name;
  const role=session?.user?.role
  if (!employeeId || !name ||!role) {
    return <div>Not authenticated</div>;
  }

  return <ReimbursementForm employeeId={employeeId} name={name} role={role} />;
}

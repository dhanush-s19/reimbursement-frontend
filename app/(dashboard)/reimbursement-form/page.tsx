import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReimbursementForm from "@/components/reimbursements/ReimbursementForm";
import { getServerSession } from "next-auth";

export default async function EmployeePage() {
  const session = await getServerSession(authOptions);
  const employeeId = session?.user?.employeeId;
  const name = session?.user?.name;
  if (!employeeId || !name) {
    return <div>Not authenticated</div>;
  }

  return <ReimbursementForm employeeId={employeeId} name={name} />;
}
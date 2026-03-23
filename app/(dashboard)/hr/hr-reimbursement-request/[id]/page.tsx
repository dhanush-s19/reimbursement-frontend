
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReimbursementDetail from "@/components/reimbursements/ReimbursementDetails";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions)
  const id = session?.user.id ?? "";
  const role = session?.user.role ?? "";
  return (
    <div className="p-8">
      <ReimbursementDetail employeeId={id} employeeRole={role} />
    </div>
  );
}
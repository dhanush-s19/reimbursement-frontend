import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReimbursementPage from "@/components/reimbursements/MyReimbursement";
import { getServerSession } from "next-auth";
export const metadata = {
  title: "Reimbursement Details",
};
export default async function Reimbursements() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.employeeId;
  if (!id) {
    return <div>Not authenticated</div>;
  }
  return <ReimbursementPage id={id} />;
}

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReimbursementList from "@/components/reimbursements/ReimburesementList";

import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!role) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="p-8">
      <ReimbursementList role={role} />
    </div>
  );
}
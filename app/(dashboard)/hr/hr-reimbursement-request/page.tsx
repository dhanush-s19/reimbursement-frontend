import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HRReimbursementList from "@/components/reimbursements/HrForwadedRequest";

import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;

  if (!id) {
    return <div>Not authenticated</div>;
  }

  return (
        <div className="mt-8">
          <HRReimbursementList hrId={id} />
        </div>
  );
}
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ManagerReimbursementQueue from "@/components/manager/ManagerQueuePage";

import { getServerSession } from "next-auth";
export const metadata = {
  title: "Employees Page",
};
export default async function Managerpage() {
  const session = await getServerSession(authOptions);
  const employeeId = session?.user?.id;
  const role = session?.user?.role;
  if (!employeeId || !role) {
    return <div>Not authenticated</div>;
  }
  return <ManagerReimbursementQueue managerId={employeeId}  />;
}

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ManagerPage from "@/components/manager/Employees";

import { getServerSession } from "next-auth";
export const metadata = {
  title: "Employees Page",
};
export default async function Managerpage() {
  const session = await getServerSession(authOptions);
  const employeeId = session?.user?.employeeId;
  const managerName = session?.user?.name;
  if (!employeeId || !managerName) {
    return <div>Not authenticated</div>;
  }
  return <ManagerPage managerId={employeeId} name={managerName} />;
}

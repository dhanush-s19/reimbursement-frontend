import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MyReimburesmentPage from "@/components/reimbursements/MyReimbursementDetails";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Summary",
};

export default async function MyReimbursement() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Not authenticated</div>
      </div>
    );
  }


  const userPayload = {
    id: session.user.id  ?? "", 
    name: session.user.name ?? "Employee",
    role: (session.user.role as string) ?? "EMPLOYEE",
  };

  return (
    <MyReimburesmentPage 
      role={userPayload.role} 
      user={userPayload} 
    />
  );
}
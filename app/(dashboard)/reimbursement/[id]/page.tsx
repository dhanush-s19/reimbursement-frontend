import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MyReimburesmentPage from "@/components/reimbursements/MyReimbursementDetails";
import { getServerSession } from "next-auth";

export default async function MyReimbursement() {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;
    if (!userRole) {
        return <div>Not authenticated</div>;
    }
    return (
        <MyReimburesmentPage role={userRole}/>
    )
}
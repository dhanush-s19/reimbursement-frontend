import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EnrollmentFormContent } from "@/components/certifications/CertificationRequest";
import { getServerSession } from "next-auth";

export default async function CertificationEnrollmentPage() {
    const session = await getServerSession(authOptions);
    const id = session?.user?.employeeId;
    const employeeName=session?.user?.name;

    if (!id||!employeeName) {
        return <div>Not authenticated</div>;
    }
    return (
        <EnrollmentFormContent name={employeeName} id={id} />
    )
}
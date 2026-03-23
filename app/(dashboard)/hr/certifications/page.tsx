import AddCertificationForm from "@/components/hr-dashboard/AddCertificationFrom";
import CertificationTable from "@/components/hr-dashboard/CertificationTable";


export default function Page() {
  return (
    <div className="p-8">
      <CertificationTable/>
      {/* <AddCertificationForm /> */}
    </div>
  );
}
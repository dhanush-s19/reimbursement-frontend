import CertificationTable from "@/components/hr-dashboard/CertificationTable";

export const metadata = {
  title: "Certification",
};

export default function Page() {
  return (
    <div className="p-8">
      <CertificationTable />
    </div>
  );
}

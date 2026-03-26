import EmployeePage from "@/components/hr-dashboard/EmployeePage";

export const metadata = {
  title: "Employees Page",
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <EmployeePage />
    </div>
  );
}

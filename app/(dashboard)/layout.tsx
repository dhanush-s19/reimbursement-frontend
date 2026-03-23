import Sidebar from "@/components/ui/Sidebar";
import { getServerSession } from "next-auth";
import { menus } from "@/types/menu";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const role = user?.role || "EMPLOYEE";
  const id=user?.id||"Undefined"
  const menuItems = menus[role as keyof typeof menus];
  return (
    <div className="relative min-h-screen w-full bg-slate-50">
      <Sidebar
        name={user?.name || "Portal"}
        role={role}
        menuItems={menuItems}
        userId={id}
      />

      <main className="transition-all duration-300 lg:ml-64 min-h-screen w-full lg:w-auto overflow-x-hidden">
        <div className="w-full h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
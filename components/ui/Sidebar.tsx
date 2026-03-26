'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import Button from "./Button";
import ProfileModal from "../ProfileModal";


type MenuItem = {
  name: string;
  href: string;
};

type SidebarProps = Readonly<{
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  menuItems: MenuItem[];
}>;

export default function Sidebar({
  userId,
  name = "User",
  role = "USER",
  menuItems
}: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const badgeText = role?.[0]?.toUpperCase() || "?";
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        initialName={name}
        userId={userId}
      />

      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <Button
          variant="secondary"
          onClick={toggleSidebar}
          className="!p-2.5 shadow-sm border-gray-200"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {isOpen && (
        <Button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden cursor-default"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}>


        <Button
          variant="secondary"
          onClick={() => setIsProfileOpen(true)}
          className="!p-6 border-none border-b border-gray-100 rounded-none bg-white hover:bg-gray-50 transition-all text-left w-full group relative flex items-center justify-start h-auto"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-md bg-zinc-900 text-white group-hover:bg-gray-600 transition-colors">
              {badgeText}
            </div>

            <div className="overflow-hidden pr-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 group-hover:text-gray=600 transition-colors">
                Profile Settings
              </p>
              <p className="font-bold text-gray-900 truncate leading-tight">{name}</p>
            </div>
            <ChevronRight size={15} className="absolute right-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
          </div>
        </Button>


        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive
                    ? "bg-green-50 text-green-700 shadow-sm border border-green-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>


        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-2 font-bold py-3 border-gray-200 hover:bg-gray-800 transition-all shadow-sm"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
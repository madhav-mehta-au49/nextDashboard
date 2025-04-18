"use client"
import { ReactNode } from "react";
import { useSidebar } from "../contexts/SidebarContext";

interface AdminBodyProps {
  children: ReactNode;
}

const AdminBody = ({ children }: AdminBodyProps) => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div
        className={`transition-all duration-200 pt-[100px] px-8 py-20 ${
          isSidebarOpen ? "ml-[240px]" : "ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default AdminBody;

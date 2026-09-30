import type { ReactNode } from "react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* 
        Dashboard shell.

        IMPORTANT:
        This layout is only the frontend structure.

        In production, the backend/authentication layer
        must verify whether the current user is allowed
        to access this dashboard before serving protected data.
      */}
      <DashboardSidebar />

      <div className="lg:pl-64">
        <DashboardTopbar />

        <main className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
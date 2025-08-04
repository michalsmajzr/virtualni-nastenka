"use client";
import { SessionProvider } from "next-auth/react";
import SideNav from "@/components/SideNav";
import FabVisibleContextLayout from "@/components/FabVisible";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <FabVisibleContextLayout>
        <SideNav />
        <div className="flex flex-col w-full lg:pl-20 overflow-x-hidden">
          {children}
        </div>
      </FabVisibleContextLayout>
    </SessionProvider>
  );
}

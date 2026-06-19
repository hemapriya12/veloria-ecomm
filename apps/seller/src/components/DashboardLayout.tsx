"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar";

const queryClient = new QueryClient();

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 1024);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />
        <main className="flex flex-col flex-1 min-w-0">
          <Navbar />
          <div className="p-6 flex-1">{children}</div>
        </main>
      </div>
      <ToastContainer position="bottom-right" />
    </QueryClientProvider>
  );
}

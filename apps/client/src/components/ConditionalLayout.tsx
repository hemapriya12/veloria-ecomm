"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth   = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isAuth) return <>{children}</>;

  return (
    <div className="mx-auto p-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

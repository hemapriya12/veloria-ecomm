"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={45 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}

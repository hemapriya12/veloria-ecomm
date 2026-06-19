"use client";

import { signOut } from "next-auth/react";
import { ShieldAlert } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
        <ShieldAlert size={28} className="text-red-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-900">Unauthorized</h1>
      <p className="text-sm text-gray-400">You do not have access to this page.</p>
      <button onClick={() => signOut({ callbackUrl: "/sign-in" })}
        className="mt-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
        style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
        Sign out
      </button>
    </div>
  );
}

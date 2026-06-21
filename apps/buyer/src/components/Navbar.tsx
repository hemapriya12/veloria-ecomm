"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import ShoppingCartIcon from "./ShoppingCartIcon";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Package } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav className="w-full flex items-center justify-between py-4 mb-2">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
        >
          <ShoppingBag size={15} className="text-white" />
        </div>
        <span className="hidden md:block font-bold text-gray-900 tracking-widest text-sm uppercase">
          Veloria
        </span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-6">
        <SearchBar />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <ShoppingCartIcon />

        {!mounted || status === "loading" ? (
          <div className="w-16 h-7 rounded-xl bg-gray-100 animate-pulse" />
        ) : status === "authenticated" ? (
          <>
            <button
              onClick={() => router.push("/orders")}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Package size={13} /> Orders
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

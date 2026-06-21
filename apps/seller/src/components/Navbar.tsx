"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { UserCircle, Settings, LogOut, ChevronDown, Search, Package, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

type Result = { type: "product" | "order"; id: string; label: string; sub: string; href: string };

function GlobalSearch() {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const token        = session?.user?.token;
      const sellerEmail  = session?.user?.email ?? "";

      // Search only this seller's products across all fields (multi-field ranked search)
      const [productsRes, ordersRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?search=${encodeURIComponent(q)}&admin=true&sellerEmail=${encodeURIComponent(sellerEmail)}&limit=5`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?limit=200`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      const products  = productsRes.ok  ? await productsRes.json()  : [];
      const allOrders = ordersRes.ok    ? await ordersRes.json()    : [];

      const ql = q.toLowerCase();

      // Order search: match by order ID, email, product name, or amount
      const filteredOrders = Array.isArray(allOrders)
        ? allOrders
            .filter((o: any) =>
              o._id?.toLowerCase().includes(ql) ||
              o.email?.toLowerCase().includes(ql) ||
              o.products?.some((p: any) => p.name?.toLowerCase().includes(ql)) ||
              String(o.amount / 100).includes(ql)
            )
            .slice(0, 3)
        : [];

      const productResults: Result[] = (Array.isArray(products) ? products : [])
        .map((p: any) => ({
          type:  "product" as const,
          id:    String(p.id),
          label: p.name,
          sub:   `${p.brand ? p.brand + " · " : ""}$${((p.salePrice ?? p.price) / 100).toFixed(2)} · ${p.categorySlug.replace(/-/g, " ")}`,
          href:  `/products`,
        }));

      const orderResults: Result[] = filteredOrders.map((o: any) => ({
        type:  "order" as const,
        id:    o._id,
        label: `Order #${o._id.slice(-8).toUpperCase()}`,
        sub:   `${o.email} · $${(o.amount / 100).toFixed(2)} · ${o.fulfillmentStatus}`,
        href:  `/orders`,
      }));

      setResults([...productResults, ...orderResults]);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setFocused(false); setQuery(""); }
    if (e.key === "Enter" && results.length > 0) {
      router.push(results[0]!.href);
      setFocused(false);
      setQuery("");
    }
  };

  const showDropdown = focused && (query.length > 0);

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all ${focused ? "border-emerald-400 bg-white ring-2 ring-emerald-100" : "border-gray-200 bg-gray-50"}`}>
        {loading
          ? <Spinner color="emerald" />
          : <Search size={14} className="text-gray-400 shrink-0" />
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, orders..."
          className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400 min-w-0"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
            <X size={13} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-11 left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400 text-center">No results for &quot;{query}&quot;</p>
          ) : (
            <div className="py-1.5">
              {results.map((r) => (
                <Link key={r.id + r.type} href={r.href}
                  onClick={() => { setFocused(false); setQuery(""); }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${r.type === "product" ? "bg-violet-100" : "bg-blue-100"}`}>
                    {r.type === "product"
                      ? <Package size={13} className="text-violet-600" />
                      : <ShoppingCart size={13} className="text-blue-600" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.label}</p>
                    <p className="text-xs text-gray-400 truncate">{r.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const name      = session?.user?.name  ?? "Seller";
  const email     = session?.user?.email ?? "";
  const initials  = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const avatar    = (session?.user as any)?.avatar;
  const firstName = name.split(" ")[0];

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 h-14 px-4 bg-white border-b border-gray-100">
      {/* Greeting */}
      <p className="text-sm text-gray-500 shrink-0 hidden sm:block">
        {getGreeting()}, <span className="font-semibold text-gray-800">{firstName}</span> 👋
      </p>

      {/* Search — grows to fill center */}
      <div className="flex-1 flex justify-center">
        <GlobalSearch />
      </div>

      {/* Avatar dropdown */}
      <div ref={ref} className="relative shrink-0">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-emerald-100 flex items-center justify-center shrink-0">
            {avatar
              ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
              : <span className="text-xs font-bold text-emerald-700">{initials}</span>
            }
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{name}</p>
            <p className="text-[10px] text-gray-400 leading-tight">{email}</p>
          </div>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-12 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 z-50">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
              <p className="text-xs text-gray-400 truncate">{email}</p>
            </div>
            <div className="py-1">
              <Link href="/profile" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <UserCircle size={15} className="text-gray-400" /> My Profile
              </Link>
              <Link href="/settings" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings size={15} className="text-gray-400" /> Settings
              </Link>
            </div>
            <div className="border-t border-gray-50 pt-1">
              <button onClick={() => signOut({ callbackUrl: "/sign-in" })}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

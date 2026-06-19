"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Plus, Tag, ShoppingBag, Store, UserCircle, Settings, RotateCcw, Star } from "lucide-react";
import AddCategory from "./AddCategory";

const nav = [
  { label: "Overview",     href: "/",            icon: LayoutDashboard, section: null },
  { label: "All Products", href: "/products",     icon: Package,         section: "Products" },
  { label: "Add Product",  href: "/products/new", icon: Plus,            section: "Products" },
  { label: "Add Category", href: null,            icon: Tag,             section: "Products", action: "category" },
  { label: "All Orders",   href: "/orders",       icon: ShoppingBag,     section: "Orders" },
  { label: "Returns",     href: "/returns",      icon: RotateCcw,       section: "Orders" },
  { label: "Reviews",     href: "/reviews",      icon: Star,            section: "Orders" },
  { label: "My Profile",  href: "/profile",      icon: UserCircle,      section: "Account" },
  { label: "Settings",    href: "/settings",     icon: Settings,        section: "Account" },
];

export default function AppSidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <aside className={`flex-shrink-0 flex flex-col min-h-screen bg-[#0f172a] overflow-hidden transition-all duration-200 ${open ? "w-60" : "w-16"}`}>
        {/* Logo — click to toggle sidebar */}
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 px-4 h-16 border-b border-white/5 w-full hover:bg-white/5 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <Store size={16} className="text-white" />
          </div>
          {open && (
            <div className="text-left">
              <p className="text-white text-sm font-bold leading-tight">Veloria</p>
              <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-widest">Seller</p>
            </div>
          )}
        </button>

        {/* Nav */}
        <div className="flex flex-col px-2 pt-4 flex-1 gap-0.5">
          {["__root__", "Products", "Orders", "Account"].map((section) => {
            const items = nav.filter((n) =>
              section === "__root__" ? n.section === null : n.section === section
            );
            if (!items.length) return null;
            return (
              <div key={section} className="mb-2">
                {open && section !== "__root__" && (
                  <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 pb-1.5">
                    {section}
                  </p>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = item.href !== null && pathname === item.href;
                  const cls =
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all cursor-pointer w-full " +
                    (active
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-white/50 hover:bg-white/5 hover:text-white/90");

                  if (item.action === "category") {
                    return (
                      <button key={item.label} onClick={() => setAddCategoryOpen(true)} className={cls}>
                        <Icon size={17} className="shrink-0" />
                        {open && <span>{item.label}</span>}
                      </button>
                    );
                  }
                  return (
                    <Link key={item.label} href={item.href!} className={cls}>
                      <Icon size={17} className="shrink-0" />
                      {open && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="px-4 py-3 border-t border-white/5">
          <p className="text-white/20 text-[10px] text-center">{open ? "Veloria Seller v1.0" : "v1.0"}</p>
        </div>
      </aside>

      <AddCategory open={addCategoryOpen} onClose={() => setAddCategoryOpen(false)} />
    </>
  );
}

"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "All Products",   href: "/products" },
      { label: "New Arrivals",   href: "/products?sort=newest" },
      { label: "Best Sellers",   href: "/products?sort=desc" },
      { label: "Deals & Offers", href: "/products?sort=asc" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "My Orders",      href: "/orders" },
      { label: "Returns",        href: "/orders" },
      { label: "Track Package",  href: "/orders" },
      { label: "Help Center",    href: "#" },
    ],
  },
  {
    title: "Sell on Veloria",
    links: [
      { label: "Start Selling",  href: "http://localhost:3003/sign-in" },
      { label: "Seller Dashboard", href: "http://localhost:3003" },
      { label: "Seller Policies", href: "#" },
      { label: "Seller Support",  href: "#" },
    ],
  },
  {
    title: "Veloria",
    links: [
      { label: "About Us",      href: "/about"          },
      { label: "Press",         href: "/press"          },
      { label: "Sustainability", href: "/sustainability" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-20 rounded-3xl overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 20% 80%, #1a1a2e 0%, #16213e 40%, #0f3460 80%, #533483 100%)" }}>

      {/* Top banner */}
      <div className="border-b border-white/5 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            <ShoppingBag size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white tracking-widest text-sm uppercase">Veloria</p>
            <p className="text-white/30 text-xs">Your one-stop marketplace</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-white/40 text-xs">
          <span>🚚 Free shipping over $50</span>
          <span>🔒 Secure payments</span>
          <span>↩️ Easy returns</span>
        </div>
      </div>

      {/* Links */}
      <div className="px-8 pt-8 pb-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {footerLinks.map(({ title, links }) => (
          <div key={title} className="flex flex-col gap-3">
            <p className="text-white text-xs font-semibold uppercase tracking-widest">{title}</p>
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-white/40 text-sm hover:text-white/80 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Social */}
      <div className="px-8 pb-6 flex items-center gap-3">
        {[
          { label: "IG", title: "Instagram",   href: "https://www.instagram.com/hemapriya12t?igsh=cDJxdjZkejQzanFw&utm_source=qr" },
          { label: "X",  title: "X / Twitter", href: "https://x.com/hemapriyat12?s=11" },
          { label: "FB", title: "Facebook",    href: "https://www.facebook.com/share/1H8TyTRZiw/?mibextid=wwXIfr" },
          { label: "YT", title: "YouTube",     href: "https://youtube.com/@hemapriyat8052?si=WAdcFOfsso-giV2x" },
        ].map(({ label, title, href }) => (
          <button
            key={label}
            title={title}
            onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white/60 text-[10px] font-bold cursor-pointer"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-white/25 text-xs">© {new Date().getFullYear()} Veloria Inc. All rights reserved.</p>
        <div className="flex items-center gap-4 text-white/25 text-xs">
          <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-white/50 transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-white/50 transition-colors">Cookie Settings</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

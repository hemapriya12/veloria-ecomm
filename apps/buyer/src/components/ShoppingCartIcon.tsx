"use client";

import useCartStore from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const ShoppingCartIcon = () => {
  const { cart, hasHydrated } = useCartStore();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href="/cart" className="relative p-1.5">
      <ShoppingCart size={18} className="text-gray-600" />
      {hasHydrated && count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
};

export default ShoppingCartIcon;

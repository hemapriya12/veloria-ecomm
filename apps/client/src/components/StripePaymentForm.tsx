"use client";
"use client";

import { useSession } from "next-auth/react";
import { ShippingFormInputs } from "@repo/types";
import useCartStore from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import Spinner from "@/components/Spinner";

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE            = 599;

const StripePaymentForm = ({ shippingForm }: { shippingForm: ShippingFormInputs }) => {
  const { cart, clearCart } = useCartStore();
  const { data: session }   = useSession();
  const router              = useRouter();
  const [loading, setLoading]     = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry]         = useState("");
  const [cvc, setCvc]               = useState("");

  // Memoized — only recomputes when cart changes
  const { subtotal, shippingCost, total } = useMemo(() => {
    const sub = cart.reduce((acc, item) => {
      const price = (item as any).salePrice ?? item.price;
      return acc + price * item.quantity;
    }, 0);
    const ship = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return { subtotal: sub, shippingCost: ship, total: sub + ship };
  }, [cart]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const products = cart.map((item) => ({
        productId: item.id,
        name:      item.name,
        quantity:  item.quantity,
        price:     (item as any).salePrice ?? item.price,
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({
          email:    shippingForm.email,
          amount:   total,
          products,
        }),
      });

      if (!res.ok) throw new Error("Order creation failed");

      clearCart();
      router.push("/orders");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Payment Details</h2>
        <p className="text-xs text-gray-400">Your payment information is secure and encrypted.</p>
      </div>

      {/* Card number */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Card Number</label>
        <div className="relative">
          <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCard(e.target.value))}
            placeholder="4242 4242 4242 4242"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Expiry</label>
          <input
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">CVC</label>
          <input
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
            placeholder="123"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Summary</p>
        {cart.map((item) => (
          <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm py-0.5">
            <span className="text-gray-600 truncate">{item.name} ×{item.quantity}</span>
            <span className="font-medium text-gray-800 shrink-0 ml-2">
              ${(((item as any).salePrice ?? item.price) / 100 * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-200 mt-2 pt-2 flex flex-col gap-1">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            {shippingCost === 0 ? (
              <span className="text-emerald-600 font-semibold">FREE 🎉</span>
            ) : (
              <span className="text-gray-700">${(shippingCost / 100).toFixed(2)}</span>
            )}
          </div>
          {shippingCost > 0 && (
            <p className="text-xs text-violet-500 mt-0.5">
              Add ${((FREE_SHIPPING_THRESHOLD - subtotal) / 100).toFixed(2)} more for free shipping
            </p>
          )}
          <div className="border-t border-gray-200 mt-1 pt-2 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>${(total / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60 transition-all"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
      >
        {loading ? (
          <Spinner />
        ) : (
          <><Lock size={14} /> Pay ${(total / 100).toFixed(2)}{shippingCost === 0 ? " · Free shipping" : ""}</>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <CheckCircle size={12} className="text-emerald-500" />
        Secure checkout — 256-bit encryption
      </div>
    </div>
  );
};

export default StripePaymentForm;

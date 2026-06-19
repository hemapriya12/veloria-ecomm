"use client";

import ShippingForm from "@/components/ShippingForm";
import StripePaymentForm from "@/components/StripePaymentForm";
import useCartStore from "@/stores/cartStore";
import { ShippingFormInputs, getProductImage } from "@repo/types";
import { ArrowRight, Trash2, ShoppingBag, MapPin, CreditCard, Check, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

const steps = [
  { id: 1, label: "Cart",     icon: ShoppingBag },
  { id: 2, label: "Shipping", icon: MapPin       },
  { id: 3, label: "Payment",  icon: CreditCard   },
];

const CartPage = () => {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();
  const activeStep = parseInt(searchParams.get("step") || "1");
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const { status } = useSession();

  const handleContinue = () => {
    if (status !== "authenticated") {
      router.push("/sign-in?callbackUrl=/cart?step=2");
    } else {
      router.push("/cart?step=2", { scroll: false });
    }
  };

  const effectivePrice = (item: any) => (item.salePrice ?? item.price);
  const subtotal = cart.reduce((acc, item) => acc + (effectivePrice(item) / 100) * item.quantity, 0);
  const shipping  = subtotal > 50 ? 0 : 10;
  const total     = subtotal + shipping;

  return (
    <div className="flex flex-col gap-8 mt-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-sm text-gray-400 mt-0.5">{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {steps.map((step, i) => {
          const done   = step.id < activeStep;
          const active = step.id === activeStep;
          const Icon   = step.icon;
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  done   ? "bg-violet-600 text-white" :
                  active ? "bg-white border-2 border-violet-600 text-violet-600" :
                           "bg-gray-100 text-gray-400"
                }`}>
                  {done ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${active ? "text-violet-600" : done ? "text-gray-600" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${step.id < activeStep ? "bg-violet-600" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left — step content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {activeStep === 1 ? (
            cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
                  <ShoppingBag size={24} className="text-violet-400" />
                </div>
                <p className="text-gray-500 text-sm">Your cart is empty</p>
                <button onClick={() => router.push("/products")}
                  className="rounded-xl px-5 py-2 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                  Shop Now
                </button>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-50">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <Image src={getProductImage(item.images, item.selectedColor)} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        {item.selectedSize  && <span>Size: {item.selectedSize.toUpperCase()}</span>}
                        {item.selectedColor && <span className="flex items-center gap-1">Color: <span className="w-3 h-3 rounded-full inline-block border" style={{ backgroundColor: item.selectedColor }} /></span>}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-sm font-semibold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900">${((effectivePrice(item) / 100) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item)}
                      className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center shrink-0 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : activeStep === 2 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 3 && shippingForm ? (
            <StripePaymentForm shippingForm={shippingForm} />
          ) : (
            <p className="text-sm text-gray-400 py-8 text-center">Please fill in the shipping form to continue.</p>
          )}
        </div>

        {/* Right — order summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-5">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Discount (10%)</span>
                <span className="font-medium text-emerald-600">-$0.00</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-medium text-gray-800">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-violet-600 mt-3 bg-violet-50 rounded-lg px-3 py-2">
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}

            {activeStep === 1 && cart.length > 0 && (
              <button
                onClick={handleContinue}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                {status !== "authenticated" ? "Sign in to Checkout" : "Continue"} <ArrowRight size={14} />
              </button>
            )}

            <p className="text-xs text-gray-400 text-center mt-4">🔒 Secured by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

"use client";
"use client";

import { ShippingFormInputs } from "@repo/types";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import { ConfirmError } from "@stripe/stripe-js";
import { useState } from "react";
import Spinner from "@/components/Spinner";

const CheckoutForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const checkout = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ConfirmError | null>(null);

  const handleClick = async () => {
    setLoading(true);
    await checkout.updateEmail(shippingForm.email);
    await checkout.updateShippingAddress({
      name: "shipping_address",
      address: {
        line1: shippingForm.address,
        city: shippingForm.city,
        country: "US",
      },
    });

    const res = await checkout.confirm();
    if (res.type === "error") {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <form>
      <PaymentElement options={{ layout: "accordion" }} />
      <button disabled={loading} onClick={handleClick}
        className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60 transition-all"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
        {loading
          ? <Spinner />
          : "Pay Now"}
      </button>
      {error && <p className="mt-3 text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{error.message}</p>}
    </form>
  );
};

export default CheckoutForm;

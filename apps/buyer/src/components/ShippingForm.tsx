"use client";

import { ShippingFormInputs, shippingFormSchema } from "@repo/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, User, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

const fields = [
  { name: "name"    as const, label: "Full Name",    type: "text",  placeholder: "John Doe",           icon: User      },
  { name: "email"   as const, label: "Email",         type: "email", placeholder: "john@example.com",   icon: Mail      },
  { name: "phone"   as const, label: "Phone",         type: "tel",   placeholder: "+1 234 567 8900",    icon: Phone     },
  { name: "address" as const, label: "Street Address",type: "text",  placeholder: "123 Main Street",    icon: MapPin    },
  { name: "city"    as const, label: "City",          type: "text",  placeholder: "New York",           icon: Building2 },
];

const ShippingForm = ({ setShippingForm }: { setShippingForm: (data: ShippingFormInputs) => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema as any),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<ShippingFormInputs> = (data) => {
    setShippingForm(data);
    router.push("/cart?step=3", { scroll: false });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Shipping Details</h2>
        <p className="text-xs text-gray-400">Enter the address where you want your order delivered.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {fields.map(({ name, label, type, placeholder, icon: Icon }) => (
          <div key={name} className={name === "address" ? "sm:col-span-2" : ""}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
            <div className="relative">
              <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register(name)}
                type={type}
                placeholder={placeholder}
                className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm outline-none transition-all bg-gray-50 ${
                  errors[name]
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                }`}
              />
            </div>
            {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]?.message}</p>}
          </div>
        ))}
      </div>

      <button type="submit"
        className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
        Continue to Payment <ArrowRight size={14} />
      </button>
    </form>
  );
};

export default ShippingForm;

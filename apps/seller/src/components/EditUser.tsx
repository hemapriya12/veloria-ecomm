"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SlidePanel from "./SlidePanel";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters!").max(50),
  email:    z.string().email("Invalid email address!"),
  phone:    z.string().min(10).max(15),
  address:  z.string().min(2),
  city:     z.string().min(2),
});

type Props = { open: boolean; onClose: () => void };

const inputCls = (err?: boolean) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 ${
    err ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
  }`;

export default function EditUser({ open, onClose }: Props) {
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "John Doe", email: "john.doe@gmail.com", phone: "+1 234 5678", address: "123 Main St", city: "New York" },
  });

  return (
    <SlidePanel open={open} onClose={onClose} title="Edit User" subtitle="Update user details" width="w-[400px]">
      <form onSubmit={handleSubmit(() => {})} className="flex flex-col gap-5 px-6 py-6">
        {[
          { name: "fullName" as const, label: "Full Name",  type: "text",     placeholder: "John Doe" },
          { name: "email"    as const, label: "Email",      type: "email",    placeholder: "john@example.com" },
          { name: "phone"    as const, label: "Phone",      type: "tel",      placeholder: "+1 234 5678" },
          { name: "address"  as const, label: "Address",    type: "text",     placeholder: "123 Main St" },
          { name: "city"     as const, label: "City",       type: "text",     placeholder: "New York" },
        ].map(({ name, label, type, placeholder }) => (
          <Controller key={name} name={name} control={control} render={({ field }) => (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
              <input {...field} type={type} placeholder={placeholder} className={inputCls(!!errors[name])} />
              {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]?.message}</p>}
            </div>
          )} />
        ))}
        <div className="pt-2 border-t border-gray-100">
          <button type="submit"
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
            Save Changes
          </button>
        </div>
      </form>
    </SlidePanel>
  );
}

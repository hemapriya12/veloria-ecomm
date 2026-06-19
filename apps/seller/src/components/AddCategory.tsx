"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoryFormSchema } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SlidePanel from "./SlidePanel";

type Props = { open: boolean; onClose: () => void };

const inputCls = (err?: boolean) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 ${
    err ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
  }`;

export default function AddCategory({ open, onClose }: Props) {
  const { data: session } = useSession();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: { name: "", slug: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof CategoryFormSchema>) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.user?.token}` },
      });
      if (!res.ok) throw new Error("Failed to create category!");
    },
    onSuccess: () => { toast.success("Category created"); reset(); onClose(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <SlidePanel open={open} onClose={onClose} title="Add Category" subtitle="Create a new product category" width="w-[400px]">
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-5 px-6 py-6 h-full">
        <Controller name="name" control={control} render={({ field }) => (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category Name</label>
            <input {...field} placeholder="e.g. Men's Clothing" className={inputCls(!!errors.name)} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
        )} />
        <Controller name="slug" control={control} render={({ field }) => (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">URL Key</label>
            <input {...field} placeholder="e.g. mens-clothing" className={inputCls(!!errors.slug)} />
            <p className="text-xs text-gray-400 mt-1">{errors.slug?.message ?? "Lowercase, hyphens only — used in the URL"}</p>
          </div>
        )} />
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button type="submit" disabled={mutation.isPending}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-all"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
            {mutation.isPending
              ? <Spinner />
              : "Create Category"}
          </button>
        </div>
      </form>
    </SlidePanel>
  );
}

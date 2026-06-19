"use client";

import SlidePanel from "./SlidePanel";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoryType, colors, ProductFormSchema, sizes } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "@/lib/cloudinary";

type Props = { open: boolean; onClose: () => void };

const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`,
  );
  if (!res.ok) throw new Error("Failed to fetch categories!");
  return res.json();
};

export default function AddProduct({ open, onClose }: Props) {
  const { data: session } = useSession();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      categorySlug: "",
      sizes: [],
      colors: [],
      images: {},
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to create product!");
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      reset();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  const watchedColors = watch("colors") ?? [];

  const handleImageUpload = async (
    file: File,
    key: string,
  ) => {
    try {
      const url = await uploadToCloudinary(file);
      setValue(
        "images",
        { ...getValues("images"), [key]: url },
        { shouldDirty: true, shouldValidate: true },
      );
    } catch (err: any) {
      toast.error(err.message || "Upload failed!");
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${hasError ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"}`;

  return (
    <SlidePanel open={open} onClose={onClose} title="Add Product" subtitle="Fill in the details to list a new product">
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col h-full">
          <div className="flex flex-col gap-5 px-6 py-6">

            {/* Basic info */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Basic Info</p>
              <div className="flex flex-col gap-4">
                <Controller name="name" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
                    <input {...field} placeholder="e.g. Nike Air Max 270" className={inputCls(!!errors.name)} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                )} />
                <Controller name="shortDescription" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
                    <input {...field} placeholder="One-line summary" className={inputCls(!!errors.shortDescription)} />
                    {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription.message}</p>}
                  </div>
                )} />
                <Controller name="description" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea {...field} rows={3} placeholder="Full product description..." className={`${inputCls(!!errors.description)} resize-none`} />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                  </div>
                )} />
              </div>
            </div>

            {/* Pricing & Category */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Pricing & Category</p>
              <div className="grid grid-cols-2 gap-4">
                <Controller name="price" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (cents)</label>
                    <input {...field} type="number" placeholder="e.g. 3990" className={inputCls(!!errors.price)} onChange={(e) => field.onChange(Number(e.target.value))} />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                  </div>
                )} />
                {categories && (
                  <Controller name="categorySlug" control={control} render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                      <select {...field} className={inputCls(!!errors.categorySlug)}>
                        <option value="">Select...</option>
                        {categories.map((cat: CategoryType) => (
                          <option key={cat.id} value={cat.slug}>{cat.name}</option>
                        ))}
                      </select>
                      {errors.categorySlug && <p className="text-xs text-red-500 mt-1">{errors.categorySlug.message}</p>}
                    </div>
                  )} />
                )}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sizes <span className="normal-case font-normal">(optional)</span></p>
              <Controller name="sizes" control={control} render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const active = field.value?.includes(size);
                    return (
                      <button key={size} type="button"
                        onClick={() => { const cur = field.value || []; field.onChange(active ? cur.filter((v) => v !== size) : [...cur, size]); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${active ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-200 text-gray-500 hover:border-emerald-300"}`}>
                        {size.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              )} />
            </div>

            {/* Colors */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Colors <span className="normal-case font-normal">(optional)</span></p>
              <Controller name="colors" control={control} render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const active = field.value?.includes(color);
                    return (
                      <button key={color} type="button"
                        onClick={() => {
                          const cur = field.value || [];
                          const next = active ? cur.filter((v) => v !== color) : [...cur, color];
                          field.onChange(next);
                          if (active) {
                            const imgs = { ...getValues("images") };
                            delete imgs[color];
                            setValue("images", imgs, { shouldValidate: true });
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${active ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        <span className="w-3 h-3 rounded-full border border-gray-200" style={{ background: color }} />
                        {color}
                      </button>
                    );
                  })}
                </div>
              )} />
            </div>

            {/* Images */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {watchedColors.length > 0 ? "Images (one per color)" : "Product Image"}
              </p>
              {watchedColors.length === 0 ? (
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 text-sm text-gray-400 hover:border-emerald-300 hover:text-emerald-600 cursor-pointer transition-all">
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await handleImageUpload(f, "default"); }} />
                    Upload image
                  </label>
                  <Controller name="images" control={control} render={({ field }) => (
                    <span className={`text-xs font-medium ${field.value?.["default"] ? "text-emerald-600" : "text-gray-400"}`}>
                      {field.value?.["default"] ? "✓ Uploaded" : "Required"}
                    </span>
                  )} />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {watchedColors.map((color) => (
                    <div key={color} className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full shrink-0 border border-gray-200" style={{ background: color }} />
                      <span className="text-xs text-gray-500 w-16 capitalize">{color}</span>
                      <label className="flex-1 flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-3 py-2 text-xs text-gray-400 hover:border-emerald-300 hover:text-emerald-600 cursor-pointer transition-all">
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await handleImageUpload(f, color); }} />
                        Upload
                      </label>
                      <Controller name="images" control={control} render={({ field }) => (
                        <span className={`text-xs font-medium shrink-0 ${field.value?.[color] ? "text-emerald-600" : "text-gray-400"}`}>
                          {field.value?.[color] ? "✓" : "—"}
                        </span>
                      )} />
                    </div>
                  ))}
                </div>
              )}
              {errors.images && (
                <p className="text-xs text-red-500 mt-1">{(errors.images as any)?.message ?? "Image is required"}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 shrink-0">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-all"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
            >
              {mutation.isPending
                ? <Spinner />
                : "Add Product"}
            </button>
          </div>
      </form>
    </SlidePanel>
  );
}

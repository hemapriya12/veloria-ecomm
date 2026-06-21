"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoryType, colors, ProductFormSchema, sizes } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Plus, X, Upload, Tag, Layers, DollarSign, Package } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Spinner from "@/components/Spinner";

const fetchCategories = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories!");
  return res.json();
};

const inputCls = (err?: boolean) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 ${
    err
      ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
  }`;

function Card({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Icon size={14} className="text-emerald-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function NewProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const [highlightInput, setHighlightInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const { control, handleSubmit, reset, watch, getValues, setValue, formState: { errors } } =
    useForm<z.infer<typeof ProductFormSchema>>({
      resolver: zodResolver(ProductFormSchema) as any,
      defaultValues: {
        name: "", shortDescription: "", description: "",
        price: 0, salePrice: undefined, sku: "", brand: "",
        stock: 0, status: "published",
        highlights: [], tags: [], weight: undefined,
        categorySlug: "", sizes: [], colors: [], images: {},
      },
    });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.user?.token}` },
      });
      if (!res.ok) throw new Error("Failed to create product!");
    },
    onSuccess: () => { toast.success("Product created successfully"); reset(); router.push("/products"); },
    onError: (e) => toast.error(e.message),
  });

  const watchedColors     = watch("colors")     ?? [];
  const watchedHighlights = watch("highlights") ?? [];
  const watchedTags       = watch("tags")       ?? [];
  const watchedStatus     = watch("status");

  const handleImageUpload = async (file: File, key: string) => {
    try {
      const url = await uploadToCloudinary(file);
      setValue("images", { ...getValues("images"), [key]: url }, { shouldDirty: true, shouldValidate: true });
    } catch (err: any) {
      toast.error(err.message || "Upload failed!");
    }
  };

  const addHighlight = () => {
    const val = highlightInput.trim();
    if (!val) return;
    setValue("highlights", [...watchedHighlights, val]);
    setHighlightInput("");
  };

  const addTag = () => {
    const val = tagInput.trim().toLowerCase();
    if (!val || watchedTags.includes(val)) return;
    setValue("tags", [...watchedTags, val]);
    setTagInput("");
  };

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/products" className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the details below to list a new product</p>
          </div>
        </div>

        {/* Status toggle */}
        <Controller name="status" control={control} render={({ field }) => (
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {["draft", "published"].map((s) => (
              <button key={s} type="button" onClick={() => field.onChange(s)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${field.value === s ? (s === "published" ? "bg-emerald-500 text-white shadow-sm" : "bg-white text-gray-700 shadow-sm") : "text-gray-400 hover:text-gray-600"}`}>
                {s}
              </button>
            ))}
          </div>
        )} />
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-5">

            {/* Product Details */}
            <Card title="Product Details" icon={Package}>
              <div className="flex flex-col gap-4">
                <Controller name="name" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Product Name *</label>
                    <input {...field} placeholder="e.g. Nike Air Max 270" className={inputCls(!!errors.name)} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                )} />

                <Controller name="shortDescription" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Short Description * <span className="text-gray-300 font-normal normal-case">({field.value?.length ?? 0}/60)</span>
                    </label>
                    <input {...field} placeholder="One-line summary shown in listings" maxLength={60} className={inputCls(!!errors.shortDescription)} />
                    {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription.message}</p>}
                  </div>
                )} />

                <Controller name="description" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Description *</label>
                    <textarea {...field} rows={5} placeholder="Detailed product description..." className={`${inputCls(!!errors.description)} resize-none`} />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                  </div>
                )} />
              </div>
            </Card>

            {/* Highlights */}
            <Card title="Product Highlights" icon={Layers}>
              <div>
                {watchedHighlights.length > 0 && (
                  <ul className="mb-3 flex flex-col gap-1.5">
                    {watchedHighlights.map((h, i) => (
                      <li key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{h}</span>
                        <button type="button" onClick={() => setValue("highlights", watchedHighlights.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 transition-colors">
                          <X size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-2">
                  <input
                    value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
                    placeholder="e.g. Waterproof material" className={inputCls()} />
                  <button type="button" onClick={addHighlight}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all shrink-0">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Bullet points shown on the product page — optional</p>
              </div>
            </Card>

            {/* Organisation */}
            <Card title="Organisation" icon={Tag}>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  {categories && (
                    <Controller name="categorySlug" control={control} render={({ field }) => (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category *</label>
                        <select {...field} className={inputCls(!!errors.categorySlug)}>
                          <option value="">Select...</option>
                          {categories.map((cat: CategoryType) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                        </select>
                        {errors.categorySlug && <p className="text-xs text-red-500 mt-1">{errors.categorySlug.message}</p>}
                      </div>
                    )} />
                  )}
                  <Controller name="brand" control={control} render={({ field }) => (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Brand</label>
                      <input {...field} placeholder="e.g. Nike" className={inputCls()} />
                    </div>
                  )} />
                </div>

                <Controller name="sku" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">SKU</label>
                    <input {...field} placeholder="e.g. SHOE-NK-001" className={inputCls()} />
                    <p className="text-xs text-gray-400 mt-1">Your internal product code</p>
                  </div>
                )} />

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tags <span className="font-normal normal-case">(optional)</span></label>
                  {watchedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {watchedTags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                          {tag}
                          <button type="button" onClick={() => setValue("tags", watchedTags.filter((t) => t !== tag))} className="text-gray-400 hover:text-red-400 transition-colors">
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                      placeholder="e.g. summer, cotton" className={inputCls()} />
                    <button type="button" onClick={addTag}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all shrink-0">
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex flex-col gap-5">

            {/* Pricing & Inventory */}
            <Card title="Pricing & Inventory" icon={DollarSign}>
              <div className="flex flex-col gap-4">
                <Controller name="price" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Price (cents) *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¢</span>
                      <input {...field} type="number" min={0} placeholder="3990" className={`${inputCls(!!errors.price)} pl-7`} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </div>
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                  </div>
                )} />

                <Controller name="salePrice" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Sale Price <span className="font-normal normal-case">(optional)</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¢</span>
                      <input value={field.value ?? ""} type="number" min={0} placeholder="Leave blank if no discount" className={`${inputCls(!!errors.salePrice)} pl-7`} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} />
                    </div>
                  </div>
                )} />

                <div className="grid grid-cols-2 gap-3">
                  <Controller name="stock" control={control} render={({ field }) => (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Stock Qty</label>
                      <input {...field} type="number" min={0} placeholder="0" className={inputCls(!!errors.stock)} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </div>
                  )} />
                  <Controller name="weight" control={control} render={({ field }) => (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Weight (kg)</label>
                      <input value={field.value ?? ""} type="number" min={0} step="0.01" placeholder="0.0" className={inputCls()} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} />
                    </div>
                  )} />
                </div>
              </div>
            </Card>

            {/* Sizes */}
            <Card title="Sizes" icon={Layers}>
              <Controller name="sizes" control={control} render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const active = field.value?.includes(size);
                    return (
                      <button key={size} type="button"
                        onClick={() => { const c = field.value || []; field.onChange(active ? c.filter((v) => v !== size) : [...c, size]); }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${active ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" : "border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-600"}`}>
                        {size.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              )} />
              <p className="text-xs text-gray-400 mt-3">Optional — skip for products without sizing</p>
            </Card>

            {/* Colors */}
            <Card title="Colors" icon={Layers}>
              <Controller name="colors" control={control} render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const active = field.value?.includes(color);
                    return (
                      <button key={color} type="button"
                        onClick={() => {
                          const c = field.value || [];
                          const next = active ? c.filter((v) => v !== color) : [...c, color];
                          field.onChange(next);
                          if (active) {
                            const imgs = { ...getValues("images") };
                            delete imgs[color];
                            setValue("images", imgs, { shouldValidate: true });
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${active ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        <span className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ background: color }} />
                        {color}
                      </button>
                    );
                  })}
                </div>
              )} />
              <p className="text-xs text-gray-400 mt-3">Optional — skip for electronics or single-color products</p>
            </Card>

            {/* Images */}
            <Card title={watchedColors.length > 0 ? "Images (one per color)" : "Product Image"} icon={Upload}>
              <div className="flex flex-col gap-3">
                {watchedColors.length === 0 ? (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-6 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group">
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await handleImageUpload(f, "default"); }} />
                    <Upload size={20} className="text-gray-300 group-hover:text-emerald-400 transition-colors" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500 group-hover:text-emerald-600">Click to upload image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
                    </div>
                    <Controller name="images" control={control} render={({ field }) => (
                      field.value?.["default"]
                        ? <span className="text-xs text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">✓ Uploaded</span>
                        : <></>
                    )} />
                  </label>
                ) : (
                  watchedColors.map((color) => (
                    <div key={color} className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full border border-gray-200 shadow-sm shrink-0" style={{ background: color }} />
                      <span className="text-xs text-gray-500 w-14 capitalize shrink-0">{color}</span>
                      <label className="flex-1 flex items-center justify-between rounded-xl border-2 border-dashed border-gray-200 px-3 py-2 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await handleImageUpload(f, color); }} />
                        <span className="text-xs text-gray-400">Upload</span>
                        <Controller name="images" control={control} render={({ field }) => (
                          <span className={`text-xs font-semibold ${field.value?.[color] ? "text-emerald-600" : "text-gray-300"}`}>
                            {field.value?.[color] ? "✓" : "—"}
                          </span>
                        )} />
                      </label>
                    </div>
                  ))
                )}
                {errors.images && <p className="text-xs text-red-500">{(errors.images as any)?.message ?? "Image is required"}</p>}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Link href="/products" className="flex-1 flex items-center justify-center rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </Link>
              <button type="submit" disabled={mutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-all"
                style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                {mutation.isPending
                  ? <Spinner />
                  : watchedStatus === "draft" ? "Save Draft" : "Publish Product"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

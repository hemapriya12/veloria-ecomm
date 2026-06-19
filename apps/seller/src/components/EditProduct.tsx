"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SlidePanel from "./SlidePanel";
import { DollarSign, Tag, Package, Percent } from "lucide-react";

type Props = { productId: number | null; onClose: () => void };

const inputCls = (err?: boolean) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 ${
    err ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
  }`;

export default function EditProduct({ productId, onClose }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({
    name: "", price: "", stock: "", status: "published",
    discountPercent: "0", sku: "", brand: "",
  });

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${productId}`)
      .then((r) => r.json())
      .then((p) => {
        setForm({
          name:            p.name             ?? "",
          price:           String(p.price     ?? ""),
          stock:           String(p.stock     ?? 0),
          status:          p.status           ?? "published",
          discountPercent: String(p.discountPercent ?? 0),
          sku:             p.sku              ?? "",
          brand:           p.brand            ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const discountedPrice = (() => {
    const p   = Number(form.price);
    const pct = Number(form.discountPercent);
    if (!p || pct <= 0 || pct >= 100) return null;
    return Math.round(p * (1 - pct / 100));
  })();

  const handleSave = async () => {
    if (!productId) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.user?.token}` },
        body: JSON.stringify({
          name:           form.name,
          price:          Number(form.price),
          stock:          Number(form.stock),
          status:         form.status,
          discountPercent: Number(form.discountPercent),
          sku:            form.sku || undefined,
          brand:          form.brand || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to update product");
      toast.success("Product updated");
      router.refresh();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <SlidePanel
      open={!!productId}
      onClose={onClose}
      title="Edit Product"
      subtitle="Update price, discount, stock and more"
      width="w-[420px]"
    >
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-6 py-6">

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <Package size={11} className="inline mr-1" />Product Name
            </label>
            <input value={form.name} onChange={set("name")} className={inputCls()} placeholder="Product name" />
          </div>

          {/* Price + Discount */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <DollarSign size={11} className="inline mr-1" />Price (cents)
            </label>
            <input value={form.price} onChange={set("price")} type="number" min={0} className={inputCls()} placeholder="e.g. 2999 = $29.99" />
            <p className="text-xs text-gray-400 mt-1">
              {form.price ? `= $${(Number(form.price) / 100).toFixed(2)}` : ""}
            </p>
          </div>

          {/* Discount percent */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <Percent size={11} className="inline mr-1" />Discount %
            </label>
            <input value={form.discountPercent} onChange={set("discountPercent")} type="number" min={0} max={99} className={inputCls()} placeholder="0" />
            {discountedPrice !== null && Number(form.discountPercent) > 0 && (
              <div className="mt-2 flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2">
                <span className="text-xs text-gray-400 line-through">${(Number(form.price) / 100).toFixed(2)}</span>
                <span className="text-sm font-bold text-emerald-600">${(discountedPrice / 100).toFixed(2)}</span>
                <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-semibold">{form.discountPercent}% OFF</span>
              </div>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Stock Quantity</label>
            <input value={form.stock} onChange={set("stock")} type="number" min={0} className={inputCls()} placeholder="0" />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
            <select value={form.status} onChange={set("status")} className={inputCls()}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* SKU + Brand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                <Tag size={11} className="inline mr-1" />SKU
              </label>
              <input value={form.sku} onChange={set("sku")} className={inputCls()} placeholder="SKU-001" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Brand</label>
              <input value={form.brand} onChange={set("brand")} className={inputCls()} placeholder="Nike" />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <button onClick={handleSave} disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
              {saving
                ? <Spinner />
                : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </SlidePanel>
  );
}

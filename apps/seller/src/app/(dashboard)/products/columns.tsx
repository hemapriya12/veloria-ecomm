"use client";

import { ProductType, getProductImage } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Copy, ExternalLink, Trash2, Pencil } from "lucide-react";
import TableCheckbox from "@/components/TableCheckbox";

// ── Three-dot dropdown ──────────────────────────────────────────────────────
function ActionsCell({ product, onDelete, onEdit }: { product: ProductType; onDelete: (id: number) => void; onEdit: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5">
          <button
            onClick={() => { navigator.clipboard.writeText(product.id.toString()); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left"
          >
            <Copy size={13} className="shrink-0" /> Copy ID
          </button>
          <Link
            href={`${process.env.NEXT_PUBLIC_CLIENT_URL ?? "http://localhost:3002"}/products/${product.id}`}
            target="_blank"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={13} className="shrink-0" /> View on site
          </Link>
          <button
            onClick={() => { onEdit(product.id); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left"
          >
            <Pencil size={13} className="shrink-0" /> Edit
          </button>
          <div className="my-1 mx-2 border-t border-gray-100" />
          <button
            onClick={() => { onDelete(product.id); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
          >
            <Trash2 size={13} className="shrink-0" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Inline-editable stock cell ──────────────────────────────────────────────
function StockCell({ product, onUpdate }: { product: ProductType; onUpdate: (id: number, stock: number) => Promise<void> }) {
  const stock = (product as any).stock ?? 0;
  const [editing, setEditing] = useState(false);
  const [value, setValue]     = useState(String(stock));
  const [saving, setSaving]   = useState(false);

  const save = async () => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num === stock) { setEditing(false); return; }
    setSaving(true);
    await onUpdate(product.id, num);
    setSaving(false);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          autoFocus
          type="number"
          min={0}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
          onBlur={save}
          className="w-16 rounded-lg border border-emerald-400 px-2 py-1 text-xs outline-none ring-2 ring-emerald-100"
        />
        {saving && <span className="h-3 w-3 animate-spin rounded-full border border-emerald-500 border-t-transparent" />}
      </div>
    );
  }

  const badge =
    stock === 0   ? "bg-red-100 text-red-600" :
    stock < 5     ? "bg-yellow-100 text-yellow-700" :
                    "bg-emerald-100 text-emerald-700";

  return (
    <button
      onClick={() => { setValue(String(stock)); setEditing(true); }}
      title="Click to edit"
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:ring-2 hover:ring-offset-1 hover:ring-emerald-300 cursor-pointer ${badge}`}
    >
      {stock === 0 ? "Out of stock" : stock}
    </button>
  );
}

// ── Column definitions ───────────────────────────────────────────────────────
export const createColumns = (
  onDelete: (id: number) => void,
  onUpdate: (id: number, stock: number) => Promise<void>,
  onEdit:   (id: number) => void,
): ColumnDef<ProductType>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <TableCheckbox indeterminate={table.getIsSomePageRowsSelected()} checked={table.getIsAllPageRowsSelected()} onChange={(c) => table.toggleAllPageRowsSelected(c)} />
    ),
    cell: ({ row }) => (
      <TableCheckbox checked={row.getIsSelected()} onChange={(c) => row.toggleSelected(c)} />
    ),
  },
  {
    id: "product",
    header: "Product",
    cell: ({ row }) => {
      const p = row.original;
      const imgSrc = getProductImage(p.images, p.colors[0]);
      return (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-11 h-11 relative rounded-xl overflow-hidden shrink-0 bg-gray-100">
            {imgSrc
              ? <Image src={imgSrc} alt={p.name} fill style={{ objectFit: "cover" }} />
              : <div className="w-full h-full bg-gray-100" />
            }
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{p.name}</p>
            {(p as any).brand && <p className="text-xs text-gray-400">{(p as any).brand}</p>}
            {(p as any).sku && <p className="text-[10px] text-gray-300 font-mono">{(p as any).sku}</p>}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "categorySlug",
    header: "Category",
    cell: ({ row }) => (
      <span className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-500 capitalize">
        {row.getValue("categorySlug")}
      </span>
    ),
  },
  {
    id: "pricing",
    header: "Price",
    cell: ({ row }) => {
      const p = row.original;
      const price     = p.price / 100;
      const salePrice = (p as any).salePrice != null ? (p as any).salePrice / 100 : null;
      return (
        <div>
          {salePrice != null ? (
            <>
              <p className="text-sm font-semibold text-red-500">${salePrice.toFixed(2)}</p>
              <p className="text-xs text-gray-400 line-through">${price.toFixed(2)}</p>
            </>
          ) : (
            <p className="text-sm font-semibold text-gray-900">${price.toFixed(2)}</p>
          )}
        </div>
      );
    },
  },
  {
    id: "stock",
    header: "Stock",
    cell: ({ row }) => <StockCell product={row.original} onUpdate={onUpdate} />,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).status ?? "published";
      return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell product={row.original} onDelete={onDelete} onEdit={onEdit} />,
  },
];

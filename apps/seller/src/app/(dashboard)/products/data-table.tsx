"use client";

import { Plus, Trash2 } from "lucide-react";
import EditProduct from "@/components/EditProduct";
import {
  flexRender, getCoreRowModel, getPaginationRowModel,
  getSortedRowModel, SortingState, useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTablePagination } from "@/components/TablePagination";
import { createColumns } from "./columns";
import { ProductType } from "@repo/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export function DataTable({ data }: { data: ProductType[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [editId, setEditId] = useState<number | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Product deleted");
      router.refresh();
    } catch {
      toast.error("Could not delete product");
    }
  };

  const handleUpdate = async (id: number, stock: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.user?.token}` },
        body: JSON.stringify({ stock }),
      });
      if (!res.ok) throw new Error();
      toast.success("Stock updated");
      router.refresh();
    } catch {
      toast.error("Could not update stock");
    }
  };

  const handleBulkDelete = async () => {
    const ids = table.getSelectedRowModel().rows.map((r) => r.original.id);
    if (!confirm(`Delete ${ids.length} product(s)?`)) return;
    await Promise.all(ids.map(handleDelete));
    setRowSelection({});
  };

  const columns = createColumns(handleDelete, handleUpdate, (id) => setEditId(id));

  const table = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: { sorting, rowSelection },
  });

  return (
    <>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <Link href="/products/new"
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
          <Plus size={15} /> Add Product
        </Link>
        {Object.keys(rowSelection).length > 0 && (
          <button onClick={handleBulkDelete}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-all">
            <Trash2 size={15} /> Delete ({Object.keys(rowSelection).length})
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-gray-100 bg-gray-50">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${row.getIsSelected() ? "bg-emerald-50/30" : ""}`}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400 text-sm">No products yet. Click "Add Product" to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <DataTablePagination table={table} />
    </div>
    <EditProduct productId={editId} onClose={() => setEditId(null)} />
    </>
  );
}

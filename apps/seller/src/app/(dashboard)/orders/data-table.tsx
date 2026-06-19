"use client";

import { Trash2 } from "lucide-react";
import {
  ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel,
  getSortedRowModel, SortingState, useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTablePagination } from "@/components/TablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex justify-end px-4 py-2.5 border-b border-gray-100">
          <button className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-all">
            <Trash2 size={14} /> Delete ({Object.keys(rowSelection).length})
          </button>
        </div>
      )}
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
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400 text-sm">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

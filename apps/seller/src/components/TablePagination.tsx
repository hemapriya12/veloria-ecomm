"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props<TData> { table: Table<TData>; }

export function DataTablePagination<TData>({ table }: Props<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
      <span>{total === 0 ? "0" : `${start}–${end}`} of {total}</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">Rows:</span>
          <select value={pageSize} onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-emerald-400">
            {[10, 20, 30, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft size={15} />
          </button>
          <span className="text-xs px-1">Page {pageIndex + 1} / {table.getPageCount() || 1}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

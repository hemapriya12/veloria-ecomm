"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { OrderType } from "@repo/types";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@example.com";
const LIMIT = 20;

const FULFILLMENT_OPTIONS = [
  { value: "",            label: "All Fulfillment" },
  { value: "pending",     label: "Pending"         },
  { value: "processing",  label: "Processing"      },
  { value: "shipped",     label: "Shipped"         },
  { value: "delivered",   label: "Delivered"       },
  { value: "cancelled",   label: "Cancelled"       },
];

const STATUS_OPTIONS = [
  { value: "",        label: "All Payments" },
  { value: "success", label: "Success"      },
  { value: "failed",  label: "Failed"       },
];

const MONTH_OPTIONS = [
  { value: "", label: "All Time" },
  { value: "2026-06-01T00:00:00.000Z|2026-06-30T23:59:59.000Z", label: "Jun 2026" },
  { value: "2026-05-01T00:00:00.000Z|2026-05-31T23:59:59.000Z", label: "May 2026" },
  { value: "2026-04-01T00:00:00.000Z|2026-04-30T23:59:59.000Z", label: "Apr 2026" },
  { value: "2026-03-01T00:00:00.000Z|2026-03-31T23:59:59.000Z", label: "Mar 2026" },
  { value: "2026-02-01T00:00:00.000Z|2026-02-28T23:59:59.000Z", label: "Feb 2026" },
  { value: "2026-01-01T00:00:00.000Z|2026-01-31T23:59:59.000Z", label: "Jan 2026" },
];

export default function OrdersPage() {
  const { data: session } = useSession();
  const email   = session?.user?.email ?? "";
  const isAdmin = email === ADMIN_EMAIL;

  const [orders,      setOrders]      = useState<OrderType[]>([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [statusFilter,      setStatusFilter]      = useState("");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("");
  const [monthFilter,       setMonthFilter]       = useState("");

  const totalPages = Math.ceil(total / LIMIT);

  const fetchOrders = useCallback(async () => {
    if (!session?.user?.token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(LIMIT), page: String(page) });
      if (!isAdmin) params.set("sellerEmail", email);
      if (statusFilter)      params.set("status",            statusFilter);
      if (fulfillmentFilter) params.set("fulfillmentStatus", fulfillmentFilter);
      if (monthFilter) {
        const [startDate, endDate] = monthFilter.split("|");
        params.set("startDate", startDate!);
        params.set("endDate",   endDate!);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?${params}`,
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      if (res.ok) {
        const json = await res.json();
        setOrders(json.orders ?? []);
        setTotal(json.total  ?? 0);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token, email, isAdmin, page, statusFilter, fulfillmentFilter, monthFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [statusFilter, fulfillmentFilter, monthFilter]);

  const filtered = search
    ? orders.filter(o =>
        o.email?.toLowerCase().includes(search.toLowerCase()) ||
        o._id?.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="flex flex-col gap-4">
      {/* DEBUG — remove after confirming */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-xs text-yellow-800 font-mono">
        v2 | session: {session ? "✅" : "⏳"} | email: {email || "none"} | loading: {String(loading)} | total: {total}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isAdmin ? "All orders — " : "Your orders — "}
            <span className="font-medium text-gray-700">{total.toLocaleString()}</span> total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
        <SlidersHorizontal size={14} className="text-gray-400 shrink-0" />

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50"
          />
        </div>

        {/* Payment status */}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-400 bg-gray-50 text-gray-700">
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Fulfillment status */}
        <select value={fulfillmentFilter} onChange={e => setFulfillmentFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-400 bg-gray-50 text-gray-700">
          {FULFILLMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Month filter */}
        <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-400 bg-gray-50 text-gray-700">
          {MONTH_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {(statusFilter || fulfillmentFilter || monthFilter || search) && (
          <button onClick={() => { setStatusFilter(""); setFulfillmentFilter(""); setMonthFilter(""); setSearch(""); }}
            className="text-xs text-red-500 hover:text-red-700 font-medium px-2">
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.1 }} />
            ))}
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-700">{page}</span> of <span className="font-medium text-gray-700">{totalPages.toLocaleString()}</span>
            {" "}— showing {orders.length} of {total.toLocaleString()} orders
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(1)} disabled={page === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              First
            </button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={14} />
            </button>
            <span className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const p = start + i;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs font-medium rounded-lg border transition-colors ${
                      p === page ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}>
                    {p}
                  </button>
                );
              })}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronRight size={14} />
            </button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

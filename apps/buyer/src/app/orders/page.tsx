"use client";

import { OrderType } from "@repo/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, CheckCircle, Clock, XCircle, Truck, RotateCcw, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import ReturnButton from "@/components/ReturnButton";
import ReviewModal from "@/components/ReviewModal";
import Spinner from "@/components/Spinner";

const fulfillmentConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string; bg: string }> = {
  pending:    { label: "Pending",    icon: Clock,       color: "text-yellow-600",  bg: "bg-yellow-50"  },
  processing: { label: "Processing", icon: Clock,       color: "text-blue-600",    bg: "bg-blue-50"    },
  shipped:    { label: "Shipped",    icon: Truck,       color: "text-indigo-600",  bg: "bg-indigo-50"  },
  delivered:  { label: "Delivered",  icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  cancelled:  { label: "Cancelled",  icon: XCircle,     color: "text-red-500",     bg: "bg-red-50"     },
};

const returnConfig: Record<string, { label: string; color: string; bg: string }> = {
  requested: { label: "Return Requested", color: "text-orange-600",  bg: "bg-orange-50"  },
  approved:  { label: "Return Approved",  color: "text-emerald-600", bg: "bg-emerald-50" },
  rejected:  { label: "Return Rejected",  color: "text-red-500",     bg: "bg-red-50"     },
};

const FULFILLMENT_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending",     label: "Pending"     },
  { value: "processing",  label: "Processing"  },
  { value: "shipped",     label: "Shipped"     },
  { value: "delivered",   label: "Delivered"   },
  { value: "cancelled",   label: "Cancelled"   },
];

const YEAR_OPTIONS = [
  { value: "", label: "All Years" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
];

const MONTH_OPTIONS = [
  { value: "",   label: "All Months" },
  { value: "1",  label: "January"   },
  { value: "2",  label: "February"  },
  { value: "3",  label: "March"     },
  { value: "4",  label: "April"     },
  { value: "5",  label: "May"       },
  { value: "6",  label: "June"      },
  { value: "7",  label: "July"      },
  { value: "8",  label: "August"    },
  { value: "9",  label: "September" },
  { value: "10", label: "October"   },
  { value: "11", label: "November"  },
  { value: "12", label: "December"  },
];

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [allOrders,  setAllOrders]  = useState<OrderType[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter,   setYearFilter]   = useState("");
  const [monthFilter,  setMonthFilter]  = useState("");
  const [page,         setPage]         = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/sign-in"); return; }
    if (status !== "authenticated") return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("fulfillmentStatus", statusFilter);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders?${params}`,
          { headers: { Authorization: `Bearer ${session.user.token}` } }
        );
        if (res.ok) setAllOrders(await res.json());
      } catch { setAllOrders([]); }
      finally  { setLoading(false); }
    };
    fetchOrders();
  }, [status, session?.user?.token, statusFilter, router]);

  // reset page when filters change
  useEffect(() => setPage(1), [statusFilter, yearFilter, monthFilter]);

  // client-side year/month filter
  const filtered = allOrders.filter((order) => {
    if (!yearFilter && !monthFilter) return true;
    const d = new Date((order as any).createdAt);
    if (yearFilter  && String(d.getFullYear()) !== yearFilter) return false;
    if (monthFilter && String(d.getMonth() + 1) !== monthFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = statusFilter || yearFilter || monthFilter;

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {loading ? "Loading..." : `${filtered.length} order${filtered.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
        <SlidersHorizontal size={13} className="text-gray-400 shrink-0" />

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-violet-400 bg-gray-50">
          {FULFILLMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
          className="text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-violet-400 bg-gray-50">
          {YEAR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
          className="text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-violet-400 bg-gray-50">
          {MONTH_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {hasFilters && (
          <button onClick={() => { setStatusFilter(""); setYearFilter(""); setMonthFilter(""); }}
            className="text-xs text-red-500 hover:text-red-700 font-medium px-2">
            Clear filters
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
            <Package size={26} className="text-violet-400" />
          </div>
          <p className="text-gray-500 text-sm">
            {hasFilters ? "No orders match your filters." : "You haven't placed any orders yet."}
          </p>
          {hasFilters ? (
            <button onClick={() => { setStatusFilter(""); setYearFilter(""); setMonthFilter(""); }}
              className="text-sm text-violet-600 hover:underline">Clear filters</button>
          ) : (
            <a href="/products" className="rounded-xl px-5 py-2 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
              Start Shopping
            </a>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {paginated.map((order) => {
              const fulfillment  = (order as any).fulfillmentStatus ?? "pending";
              const returnStatus = (order as any).returnStatus ?? "none";
              const fCfg  = fulfillmentConfig[fulfillment] ?? fulfillmentConfig["pending"]!;
              const rCfg  = returnConfig[returnStatus];
              const FIcon = fCfg.icon;
              const orderDate    = new Date((order as any).createdAt);
              const daysSince    = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
              const withinWindow = daysSince <= 30;
              const canReturn    = fulfillment === "delivered" && withinWindow && (returnStatus === "none" || returnStatus === "requested");

              return (
                <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                      <p className="font-mono text-xs font-semibold text-gray-700">#{order._id.slice(-12).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">Paid</span>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${fCfg.bg} ${fCfg.color}`}>
                        <FIcon size={11} /> {fCfg.label}
                      </span>
                      {rCfg && (
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${rCfg.bg} ${rCfg.color}`}>
                          <RotateCcw size={11} /> {rCfg.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {order.products && order.products.length > 0 && (
                    <div className="flex flex-col gap-2 mb-4">
                      {order.products.map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-sm gap-2">
                          <span className="text-gray-600 flex-1 min-w-0 truncate">
                            {p.name} <span className="text-gray-400">×{p.quantity}</span>
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            {fulfillment === "delivered" && (p as any).productId && (
                              <ReviewModal productId={(p as any).productId} productName={p.name} />
                            )}
                            <span className="font-medium text-gray-800">${((p.price * p.quantity) / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-gray-50 pt-3 flex items-center justify-between flex-wrap gap-2">
                    <p className="text-gray-400 text-xs">
                      {orderDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <div className="flex items-center gap-3">
                      {canReturn && <ReturnButton orderId={order._id} returnStatus={returnStatus} />}
                      {fulfillment === "delivered" && !withinWindow && returnStatus === "none" && (
                        <span className="text-xs text-gray-400 italic">Return window closed</span>
                      )}
                      <p className="font-bold text-gray-900">${(order.amount / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-gray-500">
                Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                {" "}— {filtered.length} orders
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs font-medium rounded-xl border transition-colors ${
                        p === page ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

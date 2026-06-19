export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ReturnActions from "@/components/ReturnActions";
import { RotateCcw } from "lucide-react";

const fetchReturns = async () => {
  const session = await getServerSession(authOptions);
  const token   = session?.user?.token;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/returns`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? res.json() : [];
  } catch { return []; }
};

const returnBadge: Record<string, { label: string; color: string; bg: string }> = {
  requested: { label: "Requested", color: "text-orange-600", bg: "bg-orange-50" },
  approved:  { label: "Approved",  color: "text-emerald-600", bg: "bg-emerald-50" },
  rejected:  { label: "Rejected",  color: "text-red-500",    bg: "bg-red-50"     },
};

export default async function ReturnsPage() {
  const returns = await fetchReturns();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Returns</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {returns.length} return request{returns.length !== 1 ? "s" : ""}
        </p>
      </div>

      {returns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <RotateCcw size={22} className="text-emerald-500" />
          </div>
          <p className="text-gray-400 text-sm">No return requests yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {returns.map((order: any) => {
            const badge = returnBadge[order.returnStatus] ?? returnBadge["requested"]!;
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                    <p className="font-mono text-xs font-semibold text-gray-700">#{order._id.slice(-12).toUpperCase()}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.email}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Return Reason</p>
                  <p className="text-sm text-gray-700">{order.returnReason || "No reason provided"}</p>
                </div>

                <div className="text-xs text-gray-400 mb-3">
                  {order.products?.map((p: any, i: number) => (
                    <span key={i}>{p.name} ×{p.quantity}{i < order.products.length - 1 ? ", " : ""}</span>
                  ))}
                  <span className="ml-2 font-semibold text-gray-700">${(order.amount / 100).toFixed(2)}</span>
                </div>

                {order.returnStatus === "requested" && (
                  <ReturnActions orderId={order._id} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

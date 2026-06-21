import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { OrderType } from "@repo/types";
import { redirect } from "next/navigation";
import { Package, CheckCircle, Clock, XCircle, Truck, RotateCcw } from "lucide-react";
import ReturnButton from "@/components/ReturnButton";
import ReviewModal from "@/components/ReviewModal";

const fetchOrders = async () => {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  if (!token) return null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? (res.json() as Promise<OrderType[]>) : [];
  } catch {
    return [];
  }
};

const fulfillmentConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string; bg: string }> = {
  pending:    { label: "Pending",    icon: Clock,       color: "text-yellow-600",  bg: "bg-yellow-50"   },
  processing: { label: "Processing", icon: Clock,       color: "text-blue-600",    bg: "bg-blue-50"     },
  shipped:    { label: "Shipped",    icon: Truck,       color: "text-indigo-600",  bg: "bg-indigo-50"   },
  delivered:  { label: "Delivered",  icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50"  },
  cancelled:  { label: "Cancelled",  icon: XCircle,     color: "text-red-500",     bg: "bg-red-50"      },
};

const returnConfig: Record<string, { label: string; color: string; bg: string }> = {
  requested: { label: "Return Requested", color: "text-orange-600", bg: "bg-orange-50" },
  approved:  { label: "Return Approved",  color: "text-emerald-600", bg: "bg-emerald-50" },
  rejected:  { label: "Return Rejected",  color: "text-red-500",    bg: "bg-red-50"     },
};

const OrdersPage = async () => {
  const orders = await fetchOrders();
  if (orders === null) redirect("/sign-in");

  return (
    <div className="flex flex-col gap-6 mt-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {orders.length === 0 ? "No orders yet" : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
            <Package size={26} className="text-violet-400" />
          </div>
          <p className="text-gray-500 text-sm">You haven&apos;t placed any orders yet.</p>
          <a href="/products"
            className="rounded-xl px-5 py-2 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const fulfillment  = (order as any).fulfillmentStatus ?? "pending";
            const returnStatus = (order as any).returnStatus ?? "none";
            const fCfg  = fulfillmentConfig[fulfillment] ?? fulfillmentConfig["pending"]!;
            const rCfg  = returnConfig[returnStatus];
            const FIcon = fCfg.icon;
            const orderDate   = new Date((order as any).createdAt);
            const daysSince   = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
            const withinWindow = daysSince <= 30;
            const canReturn   = fulfillment === "delivered" && withinWindow && (returnStatus === "none" || returnStatus === "requested");

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                    <p className="font-mono text-xs font-semibold text-gray-700">#{order._id.slice(-12).toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Payment */}
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                      Paid
                    </span>
                    {/* Fulfillment */}
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${fCfg.bg} ${fCfg.color}`}>
                      <FIcon size={11} /> {fCfg.label}
                    </span>
                    {/* Return status */}
                    {rCfg && (
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${rCfg.bg} ${rCfg.color}`}>
                        <RotateCcw size={11} /> {rCfg.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Products */}
                {order.products && order.products.length > 0 && (
                  <div className="flex flex-col gap-2 mb-4">
                    {order.products.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-sm gap-2">
                        <span className="text-gray-600 flex-1 min-w-0 truncate">
                          {p.name} <span className="text-gray-400">×{p.quantity}</span>
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {fulfillment === "delivered" && (p as any).productId && (
                            <ReviewModal
                              productId={(p as any).productId}
                              productName={p.name}
                            />
                          )}
                          <span className="font-medium text-gray-800">${((p.price * p.quantity) / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-50 pt-3 flex items-center justify-between flex-wrap gap-2">
                  <p className="text-gray-400 text-xs">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "-"}
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
      )}
    </div>
  );
};

export default OrdersPage;

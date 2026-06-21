import Link from "next/link";
import { CheckCircle, XCircle, Package, ArrowRight, Home } from "lucide-react";

const ReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }> | undefined;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <XCircle size={28} className="text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">No session found</h1>
        <p className="text-sm text-gray-400">Something went wrong with your payment.</p>
        <Link href="/" className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
          <Home size={14} /> Go Home
        </Link>
      </div>
    );
  }

  const res  = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${session_id}`);
  const data = await res.json();
  const success = data.paymentStatus === "paid" || data.status === "complete";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 py-16">

      {/* Icon */}
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${success ? "bg-emerald-50" : "bg-red-50"}`}
        style={success ? { background: "linear-gradient(135deg, #ecfdf5, #d1fae5)" } : {}}>
        {success
          ? <CheckCircle size={36} className="text-emerald-500" />
          : <XCircle    size={36} className="text-red-400" />
        }
      </div>

      {/* Message */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {success ? "Payment Successful!" : "Payment Failed"}
        </h1>
        <p className="text-sm text-gray-400 max-w-xs">
          {success
            ? "Thank you for your purchase. Your order is being processed and you'll receive a confirmation email shortly."
            : "Something went wrong with your payment. Please try again or contact support."
          }
        </p>
      </div>

      {/* Order summary pill */}
      {success && (
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <Package size={18} className="text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Payment status</p>
            <p className="text-sm font-semibold text-gray-800 capitalize">{data.paymentStatus ?? data.status}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {success && (
          <Link href="/orders"
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            <Package size={14} /> View Orders <ArrowRight size={14} />
          </Link>
        )}
        <Link href="/"
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
          <Home size={14} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ReturnPage;

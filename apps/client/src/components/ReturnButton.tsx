"use client";
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RotateCcw, X, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

// Shown when returnStatus === "none" — lets user request a return
function RequestReturnButton({ orderId }: { orderId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen]       = useState(false);
  const [reason, setReason]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) { toast.error("Please provide a reason"); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders/${orderId}/return`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.user?.token}` },
          body: JSON.stringify({ reason }),
        }
      );
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      toast.success("Return request submitted!");
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit return");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 transition-colors"
      >
        <RotateCcw size={12} /> Request Return
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Request Return</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Please describe why you&apos;d like to return this order.</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="e.g. Wrong size, damaged item, not as described..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                {loading
                  ? <Spinner />
                  : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Shown when returnStatus === "requested" — lets user cancel their pending request
function CancelReturnButton({ orderId }: { orderId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders/${orderId}/return`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      toast.success("Return request cancelled.");
      setConfirm(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel return");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setConfirm(true)}
        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
      >
        <Trash2 size={12} /> Cancel Return
      </button>

      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Cancel Return Request?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your return request will be withdrawn. You can submit a new one if needed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Keep Request
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {loading
                  ? <Spinner />
                  : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ReturnButton({
  orderId,
  returnStatus,
}: {
  orderId: string;
  returnStatus?: string;
}) {
  if (returnStatus === "requested") {
    return <CancelReturnButton orderId={orderId} />;
  }
  return <RequestReturnButton orderId={orderId} />;
}

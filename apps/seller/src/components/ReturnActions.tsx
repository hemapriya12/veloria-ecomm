"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

export default function ReturnActions({ orderId }: { orderId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const handle = async (action: "approve" | "reject") => {
    setLoading(action);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders/${orderId}/return-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.user?.token}` },
        body: JSON.stringify({ returnStatus: action === "approve" ? "approved" : "rejected" }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Return ${action}d`);
      router.refresh();
    } catch {
      toast.error("Failed to update return status");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handle("approve")} disabled={!!loading}
        className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 transition-all"
        style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
        {loading === "approve" ? <Spinner /> : <><Check size={14} /> Approve</>}
      </button>
      <button onClick={() => handle("reject")} disabled={!!loading}
        className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-60 transition-all">
        {loading === "reject" ? <Spinner color="red" /> : <><X size={14} /> Reject</>}
      </button>
    </div>
  );
}

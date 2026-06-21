"use client";
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star, Send, X } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            size={24}
            className={`transition-colors ${
              (hover || value) >= s
                ? "fill-amber-400 text-amber-400"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewModal({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const { data: session } = useSession();
  const [open, setOpen]         = useState(false);
  const [rating, setRating]     = useState(5);
  const [comment, setComment]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) { toast.error("Please write a comment"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify({
            productId,
            productName,
            rating,
            comment,
            userName: session?.user?.name ?? "Anonymous",
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Review submitted! Thank you.");
      setDone(true);
      setTimeout(() => setOpen(false), 1200);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={done}
        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100 transition-all disabled:opacity-50"
      >
        <Star size={12} className="fill-amber-400 text-amber-400" />
        {done ? "Reviewed" : "Write Review"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Write a Review</h2>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{productName}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Your rating</p>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Your review</p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience with this product..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                {submitting ? (
                  <Spinner />
                ) : (
                  <><Send size={13} /> Submit Review</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

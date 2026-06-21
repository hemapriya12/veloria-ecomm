"use client";
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Star, Send } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

type Review = { _id: string; userName: string; rating: number; comment: string; createdAt: string };

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((s) => (
        <button key={s} type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}>
          <Star size={18}
            className={`transition-colors ${(hover || value) >= s ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId }: { productId: number }) {
  const { data: session, status } = useSession();
  const [reviews, setReviews]   = useState<Review[]>([]);
  const [rating, setRating]     = useState(5);
  const [comment, setComment]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = () => {
    fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/reviews/${productId}`)
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setReviews(d))
      .catch(() => {});
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) { toast.error("Please write a comment"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.user?.token}` },
        body: JSON.stringify({ productId, rating, comment, userName: session?.user?.name ?? "Anonymous" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Review submitted!");
      setComment(""); setRating(5);
      fetchReviews();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <StarRating value={Math.round(avg)} />
            <span className="text-sm text-gray-500">{avg.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Write a review */}
      {status === "authenticated" ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-5 flex flex-col gap-3 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Write a Review</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Your rating:</span>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share your experience with this product..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
          />
          <button type="submit" disabled={submitting}
            className="self-end flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            {submitting ? <Spinner /> : <><Send size={13} /> Submit Review</>}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
          <p className="text-sm text-gray-500">
            <a href="/sign-in" className="text-violet-600 font-medium hover:underline">Sign in</a> to leave a review
          </p>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.userName}</p>
                  <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <StarRating value={r.rating} />
              </div>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

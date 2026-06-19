export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Star, MessageSquare, TrendingUp } from "lucide-react";

const fetchReviews = async () => {
  const session = await getServerSession(authOptions);
  const token   = session?.user?.token;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? res.json() : [];
  } catch { return []; }
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={13} className={s <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const reviews = await fetchReviews();
  const avg = reviews.length
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length)
    : 0;

  // Rating distribution
  const dist = [5,4,3,2,1].map((star) => ({
    star,
    count: reviews.filter((r: any) => r.rating === star).length,
    pct: reviews.length
      ? Math.round((reviews.filter((r: any) => r.rating === star).length / reviews.length) * 100)
      : 0,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""} · {avg.toFixed(1)} avg rating
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
            <MessageSquare size={22} className="text-amber-500" />
          </div>
          <p className="text-gray-400 text-sm">No reviews yet</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Average */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Star size={22} className="fill-amber-400 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{avg.toFixed(1)}</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={11} className={s <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Average rating</p>
              </div>
            </div>

            {/* Total */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                <MessageSquare size={22} className="text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                <p className="text-xs text-gray-400 mt-1">Total reviews</p>
              </div>
            </div>

            {/* 5-star % */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <TrendingUp size={22} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dist[0]!.pct}%</p>
                <p className="text-xs text-gray-400 mt-1">5-star reviews</p>
              </div>
            </div>
          </div>

          {/* Rating distribution */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Rating Breakdown</h2>
            <div className="flex flex-col gap-2">
              {dist.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-14 shrink-0">
                    <span className="text-xs font-medium text-gray-600">{star}</span>
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-amber-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">{count} ({pct}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reviews.map((r: any) => (
              <div key={r._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-violet-600">
                        {r.userName?.[0]?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{r.userName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                <div className="mt-3">
                  <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                    {r.productName || `Product #${r.productId}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

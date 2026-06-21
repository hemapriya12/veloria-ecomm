"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  hasMore,
  category,
  sort,
  search,
}: {
  currentPage: number;
  hasMore: boolean;
  category?: string;
  sort?: string;
  search?: string;
}) {
  const router = useRouter();

  const buildUrl = (page: number) => {
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (sort)     qs.set("sort", sort);
    if (search)   qs.set("search", search);
    if (page > 1) qs.set("page", String(page));
    return `/products?${qs.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-12">
      <button
        onClick={() => router.push(buildUrl(currentPage - 1))}
        disabled={currentPage <= 1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={15} /> Previous
      </button>

      <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold">
        Page {currentPage}
      </span>

      <button
        onClick={() => router.push(buildUrl(currentPage + 1))}
        disabled={!hasMore}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next <ChevronRight size={15} />
      </button>
    </div>
  );
}

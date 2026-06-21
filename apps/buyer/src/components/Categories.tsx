"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid } from "lucide-react";

type Category = { id: number; name: string; slug: string };

// limit: when set, only show that many category chips (homepage uses 5)
// personalizedSlugs: ordered list of the user's top category slugs by purchase freq
const Categories = ({
  limit,
  personalizedSlugs,
}: {
  limit?: number;
  personalizedSlugs?: string[];
}) => {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);

  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    const CACHE_KEY = "veloria_categories";

    const applyFilter = (data: Category[]) => {
      let visible: Category[];
      if (personalizedSlugs && personalizedSlugs.length > 0) {
        visible = personalizedSlugs
          .map((slug) => data.find((c) => c.slug === slug))
          .filter((c): c is Category => c !== undefined);
      } else if (limit) {
        visible = data.slice(0, limit);
      } else {
        visible = data;
      }
      if (limit) visible = visible.slice(0, limit);
      setCategories(visible);
    };

    // Serve from sessionStorage cache to avoid hitting the API on every navigation
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) { applyFilter(JSON.parse(cached)); return; }
    } catch {}

    fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`)
      .then((r) => r.json())
      .then((data: Category[]) => {
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
        applyFilter(data);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const active   = "bg-violet-600 text-white shadow-sm";
  const inactive = "bg-white text-gray-500 border border-gray-200 hover:border-violet-300 hover:text-violet-600";

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => handleChange(null)}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          !selectedCategory || selectedCategory === "all" ? active : inactive
        }`}
      >
        <LayoutGrid size={13} /> All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleChange(cat.slug)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            cat.slug === selectedCategory ? active : inactive
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default Categories;

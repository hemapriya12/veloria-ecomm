"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const Filter = () => {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-end gap-2 my-4">
      <ArrowUpDown size={13} className="text-gray-400" />
      <select
        defaultValue={searchParams.get("sort") ?? "newest"}
        onChange={(e) => handleFilter(e.target.value)}
        className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-violet-400 bg-white text-gray-600"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
    </div>
  );
};

export default Filter;

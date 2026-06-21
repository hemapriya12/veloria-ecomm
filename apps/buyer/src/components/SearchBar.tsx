"use client";

import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { getProductImage } from "@repo/types";

const RECENT_KEY = "veloria_recent_searches";
const MAX_RECENT = 5;

type Hit = {
  id: number;
  name: string;
  brand?: string;
  price: number;
  salePrice?: number;
  categorySlug: string;
  images: Record<string, string>;
};

function loadRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); }
  catch { return []; }
}

function saveRecent(query: string) {
  const prev = loadRecent().filter((q) => q !== query);
  localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...prev].slice(0, MAX_RECENT)));
}

function removeRecent(query: string) {
  const next = loadRecent().filter((q) => q !== query);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export default function SearchBar() {
  const [value, setValue]       = useState("");
  const [hits, setHits]         = useState<Hit[]>([]);
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState(-1);
  const [recent, setRecent]     = useState<string[]>([]);
  const inputRef                = useRef<HTMLInputElement>(null);
  const containerRef            = useRef<HTMLDivElement>(null);
  const searchParams            = useSearchParams();
  const router                  = useRouter();

  // Load recent on mount
  useEffect(() => { setRecent(loadRecent()); }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced live search — fires 300ms after user stops typing
  const fetchHits = useCallback(async (q: string) => {
    if (!q.trim()) { setHits([]); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?search=${encodeURIComponent(q)}&limit=6`
      );
      const data = await res.json();
      setHits(Array.isArray(data) ? data : []);
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => fetchHits(value), 300);
    return () => clearTimeout(id);
  }, [value, fetchHits]);

  const navigate = (query: string) => {
    if (!query.trim()) return;
    saveRecent(query.trim());
    setRecent(loadRecent());
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", query.trim());
    params.delete("category");
    router.push(`/products?${params.toString()}`);
    setOpen(false);
    setValue("");
  };

  const goToProduct = (id: number, name: string) => {
    saveRecent(name);
    setRecent(loadRecent());
    router.push(`/products/${id}`);
    setOpen(false);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = hits.length > 0 ? hits : [];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && hits[active]) {
        goToProduct(hits[active]!.id, hits[active]!.name);
      } else {
        navigate(value);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setValue("");
    }
  };

  const showDropdown = open && (value.length > 0 || recent.length > 0);
  const showHints    = value.length === 0 && recent.length > 0;

  return (
    <div ref={containerRef} className="hidden sm:block relative w-full max-w-sm">
      {/* Input */}
      <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all ${
        open ? "border-violet-400 bg-white ring-2 ring-violet-100" : "border-gray-200 bg-gray-50"
      }`}>
        {loading
          ? <span className="w-3.5 h-3.5 rounded-full border-2 border-violet-400 border-t-transparent animate-spin shrink-0" />
          : <Search size={14} className="text-gray-400 shrink-0" />
        }
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder="Search products, brands..."
          className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400 min-w-0"
          onChange={(e) => { setValue(e.target.value); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <button onClick={() => { setValue(""); setHits([]); inputRef.current?.focus(); }}>
            <X size={13} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-11 left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">

          {/* Recent searches (when input is empty) */}
          {showHints && (
            <div className="py-2">
              <p className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Recent searches
              </p>
              {recent.map((q) => (
                <div key={q} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 group cursor-pointer"
                  onClick={() => { setValue(q); inputRef.current?.focus(); }}>
                  <Clock size={13} className="text-gray-300 shrink-0" />
                  <span className="text-sm text-gray-600 flex-1">{q}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeRecent(q); setRecent(loadRecent()); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={11} className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Live results */}
          {value.length > 0 && (
            <>
              {hits.length === 0 && !loading ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-500">No results for <span className="font-medium">"{value}"</span></p>
                  <p className="text-xs text-gray-400 mt-1">Try a different keyword or browse categories</p>
                </div>
              ) : (
                <div className="py-1.5">
                  <p className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    Products
                  </p>
                  {hits.map((hit, i) => {
                    const price    = hit.salePrice ?? hit.price;
                    const thumb    = getProductImage(hit.images);
                    const isActive = i === active;
                    return (
                      <button
                        key={hit.id}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => goToProduct(hit.id, hit.name)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isActive ? "bg-violet-50" : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {thumb ? (
                            <Image src={thumb} alt={hit.name} width={40} height={40} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">{hit.name}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {hit.brand && <span className="text-violet-500">{hit.brand} · </span>}
                            {hit.categorySlug.replace(/-/g, " ")}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 shrink-0">
                          ${(price / 100).toFixed(2)}
                          {hit.salePrice && <span className="ml-1 text-xs line-through text-gray-400">${(hit.price / 100).toFixed(2)}</span>}
                        </span>
                      </button>
                    );
                  })}
                  {/* View all results */}
                  <button
                    onClick={() => navigate(value)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-50 text-sm text-violet-600 font-medium hover:bg-violet-50 transition-colors"
                  >
                    <TrendingUp size={13} />
                    View all results for &quot;{value}&quot;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

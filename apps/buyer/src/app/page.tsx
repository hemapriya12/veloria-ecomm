import ProductList from "@/components/ProductList";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";
// ArrowRight used in "View all" link below
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const perks = [
  { icon: Truck,       label: "Free Shipping",    desc: "On orders over $50" },
  { icon: RefreshCw,   label: "Easy Returns",     desc: "30-day return policy" },
  { icon: ShieldCheck, label: "Secure Payment",   desc: "100% protected checkout" },
];

// Resolves the user's top 5 most-purchased category slugs from order history.
// Logic:
//   1. Fetch all of this user's orders
//   2. Count how many times each productId was purchased (× quantity)
//   3. Resolve the top-10 productIds → categorySlug via the product service (parallel)
//   4. Deduplicate and return the top 5 unique slugs in purchase-frequency order
async function getTopCategorySlugs(token: string): Promise<string[] | null> {
  try {
    const ordersRes = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!ordersRes.ok) return null;

    const orders: Array<{ products?: Array<{ productId?: number; quantity?: number }> }> =
      await ordersRes.json();

    // Count purchase frequency per productId
    const freq: Record<number, number> = {};
    for (const order of orders) {
      for (const item of order.products ?? []) {
        if (item.productId) {
          freq[item.productId] = (freq[item.productId] ?? 0) + (item.quantity ?? 1);
        }
      }
    }

    const rankedIds = Object.entries(freq)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 10)                          // resolve top 10 to survive duplicates
      .map(([id]) => Number(id));

    if (rankedIds.length === 0) return null;

    // Resolve productIds → categorySlug in parallel
    const details: Array<{ categorySlug: string } | null> = await Promise.all(
      rankedIds.map((id) =>
        fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    );

    // Collect up to 5 unique categories, preserving frequency order
    const seen = new Set<string>();
    const top: string[] = [];
    for (const p of details) {
      if (p?.categorySlug && !seen.has(p.categorySlug)) {
        seen.add(p.categorySlug);
        top.push(p.categorySlug);
      }
      if (top.length === 5) break;
    }

    return top.length > 0 ? top : null;
  } catch {
    return null;
  }
}

const Homepage = async ({ searchParams }: { searchParams: Promise<{ category: string }> }) => {
  const category = (await searchParams).category;
  const session  = await getServerSession(authOptions);
  const token    = session?.user?.token;

  // Only compute personalised slugs for logged-in users
  const topSlugs = token ? await getTopCategorySlugs(token) : null;

  return (
    <div className="flex flex-col gap-16">

      {/* Hero carousel */}
      <HeroCarousel />

      {/* Perks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {perks.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured products */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1">Curated for you</p>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <Link href="/products" className="text-sm text-violet-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <ProductList category={category} params="homepage" personalizedSlugs={topSlugs ?? undefined} />
      </div>

    </div>
  );
};

export default Homepage;

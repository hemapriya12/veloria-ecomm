import AppBarChart from "@/components/AppBarChart";
import CardList from "@/components/CardList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { OrderSummaryType } from "@repo/types";
import { TrendingUp, ShoppingCart, Clock, Package, ArrowUpRight } from "lucide-react";

const statCards = [
  { key: "revenue",  title: "Total Revenue",       icon: TrendingUp,  bg: "bg-emerald-50", text: "text-emerald-600" },
  { key: "orders",   title: "Total Orders",         icon: ShoppingCart, bg: "bg-blue-50",   text: "text-blue-600"   },
  { key: "pending",  title: "Pending Shipments",    icon: Clock,        bg: "bg-orange-50", text: "text-orange-600" },
  { key: "products", title: "Total Products",       icon: Package,      bg: "bg-violet-50", text: "text-violet-600" },
];

export default async function Homepage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  const headers = { Authorization: `Bearer ${token}` };
  const base = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL;
  const productBase = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;

  const email   = session?.user?.email ?? "";
  const isAdmin = email === (process.env.ADMIN_EMAIL ?? "admin@example.com");
  const sq      = isAdmin ? "" : `sellerEmail=${encodeURIComponent(email)}`;

  const [summary, orderChartData, productCount] = await Promise.all([
    fetch(`${base}/orders/summary${sq ? `?${sq}` : ""}`, { headers, cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null) as Promise<OrderSummaryType | null>,
    fetch(`${base}/order-chart${sq ? `?${sq}` : ""}`, { headers, cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
    fetch(`${productBase}/products?admin=true&sellerEmail=${encodeURIComponent(email)}`, { headers, cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).then((p: unknown[]) => p.length).catch(() => 0),
  ]);

  const totalRevenue = summary
    ? `$${(summary.totalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    : "—";

  const values: Record<string, string> = {
    revenue: totalRevenue,
    orders: summary ? String(summary.totalOrders) : "—",
    pending: summary ? String(summary.pendingShipments) : "—",
    products: String(productCount),
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, title, icon: Icon, bg, text }) => (
          <div key={key} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={18} className={text} />
              </div>
              <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight size={11} /> Live
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-tight">{values[key]}</p>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Revenue Overview</h2>
          <p className="text-sm text-gray-400">Monthly order revenue</p>
        </div>
        <AppBarChart dataPromise={Promise.resolve(orderChartData)} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <CardList title="Latest Transactions" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <CardList title="Popular Products" />
        </div>
      </div>
    </div>
  );
}

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { OrderType } from "@repo/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const token   = session?.user?.token;
  const email   = session?.user?.email ?? "";
  const isAdmin = email === ADMIN_EMAIL;

  let data: OrderType[] = [];
  let total = 0;

  try {
    const url = isAdmin
      ? `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?limit=100`
      : `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?sellerEmail=${encodeURIComponent(email)}&limit=100`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      data  = json.orders  ?? [];
      total = json.total   ?? data.length;
    }
  } catch {
    data = [];
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isAdmin ? "All orders across all sellers — " : "Orders containing your products — "}
          <span className="font-medium text-gray-700">{total.toLocaleString()}</span> orders total
          {total > 100 && <span className="text-gray-400"> (showing latest 100)</span>}.
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { OrderType } from "@repo/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  const email = session?.user?.email ?? "";
  const isAdmin = email === ADMIN_EMAIL;

  let data: OrderType[] = [];

  try {
    const allOrdersRes = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const allOrders: OrderType[] = allOrdersRes.ok ? await allOrdersRes.json() : [];

    if (isAdmin) {
      data = allOrders;
    } else {
      // fetch this seller's products to get their IDs
      const productsRes = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?admin=true&sellerEmail=${encodeURIComponent(email)}`,
        { cache: "no-store" }
      );
      const products: { id: number }[] = productsRes.ok ? await productsRes.json() : [];
      const sellerProductIds = new Set(products.map((p) => p.id));

      // keep only orders that contain at least one product from this seller
      data = allOrders.filter((order: any) =>
        order.products?.some((p: any) => sellerProductIds.has(p.productId))
      );
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
          <span className="font-medium text-gray-700">{data.length}</span> order{data.length !== 1 ? "s" : ""} total.
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

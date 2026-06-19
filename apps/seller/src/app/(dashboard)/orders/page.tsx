import { columns } from "./columns";
import { DataTable } from "./data-table";
import { OrderType } from "@repo/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const getData = async (): Promise<OrderType[]> => {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
};

export default async function OrdersPage() {
  const data = await getData();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage fulfillment and download invoices — <span className="font-medium text-gray-700">{data.length}</span> order{data.length !== 1 ? "s" : ""} total.</p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

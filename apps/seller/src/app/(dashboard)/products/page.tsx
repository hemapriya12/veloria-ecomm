export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ProductsType } from "@repo/types";
import { DataTable } from "./data-table";

const getData = async (sellerEmail: string): Promise<ProductsType> => {
  if (!sellerEmail) return [];
  try {
    const url = `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?admin=true&sellerEmail=${encodeURIComponent(sellerEmail)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export default async function ProductPage() {
  const session = await getServerSession(authOptions);
  const sellerEmail = session?.user?.email ?? "";
  const data = await getData(sellerEmail);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your catalogue —{" "}
          <span className="font-medium text-gray-700">{data.length}</span>{" "}
          product{data.length !== 1 ? "s" : ""} total
          {sellerEmail ? ` for ${sellerEmail}` : " (no session)"}.
        </p>
      </div>
      <DataTable data={data} />
    </div>
  );
}

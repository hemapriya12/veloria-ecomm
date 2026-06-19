import Image from "next/image";
import { OrderType, ProductsType } from "@repo/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const statusColors: Record<string, string> = {
  paid:      "bg-emerald-100 text-emerald-700",
  pending:   "bg-yellow-100 text-yellow-700",
  shipped:   "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

const CardList = async ({ title }: { title: string }) => {
  let products: ProductsType = [];
  let orders: OrderType[] = [];

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  if (title === "Popular Products") {
    products = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?limit=5&popular=true`,
    )
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);
  } else {
    orders = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?limit=5`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-col gap-1">
        {title === "Popular Products"
          ? products.length === 0
            ? <p className="text-sm text-gray-400 py-4 text-center">No products yet</p>
            : products.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    {Object.values(item.images as Record<string, string>)[0] && (
                      <Image src={Object.values(item.images as Record<string, string>)[0]!} alt={item.name} fill style={{ objectFit: "cover" }} />
                    )}
                  </div>
                  <p className="text-sm text-gray-700 flex-1 truncate">{item.name}</p>
                  <p className="text-sm font-semibold text-gray-900">${(item.price / 100).toFixed(2)}</p>
                </div>
              ))
          : orders.length === 0
            ? <p className="text-sm text-gray-400 py-4 text-center">No orders yet</p>
            : orders.map((item) => (
                <div key={item._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-gray-500">{item.email?.[0]?.toUpperCase() ?? "?"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{item.email}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${statusColors[item.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">${(item.amount / 100).toFixed(2)}</p>
                </div>
              ))}
      </div>
    </div>
  );
};

export default CardList;

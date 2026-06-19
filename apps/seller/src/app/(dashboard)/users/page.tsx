import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const getData = async (): Promise<{ data: any[]; totalCount: number }> => {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return await res.json();
  } catch {
    return { data: [], totalCount: 0 };
  }
};

export default async function UsersPage() {
  const res = await getData();
  const users = Array.isArray(res) ? res : (res?.data ?? []);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage all registered buyer and seller accounts.</p>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  );
}

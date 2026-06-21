import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";

const getData = async (token: string): Promise<any[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch {
    return [];
  }
};

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email !== ADMIN_EMAIL) {
    redirect("/unauthorized");
  }

  const users = await getData(session.user.token);

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

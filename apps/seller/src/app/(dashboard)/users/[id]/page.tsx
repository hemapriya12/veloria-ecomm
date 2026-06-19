import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AppLineChart from "@/components/AppLineChart";
import EditUserWrapper from "@/components/EditUserWrapper";
import { ChevronRight, ShieldCheck, Star, Award, Flame } from "lucide-react";

const getData = async (id: string): Promise<any | null> => {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return null;
  }
};

const badges = [
  { icon: ShieldCheck, label: "Verified",  desc: "This user has been verified.",           color: "text-blue-500",   bg: "bg-blue-50"   },
  { icon: Star,        label: "Seller",    desc: "Seller users have access to all features.", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Award,       label: "Awarded",   desc: "Awarded for their contributions.",        color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Flame,       label: "Popular",   desc: "Popular in the community.",               color: "text-purple-500", bg: "bg-purple-50" },
];

export default async function SingleUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData(id);

  if (!data) return <p className="text-gray-500">User not found.</p>;

  const fullName = data?.firstName ? `${data.firstName} ${data.lastName ?? ""}`.trim() : (data?.username ?? "-");
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const info = [
    { label: "Full name", value: fullName },
    { label: "Email",     value: data.emailAddresses?.[0]?.emailAddress ?? data.email ?? "-" },
    { label: "Phone",     value: data.phoneNumbers?.[0]?.phoneNumber ?? data.phone ?? "-" },
    { label: "Role",      value: String(data.publicMetadata?.role ?? data.role ?? "user") },
    { label: "Status",    value: data.banned ? "banned" : "active" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600 transition-colors">Dashboard</Link>
        <ChevronRight size={13} />
        <Link href="/users" className="hover:text-gray-600 transition-colors">Users</Link>
        <ChevronRight size={13} />
        <span className="text-gray-700 font-medium">{fullName}</span>
      </nav>

      <div className="flex flex-col xl:flex-row gap-5">
        {/* Left column */}
        <div className="flex flex-col gap-5 xl:w-80">

          {/* Badges */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">User Badges</h3>
            <div className="flex gap-3 flex-wrap">
              {badges.map(({ icon: Icon, label, desc, color, bg }) => (
                <div key={label} title={desc} className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center cursor-default`}>
                  <Icon size={18} className={color} />
                </div>
              ))}
            </div>
          </div>

          {/* User card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                {data.avatar
                  ? <Image src={data.avatar} alt={fullName} fill className="object-cover" />
                  : <span className="text-lg font-bold text-emerald-700">{initials}</span>
                }
              </div>
              <div>
                <p className="font-semibold text-gray-900">{fullName}</p>
                <p className="text-xs text-gray-400">{data.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Member since {new Date(data.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
          </div>

          {/* User information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">User Information</h3>
              <EditUserWrapper />
            </div>
            {/* Profile completion */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1.5">Profile completion</p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "66%" }} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {info.map(({ label, value }) => (
                <div key={label} className="flex gap-2 text-sm">
                  <span className="font-semibold text-gray-700 shrink-0">{label}:</span>
                  <span className="text-gray-500 truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">User Activity</h3>
          <AppLineChart />
        </div>
      </div>
    </div>
  );
}

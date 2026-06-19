"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Store, TrendingUp, Package, Users } from "lucide-react";

const stats = [
  { icon: TrendingUp, label: "Avg. monthly revenue", value: "$12,400" },
  { icon: Package,    label: "Products listed",      value: "12k+"    },
  { icon: Users,      label: "Active buyers",         value: "10k+"    },
];

export default function Page() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "radial-gradient(ellipse at 20% 50%, #0f2027 0%, #1a3a2a 40%, #0d4f3c 70%, #1a6b4a 100%)" }}>

        {/* decorative rings */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/20"
              style={{ width: (i+1)*150, height: (i+1)*150, top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
          ))}
        </div>

        {/* floating cards */}
        <div className="absolute top-24 right-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 w-48">
          <p className="text-white/50 text-xs mb-1">Today's Sales</p>
          <p className="text-white text-2xl font-bold">$3,240</p>
          <p className="text-emerald-400 text-xs mt-1">↑ 18% vs yesterday</p>
        </div>
        <div className="absolute bottom-36 right-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 w-44">
          <p className="text-white/50 text-xs mb-1">New Orders</p>
          <p className="text-white text-2xl font-bold">24</p>
          <p className="text-emerald-400 text-xs mt-1">↑ 5 since last hour</p>
        </div>

        {/* logo */}
        <div className="relative z-10 flex items-center gap-2">
          <Store className="text-emerald-400" size={28} />
          <span className="text-white text-xl font-bold tracking-widest uppercase">Veloria</span>
          <span className="ml-1 text-xs text-emerald-400 border border-emerald-400/40 rounded-full px-2 py-0.5">Seller</span>
        </div>

        {/* headline */}
        <div className="relative z-10">
          <p className="text-white/40 text-sm uppercase tracking-[0.3em] mb-4">Seller portal</p>
          <h2 className="text-white text-5xl font-bold leading-tight mb-6">
            Manage<br />your<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #6ee7b7, #34d399)" }}>
              empire.
            </span>
          </h2>
          <p className="text-white/50 text-base max-w-xs">
            Everything you need to run your store — products, orders, analytics, all in one place.
          </p>
        </div>

        {/* stats */}
        <div className="relative z-10 flex gap-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <div className="mt-0.5 p-1.5 rounded-lg bg-emerald-500/20">
                <Icon size={14} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-lg font-bold leading-tight">{value}</p>
                <p className="text-white/40 text-xs">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">

          {/* mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Store size={22} className="text-emerald-600" />
            <span className="text-xl font-bold tracking-widest uppercase">Veloria</span>
            <span className="text-xs text-emerald-600 border border-emerald-300 rounded-full px-2 py-0.5">Seller</span>
          </div>

          {/* heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your seller dashboard</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-emerald-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
            >
              {loading
                ? <Spinner />
                : <> Sign in <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Not a seller yet?{" "}
              <a href="http://localhost:3002/sign-up" className="text-emerald-600 font-medium hover:underline">
                Create a seller account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

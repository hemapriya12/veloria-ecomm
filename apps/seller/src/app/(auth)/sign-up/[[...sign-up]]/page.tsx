"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Store } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/signup-seller`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Unable to create account.");
        return;
      }

      router.push("/sign-in");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "radial-gradient(ellipse at 20% 50%, #0f2027 0%, #1a3a2a 40%, #0d4f3c 70%, #1a6b4a 100%)" }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/20"
              style={{ width: (i + 1) * 150, height: (i + 1) * 150, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Store className="text-emerald-400" size={28} />
          <span className="text-white text-xl font-bold tracking-widest uppercase">Veloria</span>
          <span className="ml-1 text-xs text-emerald-400 border border-emerald-400/40 rounded-full px-2 py-0.5">Seller</span>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-sm uppercase tracking-[0.3em] mb-4">Join us</p>
          <h2 className="text-white text-5xl font-bold leading-tight mb-6">
            Start<br />selling<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #6ee7b7, #34d399)" }}>
              today.
            </span>
          </h2>
          <p className="text-white/50 text-base max-w-xs">
            Create your seller account and start listing products in minutes.
          </p>
        </div>

        <div className="relative z-10" />
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Store size={22} className="text-emerald-600" />
            <span className="text-xl font-bold tracking-widest uppercase">Veloria</span>
            <span className="text-xs text-emerald-600 border border-emerald-300 rounded-full px-2 py-0.5">Seller</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Create account</h1>
            <p className="text-gray-500 text-sm">Join Veloria as a seller</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input name="firstName" type="text" value={form.firstName} onChange={handleChange}
                    placeholder="Jane" required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                <input name="lastName" type="text" value={form.lastName} onChange={handleChange}
                  placeholder="Doe" required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="password" type="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required minLength={6}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
              {loading ? "Creating account..." : <> Create account <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Already have an account?{" "}
              <a href="/sign-in" className="text-emerald-600 font-medium hover:underline">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

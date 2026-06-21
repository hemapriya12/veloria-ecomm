"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, ShoppingBag, ShoppingCart, Store } from "lucide-react";

type Role = "user" | "seller";

const SELLER_URL = "http://localhost:3003";

export default function Page() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("user");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSeller = selectedRole === "seller";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password, role: selectedRole }),
    });

    if (!res.ok) {
      const data = await res.json();
      setLoading(false);
      setError(data?.message || "Unable to create account");
      return;
    }

    await signIn("credentials", { redirect: false, email, password });
    setLoading(false);

    if (isSeller) {
      window.location.href = SELLER_URL;
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black flex-col justify-between p-12">
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: isSeller
              ? "radial-gradient(ellipse at 20% 50%, #0f2027 0%, #1a3a2a 40%, #0d4f3c 70%, #1a6b4a 100%)"
              : "radial-gradient(ellipse at 20% 50%, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/20"
              style={{
                width: `${(i + 1) * 150}px`,
                height: `${(i + 1) * 150}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-white" size={28} />
            <span className="text-white text-xl font-bold tracking-widest uppercase">
              Veloria
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-sm uppercase tracking-[0.3em] mb-4">
            {isSeller ? "Join as a seller" : "Join us today"}
          </p>
          <h2 className="text-white text-5xl font-bold leading-tight mb-6">
            {isSeller ? (
              <>
                Start
                <br />
                selling
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg, #6ee7b7, #34d399)" }}
                >
                  today.
                </span>
              </>
            ) : (
              <>
                Your
                <br />
                style,
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg, #a78bfa, #f472b6)" }}
                >
                  your way.
                </span>
              </>
            )}
          </h2>
          <p className="text-white/50 text-base max-w-xs">
            {isSeller
              ? "Create your seller account and reach thousands of buyers on Veloria."
              : "Create an account to shop, track orders, and get exclusive member deals."}
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          {(isSeller
            ? [["500+", "Sellers"], ["12k+", "Products"], ["4.8★", "Rating"]]
            : [["10k+", "Customers"], ["500+", "Brands"], ["4.9★", "Rating"]]
          ).map(([stat, label], i) => (
            <div key={i}>
              <p className="text-white text-2xl font-bold">{stat}</p>
              <p className="text-white/40 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <ShoppingBag size={24} />
            <span className="text-xl font-bold tracking-widest uppercase">Veloria</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-6">
            Already have an account?{" "}
            <a href="/sign-in" className="text-violet-600 font-medium hover:underline">
              Sign in
            </a>
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => { setSelectedRole("user"); setError(null); }}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all ${
                selectedRole === "user"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              <ShoppingCart size={18} />
              <div className="text-left">
                <p className="font-semibold">Buyer</p>
                <p className="text-xs opacity-60 font-normal">Shop products</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole("seller"); setError(null); }}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all ${
                selectedRole === "seller"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              <Store size={18} />
              <div className="text-left">
                <p className="font-semibold">Seller</p>
                <p className="text-xs opacity-60 font-normal">Manage store</p>
              </div>
            </button>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <span className="shrink-0">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{
                background: isSeller
                  ? "linear-gradient(135deg, #059669, #10b981)"
                  : "linear-gradient(135deg, #7c3aed, #a855f7)",
              }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  Create {isSeller ? "Seller" : "Buyer"} Account <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              By creating an account, you agree to our{" "}
              <a href="#" className="underline hover:text-gray-600">Terms</a> and{" "}
              <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

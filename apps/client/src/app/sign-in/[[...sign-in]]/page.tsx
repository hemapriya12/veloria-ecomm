"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, ShoppingBag, ShoppingCart, Store } from "lucide-react";

type Role = "user" | "seller";

const SELLER_URL = "http://localhost:3003";

export default function Page() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") || "/";
  const [selectedRole, setSelectedRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setLoading(false);
      setError("Invalid email or password. Please try again.");
      return;
    }

    const session = await getSession();
    const actualRole = session?.user?.role;

    setLoading(false);

    if (selectedRole === "seller" && actualRole !== "seller") {
      setError("This account is not a seller account. Please sign in as a buyer.");
      return;
    }

    if (selectedRole === "user" && actualRole === "seller") {
      setError("This is a seller account. Please select 'Seller' to continue.");
      return;
    }

    if (actualRole === "seller") {
      window.location.href = SELLER_URL;
    } else {
      router.push(callbackUrl);
    }
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/" });

  const isSeller = selectedRole === "seller";

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
            {isSeller ? "Seller portal" : "Welcome back"}
          </p>
          <h2 className="text-white text-5xl font-bold leading-tight mb-6">
            {isSeller ? (
              <>
                Grow
                <br />
                your
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg, #6ee7b7, #34d399)" }}
                >
                  business.
                </span>
              </>
            ) : (
              <>
                Style
                <br />
                starts
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg, #a78bfa, #f472b6)" }}
                >
                  here.
                </span>
              </>
            )}
          </h2>
          <p className="text-white/50 text-base max-w-xs">
            {isSeller
              ? "Sign in to manage your products, orders, and storefront."
              : "Sign in to access your orders, wishlist, and exclusive member deals."}
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

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-gray-500 text-sm mb-6">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-violet-600 font-medium hover:underline">
              Sign up
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

          {/* Google button — buyers only */}
          {selectedRole === "user" && (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all mb-5"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-violet-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
                  required
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
                  Sign in as {isSeller ? "Seller" : "Buyer"} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

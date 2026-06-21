import { ShoppingBag, Users, Globe, TrendingUp, Award } from "lucide-react";

const stats = [
  { value: "10K+",  label: "Active Buyers"   },
  { value: "500+",  label: "Verified Sellers" },
  { value: "12K+",  label: "Products Listed"  },
  { value: "4.8★",  label: "Average Rating"   },
];

const values = [
  { icon: Users,      title: "Customer First",    desc: "Every decision we make starts with asking: how does this help our customers? We obsess over experience, not just transactions." },
  { icon: Globe,      title: "Open to Everyone",  desc: "Whether you're a buyer in a small town or a seller launching your first product, Veloria is built for you." },
  { icon: TrendingUp, title: "Growth Together",   desc: "When sellers succeed, buyers benefit. We build tools that help sellers grow, knowing that creates better experiences for everyone." },
  { icon: Award,      title: "Trust & Safety",    desc: "We verify sellers, protect payments, and stand behind every purchase. Marketplace trust is not a feature — it's our foundation." },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 mt-8 pb-16">

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
          <ShoppingBag size={24} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Veloria</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Veloria is a marketplace where buyers discover great products and sellers build thriving businesses — all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ value, label }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
        <div className="flex flex-col gap-4 text-gray-500 leading-relaxed">
          <p>Veloria was founded with a simple belief: shopping online should feel as personal and trustworthy as shopping in your favourite local store. We started as a small team tired of impersonal, cluttered marketplaces and decided to build something better.</p>
          <p>Today, Veloria connects thousands of buyers with hundreds of independent sellers across dozens of product categories — from fashion and electronics to home goods, books, and beyond. We're not just a shop; we're a platform where small businesses can compete with big brands on a level playing field.</p>
          <p>Our technology team is constantly working to make discovery smarter, checkout faster, and the seller experience more powerful — so the people behind the products can focus on what they do best.</p>
        </div>
      </div>

      {/* Values */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
                <Icon size={18} className="text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Leaf, Recycle, Sun, Heart } from "lucide-react";

const initiatives = [
  {
    icon: Leaf,
    title: "Carbon-Neutral Shipping",
    desc: "We offset 100% of the carbon emissions from every delivery through certified reforestation and renewable energy projects.",
    progress: 100,
    label: "Achieved",
  },
  {
    icon: Recycle,
    title: "Packaging Reduction",
    desc: "We work with our seller community to reduce excess packaging. Over 60% of our sellers now use recycled or minimal packaging materials.",
    progress: 62,
    label: "62% of sellers",
  },
  {
    icon: Sun,
    title: "Renewable Energy",
    desc: "Our data centres and offices run on 80% renewable energy. We're on track to reach 100% by 2026.",
    progress: 80,
    label: "80% renewable",
  },
  {
    icon: Heart,
    title: "Community Impact",
    desc: "1% of every transaction fee goes to environmental and social causes through our Veloria Gives Back programme.",
    progress: 100,
    label: "1% pledged",
  },
];

export default function SustainabilityPage() {
  return (
    <div className="max-w-3xl mx-auto mt-8 pb-16 flex flex-col gap-12">

      {/* Hero */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 bg-emerald-50 flex items-center justify-center">
          <Leaf size={24} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Our Commitment to the Planet</h1>
        <p className="text-gray-500 leading-relaxed max-w-xl mx-auto">
          Commerce and sustainability are not opposites. We believe a marketplace can grow while taking care of the world it operates in.
        </p>
      </div>

      {/* Initiatives */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-900">Our Initiatives</h2>
        {initiatives.map(({ icon: Icon, title, desc, progress, label }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-semibold text-emerald-600 shrink-0">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pledge */}
      <div className="rounded-3xl p-8 text-center"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #064e3b 0%, #065f46 50%, #047857 100%)" }}>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Our Pledge</p>
        <p className="text-white text-2xl font-bold leading-tight mb-4">
          Net-zero emissions by 2030.
        </p>
        <p className="text-white/60 text-sm max-w-md mx-auto">
          We've committed to science-based targets and report our progress publicly every quarter. No greenwashing — just honest work.
        </p>
      </div>
    </div>
  );
}

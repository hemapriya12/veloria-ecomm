import { Newspaper, Mail } from "lucide-react";

const articles = [
  { outlet: "TechCrunch",   date: "March 2025", title: "Veloria raises $5M to build a fairer marketplace for independent sellers",       tag: "Funding"     },
  { outlet: "Forbes",       date: "January 2025", title: "The new wave of marketplaces putting sellers first — Veloria leads the charge", tag: "Feature"     },
  { outlet: "The Verge",    date: "November 2024", title: "Veloria review: A clean, fast marketplace that actually works",                tag: "Review"      },
  { outlet: "Business Wire", date: "October 2024", title: "Veloria announces 10,000 active buyers milestone in its first year",          tag: "Milestone"   },
];

export default function PressPage() {
  return (
    <div className="max-w-3xl mx-auto mt-8 pb-16 flex flex-col gap-10">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 bg-violet-50 flex items-center justify-center">
          <Newspaper size={24} className="text-violet-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Press & Media</h1>
        <p className="text-gray-500">Latest news, coverage, and resources for journalists and media professionals.</p>
      </div>

      {/* Press contact */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
          <Mail size={18} className="text-violet-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">Press Inquiries</p>
          <p className="text-sm text-gray-500 mt-0.5">For media inquiries, interviews, or press kit requests, contact our communications team.</p>
          <a href="mailto:press@veloria.com" className="text-sm text-violet-600 font-medium hover:underline mt-1 block">press@veloria.com</a>
        </div>
      </div>

      {/* Coverage */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">In the News</h2>
        <div className="flex flex-col gap-3">
          {articles.map(({ outlet, date, title, tag }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">{outlet}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{date}</span>
                </div>
                <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{tag}</span>
              </div>
              <p className="text-sm font-medium text-gray-800 leading-snug">{title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Brand assets */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-2">Brand Assets</h2>
        <p className="text-sm text-gray-500 mb-4">Download our official logo, brand guidelines, and product screenshots for use in press coverage.</p>
        <a href="mailto:press@veloria.com"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
          Request Press Kit
        </a>
      </div>
    </div>
  );
}

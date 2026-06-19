"use client";

import { useState } from "react";
import { Cookie } from "lucide-react";

const cookieTypes = [
  {
    id: "essential",
    title: "Essential Cookies",
    desc: "Required for the website to function. These cannot be disabled. They include session management, security tokens, and cart persistence.",
    required: true,
  },
  {
    id: "analytics",
    title: "Analytics Cookies",
    desc: "Help us understand how visitors interact with our website by collecting and reporting information anonymously. Used to improve our platform.",
    required: false,
  },
  {
    id: "preferences",
    title: "Preference Cookies",
    desc: "Remember your settings and preferences such as language, region, and display options to provide a more personalised experience.",
    required: false,
  },
  {
    id: "marketing",
    title: "Marketing Cookies",
    desc: "Used to track visitors across websites to display relevant advertisements. These are set by our advertising partners.",
    required: false,
  },
];

export default function CookiesPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    essential: true,
    analytics: true,
    preferences: true,
    marketing: false,
  });

  const toggle = (id: string) => {
    if (id === "essential") return;
    setEnabled((e) => ({ ...e, [id]: !e[id] }));
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 pb-16 flex flex-col gap-8">
      <div>
        <div className="w-14 h-14 rounded-2xl mb-6 bg-violet-50 flex items-center justify-center">
          <Cookie size={24} className="text-violet-600" />
        </div>
        <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2">Preferences</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Cookie Settings</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          We use cookies to enhance your experience, analyse traffic, and personalise content. You can manage your preferences below. Essential cookies cannot be disabled as they are required for the site to work.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {cookieTypes.map(({ id, title, desc, required }) => (
          <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                  {required && (
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Required</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(id)}
                disabled={required}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                  enabled[id] ? "bg-violet-600" : "bg-gray-200"
                } ${required ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled[id] ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setEnabled({ essential: true, analytics: false, preferences: false, marketing: false })}
          className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Reject All Optional
        </button>
        <button
          onClick={() => setEnabled({ essential: true, analytics: true, preferences: true, marketing: true })}
          className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Accept All
        </button>
        <button
          className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          onClick={() => alert("Preferences saved!")}
        >
          Save Preferences
        </button>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <h2 className="font-semibold text-gray-900 text-sm mb-2">What is a cookie?</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          A cookie is a small text file placed on your device when you visit a website. Cookies help websites remember your preferences and improve your experience over repeated visits. They do not contain personal data on their own — they store a unique identifier that the website uses to retrieve stored information.
        </p>
      </div>
    </div>
  );
}

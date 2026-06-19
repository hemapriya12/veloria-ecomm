"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Lock, Bell, Palette, ShieldAlert, Eye, EyeOff, Loader2, LogOut, Sun, Moon } from "lucide-react";
import { toast } from "react-toastify";

const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Icon size={14} className="text-emerald-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Toggle({ enabled, onChange, label, desc }: { enabled: boolean; onChange: (v: boolean) => void; label: string; desc: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${enabled ? "bg-emerald-500" : "bg-gray-200"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();

  // Password
  const [pwForm, setPwForm]     = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw]     = useState({ current: false, newPw: false, confirm: false });
  const [savingPw, setSavingPw] = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState({
    newOrder:    true,
    lowStock:    true,
    newReview:   false,
    weeklyReport: true,
    marketing:   false,
  });

  // Theme
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (pwForm.newPw.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${session?.user?.id}/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.user?.token}` },
          body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Password changed successfully");
      setPwForm({ current: "", newPw: "", confirm: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSavingPw(false);
    }
  };

  const PasswordInput = ({ field, label }: { field: keyof typeof pwForm; label: string }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={showPw[field] ? "text" : "password"}
          value={pwForm[field]}
          onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))}
          className={`${inputCls} pr-10`}
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setShowPw((s) => ({ ...s, [field]: !s[field] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences and security</p>
      </div>

      {/* Change Password */}
      <Section title="Change Password" icon={Lock}>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <PasswordInput field="current" label="Current Password" />
          <div className="grid grid-cols-2 gap-4">
            <PasswordInput field="newPw" label="New Password" />
            <PasswordInput field="confirm" label="Confirm New Password" />
          </div>
          <div className="flex justify-end mt-1">
            <button type="submit" disabled={savingPw}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-all"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
              {savingPw ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              {savingPw ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <div className="flex flex-col">
          <Toggle enabled={notifs.newOrder}     onChange={(v) => setNotifs((n) => ({ ...n, newOrder: v }))}     label="New Orders"       desc="Get notified when a customer places an order" />
          <Toggle enabled={notifs.lowStock}     onChange={(v) => setNotifs((n) => ({ ...n, lowStock: v }))}     label="Low Stock Alerts" desc="Alert when a product stock falls below 5" />
          <Toggle enabled={notifs.newReview}    onChange={(v) => setNotifs((n) => ({ ...n, newReview: v }))}    label="New Reviews"      desc="Notify when a customer leaves a review" />
          <Toggle enabled={notifs.weeklyReport} onChange={(v) => setNotifs((n) => ({ ...n, weeklyReport: v }))} label="Weekly Report"    desc="Receive a weekly summary of your store performance" />
          <Toggle enabled={notifs.marketing}    onChange={(v) => setNotifs((n) => ({ ...n, marketing: v }))}    label="Marketing Tips"   desc="Tips and updates from the Veloria team" />
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => toast.success("Notification preferences saved")}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
            Save Preferences
          </button>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Palette}>
        <p className="text-sm text-gray-500 mb-4">Choose how the dashboard looks to you</p>
        <div className="grid grid-cols-2 gap-3">
          {(["light", "dark"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTheme(t)}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${theme === t ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t === "light" ? "bg-yellow-100" : "bg-gray-800"}`}>
                {t === "light" ? <Sun size={15} className="text-yellow-600" /> : <Moon size={15} className="text-gray-300" />}
              </div>
              <div className="text-left">
                <p className={`text-sm font-semibold capitalize ${theme === t ? "text-emerald-700" : "text-gray-700"}`}>{t}</p>
                <p className="text-xs text-gray-400">{t === "light" ? "Clean & bright" : "Easy on the eyes"}</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone" icon={ShieldAlert}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-700">Sign Out</p>
              <p className="text-xs text-gray-400 mt-0.5">Sign out from this device</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-white transition-all">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50">
            <div>
              <p className="text-sm font-semibold text-red-700">Delete Account</p>
              <p className="text-xs text-red-400 mt-0.5">Permanently delete your seller account and all data</p>
            </div>
            <button onClick={() => toast.error("Please contact support to delete your account")}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-100 transition-all">
              <ShieldAlert size={14} /> Delete
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

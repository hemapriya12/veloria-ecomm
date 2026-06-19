"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Camera, User, Store, Phone, Globe, FileText, Save, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "@/lib/cloudinary";

const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    storeName: "",
    bio: "",
    phone: "",
    website: "",
    avatar: "",
  });

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${session.user.id}`, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setForm({
          firstName: data.firstName ?? "",
          lastName:  data.lastName  ?? "",
          storeName: data.storeName ?? "",
          bio:       data.bio       ?? "",
          phone:     data.phone     ?? "",
          website:   data.website   ?? "",
          avatar:    data.avatar    ?? "",
        });
      });
  }, [session]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((f) => ({ ...f, avatar: url }));
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = `${form.firstName?.[0] ?? ""}${form.lastName?.[0] ?? ""}`.toUpperCase() || "S";

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your personal info and public seller profile</p>
      </div>

      {/* Avatar */}
      <Section title="Profile Photo">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-emerald-100 flex items-center justify-center">
              {form.avatar
                ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-emerald-600">{initials}</span>
              }
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-colors shadow-sm">
              {uploading
                ? <Loader2 size={13} className="text-white animate-spin" />
                : <Camera size={13} className="text-white" />
              }
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{form.firstName} {form.lastName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{session?.user?.email}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1 capitalize">{session?.user?.role} account</p>
          </div>
        </div>
      </Section>

      {/* Personal Info */}
      <Section title="Personal Information">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <User size={11} className="inline mr-1" />First Name
            </label>
            <input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className={inputCls} placeholder="John" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <User size={11} className="inline mr-1" />Last Name
            </label>
            <input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className={inputCls} placeholder="Doe" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
            <input value={session?.user?.email ?? ""} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <Phone size={11} className="inline mr-1" />Phone
            </label>
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} placeholder="+1 234 567 8900" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <Globe size={11} className="inline mr-1" />Website
            </label>
            <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} className={inputCls} placeholder="https://yourstore.com" />
          </div>
        </div>
      </Section>

      {/* Seller Info */}
      <Section title="Seller Information">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <Store size={11} className="inline mr-1" />Store Name
            </label>
            <input value={form.storeName} onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))} className={inputCls} placeholder="My Awesome Store" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <FileText size={11} className="inline mr-1" />Bio
            </label>
            <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Tell buyers about yourself and your store..." />
          </div>
        </div>
      </Section>

      {/* Account Info */}
      <Section title="Account Details">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Account ID</p>
            <p className="font-mono text-xs text-gray-600 truncate">{profile?.id ?? "—"}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Member Since</p>
            <p className="font-medium text-gray-700">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Role</p>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 capitalize">{profile?.role ?? "—"}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Status</p>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Active</span>
          </div>
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-all"
          style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

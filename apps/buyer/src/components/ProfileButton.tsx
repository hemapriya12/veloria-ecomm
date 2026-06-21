"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <button
        type="button"
        onClick={() => signIn()}
        className="inline-flex items-center gap-2 rounded bg-black px-4 py-2 text-white"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => router.push("/orders")}
        className="inline-flex items-center gap-2 rounded bg-black px-4 py-2 text-white"
      >
        <ShoppingBag className="w-4 h-4" />
        Orders
      </button>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="inline-flex items-center gap-2 rounded border px-4 py-2"
      >
        Sign out
      </button>
    </div>
  );
};

export default ProfileButton;

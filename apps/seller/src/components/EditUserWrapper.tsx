"use client";

import { useState } from "react";
import EditUser from "./EditUser";

export default function EditUserWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}
        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all"
        style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
        Edit User
      </button>
      <EditUser open={open} onClose={() => setOpen(false)} />
    </>
  );
}

"use client";

import { MoreHorizontal, Copy, Eye } from "lucide-react";
import TableCheckbox from "@/components/TableCheckbox";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type User = {
  id: string;
  imageUrl?: string;
  firstName?: string;
  username?: string;
  email?: string;
  banned?: boolean;
};

function ActionsCell({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative flex justify-end">
      <button onClick={() => setOpen((o) => !o)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5">
          <button onClick={() => { navigator.clipboard.writeText(user.id); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50 text-left">
            <Copy size={13} /> Copy ID
          </button>
          <Link href={`/users/${user.id}`} onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <Eye size={13} /> View user
          </Link>
        </div>
      )}
    </div>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <TableCheckbox indeterminate={table.getIsSomePageRowsSelected()} checked={table.getIsAllPageRowsSelected()} onChange={(c) => table.toggleAllPageRowsSelected(c)} />
    ),
    cell: ({ row }) => (
      <TableCheckbox checked={row.getIsSelected()} onChange={(c) => row.toggleSelected(c)} />
    ),
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original;
      return user.imageUrl ? (
        <div style={{ width: 36, height: 36, position: "relative" }}>
          <Image
            src={user.imageUrl}
            alt={user.firstName || "-"}
            fill
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#e0e0e0",
          }}
        />
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "User",
    cell: ({ row }) => row.original.firstName || row.original.username || "-",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const banned = row.original.banned;
      return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${banned ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}`}>
          {banned ? "banned" : "active"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];

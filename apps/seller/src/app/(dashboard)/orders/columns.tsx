"use client";

import { FileText } from "lucide-react";
import TableCheckbox from "@/components/TableCheckbox";
import { FulfillmentStatus, OrderType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const paymentBadge = (s: string) =>
  s === "success" ? "bg-emerald-100 text-emerald-700" :
  s === "failed"  ? "bg-red-100 text-red-600" :
                    "bg-gray-100 text-gray-500";

const fulfillmentBadge = (s: string) => {
  switch (s) {
    case "pending":    return "bg-yellow-100 text-yellow-700";
    case "processing": return "bg-blue-100 text-blue-700";
    case "shipped":    return "bg-indigo-100 text-indigo-700";
    case "delivered":  return "bg-emerald-100 text-emerald-700";
    case "cancelled":  return "bg-red-100 text-red-600";
    default:           return "bg-gray-100 text-gray-500";
  }
};

const FULFILLMENT_OPTIONS: FulfillmentStatus[] = [
  "pending", "processing", "shipped", "delivered", "cancelled",
];

function FulfillmentSelect({ order }: { order: OrderType }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as FulfillmentStatus;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders/${order._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify({ fulfillmentStatus: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Status updated");
      router.refresh();
    } catch {
      toast.error("Could not update status");
    } finally {
      setLoading(false);
    }
  };

  const current = order.fulfillmentStatus ?? "pending";
  return (
    <select value={current} onChange={handleChange} disabled={loading}
      className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border-0 outline-none cursor-pointer capitalize transition-colors ${fulfillmentBadge(current)}`}>
      {FULFILLMENT_OPTIONS.map((s) => (
        <option key={s} value={s} className="bg-white text-gray-700 capitalize">{s}</option>
      ))}
    </select>
  );
}

function InvoiceButton({ order }: { order: OrderType }) {
  const handlePrint = () => {
    const date = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    const rows = (order.products ?? [])
      .map(
        (p) => `
        <tr>
          <td>${p.name}</td>
          <td style="text-align:center">${p.quantity}</td>
          <td style="text-align:right">$${(p.price / 100).toFixed(2)}</td>
          <td style="text-align:right">$${((p.price * p.quantity) / 100).toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice #${order._id.slice(-8).toUpperCase()}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; color: #333; padding: 48px; max-width: 720px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .brand { font-size: 22px; font-weight: 700; color: #1976d2; }
    .invoice-title { font-size: 28px; font-weight: 700; color: #111; }
    .meta { font-size: 13px; color: #666; margin-top: 4px; }
    .bill-to { margin-bottom: 32px; }
    .bill-to h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 6px; }
    .bill-to p { font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #f5f5f5; }
    th { padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; }
    td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #eee; }
    .total-row { display: flex; justify-content: flex-end; gap: 48px; padding: 16px 12px; border-top: 2px solid #111; margin-top: 8px; }
    .total-label { font-size: 14px; color: #666; }
    .total-value { font-size: 18px; font-weight: 700; }
    .footer { margin-top: 48px; font-size: 12px; color: #999; text-align: center; }
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: capitalize;
      background: ${order.status === "success" ? "#e8f5e9" : "#ffebee"};
      color: ${order.status === "success" ? "#2e7d32" : "#c62828"}; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="meta">#${order._id.slice(-8).toUpperCase()}</div>
      <div class="meta">Date: ${date}</div>
      <div class="meta" style="margin-top:6px">
        Payment: <span class="status-badge">${order.status}</span>
      </div>
    </div>
    <div class="brand">Seller Dashboard</div>
  </div>

  <div class="bill-to">
    <h3>Bill To</h3>
    <p>${order.email}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Unit Price</th>
        <th style="text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="total-row">
    <span class="total-label">Total</span>
    <span class="total-value">$${(order.amount / 100).toFixed(2)}</span>
  </div>

  <div class="footer">Thank you for your purchase.</div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <button onClick={handlePrint} title="Download Invoice"
      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
      <FileText size={14} />
    </button>
  );
}

export const columns: ColumnDef<OrderType>[] = [
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
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => (
      <span style={{ fontFamily: "monospace", fontSize: 12 }}>
        #{(row.getValue("_id") as string).slice(-8).toUpperCase()}
      </span>
    ),
  },
  { accessorKey: "email", header: "Customer" },
  {
    accessorKey: "products",
    header: "Items",
    cell: ({ row }) => {
      const products = row.getValue("products") as OrderType["products"];
      return (
        <span style={{ fontSize: 12, color: "#666" }}>
          {(products ?? []).map((p) => `${p.name} ×${p.quantity}`).join(", ")}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span style={{ fontWeight: 600 }}>
        ${((row.getValue("amount") as number) / 100).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Payment",
    cell: ({ row }) => {
      const s = row.getValue("status") as string;
      return <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${paymentBadge(s)}`}>{s}</span>;
    },
  },
  {
    accessorKey: "fulfillmentStatus",
    header: "Fulfillment",
    cell: ({ row }) => <FulfillmentSelect order={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt") as string).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
  },
  {
    id: "invoice",
    header: "Invoice",
    cell: ({ row }) => <InvoiceButton order={row.original} />,
  },
];

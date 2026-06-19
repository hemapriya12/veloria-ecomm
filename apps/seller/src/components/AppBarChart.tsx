"use client";

import { use } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OrderChartType } from "@repo/types";

export default function AppBarChart({ dataPromise }: { dataPromise: Promise<OrderChartType[]> }) {
  const chartData = use(dataPromise);
  return (
    <div>
      <h2 style={{ fontWeight: 500, marginBottom: 16 }}>Total Revenue</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#1976d2" radius={4} />
          <Bar dataKey="successful" fill="#2e7d32" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export default function AppLineChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Line dataKey="desktop" type="monotone" stroke="#1976d2" strokeWidth={2} dot={false} />
        <Line dataKey="mobile" type="monotone" stroke="#9c27b0" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

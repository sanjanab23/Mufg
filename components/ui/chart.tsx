"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { name: "Mon", risk: 32 },
  { name: "Tue", risk: 28 },
  { name: "Wed", risk: 36 },
  { name: "Thu", risk: 31 },
  { name: "Fri", risk: 40 },
  { name: "Sat", risk: 38 },
  { name: "Sun", risk: 42 },
];

export default function RiskChart() {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">Weekly Risk Index</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="risk" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

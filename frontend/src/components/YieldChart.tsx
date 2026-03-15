"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", yield: 4.2 },
  { name: "Feb", yield: 4.3 },
  { name: "Mar", yield: 4.5 },
  { name: "Apr", yield: 4.8 },
  { name: "May", yield: 5.1 },
  { name: "Jun", yield: 5.2 },
  { name: "Jul", yield: 5.3 },
];

export function YieldChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "#262626", color: "#d4d4d4" }}
            itemStyle={{ color: "#34d399" }}
          />
          <Line type="monotone" dataKey="yield" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399", strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

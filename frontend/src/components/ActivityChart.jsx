import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import EmptyState from "./EmptyState";

export default function ActivityChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyState title="No activity data yet." />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <Tooltip
            contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }}
            labelStyle={{ color: "#111827" }}
          />
          <Line
            type="monotone"
            dataKey="count"
            name="Events"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

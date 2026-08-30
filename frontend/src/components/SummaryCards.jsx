const METRICS = [
  { key: "totalEvents", label: "Total Events" },
  { key: "uniqueUsers", label: "Unique Users" },
  { key: "activeUsers", label: "Active Users" },
];

export default function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {METRICS.map((metric) => (
        <div key={metric.key} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">{metric.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
            {(summary?.[metric.key] ?? 0).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

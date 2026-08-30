import EmptyState from "./EmptyState";

function conversionRate(from, to) {
  if (!from) return null;
  return Math.round((to / from) * 100);
}

export default function FunnelChart({ funnel }) {
  const steps = Object.entries(funnel || {});
  const maxCount = Math.max(1, ...steps.map(([, count]) => count));

  if (steps.length === 0 || maxCount === 0) {
    return <EmptyState title="No funnel data yet." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {steps.map(([stepName, count], index) => {
        const widthPercent = Math.max(6, Math.round((count / maxCount) * 100));
        const prevCount = index > 0 ? steps[index - 1][1] : null;
        const rate = index > 0 ? conversionRate(prevCount, count) : null;

        return (
          <div key={stepName}>
            {index > 0 && rate !== null && (
              <p className="mb-1.5 text-xs text-gray-400">
                {steps[index - 1][0]} → {stepName}: {rate}%
              </p>
            )}
            <div className="flex items-center gap-3">
              <div className="w-24 shrink-0 text-sm font-medium capitalize text-gray-700">
                {stepName}
              </div>
              <div className="h-8 flex-1 rounded-md bg-gray-100">
                <div
                  className="flex h-8 items-center rounded-md bg-indigo-600 px-3 text-xs font-medium text-white transition-all"
                  style={{ width: `${widthPercent}%` }}
                >
                  {count.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

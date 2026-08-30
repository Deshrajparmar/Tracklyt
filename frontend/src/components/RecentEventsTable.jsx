import EmptyState from "./EmptyState";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentEventsTable({ events }) {
  if (!events || events.length === 0) {
    return (
      <EmptyState
        title="No events yet"
        description="Once your application starts sending events, your analytics will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Event</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">User</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Page</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {events.map((event, index) => (
            <tr key={`${event.userId}-${event.timestamp}-${index}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{event.eventName}</td>
              <td className="px-4 py-3 text-gray-600">{event.userId}</td>
              <td className="px-4 py-3 text-gray-600">{event.page || "—"}</td>
              <td className="px-4 py-3 text-gray-500">{timeAgo(event.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

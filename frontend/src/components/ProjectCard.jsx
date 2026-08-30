import { Link } from "react-router-dom";

const PLATFORM_LABELS = {
  web: "Web",
  android: "Android",
  ios: "iOS",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProjectCard({ project }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-base font-semibold text-gray-900">{project.projectName}</p>
        <p className="mt-1 text-sm text-gray-500">
          {PLATFORM_LABELS[project.platform] || project.platform} · Created{" "}
          {formatDate(project.createdAt)}
        </p>
      </div>
      <Link
        to={`/projects/${project._id}`}
        className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        View Analytics →
      </Link>
    </div>
  );
}

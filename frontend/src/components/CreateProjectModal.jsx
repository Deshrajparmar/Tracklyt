import { useState } from "react";
import { projectsApi } from "../api/tracklytApi";
import { getErrorMessage } from "../api/client";
import Button from "./Button";
import TextField from "./TextField";
import ErrorBanner from "./ErrorBanner";

const PLATFORMS = [
  { value: "web", label: "Web" },
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
];

export default function CreateProjectModal({ onClose, onCreated }) {
  const [projectName, setProjectName] = useState("");
  const [platform, setPlatform] = useState("web");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await projectsApi.create({ projectName, platform });
      onCreated(res.data.project);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create project. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <p className="text-lg font-semibold text-gray-900">Create project</p>
        <p className="mt-1 text-sm text-gray-500">
          Projects group the events sent from one application.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <ErrorBanner message={error} />

          <TextField
            id="projectName"
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="My E-commerce App"
            autoFocus
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="platform" className="text-sm font-medium text-gray-700">
              Platform
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

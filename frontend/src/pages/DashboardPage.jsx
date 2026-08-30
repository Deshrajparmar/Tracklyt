import { useEffect, useState } from "react";
import { projectsApi } from "../api/tracklytApi";
import { getErrorMessage } from "../api/client";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import LoadingState from "../components/LoadingState";
import ErrorBanner from "../components/ErrorBanner";
import EmptyState from "../components/EmptyState";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await projectsApi.list();
      setProjects(res.data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load your projects right now."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreated = (project) => {
    setShowModal(false);
    setProjects((prev) => [project, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and analyze user activity across your applications.
            </p>
          </div>
          {projects.length > 0 && (
            <Button onClick={() => setShowModal(true)}>+ Create Project</Button>
          )}
        </div>

        <div className="mt-6">
          {loading && <LoadingState label="Loading projects..." />}

          {!loading && error && <ErrorBanner message={error} />}

          {!loading && !error && projects.length === 0 && (
            <EmptyState
              title="No projects yet"
              description="Create your first project to start tracking analytics."
              action={<Button onClick={() => setShowModal(true)}>+ Create Project</Button>}
            />
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <CreateProjectModal onClose={() => setShowModal(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}

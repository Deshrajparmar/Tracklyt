import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { analyticsApi, eventsApi, projectsApi } from "../api/tracklytApi";
import { getErrorMessage } from "../api/client";
import Navbar from "../components/Navbar";
import LoadingState from "../components/LoadingState";
import ErrorBanner from "../components/ErrorBanner";
import SummaryCards from "../components/SummaryCards";
import ActivityChart from "../components/ActivityChart";
import EventBreakdownChart from "../components/EventBreakdownChart";
import FunnelChart from "../components/FunnelChart";
import RecentEventsTable from "../components/RecentEventsTable";
import DemoEventsButton from "../components/DemoEventsButton";

const PLATFORM_LABELS = {
  web: "Web",
  android: "Android",
  ios: "iOS",
};

export default function ProjectAnalyticsPage() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  const [breakdown, setBreakdown] = useState({});
  const [funnel, setFunnel] = useState({});
  const [recentEvents, setRecentEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [projectsRes, summaryRes, activityRes, breakdownRes, funnelRes, eventsRes] =
        await Promise.all([
          projectsApi.list(),
          analyticsApi.summary(projectId),
          analyticsApi.activity(projectId),
          analyticsApi.eventBreakdown(projectId),
          analyticsApi.funnel(projectId),
          eventsApi.listForProject(projectId),
        ]);

      const matchingProject = projectsRes.data.find((p) => p._id === projectId);
      setProject(matchingProject || null);
      setSummary(summaryRes.data);
      setActivity(activityRes.data);
      setBreakdown(breakdownRes.data);
      setFunnel(funnelRes.data);
      setRecentEvents(eventsRes.data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load analytics for this project."));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← Back to Projects
        </Link>

        {loading && <LoadingState label="Loading analytics..." />}

        {!loading && error && <div className="mt-4"><ErrorBanner message={error} /></div>}

        {!loading && !error && (
          <>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                  {project?.projectName || "Project"}
                </h1>
                {project && (
                  <p className="mt-1 text-sm text-gray-500">
                    {PLATFORM_LABELS[project.platform] || project.platform}
                  </p>
                )}
              </div>
              <DemoEventsButton projectId={projectId} onGenerated={loadData} />
            </div>

            <div className="mt-6">
              <SummaryCards summary={summary} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="mb-4 text-sm font-semibold text-gray-900">Events over time</p>
                <ActivityChart data={activity} />
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="mb-4 text-sm font-semibold text-gray-900">Event breakdown</p>
                <EventBreakdownChart breakdown={breakdown} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="mb-4 text-sm font-semibold text-gray-900">Funnel</p>
                <FunnelChart funnel={funnel} />
              </div>

              <div>
                <p className="mb-4 text-sm font-semibold text-gray-900">Recent events</p>
                <RecentEventsTable events={recentEvents} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

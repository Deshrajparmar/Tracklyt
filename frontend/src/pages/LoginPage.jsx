import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/tracklytApi";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import TextField from "../components/TextField";
import ErrorBanner from "../components/ErrorBanner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await authApi.login(form);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to log in. Please check your credentials."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xl font-semibold tracking-tight text-gray-900">Tracklyt</p>
          <p className="mt-1 text-sm text-gray-500">Log in to your analytics dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <ErrorBanner message={error} />

          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@company.com"
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="••••••••"
          />

          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/tracklytApi";
import { getErrorMessage } from "../api/client";
import Button from "../components/Button";
import TextField from "../components/TextField";
import ErrorBanner from "../components/ErrorBanner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ companyName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    if (!form.companyName.trim()) return "Company name is required.";
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    setSubmitting(true);
    try {
      await authApi.signup(form);
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create your account. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xl font-semibold tracking-tight text-gray-900">Tracklyt</p>
          <p className="mt-1 text-sm text-gray-500">Create your company account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <ErrorBanner message={error} />

          <TextField
            id="companyName"
            label="Company Name"
            value={form.companyName}
            onChange={handleChange("companyName")}
            placeholder="Acme Inc."
          />

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
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="At least 6 characters"
          />

          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

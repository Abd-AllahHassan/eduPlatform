import { useState, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, auth } = useAuth();
  const { mutate, isPending, isError, error } = useLogin();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: (res) => {
        login({ token: res.data.token }); // Save token & decode role
      },
    });
  };

  useEffect(() => {
    if (auth.role === "super-admin") navigate("/super-admin");
    else if (auth.role === "admin") navigate("/admin");
    else if (auth.role === "student") navigate("/student");
  }, [auth.role, navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left illustration */}
      <div className="hidden lg:flex flex-1 justify-center items-center bg-white">
        <img
          src="src/assets/desktop-illustration-step-2-x1.webp"
          alt="Learning illustration"
          className="max-w-[80%] h-auto"
        />
      </div>

      {/* Right form */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Log in to continue your learning journey
        </h1>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-purple-700 text-white rounded-md py-2 hover:bg-purple-800 transition-colors"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>
          {isError && (
            <p className="text-red-600 text-sm">
              ❌ {error?.response?.data?.message || "Login failed"}
            </p>
          )}
        </form>

        {/* Links */}
        <div className="mt-6 flex flex-col gap-2 text-center text-purple-700">
          <Link to="/login-other" className="hover:underline">
            Log in to a different account
          </Link>
          <span>
            Don’t have an account?{" "}
            <Link to="/signup" className="hover:underline font-medium">
              Sign up
            </Link>
          </span>
          <Link to="/org-login" className="hover:underline">
            Log in with your organization
          </Link>
        </div>
      </div>
    </div>
  );
}

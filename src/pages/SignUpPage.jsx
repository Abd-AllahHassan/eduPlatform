import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    cpassword: "",
    classLevel: "",
  });

  const { mutate, isPending, isSuccess, isError, error } = useSignup();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

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
          Create your student account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <input
            name="cpassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <input
            name="classLevel"
            placeholder="Class Level"
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-purple-700 text-white rounded-md py-2 hover:bg-purple-800 transition-colors"
          >
            {isPending ? "Signing up..." : "Sign Up"}
          </button>
          {isSuccess && (
            <p className="text-green-600 text-sm">✅ Signup successful!</p>
          )}
          {isError && (
            <p className="text-red-600 text-sm">
              ❌ {error.response?.data?.message || "Signup failed"}
            </p>
          )}
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-purple-700">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

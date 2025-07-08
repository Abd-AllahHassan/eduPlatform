import { useState } from "react";
import { useCreateAdmin } from "../hooks/useCreateAdmin";
import { useAuth } from "../context/AuthContext";

export default function CreateAdminPage() {
  const { auth } = useAuth();
  const token = auth.token;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    cpassword: "",
  });

  const { mutate, isPending, isSuccess, isError, error } =
    useCreateAdmin(token);

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
      <div className="hidden lg:flex flex-2 justify-center items-center bg-white">
        <img
          src="src/assets/desktop-illustration-step-2-x1.webp"
          alt="Admin illustration"
          className="max-w-[80%] h-auto"
        />
      </div>

      {/* Right form */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Create a new Admin
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Only Super Admins can create new admin accounts.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <input
            name="fullName"
            onChange={handleChange}
            placeholder="Full Name"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <input
            name="phoneNumber"
            onChange={handleChange}
            placeholder="Phone Number"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <input
            name="cpassword"
            type="password"
            onChange={handleChange}
            placeholder="Confirm Password"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-purple-700 text-white rounded-md py-2 hover:bg-purple-800 transition-colors"
          >
            {isPending ? "Creating..." : "Create Admin"}
          </button>

          {isSuccess && (
            <p className="text-green-600 text-sm">
              ✅ Admin created successfully!
            </p>
          )}
          {isError && (
            <p className="text-red-600 text-sm">
              ❌ {error.response?.data?.message || "Error occurred"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

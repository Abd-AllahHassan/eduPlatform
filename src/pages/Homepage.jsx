import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left illustration */}
      <div className="hidden lg:flex flex-1 justify-center items-center bg-white">
        <img
          src="src/assets/desktop-illustration-step-2-x1.webp"
          alt="Welcome illustration"
          className="max-w-[80%] h-auto"
        />
      </div>

      {/* Right content */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome to EduMaster 🎓
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
          Learn at your own pace. Sign up today to get started, or log in if you
          already have an account.
        </p>

        {/* Action buttons */}
        <div className="w-full max-w-sm flex flex-col gap-4">
          <Link
            to="/login"
            className="bg-purple-700 text-white text-center py-2 rounded-md hover:bg-purple-800 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white border border-purple-700 text-purple-700 text-center py-2 rounded-md hover:bg-purple-50 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

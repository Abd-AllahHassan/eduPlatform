import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Menu, X, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import share from "./../../assets/share.png";

export default function Sidebar() {
  const [profile, setProfile] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage")
  );
  const { auth } = useAuth();
  const token = auth.token;
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const response = await axios.get(
        "https://edu-master-delta.vercel.app/user",
        { headers: { token } }
      );
      setProfile(response.data.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    if (token) {
      getProfile();
    }

    const syncImage = () => {
      const image = localStorage.getItem("profileImage");
      setProfileImage(image);
    };

    // Listen to storage change in other tabs
    window.addEventListener("storage", syncImage);

    // Sync on component mount/focus
    window.addEventListener("focus", syncImage);

    return () => {
      window.removeEventListener("storage", syncImage);
      window.removeEventListener("focus", syncImage);
    };
  }, [token]);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border rounded p-2 shadow"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex md:flex-col`}
      >
        <div className="text-center mt-20 mb-6 flex flex-col items-center">
          {/* ✅ Avatar uses updated state */}
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={
                profileImage ||
                `https://api.dicebear.com/6.x/initials/svg?seed=${profile.fullName}`
              }
              alt="User"
            />
            <AvatarFallback>
              {profile.fullName?.slice(0, 2).toUpperCase() || "GU"}
            </AvatarFallback>
          </Avatar>

          <h3 className="mt-2 font-bold text-xl text-center break-words">
            {profile.fullName || "Guest"}
          </h3>
          <button className="text-sm text-black flex items-center gap-1 mt-2">
            Share Profile
            <img src={share} alt="Share icon" className="w-4 h-4" />
          </button>
        </div>

        <nav className="mt-4">
          <ul className="space-y-2 px-4">
            {[
              { label: "Profile", to: "/profile" },
              { label: "My Courses", to: "/profile/courses" },
              { label: "Teachers", to: "/profile/teachers" },
              { label: "My Reviews", to: "/profile/reviews" },
            ].map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `block p-2 ps-4 rounded text-sm ${
                      isActive
                        ? "bg-slate-800 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}

            <li className="mt-4">
              <button
                onClick={() => navigate("/student")}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-700 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-transparent bg-opacity-30 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}

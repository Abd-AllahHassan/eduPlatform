// "use client";

// import { useEffect, useState } from "react";
// import { Link, useLocation, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import LogoutButton from "./LogoutButton";

// export default function AdminLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { auth } = useAuth();
//   const location = useLocation();

//   const navigation = [
//     {
//       name: "Dashboard",
//       href: "/admin",
//       icon: "📊",
//       gradient: "from-blue-500 to-purple-600",
//     },
//     {
//       name: "Users",
//       href: "/admin/users",
//       icon: "👥",
//       gradient: "from-green-500 to-teal-600",
//     },
//     {
//       name: "Lessons",
//       href: "/admin/lessons",
//       icon: "📚",
//       gradient: "from-orange-500 to-red-600",
//     },
//     {
//       name: "Exams",
//       href: "/admin/exams",
//       icon: "📝",
//       gradient: "from-purple-500 to-pink-600",
//     },
//     {
//       name: "Revenue",
//       href: "/admin/revenue",
//       icon: "💰",
//       gradient: "from-yellow-500 to-orange-600",
//     },
//     {
//       name: "Settings",
//       href: "/admin/settings",
//       icon: "⚙️",
//       gradient: "from-gray-500 to-gray-700",
//     },
//   ];

//   const isActive = (href) => {
//     if (href === "/admin") {
//       return location.pathname === "/admin";
//     }
//     return location.pathname.startsWith(href);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       {/* Mobile sidebar */}
//       <div
//         className={`fixed inset-0 z-50 lg:hidden ${
//           sidebarOpen ? "block" : "hidden"
//         }`}
//       >
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
//           onClick={() => setSidebarOpen(false)}
//         />
//         <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl">
//           <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600">
//             <h2 className="text-xl font-bold text-white">Admin Panel</h2>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="text-white hover:text-gray-200 transition-colors"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//           <nav className="mt-6 px-4">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 onClick={() => setSidebarOpen(false)}
//                 className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-xl transition-all duration-200 ${
//                   isActive(item.href)
//                     ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
//                     : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                 }`}
//               >
//                 <span className="text-xl mr-4">{item.icon}</span>
//                 {item.name}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Desktop sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
//         <div className="flex flex-col flex-grow bg-white shadow-xl border-r border-gray-200">
//           <div className="flex items-center px-6 py-8 bg-gradient-to-r from-purple-600 to-blue-600">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
//                 <span className="text-2xl">👨‍💻</span>
//               </div>
//               <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
//             </div>
//           </div>
//           <nav className="mt-8 flex-1 px-4">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`flex items-center px-4 py-4 mb-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
//                   isActive(item.href)
//                     ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
//                     : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md"
//                 }`}
//               >
//                 <span className="text-xl mr-4 group-hover:scale-110 transition-transform">
//                   {item.icon}
//                 </span>
//                 {item.name}
//               </Link>
//             ))}
//           </nav>
//           <div className="border-t p-6 bg-gray-50">
//             <div className="flex items-center mb-4">
//               <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 bg-gradient-to-r from-purple-500 to-blue-500">
//                 <span className="text-white text-xl">👨‍💻</span>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">
//                   {auth.user || "Admin"}
//                 </p>
//                 <p className="text-xs text-gray-500">Administrator</p>
//               </div>
//             </div>
//             <LogoutButton />
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-72">
//         {/* Mobile header */}
//         <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
//           <div className="flex items-center justify-between px-4 py-4">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="text-gray-600 hover:text-gray-900"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//             <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
//             <div className="w-6" />
//           </div>
//         </div>

//         {/* Page content */}
//         <main className="p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// } 
"use client"

import { useState } from "react"
import { Link, useLocation, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { auth, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "🏠", gradient: "from-blue-500 to-purple-600" },
    { name: "Users", href: "/admin/users", icon: "👥", gradient: "from-green-500 to-teal-600" },
    { name: "Lessons", href: "/admin/lessons", icon: "📚", gradient: "from-orange-500 to-red-600" },
    { name: "Exams", href: "/admin/exams", icon: "📝", gradient: "from-purple-500 to-pink-600" },
    { name: "Questions", href: "/admin/questions", icon: "❓", gradient: "from-yellow-500 to-orange-600" },
    { name: "Payments", href: "/admin/payments", icon: "💰", gradient: "from-green-600 to-emerald-600" },
    { name: "Analytics", href: "/admin/analytics", icon: "📊", gradient: "from-indigo-500 to-blue-600" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️", gradient: "from-gray-500 to-gray-600" },
  ]

  const isActive = (href) => {
    if (href === "/admin") {
      return location.pathname === "/admin"
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="mt-6 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-xl mr-4">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-xl border-r border-gray-200">
          <div className="flex items-center px-6 py-8 bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
            </div>
          </div>
          <nav className="mt-8 flex-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-4 mb-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive(item.href)
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md"
                }`}
              >
                <span className="text-xl mr-4 group-hover:scale-110 transition-transform">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t p-6 bg-gray-50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xl">👨‍💻</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{auth.user || "Admin"}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <span className="mr-2">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

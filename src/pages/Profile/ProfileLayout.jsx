import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Make sure Sidebar.jsx exists in the same folder

export default function ProfileLayout() {
  return (
    <div className="flex">
      <aside className="w-64 min-h-screen bg-white shadow-md">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

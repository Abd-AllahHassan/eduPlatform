"use client"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"

// Public pages
import Homepage from "./pages/Homepage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"

// Admin/super-admin pages
import CreateAdminPage from "./pages/CreateAdminPage"
import AdminLayout from "./components/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import UsersManagement from "./pages/admin/UsersManagement"
import LessonsManagement from "./pages/admin/LessonsManagement"
import ExamsManagement from "./pages/admin/ExamsManagement"
import QuestionsManagement from "./pages/admin/QuestionsManagement"
import PaymentsManagement from "./pages/admin/PaymentsManagement"

// Student area
import StudentLayout from "./components/StudentLayout"
import Dashboard from "./pages/student/Dashboard"
import Lessons from "./pages/student/Lessons"
import MyLessons from "./pages/student/MyLessons"
import Cart from "./pages/student/Cart"
import Exams from "./pages/student/Exams"
import LessonPlayer from "./pages/student/LessonPlayer"
import ExamTaking from "./pages/student/ExamTaking"
import ExamResult from "./pages/student/ExamResult"

// Profile area
import Profile from "./pages/Profile/Profile"
import ProfileLayout from "./pages/Profile/ProfileLayout"
import EditProfile from "./pages/Profile/EditProfile"
import MyCourses from "./pages/Profile/MyCourses"
import ReviewsSection from "./pages/Profile/Reviews"
import Teachers from "./pages/Profile/Teachers"

function App() {
  const { auth, loading } = useAuth()

  // ✅ Wait until auth is checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Super Admin */}
          <Route
            path="/super-admin"
            element={auth.role === "super-admin" ? <CreateAdminPage /> : <Navigate to="/login" replace />}
          />

          {/* Admin Routes - Updated with full management system */}
          <Route path="/admin" element={auth.role === "admin" ? <AdminLayout /> : <Navigate to="/login" replace />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="lessons" element={<LessonsManagement />} />
            <Route path="exams" element={<ExamsManagement />} />
            <Route path="questions" element={<QuestionsManagement />} />
            <Route path="payments" element={<PaymentsManagement />} />
            <Route
              path="revenue"
              element={
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Revenue Analytics 💰</h1>
                    <p className="text-green-100 text-lg">Track your platform's financial performance</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📊</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Revenue Analytics Coming Soon</h3>
                    <p className="text-gray-500">Advanced financial reporting and analytics will be available here</p>
                  </div>
                </div>
              }
            />
            <Route
              path="analytics"
              element={
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Analytics Dashboard 📊</h1>
                    <p className="text-indigo-100 text-lg">Comprehensive platform analytics and insights</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📈</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Analytics Coming Soon</h3>
                    <p className="text-gray-500">
                      Detailed user behavior, engagement metrics, and performance insights
                    </p>
                  </div>
                </div>
              }
            />
            <Route
              path="settings"
              element={
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Admin Settings ⚙️</h1>
                    <p className="text-gray-100 text-lg">Configure your platform settings</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">⚙️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Settings Panel Coming Soon</h3>
                    <p className="text-gray-500">Platform configuration, security settings, and system preferences</p>
                  </div>
                </div>
              }
            />
          </Route>

          {/* Student Dashboard Routes */}
          <Route
            path="/student"
            element={auth.role === "student" ? <StudentLayout /> : <Navigate to="/login" replace />}
          >
            <Route index element={<Dashboard />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="my-lessons" element={<MyLessons />} />
            <Route path="cart" element={<Cart />} />
            <Route path="exams" element={<Exams />} />
          </Route>

          {/* Standalone Student Pages (Full Screen) */}
          <Route
            path="/student/lesson/:lessonId"
            element={auth.role === "student" ? <LessonPlayer /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/student/exam/:examId"
            element={auth.role === "student" ? <ExamTaking /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/student/exam-result/:examId"
            element={auth.role === "student" ? <ExamResult /> : <Navigate to="/login" replace />}
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={auth.role === "student" ? <ProfileLayout /> : <Navigate to="/login" replace />}
          >
            <Route index element={<Profile />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="reviews" element={<ReviewsSection />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App

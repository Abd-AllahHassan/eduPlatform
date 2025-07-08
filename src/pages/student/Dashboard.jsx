"use client"

import { useNavigate } from "react-router-dom"
import { usePurchasedLessons, useExams, useStudentStats } from "../../hooks/useStudent"

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: purchasedLessons, isLoading: lessonsLoading } = usePurchasedLessons()
  const { data: exams, isLoading: examsLoading } = useExams()
  const { data: stats, isLoading: statsLoading } = useStudentStats()

  const dashboardStats = [
    {
      name: "My Lessons",
      value: purchasedLessons?.data?.length || 0,
      icon: "📚",
      gradient: "from-blue-500 to-purple-600",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Available Exams",
      value: exams?.data?.length || 0,
      icon: "📝",
      gradient: "from-green-500 to-teal-600",
      change: "+5%",
      changeType: "positive",
    },
    {
      name: "Completed Exams",
      value: stats?.completedExams || 0,
      icon: "🏆",
      gradient: "from-yellow-500 to-orange-600",
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Study Hours",
      value: stats?.studyHours || 24,
      icon: "⏰",
      gradient: "from-purple-500 to-pink-600",
      change: "+15%",
      changeType: "positive",
    },
  ]

  if (lessonsLoading || examsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-purple-100 text-lg">Ready to continue your learning journey?</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">🎓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div
            key={stat.name}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}
                >
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.changeType === "positive" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Lessons */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recent Lessons</h3>
              <span className="text-sm text-purple-600 font-medium">View All</span>
            </div>
          </div>
          <div className="p-6">
            {purchasedLessons?.data?.slice(0, 4).map((lesson, index) => (
              <div
                key={lesson._id}
                className="flex items-center py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-lg">📚</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{lesson.title}</p>
                  <p className="text-sm text-gray-500">Class {lesson.classLevel}</p>
                </div>
                <button
                  onClick={() => navigate(`/student/lesson/${lesson._id}`)}
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  Continue
                </button>
              </div>
            )) || (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-gray-500 mb-4">No lessons purchased yet</p>
                <button
                  onClick={() => navigate("/student/lessons")}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Browse Lessons
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Upcoming Exams</h3>
              <span className="text-sm text-green-600 font-medium">View All</span>
            </div>
          </div>
          <div className="p-6">
            {exams?.data?.slice(0, 4).map((exam, index) => (
              <div
                key={exam._id}
                className="flex items-center py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-lg">📝</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{exam.title}</p>
                  <p className="text-sm text-gray-500">Duration: {exam.duration} minutes</p>
                </div>
                <button
                  onClick={() => navigate(`/student/exam/${exam._id}`)}
                  className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Start
                </button>
              </div>
            )) || (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-gray-500">No exams available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

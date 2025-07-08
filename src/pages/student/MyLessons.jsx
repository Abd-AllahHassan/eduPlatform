"use client"

import { usePurchasedLessons } from "../../hooks/useStudent"
import { useNavigate } from "react-router-dom"

export default function MyLessons() {
  const { data: lessons, isLoading, error } = usePurchasedLessons()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-red-600 font-medium">Error loading lessons</p>
        <p className="text-gray-500 text-sm mt-2">{error.message}</p>
      </div>
    )
  }

  if (!lessons?.data?.length) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-6xl">🎓</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No lessons purchased yet</h3>
          <p className="text-gray-500 mb-8 text-lg">Browse our lesson catalog and start learning today.</p>
          <button
            onClick={() => navigate("/student/lessons")}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <span className="mr-2">📚</span>
            Browse Lessons
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">My Lessons 🎓</h1>
        <p className="text-orange-100 text-lg">Access your purchased lessons and learning materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons.data.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center relative">
              <span className="text-white text-4xl">🎥</span>
              <button
                onClick={() => navigate(`/student/lesson/${lesson._id}`)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <span className="text-2xl ml-1">▶️</span>
                </div>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">{lesson.title}</h3>
                <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium ml-2">
                  Class {lesson.classLevel}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {lesson.description || "Continue your learning journey with this lesson"}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/student/lesson/${lesson._id}`)}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl text-sm font-medium hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105"
                >
                  <span className="mr-2">▶️</span>
                  Watch
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                  <span className="mr-1">📄</span>
                  Materials
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

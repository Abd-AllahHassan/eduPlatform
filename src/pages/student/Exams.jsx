"use client"

import { useState } from "react"
import { useExams, useStartExam } from "../../hooks/useStudent"
import { useNavigate } from "react-router-dom"

export default function Exams() {
  const [selectedTab, setSelectedTab] = useState("available")
  const { data: exams, isLoading, error } = useExams()
  const { mutate: startExam, isPending } = useStartExam()
  const navigate = useNavigate()

  const handleStartExam = (examId) => {
    navigate(`/student/exam/${examId}`)
  }

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
        <p className="text-red-600 font-medium">Error loading exams</p>
        <p className="text-gray-500 text-sm mt-2">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Exams 📝</h1>
        <p className="text-purple-100 text-lg">Test your knowledge and track your progress</p>
      </div>

      {/* Exam Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-2">
        <nav className="flex space-x-2">
          <button
            onClick={() => setSelectedTab("available")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all ${
              selectedTab === "available"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            Available Exams
          </button>
          <button
            onClick={() => setSelectedTab("completed")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all ${
              selectedTab === "completed"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            Completed Exams
          </button>
        </nav>
      </div>

      {/* Available Exams */}
      {selectedTab === "available" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams?.data?.map((exam) => (
            <div
              key={exam._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{exam.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {exam.description || "Test your knowledge with this comprehensive exam"}
                  </p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  Class {exam.classLevel}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span>⏰</span>
                  </div>
                  <span>Duration: {exam.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span>📝</span>
                  </div>
                  <span>Questions: {exam.questions?.length || 0}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span>🎯</span>
                  </div>
                  <span>Difficulty: Medium</span>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam._id)}
                disabled={isPending}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Starting...
                  </div>
                ) : (
                  "Start Exam"
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Completed Exams */}
      {selectedTab === "completed" && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🏆</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No completed exams yet</h3>
          <p className="text-gray-500 mb-6">Start taking exams to see your results here</p>
          <button
            onClick={() => setSelectedTab("available")}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            View Available Exams
          </button>
        </div>
      )}

      {exams?.data?.length === 0 && selectedTab === "available" && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No exams available</h3>
          <p className="text-gray-500">Check back later for new exams</p>
        </div>
      )}
    </div>
  )
}

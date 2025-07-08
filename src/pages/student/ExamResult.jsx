"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useExamScore } from "../../hooks/useStudent"

export default function ExamResult() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const { data: scoreData, isLoading, error } = useExamScore(examId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
          </div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error loading results</h3>
          <p className="text-gray-500 mb-6">{error.message || "Unable to load exam results"}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/student/exams")}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Back to Exams
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Handle different API response formats
  const score = scoreData?.score || scoreData?.data?.score || 0
  const totalQuestions = scoreData?.totalQuestions || scoreData?.data?.totalQuestions || 0
  const correctAnswers = scoreData?.correctAnswers || scoreData?.data?.correctAnswers || 0
  const examTitle = scoreData?.examTitle || scoreData?.data?.examTitle || "Exam"
  const timeTaken = scoreData?.timeTaken || scoreData?.data?.timeTaken

  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = () => {
    if (percentage >= 80) return "Excellent! 🎉"
    if (percentage >= 60) return "Good job! 👍"
    return "Keep practicing! 💪"
  }

  const getGrade = () => {
    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B"
    if (percentage >= 60) return "C"
    if (percentage >= 50) return "D"
    return "F"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🏆</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Completed!</h1>
          <h2 className="text-xl text-gray-600 mb-4">{examTitle}</h2>
          <p className="text-gray-600 mb-8">{getScoreMessage()}</p>

          {/* Score Display */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>{percentage}%</div>
                <div className="text-gray-600">Score</div>
              </div>
              <div>
                <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>{getGrade()}</div>
                <div className="text-gray-600">Grade</div>
              </div>
            </div>
            <div className="mt-6 text-gray-600">
              <p className="text-lg mb-2">Points: {score}</p>
              <p>
                Correct Answers: {correctAnswers} out of {totalQuestions}
              </p>
              {timeTaken && <p>Time Taken: {timeTaken}</p>}
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-green-800">Correct</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-red-800">Incorrect</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
              <div className="text-sm text-blue-800">Total</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Performance</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  percentage >= 80
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : percentage >= 60
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                      : "bg-gradient-to-r from-red-500 to-red-600"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/student/exams")}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Take Another Exam
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/student/my-lessons")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Review Lessons
              </button>
              <button
                onClick={() => navigate("/student/dashboard")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-3">
            {percentage < 60 && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <span className="text-red-500 mr-3">📚</span>
                <span className="text-red-800">Review the lesson materials and try again</span>
              </div>
            )}
            {percentage >= 60 && percentage < 80 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-500 mr-3">⭐</span>
                <span className="text-yellow-800">Good work! Practice more to achieve excellence</span>
              </div>
            )}
            {percentage >= 80 && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-500 mr-3">🎉</span>
                <span className="text-green-800">Excellent! You're ready for the next level</span>
              </div>
            )}
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-500 mr-3">💡</span>
              <span className="text-blue-800">Share your achievement with friends and family!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

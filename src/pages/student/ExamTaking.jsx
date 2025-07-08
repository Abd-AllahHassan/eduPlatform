"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useStartExam, useSubmitExam, useExams } from "../../hooks/useStudent"
import { useAuth } from "../../context/AuthContext"

export default function ExamTaking() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const { auth } = useAuth()
  const [examData, setExamData] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const { mutate: startExam, isPending: isStarting } = useStartExam()
  const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam()
  const { data: examsData } = useExams()

  // Debug logs
  useEffect(() => {
    console.log("📝 ExamTaking mounted:", { examId, auth })
  }, [examId, auth])

  // Get exam info from the exams list
  const examInfo = examsData?.data?.find((exam) => exam._id === examId)

  useEffect(() => {
    console.log("📊 Exams data:", examsData)
    console.log("🎯 Found exam info:", examInfo)
  }, [examsData, examInfo])

  useEffect(() => {
    if (timeLeft > 0 && examStarted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitExam()
            return 0
          }
          if (prev <= 300 && prev % 60 === 0) {
            // Show warning every minute in last 5 minutes
            setShowWarning(true)
            setTimeout(() => setShowWarning(false), 3000)
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, examStarted])

  const handleStartExam = () => {
    console.log("🚀 Starting exam:", examId)
    startExam(examId, {
      onSuccess: (data) => {
        console.log("✅ Exam started successfully:", data)
        if (data.exam) {
          setExamData(data.exam)
          setTimeLeft(data.exam.duration * 60)

          // ✅ Check if exam has no questions
          if (!data.exam.questions || data.exam.questions.length === 0) {
            console.log("⚠️ Exam has no questions, redirecting to results")
            alert("This exam has no questions. Redirecting to results page.")
            navigate(`/student/exam-result/${examId}`)
            return
          }
        } else if (examInfo) {
          console.log("📋 Using fallback exam data:", examInfo)
          setExamData(examInfo)
          setTimeLeft(examInfo.duration * 60)

          // ✅ Check if exam has no questions (fallback)
          if (!examInfo.questions || examInfo.questions.length === 0) {
            console.log("⚠️ Exam has no questions (fallback), redirecting to results")
            alert("This exam has no questions. Redirecting to results page.")
            navigate(`/student/exam-result/${examId}`)
            return
          }
        }
        setExamStarted(true)
      },
      onError: (error) => {
        console.error("❌ Failed to start exam:", error)
        alert("Failed to start exam: " + (error.message || "Unknown error"))
        navigate("/student/exams")
      },
    })
  }

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }))
  }

  const handleSubmitExam = () => {
    if (Object.keys(answers).length === 0) {
      if (!confirm("You haven't answered any questions. Are you sure you want to submit?")) {
        return
      }
    }

    // ✅ Fix: Use selectedAnswer instead of selectedOption
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      selectedAnswer: answer, // Changed from selectedOption to selectedAnswer
    }))

    console.log("📤 Submitting exam:", { examId, answers: formattedAnswers })

    submitExam(
      { examId, answers: formattedAnswers },
      {
        onSuccess: (data) => {
          console.log("✅ Exam submitted successfully:", data)
          navigate(`/student/exam-result/${examId}`)
        },
        onError: (error) => {
          console.error("❌ Failed to submit exam:", error)
          alert("Failed to submit exam: " + (error.message || "Unknown error"))
        },
      },
    )
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeLeft > 300) return "text-green-600" // > 5 minutes
    if (timeLeft > 60) return "text-yellow-600" // > 1 minute
    return "text-red-600" // < 1 minute
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Exam?</h2>
          {examInfo && (
            <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{examInfo.title}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Duration: {examInfo.duration} minutes</p>
                <p>Questions: {examInfo.questions?.length || 0}</p>
                <p>Class: {examInfo.classLevel}</p>
              </div>
            </div>
          )}
          <p className="text-gray-600 mb-6">Once you start, the timer will begin and you cannot pause the exam.</p>
          <div className="space-y-4">
            <button
              onClick={handleStartExam}
              disabled={isStarting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
            >
              {isStarting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Starting...
                </div>
              ) : (
                "Start Exam"
              )}
            </button>
            <button
              onClick={() => navigate("/student/exams")}
              className="w-full text-gray-600 py-3 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!examData || !examData.questions) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
          </div>
          <p className="text-gray-600">Loading exam questions...</p>
        </div>
      </div>
    )
  }

  // Add this check right after the loading check for examData
  if (examData && (!examData.questions || examData.questions.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6">This exam doesn't have any questions yet.</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate(`/student/exam-result/${examId}`)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              View Results
            </button>
            <button
              onClick={() => navigate("/student/exams")}
              className="w-full text-gray-600 py-3 hover:text-gray-800 transition-colors"
            >
              Back to Exams
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestionData = examData.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Time Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 text-center">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-lg font-bold text-red-600 mb-2">Time Warning!</h3>
            <p className="text-gray-600">Only {Math.floor(timeLeft / 60)} minutes remaining!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{examData.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {examData.questions.length} • Answered: {getAnsweredCount()}/
                {examData.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getTimeColor()}`}>{formatTime(timeLeft)}</div>
              <p className="text-sm text-gray-500">Time Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / examData.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                Question {currentQuestion + 1}
              </span>
              {answers[currentQuestionData._id] && (
                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  ✓ Answered
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentQuestionData.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestionData.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index) // A, B, C, D
              const isSelected = answers[currentQuestionData._id] === option

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestionData._id, option)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 text-purple-900"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                        isSelected ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {optionLetter}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {currentQuestion === examData.questions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-teal-700 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Submit Exam"
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion((prev) => Math.min(examData.questions.length - 1, prev + 1))}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {examData.questions.map((_, index) => {
              const isAnswered = answers[examData.questions[index]._id]
              const isCurrent = index === currentQuestion

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    isCurrent
                      ? "bg-purple-600 text-white"
                      : isAnswered
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
              <span>Answered ({getAnsweredCount()})</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
              <span>Not Answered ({examData.questions.length - getAnsweredCount()})</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-600 rounded mr-2"></div>
              <span>Current</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

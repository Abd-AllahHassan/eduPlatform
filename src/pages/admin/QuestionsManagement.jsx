"use client"

import { useState } from "react"
import {
  useAllQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useAllExams,
} from "../../hooks/useAdmin"

export default function QuestionsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterExam, setFilterExam] = useState("")
  const [filterType, setFilterType] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)

  const { data: questions, isLoading, error } = useAllQuestions()
  const { data: exams } = useAllExams()
  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion()
  const { mutate: updateQuestion, isPending: isUpdating } = useUpdateQuestion()
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion()

  const [questionForm, setQuestionForm] = useState({
    text: "",
    type: "multiple-choice", // Fixed: Use hyphen instead of underscore
    options: ["", "", "", ""],
    correctAnswer: "",
    exam: "",
    points: "1",
  })

  const filteredQuestions =
    questions?.data?.filter((question) => {
      const questionText = question.question || question.text || ""
      const matchesSearch = questionText.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesExam = !filterExam || question.exam === filterExam
      const matchesType = !filterType || question.type === filterType
      return matchesSearch && matchesExam && matchesType
    }) || []

  const handleCreateQuestion = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!questionForm.text.trim()) {
      alert("Please enter a question")
      return
    }
    if (!questionForm.correctAnswer.trim()) {
      alert("Please provide a correct answer")
      return
    }
    if (questionForm.type === "multiple-choice") {
      const validOptions = questionForm.options.filter((opt) => opt.trim())
      if (validOptions.length < 2) {
        alert("Please provide at least 2 options for multiple choice questions")
        return
      }
      if (!questionForm.options.includes(questionForm.correctAnswer)) {
        alert("The correct answer must be one of the provided options")
        return
      }
    }

    console.log("📝 Creating question with data:", questionForm)

    const formData = {
      text: questionForm.text,
      type: questionForm.type,
      correctAnswer: questionForm.correctAnswer,
      exam: questionForm.exam || null,
      points: Number.parseInt(questionForm.points) || 1,
    }

    // Only include options for multiple-choice questions
    if (questionForm.type === "multiple-choice") {
      formData.options = questionForm.options.filter((opt) => opt.trim())
    }

    createQuestion(formData, {
      onSuccess: () => {
        setShowCreateModal(false)
        resetForm()
      },
    })
  }

  const handleUpdateQuestion = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!questionForm.text.trim()) {
      alert("Please enter a question")
      return
    }
    if (!questionForm.correctAnswer.trim()) {
      alert("Please provide a correct answer")
      return
    }

    console.log("📝 Updating question with data:", questionForm)

    const formData = {
      text: questionForm.text,
      type: questionForm.type,
      correctAnswer: questionForm.correctAnswer,
      exam: questionForm.exam || null,
      points: Number.parseInt(questionForm.points) || 1,
    }

    // Only include options for multiple-choice questions
    if (questionForm.type === "multiple-choice") {
      formData.options = questionForm.options.filter((opt) => opt.trim())
    }

    updateQuestion(
      { questionId: editingQuestion._id, questionData: formData },
      {
        onSuccess: () => {
          setEditingQuestion(null)
          resetForm()
        },
      },
    )
  }

  const handleDeleteQuestion = (questionId, questionText) => {
    if (confirm(`Are you sure you want to delete this question? This action cannot be undone.`)) {
      console.log("🗑️ Deleting question:", questionId)
      deleteQuestion(questionId)
    }
  }

  const handleEditQuestion = (question) => {
    console.log("✏️ Editing question:", question)
    setEditingQuestion(question)
    setQuestionForm({
      text: question.question || question.text || "",
      type: question.type || "multiple-choice",
      options:
        question.options && question.options.length > 0
          ? [...question.options, "", "", "", ""].slice(0, 4)
          : ["", "", "", ""],
      correctAnswer: question.correctAnswer || "",
      exam: question.exam || "",
      points: question.points?.toString() || "1",
    })
  }

  const resetForm = () => {
    setQuestionForm({
      text: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      exam: "",
      points: "1",
    })
  }

  const updateOption = (index, value) => {
    const newOptions = [...questionForm.options]
    newOptions[index] = value
    setQuestionForm({ ...questionForm, options: newOptions })
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
        <p className="text-red-600 font-medium">Error loading questions</p>
        <p className="text-gray-500 text-sm mt-2">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Questions Management ❓</h1>
            <p className="text-yellow-100 text-lg">Build your question bank</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            + Add Question
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <select
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">All Exams</option>
            {exams?.data?.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.title}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">All Types</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="short-answer">Short Answer</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("")
              setFilterExam("")
              setFilterType("")
            }}
            className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div key={question._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      question.type === "multiple-choice"
                        ? "bg-blue-100 text-blue-800"
                        : question.type === "true-false"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {question.type?.replace("-", " ").toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">{question.points || 1} points</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{question.question || question.text}</h3>

                {question.type === "multiple-choice" && question.options && (
                  <div className="space-y-2 mb-3">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-2 rounded-lg ${
                          option === question.correctAnswer ? "bg-green-50 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-sm">{option}</span>
                        {option === question.correctAnswer && (
                          <span className="ml-auto text-green-600 text-xs font-medium">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "true-false" && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">
                      Correct Answer: <span className="font-medium">{question.correctAnswer}</span>
                    </span>
                  </div>
                )}

                {question.type === "short-answer" && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">
                      Correct Answer: <span className="font-medium">{question.correctAnswer}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEditQuestion(question)}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question._id, question.question || question.text)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❓</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-500 mb-6">Create your first question to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Create Question
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingQuestion) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingQuestion ? "Edit Question" : "Create New Question"}
              </h3>
            </div>

            <form onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Type *</label>
                  <select
                    required
                    value={questionForm.type}
                    onChange={(e) => {
                      setQuestionForm({
                        ...questionForm,
                        type: e.target.value,
                        correctAnswer: "", // Reset correct answer when type changes
                        options: e.target.value === "multiple-choice" ? ["", "", "", ""] : [],
                      })
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="short-answer">Short Answer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam</label>
                  <select
                    value={questionForm.exam}
                    onChange={(e) => setQuestionForm({ ...questionForm, exam: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Exam (Optional)</option>
                    {exams?.data?.map((exam) => (
                      <option key={exam._id} value={exam._id}>
                        {exam.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                  <input
                    type="number"
                    min="1"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm({ ...questionForm, points: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                <textarea
                  required
                  rows={3}
                  value={questionForm.text}
                  onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your question here..."
                />
              </div>

              {questionForm.type === "multiple-choice" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options *</label>
                  <div className="space-y-3">
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        />
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={questionForm.correctAnswer === option && option.trim() !== ""}
                          onChange={() => setQuestionForm({ ...questionForm, correctAnswer: option })}
                          className="w-4 h-4 text-purple-600"
                          disabled={option.trim() === ""}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Select the radio button next to the correct answer</p>
                </div>
              )}

              {questionForm.type === "true-false" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value="true"
                        checked={questionForm.correctAnswer === "true"}
                        onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                        className="w-4 h-4 text-purple-600 mr-2"
                      />
                      True
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value="false"
                        checked={questionForm.correctAnswer === "false"}
                        onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                        className="w-4 h-4 text-purple-600 mr-2"
                      />
                      False
                    </label>
                  </div>
                </div>
              )}

              {questionForm.type === "short-answer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                  <input
                    type="text"
                    required
                    value={questionForm.correctAnswer}
                    onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter the correct answer"
                  />
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingQuestion(null)
                    resetForm()
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {isCreating || isUpdating
                    ? editingQuestion
                      ? "Updating..."
                      : "Creating..."
                    : editingQuestion
                      ? "Update Question"
                      : "Create Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

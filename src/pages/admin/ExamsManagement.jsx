"use client"

import { useState } from "react"
import { useAllExams, useCreateExam, useUpdateExam, useDeleteExam } from "../../hooks/useAdmin"

export default function ExamsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingExam, setEditingExam] = useState(null)

  const { data: exams, isLoading, error } = useAllExams()
  const { mutate: createExam, isPending: isCreating } = useCreateExam()
  const { mutate: updateExam, isPending: isUpdating } = useUpdateExam()
  const { mutate: deleteExam, isPending: isDeleting } = useDeleteExam()

  const [examForm, setExamForm] = useState({
    title: "",
    description: "",
    classLevel: "",
    duration: "",
    startDate: "",
    endDate: "",
    questions: [],
  })

  const filteredExams =
    exams?.data?.filter((exam) => {
      const matchesSearch = exam.title?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = !filterClass || exam.classLevel === filterClass
      return matchesSearch && matchesClass
    }) || []

  const handleCreateExam = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!examForm.title.trim()) {
      alert("Please enter an exam title")
      return
    }
    if (!examForm.description.trim()) {
      alert("Please enter a description")
      return
    }
    if (examForm.description.trim().length < 10) {
      alert("Description must be at least 10 characters long")
      return
    }
    if (!examForm.classLevel) {
      alert("Please select a class level")
      return
    }
    if (!examForm.duration || Number(examForm.duration) <= 0) {
      alert("Please enter a valid duration")
      return
    }
    if (!examForm.startDate) {
      alert("Please select a start date")
      return
    }
    if (!examForm.endDate) {
      alert("Please select an end date")
      return
    }
    if (new Date(examForm.startDate) >= new Date(examForm.endDate)) {
      alert("End date must be after start date")
      return
    }

    console.log("📝 Creating exam with data:", examForm)

    const formData = {
      ...examForm,
      duration: Number(examForm.duration),
    }

    createExam(formData, {
      onSuccess: () => {
        setShowCreateModal(false)
        resetForm()
      },
    })
  }

  const handleUpdateExam = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!examForm.title.trim()) {
      alert("Please enter an exam title")
      return
    }
    if (!examForm.description.trim()) {
      alert("Please enter a description")
      return
    }
    if (examForm.description.trim().length < 10) {
      alert("Description must be at least 10 characters long")
      return
    }
    if (!examForm.classLevel) {
      alert("Please select a class level")
      return
    }
    if (!examForm.duration || Number(examForm.duration) <= 0) {
      alert("Please enter a valid duration")
      return
    }
    if (!examForm.startDate) {
      alert("Please select a start date")
      return
    }
    if (!examForm.endDate) {
      alert("Please select an end date")
      return
    }
    if (new Date(examForm.startDate) >= new Date(examForm.endDate)) {
      alert("End date must be after start date")
      return
    }

    console.log("📝 Updating exam with data:", examForm)

    const formData = {
      ...examForm,
      duration: Number(examForm.duration),
    }

    updateExam(
      { examId: editingExam._id, examData: formData },
      {
        onSuccess: () => {
          setEditingExam(null)
          resetForm()
        },
      },
    )
  }

  const handleDeleteExam = (examId, examTitle) => {
    if (confirm(`Are you sure you want to delete "${examTitle}"? This action cannot be undone.`)) {
      console.log("🗑️ Deleting exam:", examId)
      deleteExam(examId)
    }
  }

  const handleEditExam = (exam) => {
    console.log("✏️ Editing exam:", exam)
    setEditingExam(exam)

    // Format dates for input fields (convert to YYYY-MM-DD format)
    const formatDateForInput = (dateString) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      return date.toISOString().split("T")[0]
    }

    setExamForm({
      title: exam.title || "",
      description: exam.description || "",
      classLevel: exam.classLevel || "",
      duration: exam.duration?.toString() || "",
      startDate: formatDateForInput(exam.startDate),
      endDate: formatDateForInput(exam.endDate),
      questions: exam.questions || [],
    })
  }

  const resetForm = () => {
    setExamForm({
      title: "",
      description: "",
      classLevel: "",
      duration: "",
      startDate: "",
      endDate: "",
      questions: [],
    })
  }

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent absolute top-0"></div>
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
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Exams Management 📝</h1>
            <p className="text-red-100 text-lg">Create and manage student assessments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            + Add Exam
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          >
            <option value="">Select Class</option>
            <option value="Grade 1 Secondary">Class 1</option>
            <option value="Grade 2 Secondary">Class 2</option>
            <option value="Grade 3 Secondary">Class 3</option>
            <option value="Grade 4 Secondary">Class 4</option>
            <option value="Grade 5 Secondary">Class 5</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("")
              setFilterClass("")
            }}
            className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div key={exam._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">{exam.classLevel}</span>
                <span className="text-xs text-gray-500">{exam.duration} mins</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{exam.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{exam.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Questions:</span>
                  <span className="font-medium">{exam.questions?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Start Date:</span>
                  <span className="font-medium">{formatDateForDisplay(exam.startDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">End Date:</span>
                  <span className="font-medium">{formatDateForDisplay(exam.endDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-green-600">{exam.isActive !== false ? "Active" : "Inactive"}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditExam(exam)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteExam(exam._id, exam.title)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No exams found</h3>
          <p className="text-gray-500 mb-6">Create your first exam to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Create Exam
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingExam) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">{editingExam ? "Edit Exam" : "Create New Exam"}</h3>
            </div>

            <form onSubmit={editingExam ? handleUpdateExam : handleCreateExam} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title *</label>
                  <input
                    type="text"
                    required
                    value={examForm.title}
                    onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter exam title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Level *</label>
                  <select
                    required
                    value={examForm.classLevel}
                    onChange={(e) => setExamForm({ ...examForm, classLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Class</option>
                    <option value="Grade 1 Secondary">Class 1</option>
                    <option value="Grade 2 Secondary">Class 2</option>
                    <option value="Grade 3 Secondary">Class 3</option>
                    <option value="Grade 4 Secondary">Class 4</option>
                    <option value="Grade 5 Secondary">Class 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={examForm.duration}
                    onChange={(e) => setExamForm({ ...examForm, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={examForm.startDate}
                    onChange={(e) => setExamForm({ ...examForm, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    required
                    value={examForm.endDate}
                    onChange={(e) => setExamForm({ ...examForm, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description * <span className="text-xs text-gray-500">(minimum 10 characters)</span>
                </label>
                <textarea
                  required
                  rows={4}
                  minLength={10}
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describe the exam content and objectives... (minimum 10 characters)"
                />
                <div className="text-xs text-gray-500 mt-1">{examForm.description.length}/10 characters minimum</div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-medium text-blue-900 mb-2">📝 Note about Questions</h4>
                <p className="text-sm text-blue-700">
                  After creating the exam, you can add questions using the Questions Management section. Questions can
                  be associated with specific exams during creation.
                </p>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingExam(null)
                    resetForm()
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isCreating || isUpdating
                    ? editingExam
                      ? "Updating..."
                      : "Creating..."
                    : editingExam
                      ? "Update Exam"
                      : "Create Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useAllLessons, useCreateLesson, useUpdateLesson, useDeleteLesson } from "../../hooks/useAdmin"

export default function LessonsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)

  const { data: lessons, isLoading, error } = useAllLessons()
  const { mutate: createLesson, isPending: isCreating } = useCreateLesson()
  const { mutate: updateLesson, isPending: isUpdating } = useUpdateLesson()
  const { mutate: deleteLesson, isPending: isDeleting } = useDeleteLesson()

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    classLevel: "",
    video: "",
    price: "",
  })

  const filteredLessons =
    lessons?.data?.filter((lesson) => {
      const matchesSearch = lesson.title?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = !filterClass || lesson.classLevel === filterClass
      const matchesSubject = !filterSubject || lesson.subject?.toLowerCase().includes(filterSubject.toLowerCase())
      return matchesSearch && matchesClass && matchesSubject
    }) || []

  const handleCreateLesson = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!lessonForm.title.trim()) {
      alert("Please enter a lesson title")
      return
    }
    if (!lessonForm.classLevel) {
      alert("Please select a class level")
      return
    }
    if (!lessonForm.video.trim()) {
      alert("Please provide a video URL")
      return
    }

    console.log("📚 Creating lesson with data:", lessonForm)

    const formData = {
      title: lessonForm.title,
      description: lessonForm.description,
      classLevel: lessonForm.classLevel,
      video: lessonForm.video,
      price: Number(lessonForm.price) || 0,
    }

    createLesson(formData, {
      onSuccess: () => {
        setShowCreateModal(false)
        resetForm()
      },
    })
  }

  const handleUpdateLesson = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!lessonForm.title.trim()) {
      alert("Please enter a lesson title")
      return
    }
    if (!lessonForm.classLevel) {
      alert("Please select a class level")
      return
    }
    if (!lessonForm.video.trim()) {
      alert("Please provide a video URL")
      return
    }

    console.log("📚 Updating lesson with data:", lessonForm)

    const formData = {
      title: lessonForm.title,
      description: lessonForm.description,
      classLevel: lessonForm.classLevel,
      video: lessonForm.video,
      price: Number(lessonForm.price) || 0,
    }

    updateLesson(
      { lessonId: editingLesson._id, lessonData: formData },
      {
        onSuccess: () => {
          setEditingLesson(null)
          resetForm()
        },
      },
    )
  }

  const handleDeleteLesson = (lessonId, lessonTitle) => {
    if (confirm(`Are you sure you want to delete "${lessonTitle}"? This action cannot be undone.`)) {
      console.log("🗑️ Deleting lesson:", lessonId)
      deleteLesson(lessonId)
    }
  }

  const handleEditLesson = (lesson) => {
    console.log("✏️ Editing lesson:", lesson)
    setEditingLesson(lesson)

    setLessonForm({
      title: lesson.title || "",
      description: lesson.description || "",
      classLevel: lesson.classLevel || "",
      video: lesson.video || lesson.videoUrl || "",
      price: lesson.price?.toString() || "",
    })
  }

  const resetForm = () => {
    setLessonForm({
      title: "",
      description: "",
      classLevel: "",
      video: "",
      price: "",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
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
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lessons Management 📚</h1>
            <p className="text-blue-100 text-lg">Create and manage your educational content</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            + Add Lesson
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
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select Class</option>
            <option value="Grade 1 Secondary">Class 1</option>
            <option value="Grade 2 Secondary">Class 2</option>
            <option value="Grade 3 Secondary">Class 3</option>
            <option value="Grade 4 Secondary">Class 4</option>
            <option value="Grade 5 Secondary">Class 5</option>
          </select>

          <input
            type="text"
            placeholder="Filter by subject..."
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />

          <button
            onClick={() => {
              setSearchTerm("")
              setFilterClass("")
              setFilterSubject("")
            }}
            className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="relative">
              <img
                src={lesson.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                alt={lesson.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ₦{lesson.price || 0}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {lesson.classLevel}
                </span>
                {lesson.duration && <span className="text-xs text-gray-500">{lesson.duration} mins</span>}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{lesson.title}</h3>
              {lesson.subject && <p className="text-sm text-blue-600 font-medium mb-2">{lesson.subject}</p>}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lesson.description}</p>

              {lesson.scheduledDate && (
                <p className="text-xs text-gray-500 mb-4">
                  Scheduled: {new Date(lesson.scheduledDate).toLocaleDateString()}
                </p>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditLesson(lesson)}
                  className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLesson(lesson._id, lesson.title)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No lessons found</h3>
          <p className="text-gray-500 mb-6">Create your first lesson to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Create Lesson
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingLesson) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">{editingLesson ? "Edit Lesson" : "Create New Lesson"}</h3>
            </div>

            <form onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                  <input
                    type="text"
                    required
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Level *</label>
                  <select
                    required
                    value={lessonForm.classLevel}
                    onChange={(e) => setLessonForm({ ...lessonForm, classLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={lessonForm.price}
                    onChange={(e) => setLessonForm({ ...lessonForm, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what students will learn in this lesson..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
                <input
                  type="url"
                  required
                  value={lessonForm.video}
                  onChange={(e) => setLessonForm({ ...lessonForm, video: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/video.mp4"
                />
                <p className="text-xs text-gray-500 mt-1">Provide a direct link to the lesson video</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl">
                <h4 className="font-medium text-yellow-900 mb-2">📝 API Requirements</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Video URL is required</li>
                  <li>• Only title, description, classLevel, video, and price are allowed</li>
                  <li>• Price must be a valid number (0 or greater)</li>
                </ul>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingLesson(null)
                    resetForm()
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isCreating || isUpdating
                    ? editingLesson
                      ? "Updating..."
                      : "Creating..."
                    : editingLesson
                      ? "Update Lesson"
                      : "Create Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

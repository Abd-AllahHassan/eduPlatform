"use client"

import { useState } from "react"
import { useLessons } from "../../hooks/useStudent"
import { useCart } from "../../context/CartContext"

export default function Lessons() {
  const [filters, setFilters] = useState({
    search: "",
    classLevel: "",
    isPaid: "",
  })

  const { data: lessons, isLoading, error } = useLessons(filters)
  const { addToCart, cartItems } = useCart()

  const handleFilterChange = (key, value) => {
    console.log(`Filter changed: ${key} = ${value}`)
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const isInCart = (lessonId) => {
    return cartItems.some((item) => item._id === lessonId)
  }

  // Helper function to extract class number from classLevel
  const getClassNumber = (classLevel) => {
    if (!classLevel) return ""
    // Extract number from "Grade X Secondary" format
    const match = classLevel.match(/Grade (\d+)/)
    return match ? match[1] : classLevel
  }

  // Helper function to determine if lesson is paid
  const isLessonPaid = (lesson) => {
    // Check multiple possible indicators
    return lesson.isPaid === true || (lesson.price && lesson.price > 0)
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
        <p className="text-red-600 font-medium">Error loading lessons</p>
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

  console.log("Lessons data:", lessons)
  console.log("Current filters:", filters)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Browse Lessons 📚</h1>
        <p className="text-green-100 text-lg">Discover amazing courses to boost your knowledge</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
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
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <select
            value={filters.classLevel}
            onChange={(e) => handleFilterChange("classLevel", e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">All Classes</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
            <option value="5">Class 5</option>
          </select>

          <select
            value={filters.isPaid}
            onChange={(e) => handleFilterChange("isPaid", e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">All Lessons</option>
            <option value="true">Paid Only</option>
            <option value="false">Free Only</option>
          </select>

          <button
            onClick={() => {
              console.log("Clearing all filters")
              setFilters({ search: "", classLevel: "", isPaid: "" })
            }}
            className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>
            <strong>Debug:</strong> Found {lessons?.data?.length || 0} lessons | Active filters:{" "}
            {Object.entries(filters)
              .filter(([_, value]) => value !== "")
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ") || "None"}
          </p>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons?.data?.map((lesson) => {
          const isPaid = isLessonPaid(lesson)
          const classNumber = getClassNumber(lesson.classLevel)

          return (
            <div
              key={lesson._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center relative">
                {lesson.thumbnailUrl ? (
                  <img
                    src={lesson.thumbnailUrl || "/placeholder.svg"}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ display: lesson.thumbnailUrl ? "none" : "flex" }}
                >
                  <span className="text-white text-4xl">🎥</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <span className="text-2xl ml-1">▶️</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">{lesson.title}</h3>
                  <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium ml-2">
                    Class {classNumber || "N/A"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {lesson.description || "Enhance your learning with this comprehensive lesson"}
                </p>

                {/* Subject display if available */}
                {lesson.subject && <p className="text-blue-600 text-xs font-medium mb-2">📚 {lesson.subject}</p>}

                {/* Scheduled date if available */}
                {lesson.scheduledDate && (
                  <p className="text-gray-500 text-xs mb-3">
                    📅 Scheduled: {new Date(lesson.scheduledDate).toLocaleDateString()}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isPaid ? (
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900">₦{lesson.price || 0}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₦{((lesson.price || 0) * 1.5).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-green-600">Free</span>
                    )}
                  </div>

                  {isPaid ? (
                    <button
                      onClick={() => addToCart(lesson)}
                      disabled={isInCart(lesson._id)}
                      className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                        isInCart(lesson._id)
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg transform hover:scale-105"
                      }`}
                    >
                      {isInCart(lesson._id) ? "In Cart" : "Add to Cart"}
                    </button>
                  ) : (
                    <button className="px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 hover:shadow-lg transform hover:scale-105 transition-all">
                      Access Free
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {lessons?.data?.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No lessons found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
          <button
            onClick={() => setFilters({ search: "", classLevel: "", isPaid: "" })}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

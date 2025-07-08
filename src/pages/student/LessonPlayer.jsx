"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useLessons } from "../../hooks/useStudent"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"

export default function LessonPlayer() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { auth } = useAuth()
  const [lesson, setLesson] = useState(null)
  const [videoError, setVideoError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get all lessons to find the specific one
  const { data: lessonsData, isLoading: lessonsLoading, error } = useLessons()
  const { isLessonApproved } = useCart()

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null

    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=0&controls=1&rel=0&modestbranding=1`
    }

    return null
  }

  // Helper function to check if URL is a YouTube URL
  const isYouTubeUrl = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"))
  }

  // Debug logs
  useEffect(() => {
    console.log("🎥 LessonPlayer mounted:", { lessonId, auth })
  }, [lessonId, auth])

  useEffect(() => {
    console.log("📚 Lessons data:", lessonsData)
    setIsLoading(lessonsLoading)

    if (lessonsData?.data) {
      const foundLesson = lessonsData.data.find((l) => l._id === lessonId)
      console.log("🔍 Found lesson:", foundLesson)

      if (foundLesson) {
        // Check if lesson is free or approved
        
       

        

        if (foundLesson != null) {
          setLesson(foundLesson)
        } else {
          console.log("❌ Access denied, redirecting...")
          alert("You don't have access to this lesson. Please purchase and wait for approval.")
          navigate("/student/lessons")
        }
      } else {
        console.log("❌ Lesson not found, redirecting...")
        navigate("/student/lessons")
      }
    }
  }, [lessonsData, lessonId, navigate, isLessonApproved, lessonsLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center text-white">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
          </div>
          <p className="text-lg">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Error loading lesson</h3>
          <p className="text-gray-300 mb-6">{error.message}</p>
          <button
            onClick={() => navigate("/student/lessons")}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Lesson not found</h3>
          <p className="text-gray-300 mb-6">You don't have access to this lesson or it doesn't exist</p>
          <button
            onClick={() => navigate("/student/lessons")}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    )
  }

  if (videoError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎥</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Video Error</h3>
          <p className="text-gray-300 mb-2">Unable to load the video for this lesson</p>
          <p className="text-gray-400 text-sm mb-6">Video URL: {lesson.video || "No video URL provided"}</p>
          <div className="space-x-4">
            <button
              onClick={() => setVideoError(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/student/lessons")}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Get video URL and determine if it's YouTube
  const videoUrl = lesson.video
  const isYouTube = isYouTubeUrl(videoUrl)
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(videoUrl) : videoUrl

  console.log("🎬 Video Debug:", {
    videoUrl,
    isYouTube,
    embedUrl,
    lesson: lesson.title,
  })

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{lesson.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>{lesson.classLevel}</span>
              <span>•</span>
              <span>{lesson.subject || "General"}</span>
              {lesson.price > 0 && (
                <>
                  <span>•</span>
                  <span>₦{lesson.price}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate("/student/lessons")}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Back to Lessons
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 120px)" }}>
        {!videoUrl ? (
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎥</span>
            </div>
            <h3 className="text-xl font-bold mb-2">No Video Available</h3>
            <p className="text-gray-300">This lesson doesn't have a video yet</p>
          </div>
        ) : isYouTube ? (
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}>
              <iframe
                src={embedUrl}
                title={lesson.title}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={() => {
                  console.error("YouTube iframe failed to load")
                  setVideoError(true)
                }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-4">
            <video
              className="w-full h-auto max-h-full rounded-lg"
              src={videoUrl}
              controls
              onError={(e) => {
                console.error("Video failed to load:", e)
                setVideoError(true)
              }}
              poster={lesson.thumbnail}
              crossOrigin="anonymous"
            >
              <p className="text-white">Your browser does not support the video tag.</p>
            </video>
          </div>
        )}
      </div>

      {/* Lesson Description */}
      {lesson.description && (
        <div className="bg-black/50 backdrop-blur-sm p-4 mt-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-2">About this lesson</h3>
            <p className="text-gray-300 leading-relaxed">{lesson.description}</p>
            {lesson.scheduledDate && (
              <p className="text-gray-400 text-sm mt-2">
                Scheduled: {new Date(lesson.scheduledDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

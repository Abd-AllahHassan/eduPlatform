"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useLessons } from "../../hooks/useStudent"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"

export default function LessonPlayer() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { auth } = useAuth()
  const videoRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [lesson, setLesson] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Get all lessons to find the specific one
  const { data: lessonsData, isLoading, error } = useLessons()
  const { isLessonApproved, getApprovedLessons } = useCart()

  // Debug logs
  useEffect(() => {
    console.log("🎥 LessonPlayer mounted:", { lessonId, auth })
  }, [lessonId, auth])

  useEffect(() => {
    console.log("📚 Lessons data:", lessonsData)
    if (lessonsData?.data) {
      const foundLesson = lessonsData.data.find((l) => l._id === lessonId)
      console.log("🔍 Found lesson:", foundLesson)

      if (foundLesson) {
        // Check if lesson is free or approved
        const isFree = !foundLesson.isPaid && (!foundLesson.price || foundLesson.price === 0)
        const isApproved = isLessonApproved(lessonId)

        console.log("🔐 Access check:", { isFree, isApproved, lesson: foundLesson })

        if (isFree || isApproved) {
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
  }, [lessonsData, lessonId, navigate, isLessonApproved])

  useEffect(() => {
    let hideControlsTimer
    if (showControls) {
      hideControlsTimer = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
    return () => clearTimeout(hideControlsTimer)
  }, [showControls])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleVideoError = () => {
    console.error("Video failed to load")
    setVideoError(true)
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const time = pos * duration
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault()
        handlePlayPause()
      } else if (e.code === "KeyF") {
        e.preventDefault()
        toggleFullscreen()
      } else if (e.code === "ArrowLeft") {
        e.preventDefault()
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
        }
      } else if (e.code === "ArrowRight") {
        e.preventDefault()
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10)
        }
      }
    }
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [isPlaying, duration])

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
              onClick={() => {
                setVideoError(false)
                if (videoRef.current) {
                  videoRef.current.load()
                }
              }}
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

  // Get video URL - the API uses 'video' field
  const videoUrl =
    lesson.video ||
    lesson.videoUrl ||
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div className="relative" onMouseMove={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
        <video
          ref={videoRef}
          className="w-full h-screen object-contain"
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={handleVideoError}
          poster={lesson.thumbnail}
          crossOrigin="anonymous"
        />

        {/* Loading overlay */}
        {!duration && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/30 rounded-full cursor-pointer mb-4 group" onClick={handleSeek}>
            <div
              className="h-full bg-purple-600 rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <span className="text-white text-xl">{isPlaying ? "⏸️" : "▶️"}</span>
              </button>
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-purple-600"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleFullscreen}
                className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                {isFullscreen ? "⛶" : "⛶"}
              </button>
              <button
                onClick={() => navigate("/student/lessons")}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Back to Lessons
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Info Overlay */}
        <div
          className={`absolute top-6 left-6 right-6 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white">
            <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-300">{lesson.classLevel}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{lesson.subject || "General"}</span>
              {lesson.instructor && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">By {lesson.instructor}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center play button when paused */}
        {!isPlaying && duration > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              className="w-20 h-20 bg-purple-600 bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all transform hover:scale-110"
            >
              <span className="text-white text-3xl ml-1">▶️</span>
            </button>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts info */}
      <div
        className={`fixed bottom-4 right-4 bg-black/70 text-white text-xs p-3 rounded-lg transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <div className="space-y-1">
          <div>Space: Play/Pause</div>
          <div>F: Fullscreen</div>
          <div>← →: Skip 10s</div>
        </div>
      </div>
    </div>
  )
}

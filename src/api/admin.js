import axios from "axios"

const API_BASE = "https://edu-master-delta.vercel.app"

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No authentication token found")
  }
  return {
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
  }
}

// Error handling wrapper
const handleRequest = async (request) => {
  try {
    const response = await request
    console.log("API Response:", response.data) // Debug log
    return response.data
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message)

    // Better error handling for React
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || error.response.statusText || "Server error"
      const errorData = {
        message: errorMessage,
        status: error.response.status,
        data: error.response.data,
      }
      throw errorData
    } else if (error.request) {
      // Request was made but no response received
      throw { message: "Network error - no response from server" }
    } else {
      // Something else happened
      throw { message: error.message || "An unexpected error occurred" }
    }
  }
}

// Helper function to ensure questions array contains only string IDs
const formatQuestionsArray = (questions) => {
  if (!Array.isArray(questions)) {
    return []
  }

  return questions
    .map((question) => {
      // If it's already a string (ID), return it
      if (typeof question === "string") {
        return question
      }
      // If it's an object with _id property, extract the ID
      if (question && typeof question === "object" && question._id) {
        return question._id.toString()
      }
      // If it's an object with id property, extract the ID
      if (question && typeof question === "object" && question.id) {
        return question.id.toString()
      }
      // Skip invalid entries
      return null
    })
    .filter((id) => id !== null && id.trim() !== "") // Remove null/empty values
}

// Admin Management API
export const adminAPI = {
  // Admin Management
  createAdmin: async (adminData) => {
    console.log("Creating admin:", adminData)

    // Validate required fields
    if (!adminData.fullName || !adminData.email || !adminData.password) {
      throw new Error("Missing required fields: fullName, email, password")
    }

    const payload = {
      fullName: adminData.fullName,
      email: adminData.email,
      phoneNumber: adminData.phoneNumber || "",
      password: adminData.password,
      cpassword: adminData.cpassword || adminData.password,
    }

    return handleRequest(axios.post(`${API_BASE}/admin/create-admin`, payload, getAuthHeaders()))
  },

  getAllAdmins: async () => {
    return handleRequest(axios.get(`${API_BASE}/admin/all-admin`, getAuthHeaders()))
  },

  getAllUsers: async () => {
    return handleRequest(axios.get(`${API_BASE}/admin/all-user`, getAuthHeaders()))
  },

  // Lesson Management - FIXED: Updated to match API requirements
  getAllLessons: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value)
      }
    })

    const url = params.toString() ? `${API_BASE}/lesson?${params.toString()}` : `${API_BASE}/lesson`
    return handleRequest(axios.get(url, getAuthHeaders()))
  },

  getLessonById: async (lessonId) => {
    if (!lessonId) {
      throw new Error("Lesson ID is required")
    }
    return handleRequest(axios.get(`${API_BASE}/lesson/${lessonId}`, getAuthHeaders()))
  },

  createLesson: async (lessonData) => {
    console.log("Creating lesson:", lessonData)

    // Validate required fields
    if (!lessonData.title || !lessonData.classLevel) {
      throw new Error("Missing required fields: title, classLevel")
    }

    if (!lessonData.video) {
      throw new Error("Video is required")
    }

    // Build payload with only allowed fields (removed scheduledDate)
    const payload = {
      title: lessonData.title.trim(),
      description: lessonData.description || "",
      classLevel: lessonData.classLevel,
      video: lessonData.video, // Required field
      price: Number(lessonData.price) || 0,
    }

    console.log("Final lesson payload:", payload)
    return handleRequest(axios.post(`${API_BASE}/lesson`, payload, getAuthHeaders()))
  },

  updateLesson: async (lessonId, lessonData) => {
    console.log("Updating lesson:", lessonId, lessonData)

    if (!lessonId) {
      throw new Error("Lesson ID is required")
    }

    if (!lessonData.title || !lessonData.classLevel) {
      throw new Error("Missing required fields: title, classLevel")
    }

    if (!lessonData.video) {
      throw new Error("Video is required")
    }

    // Build payload with only allowed fields (removed scheduledDate)
    const payload = {
      title: lessonData.title.trim(),
      description: lessonData.description || "",
      classLevel: lessonData.classLevel,
      video: lessonData.video, // Required field
      price: Number(lessonData.price) || 0,
    }

    console.log("Final lesson update payload:", payload)
    return handleRequest(axios.put(`${API_BASE}/lesson/${lessonId}`, payload, getAuthHeaders()))
  },

  deleteLesson: async (lessonId) => {
    console.log("Deleting lesson:", lessonId)

    if (!lessonId) {
      throw new Error("Lesson ID is required")
    }

    return handleRequest(axios.delete(`${API_BASE}/lesson/${lessonId}`, getAuthHeaders()))
  },

  // Exam Management - FIXED: Questions array handling
  getAllExams: async () => {
    return handleRequest(axios.get(`${API_BASE}/exam`, getAuthHeaders()))
  },

  getExamById: async (examId) => {
    if (!examId) {
      throw new Error("Exam ID is required")
    }
    return handleRequest(axios.get(`${API_BASE}/exam/${examId}`, getAuthHeaders()))
  },

  createExam: async (examData) => {
    console.log("Creating exam:", examData)

    // Validate required fields
    if (!examData.title || !examData.classLevel || !examData.duration) {
      throw new Error("Missing required fields: title, classLevel, duration")
    }

    if (!examData.description || examData.description.length < 10) {
      throw new Error("Description must be at least 10 characters long")
    }

    if (!examData.startDate || !examData.endDate) {
      throw new Error("Start date and end date are required")
    }

    // Format questions array to ensure only string IDs
    const formattedQuestions = formatQuestionsArray(examData.questions)

    const payload = {
      title: examData.title.trim(),
      description: examData.description.trim(),
      classLevel: examData.classLevel,
      duration: Number(examData.duration),
      startDate: examData.startDate,
      endDate: examData.endDate,
      questions: formattedQuestions, // Only string IDs
    }

    console.log("Formatted exam payload:", payload)
    return handleRequest(axios.post(`${API_BASE}/exam`, payload, getAuthHeaders()))
  },

  updateExam: async (examId, examData) => {
    console.log("Updating exam:", examId, examData)

    if (!examId) {
      throw new Error("Exam ID is required")
    }

    if (!examData.title || !examData.classLevel || !examData.duration) {
      throw new Error("Missing required fields: title, classLevel, duration")
    }

    if (!examData.description || examData.description.length < 10) {
      throw new Error("Description must be at least 10 characters long")
    }

    if (!examData.startDate || !examData.endDate) {
      throw new Error("Start date and end date are required")
    }

    // Format questions array to ensure only string IDs
    const formattedQuestions = formatQuestionsArray(examData.questions)

    const payload = {
      title: examData.title.trim(),
      description: examData.description.trim(),
      classLevel: examData.classLevel,
      duration: Number(examData.duration),
      startDate: examData.startDate,
      endDate: examData.endDate,
      questions: formattedQuestions, // Only string IDs
    }

    console.log("Formatted exam update payload:", payload)
    return handleRequest(axios.put(`${API_BASE}/exam/${examId}`, payload, getAuthHeaders()))
  },

  deleteExam: async (examId) => {
    console.log("Deleting exam:", examId)

    if (!examId) {
      throw new Error("Exam ID is required")
    }

    return handleRequest(axios.delete(`${API_BASE}/exam/${examId}`, getAuthHeaders()))
  },

  // Question Management - FIXED: Type values and options handling
  getAllQuestions: async () => {
    return handleRequest(axios.get(`${API_BASE}/question`, getAuthHeaders()))
  },

  getQuestionById: async (questionId) => {
    if (!questionId) {
      throw new Error("Question ID is required")
    }
    return handleRequest(axios.get(`${API_BASE}/question/get/${questionId}`, getAuthHeaders()))
  },

  createQuestion: async (questionData) => {
    console.log("Creating question:", questionData)

    // Validate required fields
    if (!questionData.text || !questionData.type || !questionData.correctAnswer) {
      throw new Error("Missing required fields: text, type, correctAnswer")
    }

    // Build base payload
    const payload = {
      text: questionData.text.trim(),
      type: questionData.type,
      correctAnswer: questionData.correctAnswer.trim(),
      exam: questionData.exam || null,
      points: Number(questionData.points) || 1,
    }

    // Only add options for multiple-choice questions
    if (questionData.type === "multiple-choice") {
      const validOptions = Array.isArray(questionData.options)
        ? questionData.options.filter((opt) => opt && opt.trim())
        : []

      if (validOptions.length < 2) {
        throw new Error("Multiple choice questions must have at least 2 options")
      }

      if (!validOptions.includes(questionData.correctAnswer.trim())) {
        throw new Error("Correct answer must be one of the provided options")
      }

      payload.options = validOptions
    }

    console.log("Final question payload:", payload)
    return handleRequest(axios.post(`${API_BASE}/question`, payload, getAuthHeaders()))
  },

  updateQuestion: async (questionId, questionData) => {
    console.log("Updating question:", questionId, questionData)

    if (!questionId) {
      throw new Error("Question ID is required")
    }

    if (!questionData.text || !questionData.type || !questionData.correctAnswer) {
      throw new Error("Missing required fields: text, type, correctAnswer")
    }

    // Build base payload
    const payload = {
      text: questionData.text.trim(),
      type: questionData.type,
      correctAnswer: questionData.correctAnswer.trim(),
      exam: questionData.exam || null,
      points: Number(questionData.points) || 1,
    }

    // Only add options for multiple-choice questions
    if (questionData.type === "multiple-choice") {
      const validOptions = Array.isArray(questionData.options)
        ? questionData.options.filter((opt) => opt && opt.trim())
        : []

      if (validOptions.length < 2) {
        throw new Error("Multiple choice questions must have at least 2 options")
      }

      if (!validOptions.includes(questionData.correctAnswer.trim())) {
        throw new Error("Correct answer must be one of the provided options")
      }

      payload.options = validOptions
    }

    console.log("Final question update payload:", payload)
    return handleRequest(axios.put(`${API_BASE}/question/${questionId}`, payload, getAuthHeaders()))
  },

  deleteQuestion: async (questionId) => {
    console.log("Deleting question:", questionId)

    if (!questionId) {
      throw new Error("Question ID is required")
    }

    return handleRequest(axios.delete(`${API_BASE}/question/${questionId}`, getAuthHeaders()))
  },

  // Payment Management (Mock for now)
  getPendingPayments: async () => {
    // In a real app, this would fetch from your backend
    // For now, we'll return mock data that matches the cart context structure
    const mockPayments = [
      {
        _id: "payment1",
        studentName: "John Doe",
        studentEmail: "john@example.com",
        lessonTitle: "Introduction to Mathematics",
        amount: 29.99,
        paymentStatus: "pending",
        paymentMethod: "Credit Card",
        purchaseDate: new Date().toISOString(),
        paymentId: "payment_123456789",
      },
      {
        _id: "payment2",
        studentName: "Jane Smith",
        studentEmail: "jane@example.com",
        lessonTitle: "Basic Science Concepts",
        amount: 19.99,
        paymentStatus: "pending",
        paymentMethod: "PayPal",
        purchaseDate: new Date(Date.now() - 86400000).toISOString(),
        paymentId: "payment_987654321",
      },
    ]

    return {
      success: true,
      data: mockPayments,
    }
  },

  approveLessonPayment: async (paymentId) => {
    console.log("Approving payment:", paymentId)

    if (!paymentId) {
      throw new Error("Payment ID is required")
    }

    // In a real app, this would update the payment status in your backend
    // For now, we'll simulate the approval
    return {
      success: true,
      message: "Payment approved successfully",
      paymentId: paymentId,
      status: "approved",
    }
  },

  rejectLessonPayment: async (paymentId, reason = "Payment verification failed") => {
    console.log("Rejecting payment:", paymentId, "Reason:", reason)

    if (!paymentId) {
      throw new Error("Payment ID is required")
    }

    return {
      success: true,
      message: "Payment rejected",
      paymentId: paymentId,
      status: "rejected",
      reason: reason,
    }
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const [lessons, exams, users] = await Promise.all([
        adminAPI.getAllLessons(),
        adminAPI.getAllExams(),
        adminAPI.getAllUsers(),
      ])

      return {
        success: true,
        data: {
          totalLessons: lessons?.data?.length || 0,
          totalExams: exams?.data?.length || 0,
          totalUsers: users?.data?.length || 0,
          totalRevenue: 1250.75,
          completedExams: 45,
          studyHours: 1200,
        },
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      return {
        success: false,
        data: {
          totalLessons: 0,
          totalExams: 0,
          totalUsers: 0,
          totalRevenue: 0,
          completedExams: 0,
          studyHours: 0,
        },
      }
    }
  },
}

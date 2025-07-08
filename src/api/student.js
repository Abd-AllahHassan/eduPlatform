import axios from "axios"

const API_BASE = "https://edu-master-delta.vercel.app"

// Get token from localStorage
const getAuthHeaders = () => ({
  headers: {
    token: localStorage.getItem("token"),
    "Content-Type": "application/json",
  },
})

// Error handling wrapper
const handleRequest = async (request) => {
  try {
    const response = await request
    console.log("API Response:", response.data) // Debug log
    return response.data
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message)
    throw error.response?.data || { message: "An error occurred" }
  }
}

// Lessons API
export const lessonAPI = {
  getAll: async (filters = {}) => {
    console.log("Fetching lessons with filters:", filters)

    const params = new URLSearchParams()

    // Handle search filter
    if (filters.search && filters.search.trim()) {
      params.append("search", filters.search.trim())
    }

    // Handle classLevel filter - convert to match API format
    if (filters.classLevel && filters.classLevel.trim()) {
      // Convert "1" to "Grade 1 Secondary" format to match admin data
      const classLevelMap = {
        1: "Grade 1 Secondary",
        2: "Grade 2 Secondary",
        3: "Grade 3 Secondary",
        4: "Grade 4 Secondary",
        5: "Grade 5 Secondary",
      }
      const mappedClassLevel = classLevelMap[filters.classLevel] || filters.classLevel
      params.append("classLevel", mappedClassLevel)
    }

    // Handle isPaid filter
    if (filters.isPaid && filters.isPaid !== "") {
      // Convert string to boolean for API
      const isPaidValue = filters.isPaid === "true"
      params.append("isPaid", isPaidValue)
    }

    const queryString = params.toString()
    const url = queryString ? `${API_BASE}/lesson?${queryString}` : `${API_BASE}/lesson`

    console.log("Final API URL:", url)
    return handleRequest(axios.get(url, getAuthHeaders()))
  },

  getPurchased: async () => {
    return handleRequest(axios.get(`${API_BASE}/lesson/my/purchased`, getAuthHeaders()))
  },

  pay: async (lessonId) => {
    return handleRequest(axios.post(`${API_BASE}/lesson/pay/${lessonId}`, {}, getAuthHeaders()))
  },
}

// Exams API
export const examAPI = {
  getAvailable: async () => {
    return handleRequest(axios.get(`${API_BASE}/exam`, getAuthHeaders()))
  },

  start: async (examId) => {
    return handleRequest(axios.post(`${API_BASE}/studentExam/start/${examId}`, {}, getAuthHeaders()))
  },

  submit: async (examId, answers) => {
    // ✅ Ensure answers have the correct format
    const formattedAnswers = answers.map((answer) => ({
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer, // Make sure this is selectedAnswer, not selectedOption
    }))

    return handleRequest(
      axios.post(`${API_BASE}/studentExam/submit/${examId}`, { answers: formattedAnswers }, getAuthHeaders()),
    )
  },

  getScore: async (examId) => {
    return handleRequest(axios.get(`${API_BASE}/studentExam/exams/score/${examId}`, getAuthHeaders()))
  },

  getRemainingTime: async (examId) => {
    return handleRequest(axios.get(`${API_BASE}/studentExam/exams/remaining-time/${examId}`, getAuthHeaders()))
  },
}

// User API
export const userAPI = {
  getProfile: async () => {
    return handleRequest(axios.get(`${API_BASE}/user/profile`, getAuthHeaders()))
  },

  updateProfile: async (profileData) => {
    return handleRequest(axios.put(`${API_BASE}/user/profile`, profileData, getAuthHeaders()))
  },

  getStats: async () => {
    return handleRequest(axios.get(`${API_BASE}/user/stats`, getAuthHeaders()))
  },
}




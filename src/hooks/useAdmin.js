import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminAPI } from "../api/admin"

// Helper function to show success/error messages
const showMessage = (message, type = "info") => {
  // You can replace this with your preferred notification system
  // like react-toastify, antd message, etc.
  if (type === "success") {
    alert(`✅ ${message}`)
  } else if (type === "error") {
    alert(`❌ ${message}`)
  } else {
    alert(message)
  }
}

// Admin Management Hooks
export const useCreateAdmin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.createAdmin,
    onSuccess: (data) => {
      console.log("✅ Admin created successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["admins"] })
      showMessage("Admin created successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to create admin:", error)
      showMessage(`Failed to create admin: ${error.message}`, "error")
    },
  })
}

export const useAllAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: adminAPI.getAllAdmins,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Error fetching admins:", error)
      showMessage(`Error fetching admins: ${error.message}`, "error")
    },
  })
}

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: adminAPI.getAllUsers,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Error fetching users:", error)
      showMessage(`Error fetching users: ${error.message}`, "error")
    },
  })
}

// Lesson Management Hooks
export const useAllLessons = (filters = {}) => {
  return useQuery({
    queryKey: ["lessons", filters],
    queryFn: () => adminAPI.getAllLessons(filters),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Error fetching lessons:", error)
      showMessage(`Error fetching lessons: ${error.message}`, "error")
    },
  })
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.createLesson,
    onSuccess: (data) => {
      console.log("✅ Lesson created successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["lessons"] })
      showMessage("Lesson created successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to create lesson:", error)
      showMessage(`Failed to create lesson: ${error.message}`, "error")
    },
  })
}

export const useUpdateLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ lessonId, lessonData }) => adminAPI.updateLesson(lessonId, lessonData),
    onSuccess: (data) => {
      console.log("✅ Lesson updated successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["lessons"] })
      showMessage("Lesson updated successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to update lesson:", error)
      showMessage(`Failed to update lesson: ${error.message}`, "error")
    },
  })
}

export const useDeleteLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.deleteLesson,
    onSuccess: (data) => {
      console.log("✅ Lesson deleted successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["lessons"] })
      showMessage("Lesson deleted successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to delete lesson:", error)
      showMessage(`Failed to delete lesson: ${error.message}`, "error")
    },
  })
}

// Exam Management Hooks
export const useAllExams = () => {
  return useQuery({
    queryKey: ["exams"],
    queryFn: adminAPI.getAllExams,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Error fetching exams:", error)
      showMessage(`Error fetching exams: ${error.message}`, "error")
    },
  })
}

export const useCreateExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.createExam,
    onSuccess: (data) => {
      console.log("✅ Exam created successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["exams"] })
      showMessage("Exam created successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to create exam:", error)
      showMessage(`Failed to create exam: ${error.message}`, "error")
    },
  })
}

export const useUpdateExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ examId, examData }) => adminAPI.updateExam(examId, examData),
    onSuccess: (data) => {
      console.log("✅ Exam updated successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["exams"] })
      showMessage("Exam updated successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to update exam:", error)
      showMessage(`Failed to update exam: ${error.message}`, "error")
    },
  })
}

export const useDeleteExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.deleteExam,
    onSuccess: (data) => {
      console.log("✅ Exam deleted successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["exams"] })
      showMessage("Exam deleted successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to delete exam:", error)
      showMessage(`Failed to delete exam: ${error.message}`, "error")
    },
  })
}

// Question Management Hooks
export const useAllQuestions = () => {
  return useQuery({
    queryKey: ["questions"],
    queryFn: adminAPI.getAllQuestions,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Error fetching questions:", error)
      showMessage(`Error fetching questions: ${error.message}`, "error")
    },
  })
}

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.createQuestion,
    onSuccess: (data) => {
      console.log("✅ Question created successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      showMessage("Question created successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to create question:", error)
      showMessage(`Failed to create question: ${error.message}`, "error")
    },
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ questionId, questionData }) => adminAPI.updateQuestion(questionId, questionData),
    onSuccess: (data) => {
      console.log("✅ Question updated successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      showMessage("Question updated successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to update question:", error)
      showMessage(`Failed to update question: ${error.message}`, "error")
    },
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.deleteQuestion,
    onSuccess: (data) => {
      console.log("✅ Question deleted successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      showMessage("Question deleted successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to delete question:", error)
      showMessage(`Failed to delete question: ${error.message}`, "error")
    },
  })
}

// Dashboard Hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: adminAPI.getDashboardStats,
    staleTime: 2 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Error fetching dashboard stats:", error)
    },
  })
}

export const usePendingPayments = () => {
  return useQuery({
    queryKey: ["pendingPayments"],
    queryFn: adminAPI.getPendingPayments,
    staleTime: 1 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Error fetching pending payments:", error)
    },
  })
}

export const useApproveLessonPayment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.approveLessonPayment,
    onSuccess: (data) => {
      console.log("✅ Payment approved successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] })
      showMessage("Payment approved successfully!", "success")
    },
    onError: (error) => {
      console.error("❌ Failed to approve payment:", error)
      showMessage(`Failed to approve payment: ${error.message}`, "error")
    },
  })
}

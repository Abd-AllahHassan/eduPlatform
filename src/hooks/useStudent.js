import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { lessonAPI, examAPI, userAPI } from "../api/student"

// Lessons hooks
export const useLessons = (filters = {}) => {
  return useQuery({
    queryKey: ["lessons", filters],
    queryFn: () => lessonAPI.getAll(filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Error fetching lessons:", error)
    },
    onSuccess: (data) => {
      console.log("Successfully fetched lessons:", data)
    },
  })
}

export const usePurchasedLessons = () => {
  return useQuery({
    queryKey: ["purchasedLessons"],
    queryFn: lessonAPI.getPurchased,
    staleTime: 5 * 60 * 1000,
  })
}

export const usePayForLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: lessonAPI.pay,
    onSuccess: () => {
      queryClient.invalidateQueries(["purchasedLessons"])
      queryClient.invalidateQueries(["lessons"])
    },
  })
}

// Exams hooks
export const useExams = () => {
  return useQuery({
    queryKey: ["exams"],
    queryFn: examAPI.getAvailable,
    staleTime: 5 * 60 * 1000,
  })
}

export const useStartExam = () => {
  return useMutation({
    mutationFn: examAPI.start,
  })
}

export const useSubmitExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ examId, answers }) => examAPI.submit(examId, answers),
    onSuccess: (_, { examId }) => {
      queryClient.invalidateQueries(["examScore", examId])
      queryClient.invalidateQueries(["exams"])
    },
  })
}

export const useExamScore = (examId) => {
  return useQuery({
    queryKey: ["examScore", examId],
    queryFn: () => examAPI.getScore(examId),
    enabled: !!examId,
  })
}

export const useExamRemainingTime = (examId) => {
  return useQuery({
    queryKey: ["examRemainingTime", examId],
    queryFn: () => examAPI.getRemainingTime(examId),
    enabled: !!examId,
    refetchInterval: 60000, // Refresh every minute
  })
}

// User hooks
export const useStudentProfile = () => {
  return useQuery({
    queryKey: ["studentProfile"],
    queryFn: userAPI.getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["studentProfile"])
    },
  })
}

export const useStudentStats = () => {
  return useQuery({
    queryKey: ["studentStats"],
    queryFn: userAPI.getStats,
    staleTime: 5 * 60 * 1000,
  })
}

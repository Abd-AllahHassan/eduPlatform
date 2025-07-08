import { useMutation } from "@tanstack/react-query";
import { signupStudent } from "../api/auth";

export const useSignup = () => {
  return useMutation({
    mutationFn: (formData) => signupStudent(formData),
  });
};

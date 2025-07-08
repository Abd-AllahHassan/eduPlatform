import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";

export const useLogin = () =>
  useMutation({
    mutationFn: (formData) => loginUser(formData),
  });

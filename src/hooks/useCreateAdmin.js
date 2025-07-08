import { useMutation } from "@tanstack/react-query";
import { createAdmin } from "../api/auth";

export const useCreateAdmin = (token) =>
  useMutation({
    mutationFn: (formData) => createAdmin(formData, token),
  });

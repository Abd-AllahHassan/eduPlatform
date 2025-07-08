import axios from "axios";

const BASE_URL = "https://edu-master-delta.vercel.app";

export const signupStudent = (data) =>
  axios.post(`${BASE_URL}/auth/signup`, data);

export const loginUser = (data) => axios.post(`${BASE_URL}/auth/login`, data);

export const createAdmin = (data, token) =>
  axios.post(`${BASE_URL}/admin/create-admin`, data, {
    headers: {
      token,
    },
  });

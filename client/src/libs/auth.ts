import axios from "axios";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  currency: string;
  referralCode?: string;
}

// Create Axios instance
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Call backend register endpoint
export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data; // returns user object + token
};

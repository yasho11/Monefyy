import { create } from "zustand";
import toast from "react-hot-toast";

export interface User {
  id: string;
  username: string;
  email: string;
  currency: string;
  avatar_url: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User, message?: string) => void; // optional custom toast
  logout: () => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user, message) => {
    set({ user });
    toast.success(message || `Welcome ${user.username}`); // automatic toast
  },

  logout: () => {
    set({ user: null });
    toast.success("Logged out successfully");
  },

  notifySuccess: (message: string) => toast.success(message),
  notifyError: (message: string) => toast.error(message),
}));

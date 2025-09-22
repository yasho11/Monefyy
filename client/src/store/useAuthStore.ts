import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { toast } from "react-hot-toast";
import axios from "axios";

interface AuthStore {
  authUser: any;
  isSigningUp: boolean;
  signup: (data: any) => void;
}


export const useAuthStore = create<AuthStore>((set)=> ({
  authUser: null,
  isSigningUp: false,



  //?------------------------------------------------
  //! @name: signup
  //! @param: data
  //! @desc: function to handle user signup

  signup: async (data) => {
    try {
      set({isSigningUp: true});
      const response = await axiosInstance.post("/auth/register", data);
      set({authUser: response.data.user});
      toast.success("Account created successfully");
    } catch (error) {

      if(axios.isAxiosError(error)){
        console.error("Sign up error: ", error.response?.data);
        toast.error(error.response?.data?.message || "Sing up failed : axios" )
      }else {
        console.error("Unexpected error: ", error);
        toast.error("Something went wrong!");
      }
      
    }finally {
      set({isSigningUp: false});
    }
  } 
}))
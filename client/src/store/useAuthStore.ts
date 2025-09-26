import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { toast } from "react-hot-toast";
import axios from "axios";


interface AuthStore {
  authUser: any;
  isSigningUp: boolean;
  signup: (data: any) => Promise<boolean>;
  isLoggingIn: boolean;
  login: (data:any) => Promise<boolean>;
  checkAuth: () => void;
  isCheckingAuth: boolean;
  isVerifying: boolean;
  verifyCode: (data:any) => Promise<boolean>;
  checkEmailVerification: () => void;
  isEmailVerified: boolean;
  logout: () => void;
  isLoggingout: boolean;
  userInfo: any;
  getUserInfo: () => void;
  isGettingInfo: boolean;
  googleLogin: () =>  void;
  forgotPassword: (email:any) => Promise <boolean>;
  resetPassword: (data: { email: string; code: string; newPassword: string }) => void;
  sendVerificationMail: (data:any) => void;
  isResetting: boolean;
  updateProfilePicture: (file: File) => Promise<boolean>;
  isUpdatingProfile: boolean;
  UpdateProfile: (data: any) => Promise<Boolean>;
}



export const useAuthStore = create<AuthStore>((set)=> ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isVerifying: false,
  isEmailVerified: false,
  isLoggingout: false,
  userInfo: null,
  isGettingInfo: false,
  isResetting: false,
  isUpdatingProfile: false,

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
      return true;
    } catch (error) {

      if(axios.isAxiosError(error)){
        console.error("Sign up error: ", error.response?.data);
        toast.error(error.response?.data?.message || "Sign up failed" )
        
      }else {
        console.error("Unexpected error: ", error);
        toast.error("Something went wrong!");
      }
      return false;
    }finally {
      set({isSigningUp: false});
    }
  },

  //?--------------------------------------------------------------------------------------

  //! @name: login
  //! @params: data
  //! @desc: Function to handle login


  login:async(data)=>{
    try {
      set({isLoggingIn: true});
      const response = await axiosInstance.post("/auth/login", data);
      set({authUser: response.data});
      toast.success("Log in successful");
      console.log("Login AuthUser: ",response.data);
      return true;


    } catch (error) {
      if(axios.isAxiosError(error)){
        console.error("Login error: ", error.response?.data);
        toast.error(error.response?.data?.message || "Log In failed!");

      }else{
        console.error("Unexpected error: " , error);
        toast.error("Something went wrong!")
      }
      return false;
    }finally{
      set({isLoggingIn: false});
  }


  },

  //?----------------------------------------------------------------------------
  //! @name: checkAuth
  //! @desc: This function is used to check if the user is authenticated

  checkAuth: async() => {
    try {
      set({isCheckingAuth: true});
      const response = await axiosInstance.get("/auth/check-auth");
      set({authUser: response.data.User});
      console.log("Auth user: ", response.data.User);

    } catch (error) {
      if(axios.isAxiosError(error)){
        console.error("Check auth error: ", error.response?.data);
        
        

      }else{
        console.error("Unexpected error: " , error);
        toast.error("Something went wrong!, try again")
      }
      set({authUser: null})
    }finally{
      set({isCheckingAuth: false});
    }
  },

  //?----------------------------------------------------------

  //! @name: verifyCode
  //! @desc: this function checks if the user is verified


  verifyCode: async(data) => {
    try {
      set({isVerifying: true});
      await axiosInstance.post("/auth/verify-email",  data);
      console.log("Email verification successful!");
      toast.success("Email is verified");
      return true;

    } catch (error) {
        if(axios.isAxiosError(error)){
        console.error("Verification error: ", error.response?.data);
        toast.error(error.response?.data?.message || "Verification failed!");

      }else{
        console.error("Unexpected error: " , error);
        toast.error("Something went wrong!")
      }
      return false;
    }finally{
      set({isVerifying: false});
    }
  },

  //?-----------------------------------------------------------
  checkEmailVerification: async ()=> {

    try {
      set({isVerifying: true});
      const response = await axiosInstance.get("/auth/email-verified");
      set({isEmailVerified: response.data.message});

    } catch (error) {
     if(axios.isAxiosError(error)){
        console.error("Verification error: ", error.response?.data);
        toast.error(error.response?.data?.message || "Verification failed!");

      }else{
        console.error("Unexpected error: " , error);
        toast.error("Something went wrong!")
      }
    }finally{
      set({isVerifying: false});
    }

  },



  //?----------------------------------------------------------------------


  //! @name: Log out
  //! @desc: helps logout

  logout: async ()=>{
       try {
      set({isLoggingout: true});
      await axiosInstance.get("/auth/logout");
      set({authUser: null});

    } catch (error) {
     if(axios.isAxiosError(error)){
        console.error("Log out error: ", error.response?.data);
        toast.error(error.response?.data?.message || "Logout failed!");

      }else{
        console.error("Unexpected error: " , error);
        toast.error("Something went wrong!")
      }
    }finally{
      set({isLoggingout: false});
    }

  },

  //?--------------------------------------------------------------

  //! @name: Get user info
  //! @desc: function to fetch user data

  getUserInfo: async() =>{
    try {
      set({isGettingInfo: true});
      const response = await axiosInstance.get("/auth/me");
      set({userInfo: response.data});
      console.log("Profile info: ", response.data);
    } catch (error) {
           if(axios.isAxiosError(error)){
        console.error("Fetching error: ", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to get user info!");

      }else{
        console.error("Unexpected error: " , error);
        toast.error("Something went wrong!")
      }
      
    }finally{
      set({isGettingInfo: false});
    }
  },

  
  //?----------------------------------------------------------------

  //! @name: Google signup
  //! @desc: function to sign in with google
  
  googleLogin: () => {
  // Redirect to full backend route for Google OAuth
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  window.location.href = `${backendURL}/api/auth/google`;
  },



  //?-----------------------------------------------------------------
  
  //! @name: forget password
  //! @desc: function to get forget password recovery email

  forgotPassword: async (email) => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset email sent!");
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
      return false;
    }
  },

  //?------------------------------------------------------------------

  //! @name: reset password
  //! @desc: function to reset password


  resetPassword: async (data: { email: string; code: string; newPassword: string }) => {
  try {
    set({isResetting: true});
    await axiosInstance.post("/auth/reset-password", data);
    toast.success("Password successfully reset!");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to reset password");
  }finally{
    set({isResetting: false});
  }
},

//?--------------------------------------------

sendVerificationMail: async(data) =>  {
    try {
      await axiosInstance.post("/auth/send-verification", data);
      toast.success("Verification email, sent!");
    } catch (error:any) {
      toast.error(error.response?.data?.message || "Failed to send email")
    }
},


//?-------------------------------------------------------------------------------------






updateProfilePicture: async (file: File) => {

  try {
    set({ isUpdatingProfile: true }); // optional state if you want a loading indicator

    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.put("/auth/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    set((state) => ({
      authUser: { ...state.authUser, avatar_url: response.data.avatar_url },
    }));

    toast.success("Profile picture updated successfully!");
    console.log("Updated AuthUser:", response.data);

    return true;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Update profile picture error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update profile picture!");
    } else {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong!");
    }
    return false;
  } finally {
    set({ isUpdatingProfile: false });
  }
},


//?-------------------------------------------------------------------------------------

  UpdateProfile: async (data:any) => {
    try {
      set({isUpdatingProfile: true});
      await axiosInstance.put("/auth/edit-profile", data);
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Update profile picture error:", error.response?.data);
          toast.error(error.response?.data?.message || "Failed to update profile picture!");
        } else {
          console.error("Unexpected error:", error);
          toast.error("Something went wrong!");
        }
      return false;
    }finally{
      set({isUpdatingProfile: false});
    }
  }

}))
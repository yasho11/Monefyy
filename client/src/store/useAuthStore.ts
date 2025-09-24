import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { toast } from "react-hot-toast";
import axios from "axios";

interface AuthStore {
  authUser: any;
  isSigningUp: boolean;
  signup: (data: any) => void;
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
        toast.error(error.response?.data?.message || "Log In failed!: axios");

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
        toast.error(error.response?.data?.message || "Fail to check auth: axios");
        

      }else{
        console.error("Unexpected error: " , error);
        toast.error("Something went wrong!")
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
        toast.error(error.response?.data?.message || "Verification failed!: axios");

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
        toast.error(error.response?.data?.message || "Verification failed!: axios");

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
        toast.error(error.response?.data?.message || "Logout failed!: axios");

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
        toast.error(error.response?.data?.message || "Failed to get user info!: axios");

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
    // Redirect user to backend Google OAuth route
    window.location.href = "/auth/google";
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



}))
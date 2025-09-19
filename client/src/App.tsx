import { Toaster } from "react-hot-toast";
import SignupForm from "./components/SignupForm";


export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <Toaster position="top-right" toastOptions={{ style: { zIndex: 9999 } }} />
      <SignupForm />
     <h1 className = "text-2xl font-bold"> Welcome to monefyy</h1>
    </div>
  );
}

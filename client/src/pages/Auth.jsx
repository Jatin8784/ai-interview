import React from "react";
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { toast } from "sonner";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      let User = res.user;
      let name = User.displayName;
      let email = User.email;
      const result = await axios.post(
        serverUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      toast.success(`Welcome back, ${result.data.name}!`);
    } catch (error) {
      console.log(error);
      toast.error("Authentication failed. Please try again.");
      dispatch(setUserData(null));
    }
  };

  return (
    <div
      className={`w-full ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] dark:bg-gray-950 flex items-center justify-center px-6 py-20 transition-colors duration-300"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className={`w-full ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-4xl"} bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 transition-colors duration-300`}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-black dark:bg-emerald-600 text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">InterviewIQ.AI</h2>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center leading-snug mb-4 text-gray-900 dark:text-gray-100">
          Continue with{" "}
          <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xl align-middle">
            <IoSparkles size={18} />
            AI Smart Interview
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm md:text-base leading-relaxed mb-8 font-medium">
          Sign in to start AI-powered mock interviews, track your progress, and
          unlock detailed performance insights.
        </p>
        <motion.button
          whileHover={{ opacity: 0.9, scale: 1.03 }}
          whileTap={{ opacity: 1, scale: 0.8 }}
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md cursor-pointer"
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Auth;

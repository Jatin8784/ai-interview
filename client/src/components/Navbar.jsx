import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";
import ProfilePanel from "./ProfilePanel";
import { toast } from "sonner";

function Navbar({ theme, toggleTheme }) {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowProfilePanel(false);
      navigate("/");
      toast.success("Logged out successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="bg-[#f3f3f3] dark:bg-gray-950 flex justify-center px-4 pt-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center relative transition-colors duration-300"
      >
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h1
            className="font-semibold hidden md:block text-lg text-gray-900 dark:text-gray-100"
            onClick={() => navigate("/")}
          >
            InterviewIQ.AI
          </h1>
        </div>

        <div className="flex items-center gap-4 md:gap-6 relative">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === "dark" ? 180 : 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
            </motion.div>
          </button>

          <div className="relative">
            <button
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-gray-800 dark:text-gray-100 cursor-pointer"
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowCreditPopup(!showCreditPopup);
                setShowProfilePanel(false);
              }}
            >
              <BsCoin size={20} className="text-yellow-500" />
              {userData?.credits || 0}
            </button>
            {showCreditPopup && (
              <div className="absolute -right-12.5 mt-3 w-64 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-5 z-50 transition-colors duration-300">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-medium">
                  Need more credits to continue interviews?
                </p>
                <button
                  className="w-full bg-black dark:bg-emerald-600 hover:bg-gray-800 dark:hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                  onClick={() => navigate("/pricing")}
                >
                  Buy more credits
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold cursor-pointer"
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowProfilePanel(!showProfilePanel);
                setShowCreditPopup(false);
              }}
            >
              {userData ? (
                userData?.name.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut size={16} />
              )}
            </button>
          </div>
        </div>
      </motion.div>
      <ProfilePanel
        isOpen={showProfilePanel}
        onClose={() => setShowProfilePanel(false)}
        userData={userData}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        theme={theme}
      />
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Navbar;

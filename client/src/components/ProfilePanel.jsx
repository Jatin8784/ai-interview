import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsCoin, BsX, BsArrowRightShort, BsClockHistory } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const ProfilePanel = ({
  isOpen,
  onClose,
  userData,
  onLogout,
  isLoggingOut,
  theme,
}) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, avgScore: 0 });

  useEffect(() => {
    if (isOpen && userData) {
      const fetchStats = async () => {
        try {
          const res = await axios.get(serverUrl + "/api/interview/get-interview", {
            withCredentials: true,
          });
          const interviews = res.data;
          const completed = interviews.filter((i) => i.status === "completed");
          const avg = completed.length > 0 ?
            completed.reduce((acc, curr) => acc + (curr.finalScore || 0), 0) /
              (completed.length || 1) : 0;

          setStats({
            total: interviews.length,
            avgScore: Number(avg.toFixed(1)),
          });
        } catch (err) {
          console.error("Stats fetch error:", err);
        }
      };
      fetchStats();
    }
  }, [isOpen, userData]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-1000 cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white dark:bg-gray-900 shadow-2xl z-1001 flex flex-col border-l border-gray-100 dark:border-gray-800 transition-colors"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-50 dark:border-gray-800">
              <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                My Profile
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all cursor-pointer"
              >
                <BsX size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Profile Hero */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-linear-to-tr from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-emerald-500/20 mb-4 ring-4 ring-emerald-50 dark:ring-emerald-950/30">
                  {userData?.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                  {userData?.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {userData?.email}
                </p>
              </div>

              {/* Credits Section */}
              <div className="bg-gray-50 dark:bg-gray-950/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BsCoin size={20} className="text-yellow-500" />
                    <span className="text-xs uppercase tracking-widest font-black text-gray-400 dark:text-gray-500">
                      Credit Balance
                    </span>
                  </div>
                  <span className="text-2xl font-black text-gray-900 dark:text-emerald-400">
                    {userData?.credits || 0}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigate("/pricing");
                    onClose();
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Get More Credits
                  <BsArrowRightShort size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center transition-colors">
                  <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">
                    {stats.total}
                  </span>
                  <span className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-widest">
                    Total Tests
                  </span>
                </div>
                <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center transition-colors">
                  <span className="block text-2xl font-black text-purple-600 dark:text-purple-400">
                    {stats.avgScore}
                  </span>
                  <span className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-widest">
                    Avg Score
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => {
                    navigate("/history");
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                >
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-bold">
                    <BsClockHistory size={18} className="text-blue-500" />
                    <span>Interview History</span>
                  </div>
                  <BsArrowRightShort size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50 dark:border-gray-800 mt-auto">
              <button
                disabled={isLoggingOut}
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-2xl border border-red-100 dark:border-red-500/20 transition-all font-black uppercase tracking-widest text-xs cursor-pointer disabled:opacity-50 group"
              >
                {isLoggingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing Out...</span>
                  </div>
                ) : (
                  <>
                    <HiOutlineLogout size={20} className="group-hover:translate-x-1 transition-transform" />
                    Sign Out
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfilePanel;

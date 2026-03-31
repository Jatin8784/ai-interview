import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

function InterviewHistory({ theme, toggleTheme }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          serverUrl + "/api/interview/get-interview",
          {
            withCredentials: true,
          },
        );
        console.log(result.data);
        setInterviews(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMyInterviews();
  }, []);

  const HistorySkeleton = () => (
    <div className="grid gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-md w-1/3"></div>
              <div className="h-4 bg-gray-50 dark:bg-gray-800/50 rounded-md w-1/4"></div>
              <div className="h-3 bg-gray-50 dark:bg-gray-800/50 rounded-md w-1/5 mt-4"></div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right space-y-2">
                <div className="h-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-md w-14 ml-auto"></div>
                <div className="h-3 bg-gray-50 dark:bg-gray-800/50 rounded-md w-16 ml-auto"></div>
              </div>
              <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-full w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 w-full flex items-start gap-4 flex-wrap">
          <button
            className="mt-1 p-3.5 rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl hover:scale-105 transition-all text-gray-600 dark:text-gray-400 group cursor-pointer border border-gray-100 dark:border-gray-800"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Interview History
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Track your past interviews and performance reports
            </p>
          </div>
        </div>

        {loading ? (
          <HistorySkeleton />
        ) : interviews.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">
              No interviews found. Start your first interview.
            </p>
            <button
               onClick={() => navigate("/interview")}
               className="mt-4 text-emerald-600 font-bold hover:underline"
            >
              Start New Test
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {interviews.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/report/${item._id}`)}
                className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-800 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                      {item.role}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-bold text-sm sm:text-base mt-2 flex items-center gap-2">
                       {item.mode} • {item.experience}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em]">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-8 sm:gap-12 md:gap-16 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50 dark:border-gray-800/50">
                    {/* Score */}
                    <div className="text-left sm:text-right min-w-[100px] md:min-w-[120px] lg:min-w-[150px]">
                      <p className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-black text-emerald-600 dark:text-emerald-500 transition-all">
                        {item.finalScore || 0}<span className="text-sm sm:text-base lg:text-xl font-bold text-gray-400">/10</span>
                      </p>
                      <p className="text-[10px] sm:text-xs lg:text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mt-2 whitespace-nowrap">Overall Score</p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                        item.status === "completed" 
                          ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" 
                          : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewHistory;

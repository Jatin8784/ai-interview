import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "motion/react";
import {
  FaCheckCircle,
  FaChartLine,
  FaCommentDots,
  FaBrain,
} from "react-icons/fa";
import { BsArrowRepeat } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Step3Report({ report, theme = "light" }) {
  const navigate = useNavigate();
  const {
    finalScore,
    confidence,
    communication,
    correctness,
    questionWiseScore,
  } = report;

  const scoreColor =
    finalScore >= 8 ? "#10b981" : finalScore >= 5 ? "#f59e0b" : "#ef4444";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
            Interview Performance Report
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comprehensive analysis of your interview performance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800"
          >
            <div className="w-48 h-48 mb-6">
              <CircularProgressbar
                value={(finalScore || 0) * 10}
                text={`${finalScore}/10`}
                strokeWidth={10}
                styles={buildStyles({
                  pathColor: scoreColor,
                  textColor: scoreColor,
                  textSize: "16px",
                  trailColor: theme === "dark" ? "#1f2937" : "#f3f4f6",
                  strokeLinecap: "round",
                })}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Overall Score</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
              Based on communication, confidence, and accuracy.
            </p>
          </motion.div>

          {/* Detailed Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Confidence",
                value: confidence,
                icon: <FaBrain className="text-blue-500" />,
                color: "#3b82f6",
              },
              {
                label: "Communication",
                value: communication,
                icon: <FaCommentDots className="text-purple-500" />,
                color: "#a855f7",
              },
              {
                label: "Correctness",
                value: correctness,
                icon: <FaCheckCircle className="text-emerald-500" />,
                color: "#10b981",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center transition-all duration-300 group hover:border-emerald-500/20"
              >
                <div className="text-3xl mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-full transition-colors">
                  {stat.icon}
                </div>
                <div className="w-24 h-24 mb-4 font-black">
                  <CircularProgressbar
                    value={(stat.value || 0) * 10}
                    text={`${stat.value}`}
                    strokeWidth={10}
                    styles={buildStyles({
                      pathColor: stat.color,
                      textColor: theme === "dark" ? "#ffffff" : "#1f2937",
                      trailColor: theme === "dark" ? "#1f2937" : "#f3f4f6",
                      textSize: "28px",
                    })}
                  />
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-300 tracking-tight">{stat.label}</span>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="md:col-span-3 bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-900/40 dark:to-teal-900/40 border border-transparent dark:border-emerald-500/20 p-6 sm:p-8 rounded-3xl shadow-lg shadow-emerald-500/10 text-white flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-black mb-1">
                  Want to improve?
                </h3>
                <p className="text-emerald-50 dark:text-emerald-300 opacity-90 text-sm sm:text-base font-medium">
                  Try another mock interview to refine your skills.
                </p>
              </div>
              <button
                onClick={() => navigate("/interview")}
                className="w-full sm:w-auto bg-white dark:bg-emerald-500 dark:text-white text-emerald-600 px-8 py-3.5 rounded-2xl font-black hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <BsArrowRepeat size={24} className="shrink-0" /> Retake Test
              </button>
            </motion.div>
          </div>
        </div>

        {/* Detailed Question Wise Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-20 transition-colors"
        >
          <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
            <FaChartLine className="text-gray-400 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Question-wise Feedback
            </h2>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {questionWiseScore?.map((q, i) => (
              <div key={i} className="p-8 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full uppercase tracking-widest">
                        Question {i + 1}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                      {q.question}
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-inner transition-colors">
                      <p className="text-[10px] font-black text-emerald-600/60 dark:text-emerald-400/50 uppercase tracking-[0.2em] mb-4">
                        AI FEEDBACK:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed text-lg font-medium">
                        "{q.feedback}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center bg-white dark:bg-gray-800 w-24 h-24 md:w-28 md:h-28 rounded-3xl border-2 border-gray-100 dark:border-gray-700 shadow-lg">
                    <div className="text-center">
                      <div
                        className={`text-4xl font-black ${
                          q.score >= 8
                            ? "text-emerald-500"
                            : q.score >= 5
                              ? "text-amber-500"
                              : "text-rose-500"
                        }`}
                      >
                        {q.score}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pt-1">
                        SCORE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/history")}
            className="text-gray-500 hover:text-emerald-600 cursor-pointer transition font-medium underline"
          >
            Back to Interview History
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step3Report;

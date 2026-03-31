import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Step1Setup({ onStart, theme, toggleTheme }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleUploadResume = async () => {
    if (!resumeFile && analyzing) return;
    setAnalyzing(true);

    const formdata = new FormData();
    formdata.append("resume", resumeFile);
    try {
      const result = await axios.post(
        serverUrl + "/api/interview/resume",
        formdata,
        { withCredentials: true },
      );
      console.log(result.data);

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log(error);
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/interview/generate-questions",
        {
          role,
          experience,
          mode,
          resumeText,
          projects,
          skills,
        },
        {
          withCredentials: true,
        },
      );
      console.log(result.data);
      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }
      setLoading(false);
      onStart(result.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-green-50 to-green-100 p-8 sm:p-12 flex flex-col justify-center"
        >
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition cursor-pointer z-10"
          >
            <FaArrowLeft className="text-gray-600 size={18}" />
          </button>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 mt-8 sm:mt-0">
            Start Your AI Interview
          </h2>
          <p className="text-gray-600 mb-10">
            Practice real interview scenarios powered by AI. Improve
            communication, technical skills, and confidence.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: <FaUserTie className="text-green-600 text-xl" />,
                text: "Choose Role & Experience",
              },
              {
                icon: <FaMicrophoneAlt className="text-green-600 text-xl" />,
                text: "Smart Voice Interview",
              },
              {
                icon: <FaChartLine className="text-green-600 text-xl" />,
                text: "Performance Analytics",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm cursor-pointer"
              >
                {item.icon}
                <span className="text-gray-700 dark:text-gray-200 font-mediumk">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white dark:bg-gray-900"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
            Interview SetUp
          </h2>

          <div className="space-y-6">
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Enter role"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-300"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Experience (e.g. 2 years)"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-300"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>
            <select
              value={mode}
              className="w-full px-4 py-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-300 cursor-pointer appearance-none"
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => document.getElementById("resumeUpload").click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition"
              >
                <FaFileUpload className="text-4xl mx-auto text-green-600 mb-3" />
                <input
                  type="file"
                  id="resumeUpload"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                <p className="text-gray-600 font-medium">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload resume (Optional)"}
                </p>

                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50/10 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-6 space-y-4"
              >
                <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <BsPatchCheckFill /> Resume Analysis Result
                </h3>
                {projects.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">
                      Projects:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {projects.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Skiils:</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              disabled={!role || !experience || loading}
              whileTap={{ scale: 0.95 }}
              className="w-full disabled:bg-gray-600 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md"
              onClick={handleStart}
            >
              {loading ? "Starting..." : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Step1Setup;

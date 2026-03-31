import React from "react";
import { BsRobot } from "react-icons/bs";

function Footer() {
  return (
    <div className="bg-[#f3f3f3] dark:bg-gray-950 flex justify-center px-4 pb-10 py-4 pt-10 transition-colors duration-300">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-800 py-8 px-3 text-center transition-colors duration-300">
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="bg-black dark:bg-emerald-600 text-white p-2 rounded-lg transition-colors">
            <BsRobot size={16} />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">InterviewIQ.AI</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto font-medium">
          AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>
      </div>
    </div>
  );
}

export default Footer;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import Step3Report from "../components/Step3Report";
import Navbar from "../components/Navbar";

function InterviewReport({ theme, toggleTheme }) {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          serverUrl + `/api/interview/report/${id}`,
          { withCredentials: true },
        );
        console.log(result.data);
        setReport(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const ReportSkeleton = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="h-10 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
          <div className="h-5 bg-gray-100 rounded-lg w-1/3"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm h-80 flex flex-col items-center justify-center border border-gray-100">
             <div className="w-40 h-40 bg-gray-100 rounded-full mb-6"></div>
             <div className="h-6 bg-gray-200 rounded-md w-1/2"></div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full mb-4"></div>
                <div className="w-20 h-20 bg-gray-50 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-16"></div>
              </div>
            ))}
            <div className="md:col-span-3 h-24 bg-gray-100 rounded-2xl shadow-sm"></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50">
             <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
          </div>
          <div className="space-y-8 p-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                 <div className="h-4 bg-emerald-50 rounded-md w-24"></div>
                 <div className="h-6 bg-gray-100 rounded-md w-3/4"></div>
                 <div className="h-20 bg-gray-50 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-950 transition-colors duration-300">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <ReportSkeleton />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Report Not Found</h2>
          <p className="text-gray-500 mt-2">The requested interview report could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Step3Report report={report} theme={theme} />
    </div>
  );
}

export default InterviewReport;

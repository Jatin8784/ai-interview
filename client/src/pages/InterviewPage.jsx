import React, { useState } from "react";
import Step1Setup from "../components/Step1Setup";
import Step2Interview from "../components/Step2Interview";
import Step3Report from "../components/Step3Report";
import { useNavigate } from "react-router-dom";

function InterviewPage({ theme, toggleTheme }) {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {step === 1 && (
        <Step1Setup
          theme={theme}
          toggleTheme={toggleTheme}
          onStart={(data) => {
            setInterviewData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Step2Interview
          interviewData={interviewData}
          onFinish={(report) => {
            setInterviewData(report);
            setStep(3);
          }}
        />
      )}
      {step === 3 && <Step3Report report={interviewData} />}
    </div>
  );
}

export default InterviewPage;

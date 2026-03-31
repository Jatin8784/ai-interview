import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

function Step2Interview({ interviewData, onFinish, theme = "light", toggleTheme }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subTitle, setSubTitle] = useState("");
  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // Try known female voices first
      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try known male voices
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback to first available voice
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender == "male" ? maleVideo : femaleVideo;

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();

      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef?.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);
        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubTitle("");
          resolve();
        }, 300);
      };

      setSubTitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`,
        );

        await speakText(
          `I'll ask you few questions. Just answer naturally, and take your time. Let's begin.`,
        );
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);
        if (isMicOn) {
          startMic();
        }
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isSubmitting, timeLeft]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start mic", error);
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Failed to stop mic", error);
      }
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        serverUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        {
          withCredentials: true,
        },
      );
      setFeedback(result.data.feedback);
      await speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    setFeedback(null);
    setAnswer("");
    await speakText("Alright, let's move to the next question.");
    setCurrentIndex(currentIndex + 1);
    setTimeLeft(questions[currentIndex + 1].timeLimit || 60);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        serverUrl + "/api/interview/finish-interview",
        {
          interviewId,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 items-center justify-center flex p-4 sm:p-6 transition-colors duration-300">
      <div className="w-full max-w-[1400px] min-h-[80vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row overflow-hidden">
        {/* Video Section */}
        <div className="w-full lg:w-[35%] bg-white dark:bg-gray-900 flex flex-col items-center p-6 space-y-6 border-gray-200 dark:border-gray-800 border-r">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              className="w-full h-auto object-cover"
              muted
              playsInline
            />
          </div>

          {/* Subtitle */}
          {subTitle && (
            <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subTitle}
              </p>
            </div>
          )}

          {/* Timer Area */}
          <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl p-8 space-y-6 transition-colors">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs uppercase tracking-[0.2em] font-black text-gray-400 dark:text-gray-500">Status</span>
              {isAIPlaying && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    AI Speaking
                  </span>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

            <div className="flex justify-center py-2">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800"></div>
            <div className="grid grid-cols-2 gap-8 text-center">
              <div className="bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {currentIndex + 1}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500">Current</span>
              </div>
              <div className="bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {questions.length}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500">Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col flex-1 p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-6">
            AI Smart Interview
          </h2>

          {!isIntroPhase && (
            <div className="relative mb-6 bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-2">
                Question {currentIndex + 1} of {questions.length}
              </p>

              <div className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed pr-16">
                {currentQuestion?.question}
              </div>
            </div>
          )}
          <textarea
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 transition text-gray-800 dark:text-gray-100"
          />

          {!feedback ? (
            <div className="flex items-center gap-4 mt-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMic}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-900 dark:bg-emerald-600 text-white shadow-xl cursor-pointer hover:scale-105 transition-all"
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:p-4 rounded-2xl shadow-lg hover:opacity-50 transition font-semibold cursor-pointer disabled:bg-gray-500"
                onClick={submitAnswer}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm"
            >
              <p className="text-emerald-700 font-medium mb-4">{feedback}</p>
              <button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1"
              >
                Next Question <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FaCheckCircle, FaStar, FaBuilding, FaRocket } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Navbar from "../components/Navbar";

function Pricing({ theme, toggleTheme }) {
  const { userData } = useSelector((state) => state.user);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const plans = [
    {
      id: "Starter",
      name: "Starter Bundle",
      price: "0",
      credits: 10,
      description: "Perfect for exploring the platform and your first few mock interviews.",
      icon: <FaRocket className="text-blue-500" />,
      features: ["10 AI Interview Credits", "Real-time AI Feedback", "History Access", "PDF Report Support"],
      buttonText: "Current Plan",
      buttonColor: "bg-blue-100 text-blue-600",
      isFree: true,
    },
    {
      id: "Pro",
      name: "Professional",
      price: "499",
      credits: 500,
      description: "Ideal for serious job seekers looking to sharpen their skills.",
      icon: <FaStar className="text-emerald-500" />,
      features: ["500 AI Interview Credits", "Priority AI Processing", "Advanced Performance Metrics", "Direct Resume Analysis", "Unlimited History"],
      buttonText: "Upgrade to Pro",
      buttonColor: "bg-emerald-600 text-white",
      highlight: true,
    },
    {
      id: "Business",
      name: "Business Pro",
      price: "1999",
      credits: 1000,
      description: "For heavy users and career-focused professionals.",
      icon: <FaBuilding className="text-purple-500" />,
      features: ["1000 AI Interview Credits", "Deep Analytics Dashboard", "Custom Interview Scenarios", "Premium Support", "Batch Analysis"],
      buttonText: "Get Business Plan",
      buttonColor: "bg-purple-600 text-white",
    },
  ];

  const handlePayment = async (planId, amount) => {
    if (!userData) {
      toast.error("Please login to purchase credits.");
      return;
    }

    try {
      // Step 1: Create Order on Backend
      const orderRes = await axios.post(
        serverUrl + "/api/payment/create-order",
        { planId },
        { withCredentials: true },
      );

      const { order, credits } = orderRes.data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "InterviewIQ.AI",
        description: `Upgrade to ${planId} Plan`,
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        order_id: order.id,
        handler: async function (response) {
          setIsProcessing(true);
          try {
            // Step 3: Verify Payment
            const verifyRes = await axios.post(
              serverUrl + "/api/payment/verify-payment",
              {
                ...response,
                planId,
              },
              { withCredentials: true },
            );

            if (verifyRes.data.credits) {
              const newCredits = verifyRes.data.credits;
              
              setTimeout(() => {
                setIsProcessing(false);
                dispatch(setUserData({ ...userData, credits: newCredits }));
                toast.success(`Payment Successful! Credits added to your account.`);
                navigate("/");
              }, 3000);
            }
          } catch (error) {
            console.error("Verification error:", error);
            setIsProcessing(false);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="py-16 px-4">
        {isProcessing && (
          <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="text-emerald-600 mb-6"
          >
            <AiOutlineLoading3Quarters size={60} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900"
          >
            Processing Your Payment...
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mt-2"
          >
            Please do not close or refresh this page.
          </motion.p>
        </div>
      )}

      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4"
        >
          Choose Your Plan
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Unlock the full potential of AI-powered mock interviews and take your career to the next level.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white dark:bg-gray-900 rounded-4xl p-10 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-300 ${
              plan.highlight ? "ring-4 ring-emerald-500/20 border-emerald-300 dark:border-emerald-500" : ""
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                MOST POPULAR
              </div>
            )}

            <div className="text-4xl mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl self-start transition-colors">
              {plan.icon}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-black text-gray-900 dark:text-gray-100">₹{plan.price}</span>
              {plan.price !== "0" && <span className="text-gray-500 dark:text-gray-400 mb-1">/ lifetime</span>}
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {plan.description}
            </p>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <BsPatchCheckFill className={`text-xl ${plan.highlight ? "text-emerald-500" : "text-blue-500"}`} />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => !plan.isFree && handlePayment(plan.id, plan.price)}
              disabled={plan.isFree}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition shadow-md flex items-center justify-center gap-2 cursor-pointer
                ${plan.buttonColor} 
                ${!plan.isFree && "hover:shadow-xl hover:scale-105 active:scale-95"}
                ${plan.isFree && "opacity-80 cursor-default"}`}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Secure payments processed by Razorpay.</p>
        <p className="mt-2 text-gray-500 dark:text-gray-400 font-semibold">
          Need a custom plan? <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">Contact sales</a>
        </p>
      </div>
      </div>
    </div>
  );
}

export default Pricing;

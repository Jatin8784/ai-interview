import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import InterviewPage from "./pages/InterviewPage";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import InterviewHistory from "./pages/InterviewHistory";
import Pricing from "./pages/Pricing";
import InterviewReport from "./pages/InterviewReport";

export const serverUrl = "http://localhost:3000";

function App() {
  const dispatch = useDispatch();
  const [theme, setTheme] = React.useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/current-user", {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    getUser();
  }, [dispatch]);
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/auth" element={<Auth theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/interview" element={<InterviewPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/history" element={<InterviewHistory theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/pricing" element={<Pricing theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/report/:id" element={<InterviewReport theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </>
  );
}

export default App;

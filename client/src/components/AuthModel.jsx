import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Auth from "../pages/Auth";

function AuthModel({ onClose }) {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]);

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-gray-950/20 dark:bg-gray-950/60 backdrop-blur-md px-4 transition-all duration-300">
      <div className="relative w-full max-w-md">
        <button
          className="absolute top-8 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          onClick={onClose}
        >
          <FaTimes size={22} />
        </button>
        <Auth isModel={true} />
      </div>
    </div>
  );
}

export default AuthModel;

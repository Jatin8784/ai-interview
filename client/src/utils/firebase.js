import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-1dd9a.firebaseapp.com",
  projectId: "interviewiq-1dd9a",
  storageBucket: "interviewiq-1dd9a.firebasestorage.app",
  messagingSenderId: "529583088774",
  appId: "1:529583088774:web:69b2c04f5a92b0a8241d07",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };

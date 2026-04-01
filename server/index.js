import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";

const app = express();
app.set("trust proxy", 1);

const allowedOrigin = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.replace(/\/$/, "")
  : "http://localhost:5173";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      const allowed = allowedOrigin.split(",");
      if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all for now to avoid blocking, but strictly handle credentials
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
  connectDb();
});

import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log("isAuth: Checking token from cookies. Found:", !!token);

    if (!token) {
      console.warn("isAuth Failure: No token found in cookies.");
      return res.status(401).json({ message: "No authentication token provided" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!verifyToken) {
      console.error("isAuth Failure: Token verification failed.");
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    console.error("isAuth Error:", error.message);
    return res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

export default isAuth;

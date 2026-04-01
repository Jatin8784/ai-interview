import genToken from "../config/token.js";
import userModel from "../models/user.model.js";

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        name: name,
        email: email,
      });
    }
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      partitioned: true, // For modern browser third-party cookie support
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Google auth error ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout error ${error}` });
  }
};



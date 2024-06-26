import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

//^ protectRoute middleware function
export const protectRoute = async (req, res, next) => {
  try {
    // & get token from cookies
    const token = req.cookies.jwt;

    // & check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized : No token provided" });
    }

    // & verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // & check if token is valid or not
    if (!verified) {
      return res.status(401).json({ error: "Unauthorized : Invalid token" });
    }

    // & get user from token
    const user = await User.findById(verified.userId).select("-password");

    // & check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // & add user to req object
    req.user = user;

    // & move to next middleware
    next();
  } catch (error) {
    // & error handling for protectRoute middleware
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

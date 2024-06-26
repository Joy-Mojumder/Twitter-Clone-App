import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

//^ auth controllers
// & signup function
export const signup = async (req, res) => {
  console.log(req.body);
  try {
    //^ destructuring req.body
    const { fullName, username, email, password } = req.body;
    //^ email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    //^ check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    //^ check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    //^ check if password is less than 6 characters
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }
    //^ hash password(for security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //^ create new user
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      // ^ save user to database
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup:", error);
    res.status(500).json({ error: `Internal server error` });
  }
};

// & login function
export const login = async (req, res) => {
  try {
    // ^ destructuring req.body for username and password
    const { username, password } = req.body;

    //^ check if user exists in database
    const user = await User.findOne({ username });

    //^ check if password is valid from bcrypt hash
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || ""
    );

    //^ check if user exists and password is valid
    if (!user || !isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    // ^ generate token and set cookie
    generateTokenAndSetCookie(user._id, res);

    //^ send response with user data
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    //^ error handling for login
    console.log("Error in login:", error);
    res.status(500).json({ error: `Internal server error` });
  }
};

// & logout function
export const logout = async (req, res) => {
  try {
    //^ clear cookie
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    //^ send response with success message
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    //^ error handling for logout
    console.log("Error in logout:", error);
    res.status(500).json({ error: `Internal server error` });
  }
};

// & getMe function for protectRoute middleware
export const getMe = async (req, res) => {
  try {
    //* get user from req.user
    const user = await User.findById(req.user._id).select("-password");

    //* send response with user data
    res.status(200).json(user);
  } catch (error) {
    //* error handling for getMe controller
    console.log("Error in getMe controller:", error);
    res.status(500).json({ error: `Internal server error` });
  }
};

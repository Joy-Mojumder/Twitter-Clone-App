import express from "express";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

//^ import routes here
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import postRouter from "./routes/post.router.js";

// ^ environment variables for database connection
dotenv.config();

// ^ environment variables for cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//^ connect to database
import connectMongoDB from "./database/connectMongoDB.js";

//^ initialize express app
const app = express();

//^ all routes are handled here
app.use(express.json()); // for parsing request body
app.use(express.urlencoded({ extended: true })); // for parsing url-encoded request body
app.use(cookieParser()); // for parsing cookies in requests
app.use("/api/auth", authRouter); // for handling requests to /api/auth
app.use("/api/users", userRouter); // for handling requests to /api/users
app.use("/api/posts", postRouter); // for handling requests to /api/posts

const PORT = process.env.PORT || 5000;

//^ start server and connect to database
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  // & connect to mongodb
  connectMongoDB();
});

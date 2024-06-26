//^ connect to database
import connectMongoDB from "./database/connectMongoDB.js";
import dotenv from "dotenv";
import router from "./routes/auth.router.js";
import express from "express";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(express.json()); // for parsing request body
app.use(express.urlencoded({ extended: true })); // for parsing url-encoded request body
app.use(cookieParser()); // for parsing cookies in requests
app.use("/api/auth", router); // for handling requests to /api/auth

const PORT = process.env.PORT || 5000;

//^ start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectMongoDB();
});

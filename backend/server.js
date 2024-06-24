import express from "express";
import authRoutes from "./routes/auth.routes.js";
//^ connect to database
import connectMongoDB from "./database/connectMongoDB.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectMongoDB();
});

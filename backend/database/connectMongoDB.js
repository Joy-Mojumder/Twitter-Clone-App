import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    // & connect to mongodb
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    // & error handling
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};
export default connectMongoDB;

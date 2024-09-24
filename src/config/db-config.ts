import mongoose from "mongoose";
import UserModel from "@/models/user-model";

//  mongod --dbpath /usr/local/var/mongodb
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
}
import mongoose from "mongoose";
import { UserModel, ChatModel, MessageModel } from "@/models";

//  mongod --dbpath /usr/local/var/mongodb
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
}
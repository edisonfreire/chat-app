import mongoose from "mongoose";

//  mongod --dbpath /usr/local/var/mongodb
export const connectMongoDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://edisonfreire14:faXeK5hijgGJlvku@cluster0.4zc2s.mongodb.net/')
    console.log("MongoDB connected");
  } catch (error) {
    console.log('MongoDB connection error:', error);
  }
}
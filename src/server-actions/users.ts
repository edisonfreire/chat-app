"use server"; // server action
import { connectMongoDB } from "@/config/db-config";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs/server";
import { profile } from "console";

connectMongoDB();

export const GetCurrentUserFromMongoDB = async () => {
  try {

    const clerkUser = await currentUser();
    // check if the user is already in the database based on clerkUserId
    const mongoUser = await UserModel.findOne({ clerkUserId: clerkUser?.id });
    if (mongoUser) {
      // convert to normal objects to avoid warnings
      return JSON.parse(JSON.stringify(mongoUser))
    }

    let email = "";
    if (clerkUser?.emailAddresses) {
      email = clerkUser?.emailAddresses[0]?.emailAddress;
    }

    // if the user is not in the database, create a user in the database
    const newUserPayload = {
      clerkUserId: clerkUser?.id,
      name: clerkUser?.firstName + " " + clerkUser?.lastName,
      username: clerkUser?.username,
      email,
      profilePicture: clerkUser?.imageUrl,
    }

    const newUser = await UserModel.create(newUserPayload);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error: any) { // syntax for returning errors in server action catch block
    return {
      error: error.message
    };
  }
}

export const GetAllUsers = async () => {
  try {
    const allUsers = await UserModel.find({});
    return JSON.parse(JSON.stringify(allUsers));
  } catch (error: any) {
    return {
      error: error.message
    };
  }
}

export const UpdateUserProfile = async (userId: string, payload: any) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, { new: true });
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error: any) {
    return {
      error: error.message
    };
  }
}
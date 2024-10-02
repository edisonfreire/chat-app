"use server";
import mongoose from "mongoose";
import { UserModel, ChatModel, MessageModel } from "@/models";
import path from "path";

export const CreateNewChat = async (payload: any) => {
  try {
    await ChatModel.create(payload);
    const newChats = await ChatModel.find({
      users: {
        $in: [payload.createdBy],
      },
    }).populate("users").sort({ updatedAt: -1 });
    // sort by updatedAt to have the latest chat on top
    return JSON.parse(JSON.stringify(newChats));
  } catch (error: any) {
    return {
      error: error.message
    };
  }
};

export const GetAllChats = async (userId: string) => {
  try {
    // users is an array of strings so filter with $in
    const users = await ChatModel.find({
      users: {
        $in: [userId],
      },
    })
      .populate("users")
      .populate("lastMessage")
      .populate("createdBy")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
        },
      })
      .sort({ updatedAt: -1 });
    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return {
      error: error.message
    };
  }
}
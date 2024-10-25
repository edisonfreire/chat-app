"use server";
import ChatModel from "@/models/chat-model";
import mongoose from "mongoose";
import path from "path";

// export const CreateNewChat = async (payload: any) => {
//   try {
//     await ChatModel.create(payload);
//     const newChats = await ChatModel.find({
//       users: {
//         $in: [payload.createdBy],
//       },
//     }).populate("users").sort({ updatedAt: -1 });
//     // sort by updatedAt to have the latest chat on top
//     return JSON.parse(JSON.stringify(newChats));
//   } catch (error: any) {
//     return {
//       error: error.message
//     };
//   }
// };

export const CreateNewChat = async (payload: any) => {
  try {
    // Check if a chat already exists between the specified users
    const existingChat = await ChatModel.findOne({
      users: { $all: [payload.createdBy, payload.users[1]] },
      isGroupChat: false,
    }).populate("users");

    if (existingChat) {
      // Return the existing chat if found
      return JSON.parse(JSON.stringify(existingChat));
    }

    // If no chat exists, create a new chat
    const newChat = await ChatModel.create(payload);

    // Retrieve the newly created chat
    const createdChat = await ChatModel.findById(newChat._id).populate("users");

    return JSON.parse(JSON.stringify(createdChat));
  } catch (error: any) {
    return {
      error: error.message,
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
      .sort({ lastMessageAt: -1 });
    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return {
      error: error.message
    };
  }
}

export const GetChatDataById = async (chatId: string) => {
  try {
    const chat = await ChatModel.findById(chatId)
      .populate("users")
      .populate("lastMessage")
      .populate("createdBy")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
        },
      })
    return JSON.parse(JSON.stringify(chat));
  } catch (error: any) {
    return {
      error: error.message
    };
  }
}

export const UpdateChat = async ({ chatId, payload }: { chatId: string, payload: any }) => {
  try {
    await ChatModel.findByIdAndUpdate(chatId, payload);
    return {
      message: "Chat updated successfully"
    };
  } catch (error: any) {
    return {
      error: error.message
    };
  }
}

export const GetChatByUsers = async ({ users }: { users: string[] }) => {
  try {
    const chat = await ChatModel.findOne({
      users: { $all: users },
      isGroupChat: false,
    }).populate("users");

    return JSON.parse(JSON.stringify(chat));
  } catch (error: any) {
    return { error: error.message };
  }
};
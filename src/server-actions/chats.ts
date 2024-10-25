"use server";
import ChatModel from "@/models/chat-model";

export const CreateNewChat = async (payload: any) => {
  try {
    // Create the new chat
    const newChat = await ChatModel.create(payload);

    // Populate the new chat
    const populatedChat = await ChatModel.findById(newChat._id)
      .populate('users')
      .populate('createdBy');

    // Return the newly created chat
    return JSON.parse(JSON.stringify(populatedChat));
  } catch (error: any) {
    // Handle duplicate key error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.userIds) {
      // Fetch the existing chat
      const existingChat = await ChatModel.findOne({
        userIds: payload.users.sort().join('_'),
      })
        .populate('users')
        .populate('createdBy');

      // Return the existing chat
      return JSON.parse(JSON.stringify(existingChat));
    } else {
      return {
        error: error.message,
      };
    }
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
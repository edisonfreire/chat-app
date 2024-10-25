"use server";

import ChatModel from "@/models/chat-model";
import MessageModel from "@/models/message-model";


export const SendNewMessage = async (payload: {
  text?: string;
  image?: string;
  chat: string;
  sender: string;
  socketMessageId: string;
  createdAt: string;
  updatedAt: string;
  readBy: string[];
}) => {
  try {
    const newMessage = new MessageModel(payload);
    await newMessage.save();

    const existingChat = await ChatModel.findById(payload.chat);
    if (!existingChat) {
      throw new Error('Chat not found');
    }

    const existingUnreadCounts = existingChat.unreadCounts || {};

    existingChat.users.forEach((user: any) => {
      const userIdInString = user.toString();
      if (userIdInString !== payload.sender) {
        existingUnreadCounts[userIdInString] =
          (existingUnreadCounts[userIdInString] || 0) + 1;
      }
    });

    await ChatModel.findByIdAndUpdate(payload.chat, {
      lastMessage: newMessage._id,
      unreadCounts: existingUnreadCounts,
      lastMessageAt: new Date().toISOString(),
    });

    // Populate the message before returning
    const populatedMessage = await MessageModel.findById(newMessage._id).populate('sender');

    return JSON.parse(JSON.stringify(populatedMessage));
  } catch (error: any) {
    return { error: error.message };
  }
};

export const GetChatMessages = async (chatId: string) => {
  try {
    const messages = await MessageModel.find({ chat: chatId })
      .populate("sender")
      .sort({ createdAt: 1 });
    return JSON.parse(JSON.stringify(messages));
  } catch (error: any) {
    return {
      error: error.message
    };
  }
}

export const ReadAllMessages = async ({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) => {
  try {
    // Push user ID to readBy array if it doesn't exist
    await MessageModel.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        readBy: { $nin: [userId] },
      },
      { $addToSet: { readBy: userId } }
    );

    const existingChat = await ChatModel.findById(chatId);
    if (!existingChat) {
      throw new Error('Chat not found');
    }

    const existingUnreadCounts = existingChat.unreadCounts || {};
    existingUnreadCounts[userId] = 0;

    await ChatModel.findByIdAndUpdate(chatId, { unreadCounts: existingUnreadCounts });

    return { message: 'Messages marked as read' };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
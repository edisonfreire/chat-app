"use server";
import { UserModel, ChatModel, MessageModel } from "@/models";


export const SendNewMessage = async (payload: {
  text?: string,
  image?: string,
  chat: string;
  sender: string;
}) => {
  try {
    const newMessage = new MessageModel(payload);
    await newMessage.save();

    const existingChat = await ChatModel.findById(payload.chat);
    const existingUnreadCounts = existingChat?.unreadCounts;

    existingChat?.users.forEach((user: any) => {
      const userIdInString = user.toString();
      if (userIdInString !== payload.sender) {
        existingUnreadCounts[userIdInString] = (existingUnreadCounts[userIdInString] || 0) + 1;
      }
    });

    await ChatModel.findByIdAndUpdate(payload.chat, {
      lastMessage: newMessage._id,
      unreadCounts: existingUnreadCounts,
    });
    return { message: "Message sent successfully" };
  } catch (error: any) {
    return {
      error: error.message
    };
  }
}

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
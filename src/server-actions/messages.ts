"use server";
import { ChatModel, MessageModel } from "@/models";


export const SendNewMessage = async (payload: {
  text?: string,
  image?: string,
  chat: string;
  sender: string;
}) => {
  try {
    const newMessage = new MessageModel(payload);
    await newMessage.save();
    await ChatModel.findByIdAndUpdate(payload.chat, {
      lastMessage: newMessage._id,
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
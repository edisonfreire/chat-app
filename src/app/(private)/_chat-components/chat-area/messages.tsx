import { MessageType } from '@/interfaces';
import { ChatState } from '@/redux/chatSlice';
import { GetChatMessages } from '@/server-actions/messages';
import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Message from './message';

function Messages() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  const getMessages = async () => {
    try {
      setLoading(true);
      const response = await GetChatMessages(selectedChat?._id!);
      if (response.error) {
        throw new Error(response.error);
      }
      console.log(response);
      setMessages(response);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMessages();
  } ,[selectedChat]);

  return (
    <div className='flex-1 p-3'>
      <div className="flex flex-col gap-3">
        {messages.map((message) => {
          return <Message key={message._id} message={message} />
        })}
      </div>
    </div>
  )
}

export default Messages;
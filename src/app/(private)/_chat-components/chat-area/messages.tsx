import { MessageType } from '@/interfaces';
import { ChatState, SetChats } from '@/redux/chatSlice';
import { GetChatMessages, ReadAllMessages } from '@/server-actions/messages';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Message from './message';
import { UserState } from '@/redux/userSlice';
import socket from '@/config/socket-config';

function Messages() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedChat, chats }: ChatState = useSelector((state: any) => state.chat);
  const { currentUserData }: UserState = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  const messagesDivRef = useRef<HTMLDivElement>(null);

  const getMessages = async () => {
    try {
      setLoading(true);
      const response = await GetChatMessages(selectedChat?._id!);
      if (response.error) {
        throw new Error(response.error);
      }
      setMessages(response);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMessages();
  }, [selectedChat]);

  useEffect(() => {
    // listen for new messages
    socket.on("new-message-received", (message: MessageType) => {
      // have to use call backs to access sockets in state
      if (selectedChat?._id === message.chat._id) {
        setMessages((prev) => {
          const isMessageAlreadyExists = prev.find((msg) => msg.socketMessageId === message.socketMessageId);
          if (isMessageAlreadyExists) return prev;
          else return [...prev, message];
        });
      }
    })
  }, [selectedChat]);

  useEffect(() => {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight + 100;
    }

    ReadAllMessages({
      chatId: selectedChat?._id!,
      userId: currentUserData?._id!
    });
    const newChats = chats.map((chat: any) => {
      if (chat._id === selectedChat?._id) {
        let chatData = { ...chat };
        chatData.unreadCounts = { ...chatData.unreadCounts };
        chatData.unreadCounts[currentUserData?._id!] = 0;
        return chatData;
      } else return chat;
    });

    dispatch(SetChats(newChats));
  }, [messages]);

  return (
    <div className='flex-1 p-3 overflow-y-scroll'
      ref={messagesDivRef}
    >
      <div className="flex flex-col gap-3">
        {messages.map((message) => {
          return <Message key={message._id} message={message} />
        })}
      </div>
    </div>
  )
}

export default Messages;
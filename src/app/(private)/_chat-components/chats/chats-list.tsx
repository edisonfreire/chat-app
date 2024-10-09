import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '@/redux/userSlice';
import { GetAllChats } from '@/server-actions/chats';
import { ChatState, SetChats } from '@/redux/chatSlice';
import ChatCard from './chat-card';
import { MessageType } from '@/interfaces';
import socket from '@/config/socket-config';
import store from '@/redux/store';


function ChatsList() {
  const dispatch = useDispatch();
  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const { chats }: ChatState = useSelector((state: any) => state.chat);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  const [loading, setLoading] = useState<boolean>(false);

  const getChats = async () => {
    try {
      setLoading(true);
      const response = await GetAllChats(currentUserData?._id!);
      if (response.error) throw new Error(response.error);
      dispatch(SetChats(response));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUserData) getChats();
  }, [currentUserData]);

  useEffect(() => {
    socket.on('new-message-received', (newMessage: MessageType)=> {
      let {chats} : ChatState = store.getState().chat;
      let prevChats = [...chats];
      let chatIndex = prevChats.findIndex((chat) => chat._id === newMessage.chat._id);

      if (chatIndex === -1) return;

      let chatToUpdate = prevChats[chatIndex];

      if (chatToUpdate.lastMessage?.socketMessageId === newMessage.socketMessageId) return;

      let chatToUpdateCopy = {...chatToUpdate};
      chatToUpdateCopy.lastMessage = newMessage;
      chatToUpdateCopy.updatedAt = newMessage.createdAt;
      prevChats[chatIndex] = chatToUpdateCopy;
      chatToUpdateCopy.unreadCounts = {...chatToUpdateCopy.unreadCounts};

      if (newMessage.sender._id !== currentUserData?._id
        && selectedChat?._id !== newMessage.chat._id
      ) {
        chatToUpdateCopy.unreadCounts[currentUserData?._id!] = (chatToUpdateCopy.unreadCounts[currentUserData?._id!] || 0) + 1;
      }

      // push chat to the top
      prevChats = [prevChats[chatIndex], ...prevChats.filter((chat) => chat._id !== newMessage.chat._id)];
      dispatch(SetChats(prevChats));
    })
  }, [selectedChat]);

  return (
    <div>
      {chats.length > 0 && (
        <div className='flex flex-col gap-5 mt-5'>
          {chats.map((chat) => {
            return <ChatCard key={chat._id} chat={chat} />
          })}
        </div>
      )}

      {loading && (
        <div className="flex mt-32 items-center justify-center">
          <div className='flex flex-col'>
            <Spin />
            <span className='text-gray-500 text-sm my-5'>Loading Chats...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatsList
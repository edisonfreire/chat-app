import React, { useEffect, useState } from 'react'
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '@/redux/userSlice';
import { GetAllChats } from '@/server-actions/chats';
import { ChatState, SetChats } from '@/redux/chatSlice';
import ChatCard from './chat-card';

function ChatsList() {
  const dispatch = useDispatch();
  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const { chats }: ChatState = useSelector((state: any) => state.chat);

  const [loading, setLoading] = useState<boolean>(false);

  const getChats = async () => {
    try {
      setLoading(true);
      const response = await GetAllChats(currentUserData?._id!);
      console.log(response)
      if (response.error) throw new Error(response.error);
      dispatch(SetChats(response));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getChats();
  }, [currentUserData]);

  return (
    <div>
      <div className='flex flex-col gap-5 mt-5'>
        {chats.map((chat) => {
          return <ChatCard key={chat._id} chat={chat} />
        })}
      </div>
    </div>
  )
}

export default ChatsList
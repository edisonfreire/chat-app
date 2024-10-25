import React from 'react'
import RecepientCard from './recipient'
import { ChatState } from '@/redux/chatSlice'
import { useSelector } from 'react-redux'
import NewMessage from './new-message';
import Messages from './messages';

// must have recipient, messages and send message components
function ChatArea() {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  if (!selectedChat) return (
    <div className='flex flex-1 flex-col justify-center items-center h-full'>
      <img src='/chat-logo.webp' alt="Chat Logo" className='h-60' />
      <span className='font-semibold text-gray-600 text-sm'>
        Select a chat to start messaging...
      </span>
    </div>
  )

  return (
    selectedChat && (
      <div className='flex-1 flex flex-col justify-between'>
        <RecepientCard />
        <Messages />
        <NewMessage />
      </div>
    )
  )
}

export default ChatArea
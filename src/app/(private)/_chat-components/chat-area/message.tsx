import { formatDateTime } from '@/helpers/date-formats';
import { MessageType } from '@/interfaces';
import { ChatState } from '@/redux/chatSlice';
import dayjs from 'dayjs';
import React from 'react'
import { useSelector } from 'react-redux';

function Message({ message }: { message: MessageType }) {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const { currentUserData } = useSelector((state: any) => state.user);

  const isLoggedInUserMessage = message.sender._id === currentUserData?._id;

  if (isLoggedInUserMessage) {
    return (
      <div className='flex justify-end'>
        <div className='flex flex-col gap-1'>
          <div className='bg-primary py-1 px-3 rounded-xl rounded-tr-none'>
            <p className='text-white m-0 text-sm'>
              {message.text}
            </p>
          </div>
          <span className='text-gray-500 text-xs'>
            {formatDateTime(message.createdAt)}
          </span>
        </div>
        <img src={message.sender.profilePicture} alt="avatar" className='w-8 h-8 rounded-full ml-2' />
      </div>
    )
  } else {
    return (
      <div className='flex justify-start gap-1'>
        <img src={message.sender.profilePicture} alt="avatar" className='w-8 h-8 rounded-full mr-2' />
        <div className='flex flex-col gap-1'>
          <div className='bg-gray-200 py-1 px-3 rounded-xl rounded-tl-none'>
            <span className='text-blue-500 text-xs font-semibold'>
              {message.sender.name}
            </span>
            <p className=' text-black m-0 text-sm'>
              {message.text}
            </p>
          </div>
          <span className='text-gray-500 text-xs'>
            {formatDateTime(message.createdAt)}
          </span>
        </div>
      </div>
    )
  }
}

export default Message;
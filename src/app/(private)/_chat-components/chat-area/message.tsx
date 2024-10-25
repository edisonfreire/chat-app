import { formatDateTime } from '@/helpers/date-formats';
import { MessageType } from '@/interfaces';
import { ChatState } from '@/redux/chatSlice';
import React from 'react'
import { useSelector } from 'react-redux';

function Message({ message }: { message: MessageType }) {
  const { currentUserData } = useSelector((state: any) => state.user);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  const isLoggedInUserMessage = message.sender._id === currentUserData?._id;

  let read=false;
  if (selectedChat && selectedChat?.users?.length-1 === message.readBy.length) {
    read=true;
  }

  if (isLoggedInUserMessage) {
    return (
      <div className='flex justify-end'>
        <div className='flex flex-col gap-1'>
          <div className='bg-primary py-1 px-3 rounded-xl rounded-tr-none flex flex-col'>
            {message.text && (
              <p className=' text-white m-0 text-sm mt-1'>
                {message.text}
              </p>
            )}
            {message.image && (
              <img
                onClick={() => window.open(message.image, '_blank')}
                src={message.image}
                alt='message'
                className='w-40 h-40 object-cover rounded-xl my-2'
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className='text-gray-500 text-xs'>
              {formatDateTime(message.createdAt)}
            </span>
            <i className={`ri-check-double-line ${read? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
        </div>
        <img src={message.sender.profilePicture} alt="avatar" className='w-8 h-8 rounded-full ml-2 object-cover' />
      </div>
    )
  } else {
    return (
      <div className='flex justify-start gap-1'>
        <img src={message.sender.profilePicture} alt="avatar" className='w-8 h-8 rounded-full mr-2 object-cover' />
        <div className='flex flex-col gap-1'>
          <div className='bg-gray-200 py-1 px-3 rounded-xl rounded-tl-none flex flex-col'>
            <span className='text-blue-500 text-xs font-semibold'>
              {message.sender.name}
            </span>
            {message.text && (
              <p className=' text-black m-0 text-sm mt-1'>
                {message.text}
              </p>
            )}
            {message.image && (
              <img
                onClick={() => window.open(message.image, '_blank')}
                src={message.image}
                alt='message'
                className='w-40 h-40 object-cover rounded-xl my-2'
              />
            )}
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
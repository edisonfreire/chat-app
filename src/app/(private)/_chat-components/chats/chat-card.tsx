import React from 'react'
import { ChatType } from '@/interfaces';
import { useSelector } from 'react-redux';
import { UserState } from '@/redux/userSlice';

function ChatCard({ chat }: { chat: ChatType }) {
  const { currentUserData }: UserState = useSelector((state: any) => state.user);

  let chatName = ''
  let chatImage = ''
  let lastMessage = ''
  let lastMessageSenderName = ''
  let lastMessageTime = ''

  if (chat.isGroupChat) {
    chatName = chat.groupName;
    chatImage = chat.groupProfilePicture;
  } else {
    const recepient = chat.users.find((user) => user._id !== currentUserData?._id);
    chatName = recepient?.name!;
    chatImage = recepient?.profilePicture!;
  }

  return (
    <div className='flex justify-between'>
      <div className='flex gap-5 items-center'>
        <img src={chatImage} alt="" className='w-10 h-10 rounded-full' />
        <span className='text-gray-500 text-sm'>
          {chatName}
        </span>
      </div>

      <div>
        <span>{lastMessageTime}</span>
      </div>
    </div>
  )
}

export default ChatCard;
import React from 'react'
import { ChatType } from '@/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '@/redux/userSlice';
import { ChatState, SetSelectedChat } from '@/redux/chatSlice';

function ChatCard({ chat }: { chat: ChatType }) {
  const dispatch = useDispatch();
  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

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

  const isSelected = selectedChat?._id === chat._id;

  return (
    <div
      className={`flex justify-between hover:bg-gray-100 py-3 px-2 rounded cursor-pointer ${isSelected ? 'bg-gray-100 border border-gray-300 border-solid' : ''}`}
      onClick={() => dispatch(SetSelectedChat(chat))}
    >
      <div className='flex gap-5 items-center'>
        <img src={chatImage} alt="" className='w-10 h-10 rounded-full' />
        <span className='text-gray-700 text-sm'>
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
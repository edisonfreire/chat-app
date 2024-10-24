import socket from '@/config/socket-config';
import { ChatType } from '@/interfaces';
import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import RecipientInfo from './recipient-info';

function RecepientCard() {
  const [typing, setTyping] = useState<boolean>(false);
  const [senderName = "", setSenderName] = React.useState<string>("");
  const [showRecipientInfo, setShowRecipientInfo] = useState<boolean>(false);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const { currentUserData }: UserState = useSelector((state: any) => state.user);

  let chatName = "";
  let chatImage = "";

  if (selectedChat?.isGroupChat) {
    chatName = selectedChat.groupName;
    chatImage = selectedChat.groupProfilePicture;
  } else {
    const recipient = selectedChat?.users.find((user) => user._id !== currentUserData?._id);
    chatName = recipient?.name!;
    chatImage = recipient?.profilePicture!;
  }

  const typingAnimation = () => {
    if (typing)
      return (
        <span className="text-green-700 font-semibold text-xs">
          {selectedChat?.isGroupChat ? `${senderName} is typing...` : "Typing..."}
        </span>
      );
  };

  useEffect(() => {
    socket.on(
      "typing",
      ({ chat, senderName }: { chat: ChatType; senderName: string }) => {
        if (selectedChat?._id === chat._id) {
          setTyping(true);
          if (chat.isGroupChat) {
            setSenderName(senderName);
          }
        }

        setTimeout(() => {
          setTyping(false);
        }, 2000);
      }
    );

    return () => {
      socket.off("typing");
    };
  }, [selectedChat]);

  return (
    <div className='flex justify-between py-3 px-5 border-0 border-b border-gray-200 border-solid bg-gray-400/5'
    >
      <div className="flex gap-5 items-center">
        <img src={chatImage} alt="" className='w-10 h-10 rounded-full' />
        <div className='flex flex-col gap-1'>
          <span className='text-gray-700 text-sm cursor-pointer'
            onClick={() => setShowRecipientInfo(true)}
          >{chatName}</span>
          {typingAnimation()}
        </div>
      </div>

      {showRecipientInfo && (
        <RecipientInfo {... { showRecipientInfo, setShowRecipientInfo }} />
      )}
    </div>
  )
}

export default RecepientCard;
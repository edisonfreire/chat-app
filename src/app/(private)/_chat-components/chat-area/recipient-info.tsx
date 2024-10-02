import { formatDateTime } from '@/helpers/date-formats';
import { ChatState } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { Divider, Drawer } from 'antd';
import React from 'react'
import { useSelector } from 'react-redux';

function RecipientInfo({
  showRecipientInfo,
  setShowRecipientInfo,
}: {
  showRecipientInfo: boolean;
  setShowRecipientInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  let chatName = '';
  let chatImage = '';
  if (selectedChat?.isGroupChat) {
    chatName = selectedChat.groupName;
    chatImage = selectedChat.groupProfilePicture;
  } else {
    const recipient = selectedChat?.users.find((user) => user._id !== currentUserData?._id);
    chatName = recipient?.name!;
    chatImage = recipient?.profilePicture!;
  }

  const getProperty = (key: string, value: string) => {
    return (
      <div className='flex flex-col'>
        <span className='font-semibold text-gray-700'>{key}</span>
        <span className='text-gray-500'>{value}</span>
      </div>
    )
  }


  return (
    <Drawer
      open={showRecipientInfo}
      onClose={() => setShowRecipientInfo(false)}
      title={chatName}
    >
      <div className="flex flex-col justify-center items-center gap-5">
        <img src={chatImage} alt="" className='w-28 h-28 rounded-full' />
        <span className='text-gray-700'>{chatName}</span>
      </div>

      <Divider className='my-3 border-gray-200' />

      <div className='flex flex-col gap-5'>
        {getProperty('Created On', formatDateTime(selectedChat?.createdAt!))}
        {getProperty('Created By', selectedChat?.createdBy?.name!)}
      </div>
    </Drawer>


  )
}

export default RecipientInfo;
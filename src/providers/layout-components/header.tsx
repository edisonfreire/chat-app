"use client";
import { GetCurrentUserFromMongoDB } from '@/server-actions/users';
import React, { useEffect } from 'react'
import { Avatar, message } from 'antd';

function Header() {
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  const getCurrentUser = async () => {
    try {
      const response = await GetCurrentUserFromMongoDB();
      if (response.error) throw new Error(response.error);
      setCurrentUser(response);
    } catch (error: any) {
      message.error(error.message);
    }
  }

  useEffect(() => {
    getCurrentUser();
  } ,[]);

  return (
    <div className='bg-gray-200 w-full px-5 py-2 flex justify-between items-center border-b border-solid border-gray-300'>
      <div>
        <h1 className='text-2xl font-bold text-primary uppercase'>Chatster</h1>
      </div>
      <div className='gap-5 flex items-center'>
        <span className='text-sm'>{currentUser?.name}</span>
        <Avatar src={currentUser?.profilePicture} />
      </div>
    </div>
  )
}

export default Header;
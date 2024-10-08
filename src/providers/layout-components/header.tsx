"use client";
import { GetCurrentUserFromMongoDB } from '@/server-actions/users';
import React, { useState, useEffect } from 'react'
import { Avatar, message } from 'antd';
import { UserType } from '@/interfaces';
import CurrentUserInfo from './current-user-info';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentUser, UserState } from '@/redux/userSlice';
import socket from '@/config/socket-config';

function Header() {
  const pathname = usePathname();
  const isPublicRoute = pathname.includes('sign-in') || pathname.includes('sign-up');
  if (isPublicRoute) return null;
  const dispatch = useDispatch();
  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const [showCurrentUserInfo, setShowCurrentUserInfo] = useState<boolean>(false);

  const getCurrentUser = async () => {
    try {
      const response = await GetCurrentUserFromMongoDB();
      if (response.error) throw new Error(response.error);
      dispatch(SetCurrentUser(response as UserType));
    } catch (error: any) {
      message.error(error.message);
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserData) {
      socket.emit('join', currentUserData._id);
    }
  }, [currentUserData]);

  return (
    <div className='bg-gray-200 w-full px-5 py-2 flex justify-between items-center border-b border-solid border-gray-300'>
      <div>
        <h1 className='text-2xl font-bold text-primary uppercase'>Chatster</h1>
      </div>
      <div className='gap-5 flex items-center'>
        <span className='text-sm'>{currentUserData?.name}</span>
        <Avatar className="cursor-pointer"
          onClick={() => setShowCurrentUserInfo(true)}
          src={currentUserData?.profilePicture}
        />
      </div>

      {showCurrentUserInfo && (
        <CurrentUserInfo
          showCurrentUserInfo={showCurrentUserInfo}
          setShowCurrentUserInfo={setShowCurrentUserInfo}
        />
      )}
    </div>
  )
}

export default Header;
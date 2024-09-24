"use client";
import { GetCurrentUserFromMongoDB } from '@/server-actions/users';
import React, { useEffect } from 'react'
import { Avatar, message } from 'antd';
import { UserType } from '@/interfaces';
import CurrentUserInfo from './current-user-info';
import { usePathname } from 'next/navigation';

function Header() {
  const pathname = usePathname();
  const isPublicRoute = pathname.includes('sign-in') || pathname.includes('sign-up');
  if (isPublicRoute) return null;

  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);
  const [showCurrentUserInfo, setShowCurrentUserInfo] = React.useState<boolean>(false);

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
  }, []);

  return (
    <div className='bg-gray-200 w-full px-5 py-2 flex justify-between items-center border-b border-solid border-gray-300'>
      <div>
        <h1 className='text-2xl font-bold text-primary uppercase'>Chatster</h1>
      </div>
      <div className='gap-5 flex items-center'>
        <span className='text-sm'>{currentUser?.name}</span>
        <Avatar className="cursor-pointer"
          onClick={() => setShowCurrentUserInfo(true)}
          src={currentUser?.profilePicture}
        />
      </div>

      {showCurrentUserInfo && (
        <CurrentUserInfo
          currentUser={currentUser}
          showCurrentUserInfo={showCurrentUserInfo}
          setShowCurrentUserInfo={setShowCurrentUserInfo}
        />
      )}
    </div>
  )
}

export default Header;
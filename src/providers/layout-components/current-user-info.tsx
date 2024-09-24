import { UserType } from '@/interfaces'
import { Button, Divider, Drawer, message } from 'antd';
import React, { useState } from 'react'
import dayjs from 'dayjs';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function CurrentUserInfo({
  currentUser,
  showCurrentUserInfo,
  setShowCurrentUserInfo
}: {
  currentUser: UserType | null;
  showCurrentUserInfo: boolean;
  setShowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const { signOut } = useClerk();
  const router = useRouter();

  const getProperty = (key: string, value: string) => {
    return (
      <div className='flex flex-col'>
        <span className='font-semibold text-gray-700'>{key}</span>
        <span className='text-gray-500'>{value}</span>
      </div>
    )
  }

  const onLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      message.success('Logged out successfully');
      router.push('/sign-in');
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      open={showCurrentUserInfo}
      onClose={() => setShowCurrentUserInfo(false)}
      title="Profile"
    >
      {currentUser &&
        <div className="flex flex-col gap-5">
          <div className='flex flex-col gap-5 justify-center items-center'>
            <img
              src={currentUser.profilePicture}
              alt="Profile Picture"
              className='w-28 h-28 rounded-full'
            />
            <span className='text-gray-700 cursor-pointer'>Change Profile Picture</span>
          </div>

          <Divider className='my-1 border-gray-200' />

          <div className='flex flex-col gap-5'>
            {getProperty('Name', currentUser.name)}
            {getProperty('Username', currentUser.username)}
            {getProperty('Id', currentUser._id)}
            {getProperty('Joined on', dayjs(currentUser.createdAt).format('DD MMMM YYYY hh:mm A'))}
          </div>

          <div className='mt-5'>
            <Button
              className='w-full'
              block
              loading={loading}
              onClick={onLogout}
            >
              Log Out
            </Button>
          </div>
        </div>
      }
    </Drawer>
  )
}

export default CurrentUserInfo;
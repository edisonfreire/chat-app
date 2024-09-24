import { Button, Divider, Drawer, message, Upload } from 'antd';
import React, { useState } from 'react'
import dayjs from 'dayjs';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { UserState } from '@/redux/userSlice';
import { on } from 'events';

function CurrentUserInfo({
  showCurrentUserInfo,
  setShowCurrentUserInfo
}: {
  showCurrentUserInfo: boolean;
  setShowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const {currentUserData}: UserState = useSelector((state: any) => state.user);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      setShowCurrentUserInfo(false);
      message.success('Logged out successfully');
      router.push('/sign-in');
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const onProfilePictureUpdate = async () => { }


  return (
    <Drawer
      open={showCurrentUserInfo}
      onClose={() => setShowCurrentUserInfo(false)}
      title="Profile"
    >
      {currentUserData &&
        <div className="flex flex-col gap-5">
          <div className='flex flex-col gap-5 justify-center items-center'>
            {!selectedFile && <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : currentUserData.profilePicture
              }
              alt="Profile Picture"
              className='w-28 h-28 rounded-full'
            />}
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false;
              }}
              className='cursor-pointer'
              listType={selectedFile ? 'picture-circle': 'text'}
              maxCount={1}
            >
            Change Profile Picture
            </Upload>
          </div>

          <Divider className='my-1 border-gray-200' />

          <div className='flex flex-col gap-5'>
            {getProperty('Name', currentUserData.name)}
            {getProperty('Username', currentUserData.username)}
            {getProperty('Id', currentUserData._id)}
            {getProperty('Joined on', dayjs(currentUserData.createdAt).format('DD MMMM YYYY hh:mm A'))}
          </div>

          <div className='mt-5 flex flex-col gap-5'>
          <Button
              className='w-full'
              block
              loading={loading}
              onClick={onProfilePictureUpdate}
              disabled={!selectedFile}
            >
              Update Profile Picture
            </Button>
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
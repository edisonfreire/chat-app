import { UserType } from '@/interfaces';
import { UserState } from '@/redux/userSlice';
import { GetAllUsers } from '@/server-actions/users';
import { Button, Divider, message, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function NewChatModal(
  {
    showNewChatModal,
    setShowNewChatModal,
  } : {
    showNewChatModal: boolean;
    setShowNewChatModal: React.Dispatch<React.SetStateAction<boolean>>;
  }
) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {currentUserData} : UserState = useSelector((state: any) => state.user);

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await GetAllUsers();
      if (response.error) throw new Error(response.error);
      console.log(response);
      setUsers(response);
    } catch (error:any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUsers();
  } ,[]);

  return (
    <Modal
      open={showNewChatModal}
      onCancel={() => setShowNewChatModal(false)}
      footer={null}
      centered
      title={null}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-primary text-center text-xl font-bold uppercase">
          Create New Chat
        </h1>
        {loading && (
          <div className="flex justify-center my-20">
            <Spin />
          </div>
        )}

        {! loading && users.length > 0 && (
          <div className="flex flex-col gap-5">
            {users.map((user) => {
              if (user._id === currentUserData?._id) return null;

              return (
                <>
                <div key={user._id}
                  className='flex justify-between items-center'
                >
                  <div className="flex gap-5 items-center">
                    <img src={user.profilePicture}
                    alt='avatar'
                    className='w-10 h-10 rounded-full'/>
                    <span className='text-gray-500'>{user.name}</span>
                  </div>
                  <Button
                    size='small'
                  >
                    Add To Chat
                  </Button>
                </div>
                <Divider 
                  className='border-gray-200 my-[1px]'
                />
                </>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default NewChatModal
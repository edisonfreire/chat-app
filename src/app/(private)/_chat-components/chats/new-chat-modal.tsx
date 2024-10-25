import { UserType } from '@/interfaces';
import { ChatState } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { CreateNewChat } from '@/server-actions/chats';
import { GetAllUsers } from '@/server-actions/users';
import { Button, Divider, message, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetChats } from '@/redux/chatSlice';
import socket from '@/config/socket-config';

function NewChatModal(
  {
    showNewChatModal,
    setShowNewChatModal,
  }: {
    showNewChatModal: boolean;
    setShowNewChatModal: React.Dispatch<React.SetStateAction<boolean>>;
  }
) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const { chats }: ChatState = useSelector((state: any) => state.chat);
  const dispatch = useDispatch();

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await GetAllUsers();
      if (response.error) throw new Error(response.error);
      console.log(response);
      setUsers(response);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const onAddToChat = async (userId: string) => {
    try {
      setSelectedUserId(userId);
      setLoading(true);
      const newChat = await CreateNewChat({
        users: [currentUserData?._id, userId],
        createdBy: currentUserData?._id,
        isGroupChat: false,
      });
      if (newChat.error) throw new Error(newChat.error);
      message.success('Chat created successfully');

      // Update the chats in the Redux store
      dispatch(SetChats([newChat, ...chats]));

      // Emit the 'chat-created' event
      socket.emit('chat-created', newChat);

      setShowNewChatModal(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getUsers();
  }, []);

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
        {loading &&
          !selectedUserId && (
            <div className="flex justify-center my-20">
              <Spin />
            </div>
          )}

        {!loading && users.length > 0 && (
          <div className="flex flex-col gap-5">
            {users.map((user) => {
              const chatAlreadyCreated = chats.find((chat) => chat.users.find((u) => u._id === user._id) && !chat.isGroupChat);
              if (user._id === currentUserData?._id || chatAlreadyCreated
              ) return null;

              return (
                <div key={user._id}>
                  <div
                    className='flex justify-between items-center mb-3'
                  >
                    <div className="flex gap-5 items-center">
                      <img src={user.profilePicture}
                        alt='avatar'
                        className='w-10 h-10 rounded-full' />
                      <span className='text-gray-500'>{user.name}</span>
                    </div>
                    <Button
                      loading={selectedUserId === user._id && loading}
                      size='small'
                      onClick={() => onAddToChat(user._id)}
                    >
                      Add To Chat
                    </Button>
                  </div>
                  <Divider
                    className='border-gray-200 my-[1px]'
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default NewChatModal
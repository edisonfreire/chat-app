import React, { useState } from 'react'
import { MenuProps, Dropdown } from 'antd';
import NewChatModal from './new-chat-modal';

function ChatsHeader() {
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const items: MenuProps['items'] = [
    {
      label: 'New Chat',
      key: '1',
      onClick: () => setShowNewChatModal(true),
    },
    {
      label: 'New Group',
      key: '2',
    },
  ];


  return (
    <div>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl text-gray-500 font-bold uppercase'>My Chats</h1>
        <Dropdown.Button
          size='small'
          className='w-max'
          menu={{ items }}
          onClick={() => setShowNewChatModal(true)}
        >
          New Chat
        </Dropdown.Button>
      </div>

      <input type='text' placeholder='Search chats...' className='bg-gray-100 w-full border border-gray-200 border-solid outline-none rounded-md px-3 h-14 focus:outline-none focus:border-primary ' />

      {showNewChatModal && (
        <NewChatModal
          showNewChatModal={showNewChatModal}
          setShowNewChatModal={setShowNewChatModal}
        />
      )}
    </div>
  )
}

export default ChatsHeader
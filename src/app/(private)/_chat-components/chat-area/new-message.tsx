import { UserState } from '@/redux/userSlice'
import { ChatState } from '@/redux/chatSlice'
import { Button, message } from 'antd'
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { SendNewMessage } from '@/server-actions/messages'
import socket from '@/config/socket-config'
import dayjs from 'dayjs'

function NewMessage() {
  const [text, setText] = React.useState('')
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)

  const onSend = async () => {
    if (!text) return;

    try {
      const commonPayload = {
        text, 
        image: '',
        socketMessageId: dayjs().unix(),
        // real time purpose
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      };

      const socketPayload = {
        ...commonPayload,
        chat: selectedChat,
        sender: currentUserData,
      };

      // send message using socket
      socket.emit('send-new-message', socketPayload);
      console.log(socketPayload);

      const dbPayload = {
        ...commonPayload,
        sender: currentUserData?._id!,
        chat: selectedChat?._id!,
      };
      SendNewMessage(dbPayload);
      setText('');
    } catch (error: any) {
      message.error(error.message)
    }
  }

  return (
    <div className='p-3 bg-gray-100 border-0 border-t border-solid border-gray-200 flex gap-5'>
      <div>
        {/* Emoji picker */}
      </div>
      <div className='flex-1'>
        <input
          type='text'
          placeholder='Type a message'
          className='w-full p-2 bg-white border border-solid border-gray-200 focus:outline-none focus:border-gray-500 h-[45px] px-5'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSend();
            }
          }}
        />
      </div>
      <Button
        type='primary'
        onClick={onSend}
      >SEND
      </Button>

    </div>
  )
}

export default NewMessage
import { UserState } from '@/redux/userSlice'
import { ChatState } from '@/redux/chatSlice'
import { Button, message } from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { SendNewMessage } from '@/server-actions/messages'
import socket from '@/config/socket-config'
import dayjs from 'dayjs'
import EmojiPicker from 'emoji-picker-react'
import ImageSelector from './image-selector'
import { UploadImageToFirebaseAndReturnUrl } from '@/helpers/image-upload'
import { read } from 'fs'

function NewMessage() {
  const [text, setText] = useState('')
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [showImageSelector, setShowImageSelector] = useState<boolean>(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const onSend = async () => {
    try {
      if (!text && !selectedImageFile) return;
      setLoading(true);

      let image = '';
      if (selectedImageFile) {
        image = await UploadImageToFirebaseAndReturnUrl(selectedImageFile);
      }

      const commonPayload = {
        text,
        image,
        socketMessageId: dayjs().unix(),
        // real time purpose
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        readBy: [],
      };

      const socketPayload = {
        ...commonPayload,
        chat: selectedChat,
        sender: currentUserData,
      };

      // send message using socket
      socket.emit('send-new-message', socketPayload);
      setText("");
      setSelectedImageFile(null);
      setShowImageSelector(false);
      setShowEmojiPicker(false);
      console.log(socketPayload);

      const dbPayload = {
        ...commonPayload,
        sender: currentUserData?._id!,
        chat: selectedChat?._id!,
      };
      SendNewMessage(dbPayload);
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    socket.emit("typing", {
      chat: selectedChat,
      senderId: currentUserData?._id!,
      senderName: currentUserData?.name.split(" ")[0],
    });
  }, [text]); // selectedChat too

  return (
    <div className='p-2 bg-gray-100 border-0 border-t border-solid border-gray-200 flex gap-2 relative'>
      <div className='flex gap-2'>
        {showEmojiPicker && (
          <div className="absolute left-5 bottom-20">
            <EmojiPicker
              height={350}
              onEmojiClick={(emojiObject) => {
                setText((prevText) => prevText + emojiObject.emoji);
                inputRef.current?.focus();
              }
            }
            />
          </div>
        )}
        <Button
          className='border-gray-300'
          onClick={() => setShowImageSelector(true)}
        >
          <i className='ri-image-line text-xl' />
        </Button>
        <Button
          className='border-gray-300'
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {!showEmojiPicker ? <i className='ri-emoji-sticker-line text-xl' /> : <i className='ri-close-line text-xl' />}
        </Button>
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
          ref={inputRef}
        />
      </div>
      <Button
        type='primary'
        onClick={onSend}
      >SEND
      </Button>

      {showImageSelector && (
        <ImageSelector
          showImageSelector={showImageSelector}
          setShowImageSelector={setShowImageSelector}
          selectedImageFile={selectedImageFile}
          setSelectedImageFile={setSelectedImageFile}
          onSend={onSend}
          loading={loading}
        /> 
      )}
    </div>
  )
}

export default NewMessage
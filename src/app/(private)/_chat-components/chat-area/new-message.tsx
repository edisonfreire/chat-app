import React, { useState, useEffect, useRef } from 'react';
import { UserState } from '@/redux/userSlice';
import { ChatState } from '@/redux/chatSlice';
import { Button, message } from 'antd';
import { useSelector } from 'react-redux';
import { SendNewMessage } from '@/server-actions/messages';
import socket from '@/config/socket-config';
import dayjs from 'dayjs';
import EmojiPicker from 'emoji-picker-react';
import ImageSelector from './image-selector';
import { UploadImageToFirebaseAndReturnUrl } from '@/helpers/image-upload';

function NewMessage() {
  const [text, setText] = useState('');
  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showImageSelector, setShowImageSelector] = useState<boolean>(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSend = async () => {
    try {
      if (!text && !selectedImageFile) return;
      setLoading(true);

      let image = '';
      if (selectedImageFile) {
        image = await UploadImageToFirebaseAndReturnUrl(selectedImageFile);
      }

      const dbPayload = {
        text,
        image,
        socketMessageId: dayjs().unix().toString(),
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        readBy: [],
        sender: currentUserData?._id!,
        chat: selectedChat?._id!,
      };

      // Save the message to the database
      const newMessage = await SendNewMessage(dbPayload);

      if (newMessage.error) {
        throw new Error(newMessage.error);
      }

      // Now, emit the new message via socket
      const socketPayload = {
        ...newMessage,
        chat: selectedChat,
      };

      socket.emit('send-new-message', socketPayload);

      setText('');
      setSelectedImageFile(null);
      setShowImageSelector(false);
      setShowEmojiPicker(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (text) {
      // Emit 'typing' event when user starts typing
      socket.emit('typing', {
        chat: selectedChat,
        senderId: currentUserData?._id!,
        senderName: currentUserData?.name.split(' ')[0],
      });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to emit 'stop-typing' event after a delay
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop-typing', {
          chat: selectedChat,
          senderId: currentUserData?._id!,
        });
      }, 2000);
    } else {
      // If input is cleared, emit 'stop-typing' immediately
      socket.emit('stop-typing', {
        chat: selectedChat,
        senderId: currentUserData?._id!,
      });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [text]);

  return (
    <div className="p-2 bg-gray-100 border-0 border-t border-solid border-gray-200 flex gap-2 relative">
      <div className="flex gap-2">
        {showEmojiPicker && (
          <div className="absolute left-5 bottom-20">
            <EmojiPicker
              height={350}
              onEmojiClick={(emojiObject) => {
                setText((prevText) => prevText + emojiObject.emoji);
                inputRef.current?.focus();
              }}
            />
          </div>
        )}
        <Button
          className="border-gray-300"
          onClick={() => setShowImageSelector(true)}
        >
          <i className="ri-image-line text-xl" />
        </Button>
        <Button
          className="border-gray-300"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {!showEmojiPicker ? (
            <i className="ri-emoji-sticker-line text-xl" />
          ) : (
            <i className="ri-close-line text-xl" />
          )}
        </Button>
      </div>
      <div className="flex-1">
        <input
          type="text"
          placeholder="Type a message"
          className="w-full p-2 bg-white border border-solid border-gray-200 focus:outline-none focus:border-gray-500 h-[45px] px-5"
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
      <Button type="primary" onClick={onSend}>
        SEND
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
  );
}

export default NewMessage;
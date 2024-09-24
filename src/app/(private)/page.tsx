"use client";

import ChatArea from "./_chat-components/chat-area";
import Chats from "./_chat-components/chats";
import { Divider } from "antd";

export default async function Home() {
  return (
    <div className='flex h-[85vh]'>
      <Chats />
      <Divider 
        type='vertical'
        className="h-full border-gray-300"
      />
      <ChatArea />
    </div>
  );
}

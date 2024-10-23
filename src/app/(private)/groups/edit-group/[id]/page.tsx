import Link from 'next/link';
import React from 'react'
import GroupForm from '../../_components/group-form';
import { UserType } from '@/interfaces';
import UserModel from '@/models/user-model';
import ChatModel from '@/models/chat-model';

async function EditGroup({ params }: { params: any }) {
  const id = params.id;
  const users: UserType[] = await UserModel.find({});
  const chat = await ChatModel.findById(id);
  return (
    <div className="p-5">
      <Link
        href={'/'}
        className='text-primary border border-primary border-solid no-underline px-5 py-2 text-sm'
      >
        Back To Chats
      </Link>
      <h1 className="text-primary text-xl font-bold py-2 uppercase">
        Create Group Chat
      </h1>

      <GroupForm
        initialData={JSON.parse(JSON.stringify(chat))}
        users={JSON.parse(JSON.stringify(users))} 
      />
    </div>
  )
}

export default EditGroup;
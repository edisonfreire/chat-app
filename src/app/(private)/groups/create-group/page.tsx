import Link from 'next/link'
import React from 'react'
import { UserModel, MessageModel, ChatModel } from '@/models'
import GroupForm from '../_components/group-form'
import { UserType } from '@/interfaces'

async function CreateGroupPage() {
  const users: UserType[] = await UserModel.find({})
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
      
      <GroupForm users={
        JSON.parse(JSON.stringify(users))
      } />
    </div>
  )
}

export default CreateGroupPage
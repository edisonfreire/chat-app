import { Button } from 'antd'
import React from 'react'

function NewMessage() {
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
        />
      </div>
      <Button
        type='primary'
      >SEND
      </Button>

    </div>
  )
}

export default NewMessage
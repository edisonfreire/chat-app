import React from 'react'

function Header() {
  return (
    <div className='bg-gray-200 w-full px-5 flex justify-between items-center'>
      <div>
        <h1 className='text-2xl font-bold text-primary'>Chatster</h1>
      </div>
      <div>
        <span>Current user</span>
      </div>
    </div>
  )
}

export default Header;
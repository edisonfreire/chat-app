import Loader from '@/components/loader';
import { UserState } from '@/redux/userSlice';
import { usePathname } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';

const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isPublicRoute = pathname.includes('sign-in') || pathname.includes('sign-up');

  if (isPublicRoute) return children;

  const { currentUserData }: UserState = useSelector((state: any) => state.user);

  if (!currentUserData) return <Loader />;
  
  return (
    <div>
      {children}
    </div>
  )
}

export default Content;
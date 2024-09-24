import { UserButton } from '@clerk/nextjs';
import { connectMongoDB } from '@/config/db-config';
import { GetCurrentUserFromMongoDB } from '@/server-actions/users';

connectMongoDB();

export default async function Home() {
  const loggedInUserData = await GetCurrentUserFromMongoDB();

  return (
    <div className='p-10'>
      <div className="flex flex-col gap-3">
        <UserButton />
        <span>Name: {loggedInUserData?.name}</span>
        <span>Username: {loggedInUserData?.username}</span>
        <span>Email: {loggedInUserData.email}</span>
      </div>
    </div>
  );
}

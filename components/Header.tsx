import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Header() {
  const { data: session } = useSession();
    const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className='flex items-center'>
          <div className='pr-2'>
            <img src={'/logo.jpg'} className='w-8 h-8 rounded'/>
          </div>
          <div>
            <span className='text-xl'>
              CareByDrSrividya
            </span>
          </div>
        </div>
        <div>
          {!session ? (
            <button onClick={() => signIn("google", { callbackUrl: '/patients'})} className ="border border-blue-500 px-4 py-2 rounded-full">
          Sign in
        </button>
        ) : (
        <button onClick={() => signOut({ callbackUrl: "/" })} className="border border-blue-500 px-4 py-2 rounded-full">
          Sign out
        </button>
        )}
        </div>
      </div>
      <div className="border-gray-600 border-b-[0.5px]">
      </div>
    </>
  );
}

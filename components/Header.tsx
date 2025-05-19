import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Header() {
  const { data: session } = useSession();
    const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className='flex items-center'>
          <div>
            <img src={'https://play-lh.googleusercontent.com/t-mu8n6kiIgETcvb36-lpp8kdO2tco9k7ETTTPAiFzqPcyvW3xmQu_xACg5qUXJAylk'} className='w-12 h-12 rounded'/>
          </div>
          <div>
            <span className='text-xl'>
              CareByDrSrividya
            </span>
          </div>
        </div>
        <div>
          {!session ? (
            // <button onClick={() => signIn("google", { callbackUrl: '/home'})} className ="border border-blue-500 px-4 py-2 rounded-full">
            <button onClick={() => router.push('/home')} className ="border border-blue-500 px-4 py-2 rounded-full">
          Sign in
        </button>
        ) : (
        <button onClick={() => signOut()} className="bg-red-500 px-4 py-2 rounded">
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

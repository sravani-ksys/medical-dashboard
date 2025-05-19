import Header from './Header';
import { useRouter } from 'next/router';

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center gap-6 py-20">
        <h2 className="text-3xl font-semibold">Welcome to the Patient Portal</h2>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/patient/add')}
            className="bg-green-500 px-6 py-3 text-white rounded"
          >
            Add Patient Info
          </button>
          <button
            onClick={() => router.push('/patient/get')}
            className="bg-blue-500 px-6 py-3 text-white rounded"
          >
            Get Patient Info
          </button>
        </div>
      </main>
    </>
  );
}

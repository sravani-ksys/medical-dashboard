import Header from './Header';
import { useRouter } from 'next/router';

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center gap-6 py-20">
      </main>
    </>
  );
}

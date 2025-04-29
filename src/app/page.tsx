'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  // Optional: Add a loading indicator while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Перенаправлення...</p>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from './providers/AppContext';

export default function Home() {
  const { isLoggedIn } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/bookings');
    } else {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  return null;
}

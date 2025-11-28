'use client';

import React,{ useEffect } from "react";
import { useAppContext } from "../providers/AppContext";
import { useRouter } from 'next/navigation';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.push("/");
  }, [isLoggedIn]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
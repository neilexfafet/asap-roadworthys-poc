'use client';

import React, { useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, BookMarked } from 'lucide-react';
import { useAppContext } from "../providers/AppContext";

// You can create and import these components from your components directory
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoggedIn } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if(!isLoggedIn) router.push('/login');
  }, [isLoggedIn])

  const handleLogout = () => {
    logout()
    router.push('/login')
  };
  
  return (
    <div className="flex max-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Car Repair Shop</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button
              // onClick={() => setView('bookings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith('/bookings')
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              <BookMarked size={20} />
              Bookings
            </button>
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2" title={user?.email}>{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-200 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </aside>

      <main className="flex-1 overflow-y-auto">
        {/* Main Content */}
        <div className=" mx-auto">{children}</div>
      </main>
    </div>
  );
}
"use client";

import CircularProgress from '@mui/material/CircularProgress';


export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black px-4">
      <CircularProgress className="text-6xl text-blue-500 animate-spin-slow" />
    </div>
  );
}

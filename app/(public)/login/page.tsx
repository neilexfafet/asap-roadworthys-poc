'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../providers/AppContext';
import api from '../../services/api';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function Login() {
  const { login } = useAppContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await api.post('/auth/login', { username, password });

      if (response.data.token) {
        let user = response.data.user;
        let token = response.data.token
        login(user, token);
        router.push('/bookings');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
        Car Repair Shop
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Login Portal
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email or Phone Number
          </label>
          <input
            type="text"
            name="username"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
        <div className="flex justify-center mt-4">
          <span>No Account yet? <Link href="/register" className="text-underline hover:text-blue-400">Register Here</Link></span>
        </div>
      </form>
    </div>
  );
}

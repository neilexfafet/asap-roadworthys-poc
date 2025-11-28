'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Booking, Message } from '@/app/types/booking-types';
import api from '../services/api';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AppContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  bookings: Booking[];
  login: (userData: User, token: string) => void;
  logout: () => void;
  addMessageToBooking: (bookingId: number, messageContent: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Replace with your actual API endpoint for session validation
          const response = await api.get('/auth/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = response.data;

          if (response && data.verified) {
            const { user } = data;
            setUserData(user);
            setIsLoggedIn(true);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Failed to verify session:', error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem('authToken', token);
    setUserData(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUserData(null);
  };

  const addMessageToBooking = (bookingId: number, messageContent: string) => {
    const newMessage: Message = {
      id: 1,
      booking_id: bookingId,
      sender: 'Customer',
      content: messageContent,
      created_at: new Date(),
    };

    setBookings(currentBookings =>
      currentBookings.map(b =>
        b.id === bookingId ? { ...b, messages: [...b.messages, newMessage] } : b
      )
    );
  };

  const value = { isLoggedIn, isLoading, user: userData, bookings, login, logout, addMessageToBooking };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
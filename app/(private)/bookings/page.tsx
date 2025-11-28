'use client';

import { useState } from 'react';
import { ChevronRight, FileText, Send, LogOut } from 'lucide-react';
import { useAppContext } from '../../providers/AppContext';
import Bookings from '@/app/components/ui/bookings/Bookings';

export default function BookingsPage() {
  const { user } = useAppContext();

  if(!user) return null;

  return (<Bookings />)
  
}

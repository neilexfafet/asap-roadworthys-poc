'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, FileText, Send, Plus } from 'lucide-react';
import { useAppContext } from '@/app/providers/AppContext';
import BookingDetails from './BookingDetails';
import BookingList from './BookingList';
import AddServiceModal from '../modals/AddServiceModal';
import { Message, Booking } from '@/app/types/booking-types';
import api from '@/app/services/api';
import { toast } from 'react-toastify';

export default function Bookings() {
  const { user } = useAppContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'bookings' | 'booking-detail'>('bookings');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isAddServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isSendingMsg, setIsSendingMessage] = useState<boolean>(false);


  const fetchBookings = async () => {
    setIsLoading(true);
    const response = await api.get('/bookings');
    setBookings(response.data);
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setView('booking-detail');
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedBooking) {
      setIsSendingMessage(true);
      try {
        const message = {
          booking_id: selectedBooking.id,
          sender: user?.role,
          content: messageInput
        }
        const response = await api.post('/messages', message);
        const newMessage: Message = {
          id: response.data.id,
          booking_id: response.data.booking_id,
          sender: response.data.sender,
          content: response.data.content,
          created_at: response.data.created_at,
        };
        setSelectedBooking({
          ...selectedBooking,
          messages: [...selectedBooking.messages, newMessage],
        });
        setMessageInput('');
      } catch(e: any) {
        toast.error(e.response?.data?.error || 'An unexpected error occurred.');
        console.error(e);
      } finally {
        setIsSendingMessage(false);
      } 
    }
  };

  // Bookings List View
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.role == 'admin' ? 'Bookings' : 'My Bookings'}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
          </div>
          {user?.role == 'customer' && (
            <button
              onClick={() => setAddServiceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-200 rounded-lg transition-colors"
            >
              <Plus size={18} />
              Add Service
            </button>
          )}
        </div>

        {isLoading && <div className="p-6 text-center">Loading bookings...</div>}

        {view === 'bookings' && (
          !isLoading && (
            <BookingList 
              data={bookings} 
              handleSelectBooking={handleSelectBooking} 
            />
          )
        )}

        {view === 'booking-detail' && selectedBooking && (
          <BookingDetails
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking as React.Dispatch<React.SetStateAction<Booking>>}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            setView={setView}
            handleSendMessage={handleSendMessage}
            isSendingMsg={isSendingMsg}
            refetch={fetchBookings}
          />
        )}

        {isAddServiceModalOpen && (
          <AddServiceModal
            onClose={() => setAddServiceModalOpen(false)}
            refetch={fetchBookings}
          />
        )}
      </div>
    </div>
  );
}

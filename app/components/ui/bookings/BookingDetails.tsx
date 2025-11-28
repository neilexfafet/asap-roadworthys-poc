'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, FileText, Send, RefreshCcw } from 'lucide-react';
import { Booking, FormAttachment } from '@/app/types/booking-types';
import { useAppContext } from '@/app/providers/AppContext';
import { toast } from 'react-toastify';
import api, { isCancel } from '@/app/services/api';
import moment from 'moment';
import { CircularProgress } from '@mui/material';

interface Props {
  selectedBooking: Booking;
  setSelectedBooking: React.Dispatch<React.SetStateAction<Booking>>;
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  setView: React.Dispatch<React.SetStateAction<'bookings' | 'booking-detail'>>;
  handleSendMessage: () => void;
  isSendingMsg: boolean;
  refetch: () => void;
}

export default function BookingDetails(props: Props) {
  const { user } = useAppContext();
  const { selectedBooking, messageInput, setMessageInput, setView, handleSendMessage, isSendingMsg, refetch, setSelectedBooking } = props;
  const [isUpdateDropdownOpen, setUpdateDropdownOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [formAttachments, setFormAttachments] = useState<FormAttachment[]>([]);
  const [isRetrievingForms, setIsRetrievingForms] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const retrieveForms = async (signal: AbortSignal) => {
      setIsRetrievingForms(true);
      try {
        const response = await api.get('/servicem8/forms', { signal });
        setFormAttachments(response.data)
      } catch (e: any) {
        if (!isCancel(e)) {
          toast.error(e?.response?.data?.error || 'An unexpected error occurred.')
          console.log(e);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsRetrievingForms(false)
        }
      }
    }

    retrieveForms(controller.signal);

    return () => {
      controller.abort();
    }
  }, []);

  const handleUpdateBooking = async (mark: string) => {
    setIsUpdating(true)
    setUpdateDropdownOpen(false);
    try {
      const response = await api.put(`/bookings/${selectedBooking.id}`, {
        status: mark
      });
      setSelectedBooking((prev) => ({
        ...prev,
        status: response.data.status
      }));
      toast.success('Booking updated successfully');
      refetch();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'An unexpected error occurred.')
      console.log(e);
    } finally {
      setIsUpdating(false);
    }
  }
  
  return (
    <>
      <div className="flex justify-between px-6 pt-6">
        <button
          onClick={() => setView('bookings')}
          className="text-blue-600 dark:text-blue-400 hover:underline mb-2"
        >
          ← Back to Bookings
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {selectedBooking.reference}
        </h1>
      </div>
      <div className="flex p-6 space-y-6 gap-4">
        <div className="flex flex-col w-full gap-4">
        {/* Booking Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Details</h2>
            <div className={user?.role == 'admin' ? 'relative' : 'hidden'}>
              <button
                onClick={() => setUpdateDropdownOpen(!isUpdateDropdownOpen)}
                onBlur={() => setTimeout(() => setUpdateDropdownOpen(false), 150)}
                disabled={isUpdating}
                className=" bg-blue-600 p-2 rounded"
              >
                <RefreshCcw size={14} className="inline-flex mb-1" /> {isUpdating ? 'Updating...' : 'Update Status'}
              </button>
              {isUpdateDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleUpdateBooking('In Progress')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Mark as In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateBooking('Completed')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className={`font-semibold ${
                selectedBooking.status === 'Completed' ? 'text-green-600' :
                selectedBooking.status === 'In Progress' ? 'text-blue-600' :
                'text-yellow-600'
              }`}>
                {selectedBooking.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
              <p className="font-semibold text-gray-900 dark:text-white">{moment(selectedBooking.created_at).format('LL')}</p>
            </div>
            { user?.role == 'admin' && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.users.name}</p>
              </div>
            )}
            <div className="flex flex-col col-span-2 gap-2 border-t border-gray-50 pt-4">
              <span className="text-gray-400">Vehicle Details</span>
              <div className="flex col-span-2 justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Make</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.vehicles.make}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Model</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.vehicles.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Year</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.vehicles.year}</p>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
              <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.description}</p>
            </div>
          </div>
        </div>

        {/* File Attachments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Form Attachments</h2>
          <div className="space-y-2">
            {isRetrievingForms ? (
              <span className="flex justify-center">
                <CircularProgress />
              </span>
            ) : formAttachments.length === 0 ? (
              <h1 className="text-center text-gray-500 dark:text-gray-400 py-4">No forms yet</h1>
            ) : (
              formAttachments.map((file) => (
                <a
                  key={file.uuid}
                  href="#"
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileText size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{file.edit_date}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </a>
              ))
            )}
          </div>
        </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 w-full">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Messages</h2>
          
          {/* Messages List */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {selectedBooking.messages.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No messages yet</p>
            ) : (
              selectedBooking.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.sender === user?.role
                      ? 'bg-blue-50 dark:bg-blue-900 ml-8'
                      : 'bg-gray-100 dark:bg-gray-700 mr-8'
                  }`}
                >
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {msg.sender == 'customer' ? 'Customer' : 'Technician'}
                  </p>
                  <p className="text-gray-900 dark:text-white text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{moment(msg.created_at).format('lll')}</p>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSendingMsg}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send size={18} />
              {isSendingMsg ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
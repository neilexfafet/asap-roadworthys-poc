'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Booking } from '@/app/types/booking-types';
import moment from 'moment';

interface Props {
  data: Booking[];
  handleSelectBooking: (booking: Booking) => void;
}

export default function BookingList(props: Props) {
  const { data, handleSelectBooking } = props;

  return (
    <>
      <div className="p-6 space-y-4">
        {
          data.length === 0 && (
            <h1 className="text-center text-gray-500 dark:text-gray-400 py-4">No bookings yet</h1>
          )
        }
        {data.map((booking, index) => (
          <div key={index} className="flex justify-center">
            <button
              key={booking.id}
              onClick={() => handleSelectBooking(booking)}
              className="w-3/4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {booking.reference}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{booking.service_type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    booking.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {booking.status}
                  </span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">{moment(booking.created_at).format('LL')}</p>
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '@/app/services/api';
import { toast } from 'react-toastify';

interface Props {
  onClose: () => void;
  refetch: () => void
}

export default function AddServiceModal(props: Props) {
  const { onClose, refetch } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serviceDetails, setServiceDetails] = useState({
    service_type: '',
    make: '',
    model: '',
    year: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServiceDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post('/bookings', serviceDetails);
      toast.success('Service added successfully');
      onClose();
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Service</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Type</label>
            <select id="serviceType" name="service_type" value={serviceDetails.service_type} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>Select a service</option>
              <option>Vehicle Inspection</option>
              <option>Brake Service</option>
              <option>Oil Change</option>
              <option>Tire Rotation</option>
              <option>Other</option>
            </select>
          </div>
          <h3 className="border-t pt-4 border-gray-50">Vehicle Details</h3>
          <div>
            <label htmlFor="vehicleDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Make</label>
            <input type="text" name="make" id="vehicleDetails" value={serviceDetails.make} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" placeholder="e.g., Toyota" />
          </div>
          <div>
            <label htmlFor="vehicleDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
            <input type="text" name="model" id="vehicleDetails" value={serviceDetails.model} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" placeholder="e.g., Camry" />
          </div>
          <div>
            <label htmlFor="vehicleDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
            <input type="text" name="year" id="vehicleDetails" value={serviceDetails.year} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" placeholder="e.g., 2021" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description of Issue</label>
            <textarea id="description" name="description" rows={4} value={serviceDetails.description} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" placeholder="Please describe the issue with your vehicle..."></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
              Cancel
            </button>
            <button 
              disabled={isSubmitting}
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {isSubmitting ? 'Submitting...' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
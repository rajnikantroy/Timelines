import React from 'react';
import { Integrations } from '../components/Integrations';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Integrations</h1>
        <Integrations />
      </div>
    </div>
  );
};

export default IntegrationsPage; 
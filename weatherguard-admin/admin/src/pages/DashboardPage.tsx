import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { requestAccess } from '../api/users.api';
import { Navbar } from '../components/layout/Navbar';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  if (!user) return null;

  const handleRequestAccess = async () => {
    setIsLoading(true);
    try {
      await requestAccess();
      setRequested(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to WeatherGuard</h2>
          
          {user.status === 'pending' && (
            <div className="space-y-4">
              <p className="text-gray-600">Your access request is pending admin approval.</p>
              <button
                onClick={handleRequestAccess}
                disabled={isLoading || requested}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {requested ? 'Request Sent' : 'Request Access'}
              </button>
            </div>
          )}

          {user.status === 'approved' && !user.hasTelegramLinked && (
            <div className="space-y-4">
              {/* TODO: telegramLinkUrl should be retrievable by the user themselves, e.g. via a dedicated endpoint — currently only the admin sees it at approval time which is a UX gap for a polished production version */}
              <p className="text-gray-600 font-medium">You've been approved!</p>
              <p className="text-sm text-gray-500">Check with the admin for your Telegram link.</p>
            </div>
          )}

          {user.status === 'approved' && user.hasTelegramLinked && (
            <div className="space-y-4">
              <p className="text-green-600 font-medium text-lg">You're all set!</p>
              <p className="text-gray-600">Weather alerts will arrive on Telegram.</p>
            </div>
          )}

          {user.status === 'rejected' && (
            <div className="space-y-4">
              <p className="text-red-600 font-medium">Your request was not approved.</p>
              <button
                onClick={handleRequestAccess}
                disabled={isLoading || requested}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {requested ? 'Request Sent' : 'Request Again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

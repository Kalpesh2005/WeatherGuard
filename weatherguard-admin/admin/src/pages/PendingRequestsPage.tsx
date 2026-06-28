import React, { useState } from 'react';
import { usePendingUsers } from '../hooks/usePendingUsers';
import { UserTable } from '../components/users/UserTable';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Loader } from '../components/common/Loader';

export const PendingRequestsPage: React.FC = () => {
  const { users, isLoading, error, refetch } = usePendingUsers();
  const [linkUrl, setLinkUrl] = useState<string | null>(null);

  const handleActionComplete = (success: boolean, url?: string) => {
    if (success) {
      if (url) {
        setLinkUrl(url);
      }
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Pending Requests</h1>
            
            {linkUrl && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-sm text-green-700 font-medium">User approved successfully!</p>
                  <p className="text-sm text-green-600 mt-1">
                    Send them this link to connect Telegram: <span className="font-mono bg-green-100 px-1 py-0.5 rounded select-all">{linkUrl}</span>
                  </p>
                </div>
                <button
                  onClick={() => setLinkUrl(null)}
                  className="text-green-500 hover:text-green-700 font-bold px-2 py-1"
                >
                  &times;
                </button>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {isLoading ? (
              <Loader />
            ) : (
              <UserTable users={users} showActions={true} onActionComplete={handleActionComplete} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

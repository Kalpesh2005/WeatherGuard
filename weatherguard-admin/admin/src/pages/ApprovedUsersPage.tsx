import React from 'react';
import { useApprovedUsers } from '../hooks/useApprovedUsers';
import { UserTable } from '../components/users/UserTable';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Loader } from '../components/common/Loader';

export const ApprovedUsersPage: React.FC = () => {
  const { users, isLoading, error } = useApprovedUsers();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Approved Users</h1>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {isLoading ? (
              <Loader />
            ) : (
              <UserTable users={users} showActions={false} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

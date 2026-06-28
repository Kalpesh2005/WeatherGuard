import React from 'react';
import { useApprovedUsers } from '../hooks/useApprovedUsers';
import { UserTable } from '../components/users/UserTable';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Loader } from '../components/common/Loader';

export const ApprovedUsersPage: React.FC = () => {
  const { users, isLoading, error } = useApprovedUsers();

  const linkedCount = users.filter(u => u.hasTelegramLinked).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0a0f1e, #0f172a)' }}>
      <div className="orb orb-1" style={{ opacity: 0.07 }} />
      <div className="orb orb-2" style={{ opacity: 0.07 }} />
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white">Approved Users</h1>
                <p className="text-slate-400 text-sm mt-1">All users currently approved to receive weather alerts</p>
              </div>
              {!isLoading && (
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-lg text-sm font-semibold"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
                    {users.length} approved
                  </div>
                  <div className="px-3 py-1 rounded-lg text-sm font-semibold"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
                    {linkedCount} linked
                  </div>
                </div>
              )}
            </div>

            {/* Stats strip */}
            {!isLoading && users.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Approved', value: users.length, color: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
                  { label: 'Telegram Linked', value: linkedCount, color: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
                  { label: 'Awaiting Link', value: users.length - linkedCount, color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
                ].map(stat => (
                  <div key={stat.label} className="glass rounded-xl px-5 py-4"
                    style={{ border: `1px solid ${stat.border}`, background: stat.bg }}>
                    <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 px-5 py-4 rounded-xl text-sm text-red-300"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                {error}
              </div>
            )}

            {isLoading ? <Loader /> : (
              <UserTable users={users} showActions={false} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

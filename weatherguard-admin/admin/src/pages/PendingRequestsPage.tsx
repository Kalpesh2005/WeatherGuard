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
      if (url) setLinkUrl(url);
      refetch();
    }
  };

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
                <h1 className="text-2xl font-bold text-white">Pending Requests</h1>
                <p className="text-slate-400 text-sm mt-1">Review and approve access requests from users</p>
              </div>
              {!isLoading && (
                <div className="px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
                  {users.length} pending
                </div>
              )}
            </div>

            {/* Telegram link success banner */}
            {linkUrl && (
              <div className="mb-6 flex items-start justify-between gap-4 px-5 py-4 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <div>
                  <p className="text-sm font-semibold text-emerald-300">User approved successfully!</p>
                  <p className="text-xs text-emerald-400/70 mt-1">
                    Send this Telegram link to the user:{' '}
                    <span className="font-mono text-emerald-300 select-all bg-emerald-950/40 px-1 py-0.5 rounded">{linkUrl}</span>
                  </p>
                </div>
                <button onClick={() => setLinkUrl(null)} className="text-emerald-400 hover:text-white transition-colors flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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
              <UserTable users={users} showActions={true} onActionComplete={handleActionComplete} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

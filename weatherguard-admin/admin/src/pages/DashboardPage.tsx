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
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #0a0f1e, #0f172a)' }}>
      <div className="orb orb-1" style={{ opacity: 0.08 }} />
      <div className="orb orb-2" style={{ opacity: 0.08 }} />
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        {/* Status Card */}
        <div className="w-full max-w-lg">
          {/* Profile greeting */}
          <div className="flex items-center gap-4 mb-6">
            {user.avatarUrl ? (
              <img className="h-14 w-14 rounded-2xl ring-2 ring-indigo-500/30" src={user.avatarUrl} alt={user.name} />
            ) : (
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {user.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">Hi, {user.name.split(' ')[0]}! 👋</h1>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>

          {/* Main status card */}
          <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {user.status === 'pending' && (
              <div className="text-center space-y-5">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Access Pending</h2>
                  <p className="text-slate-400 text-sm mt-1">Your access request is awaiting admin approval.</p>
                </div>
                <button
                  onClick={handleRequestAccess}
                  disabled={isLoading || requested}
                  className="btn-primary w-full"
                >
                  {requested ? '✓ Request Sent' : isLoading ? 'Sending...' : 'Request Access'}
                </button>
              </div>
            )}

            {user.status === 'approved' && !user.hasTelegramLinked && (
              <div className="text-center space-y-5">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">You're Approved! 🎉</h2>
                  <p className="text-slate-400 text-sm mt-1">Ask the admin for your Telegram link to start receiving weather alerts.</p>
                </div>
                <div className="px-4 py-3 rounded-xl text-sm text-cyan-300 font-medium"
                  style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  Check with admin for your Telegram link →
                </div>
              </div>
            )}

            {user.status === 'approved' && user.hasTelegramLinked && (
              <div className="text-center space-y-5">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">All Set! 🌤️</h2>
                  <p className="text-slate-400 text-sm mt-1">You're connected to Telegram. Weather alerts will arrive automatically.</p>
                </div>
                <div className="px-4 py-3 rounded-xl text-sm text-emerald-300 font-medium"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  ✓ Telegram connected — alerts active every 30 minutes
                </div>
              </div>
            )}

            {user.status === 'rejected' && (
              <div className="text-center space-y-5">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Request Not Approved</h2>
                  <p className="text-slate-400 text-sm mt-1">Your access request was declined. You may request again.</p>
                </div>
                <button
                  onClick={handleRequestAccess}
                  disabled={isLoading || requested}
                  className="btn-primary w-full"
                >
                  {requested ? '✓ Request Sent' : isLoading ? 'Sending...' : 'Request Again'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

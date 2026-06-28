import React, { useState } from 'react';
import { approveUser, rejectUser } from '../../api/users.api';

interface ApproveButtonProps {
  userId: string;
  onActionComplete: (success: boolean, linkUrl?: string) => void;
}

export const ApproveButton: React.FC<ApproveButtonProps> = ({ userId, onActionComplete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const result = await approveUser(userId);
      onActionComplete(true, result.telegramLinkUrl);
    } catch (error) {
      console.error('Failed to approve user', error);
      onActionComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await rejectUser(userId);
      onActionComplete(true);
    } catch (error) {
      console.error('Failed to reject user', error);
      onActionComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={handleApprove}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 transition-all duration-200 disabled:opacity-50"
        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
        onMouseEnter={e => !isLoading && ((e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.22)')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.12)')}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-300 transition-all duration-200 disabled:opacity-50"
        style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
        onMouseEnter={e => !isLoading && ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.22)')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)')}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Reject
      </button>
    </div>
  );
};

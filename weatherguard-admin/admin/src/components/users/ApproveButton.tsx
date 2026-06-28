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
    <div className="flex space-x-2">
      <button
        onClick={handleApprove}
        disabled={isLoading}
        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={isLoading}
        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-600 bg-red-100 hover:bg-red-200 hover:text-red-700 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
};

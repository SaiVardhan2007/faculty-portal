
import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SubscriptionStatus = 'connecting' | 'connected' | 'error' | 'reconnecting';

interface AttendanceStatusIndicatorProps {
  status: SubscriptionStatus;
  reconnectAttempts?: number;
}

const AttendanceStatusIndicator: React.FC<AttendanceStatusIndicatorProps> = ({
  status,
  reconnectAttempts = 0
}) => {
  const getSubscriptionStatusMessage = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting to real-time updates...';
      case 'connected':
        return 'Real-time updates active';
      case 'reconnecting':
        return `Reconnecting to real-time updates (Attempt ${reconnectAttempts})...`;
      case 'error':
        return 'Warning: Real-time updates are not working. Attendance changes may not appear immediately.';
      default:
        return '';
    }
  };

  const getSubscriptionStatusClass = () => {
    switch (status) {
      case 'connecting':
      case 'reconnecting':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
      case 'connected':
        return 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200';
      default:
        return '';
    }
  };

  if (status === 'connected') {
    return null;
  }

  return (
    <div className={cn("px-4 py-2 text-sm", getSubscriptionStatusClass())}>
      {getSubscriptionStatusMessage()}
    </div>
  );
};

export default AttendanceStatusIndicator;

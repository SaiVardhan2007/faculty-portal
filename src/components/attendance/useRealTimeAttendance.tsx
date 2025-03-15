
import { useState, useEffect } from 'react';
import { Student } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

type SubscriptionStatus = 'connecting' | 'connected' | 'error' | 'reconnecting';

interface UseRealTimeAttendanceProps {
  date: string;
  subjectId: string;
  students: Student[];
  initialAttendance: Record<string, 'present' | 'absent'>;
  onAttendanceUpdate: (studentId: string, status: 'present' | 'absent') => void;
}

export const useRealTimeAttendance = ({
  date,
  subjectId,
  students,
  initialAttendance,
  onAttendanceUpdate
}: UseRealTimeAttendanceProps) => {
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>(
    initialAttendance || {}
  );
  const [lastUpdatedStudent, setLastUpdatedStudent] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('connecting');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Update local state when initialAttendance prop changes
  useEffect(() => {
    setAttendance(initialAttendance || {});
  }, [initialAttendance]);

  // Reset the highlighted student after 2 seconds
  useEffect(() => {
    if (lastUpdatedStudent) {
      const timer = setTimeout(() => {
        setLastUpdatedStudent(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedStudent]);

  // Subscribe to real-time updates for attendance changes
  useEffect(() => {
    if (!date || !subjectId) {
      console.log('Missing date or subjectId for subscription, skipping setup');
      return;
    }

    console.log(`Setting up subscription for attendance updates - date: ${date}, subject: ${subjectId}`);
    
    let retryTimeout: NodeJS.Timeout;
    const maxRetries = 5;
    
    const setupSubscription = () => {
      console.log(`Attempt ${reconnectAttempts + 1}/${maxRetries + 1} to subscribe to attendance changes`);
      setSubscriptionStatus('connecting');
      
      // Create a unique channel name based on date and subject to avoid conflicts
      const channelName = `attendance-changes-${date}-${subjectId}-${Date.now()}`;
      
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'attendance_records',
            filter: `subject_id=eq.${subjectId}`
          },
          (payload: any) => {
            console.log('Received real-time update:', payload);
            try {
              if (payload.new && payload.new.date === date) {
                const { student_id, status } = payload.new;
                console.log(`Updating attendance for student ${student_id} to ${status}`);
                
                setAttendance(current => ({
                  ...current,
                  [student_id]: status as 'present' | 'absent'
                }));
                
                setLastUpdatedStudent(student_id);
                
                // Also call the passed onAttendanceUpdate function to update parent state
                onAttendanceUpdate(student_id, status as 'present' | 'absent');
                
                // Show a toast notification for the update
                const studentName = students.find(s => s.id === student_id)?.name || 'Student';
                toast.info(`${studentName}'s attendance updated to ${status}`);
              }
            } catch (error) {
              console.error('Error processing real-time update:', error);
            }
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to attendance changes');
            setSubscriptionStatus('connected');
            setReconnectAttempts(0); // Reset retry counter on success
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Error subscribing to attendance changes');
            setSubscriptionStatus('error');
            
            // Attempt to reconnect if we haven't exceeded max retries
            if (reconnectAttempts < maxRetries) {
              console.log(`Scheduling reconnect attempt ${reconnectAttempts + 1}/${maxRetries}`);
              setSubscriptionStatus('reconnecting');
              
              retryTimeout = setTimeout(() => {
                setReconnectAttempts(prev => prev + 1);
                supabase.removeChannel(channel);
                setupSubscription();
              }, 2000 * Math.pow(2, reconnectAttempts)); // Exponential backoff
            } else {
              toast.error('Failed to establish real-time connection after multiple attempts');
            }
          } else {
            setSubscriptionStatus('connecting');
          }
        });

      console.log('Subscription created:', channel);
      
      return channel;
    };
    
    const channel = setupSubscription();

    return () => {
      console.log('Cleaning up subscription');
      clearTimeout(retryTimeout);
      supabase.removeChannel(channel);
    };
  }, [date, subjectId, students, reconnectAttempts, onAttendanceUpdate]);

  return {
    attendance,
    setAttendance,
    lastUpdatedStudent,
    setLastUpdatedStudent,
    subscriptionStatus,
    reconnectAttempts
  };
};

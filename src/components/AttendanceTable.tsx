
import React, { useState, useEffect } from 'react';
import { Student } from '../lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '../lib/utils';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '../lib/toast';

interface AttendanceTableProps {
  students: Student[];
  date: string;
  subjectId: string;
  onAttendanceChange: (studentId: string, status: 'present' | 'absent') => void;
  initialAttendance?: Record<string, 'present' | 'absent'>;
  readOnly?: boolean;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  students,
  date,
  subjectId,
  onAttendanceChange,
  initialAttendance = {},
  readOnly = false
}) => {
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>(
    initialAttendance || {}
  );
  const [lastUpdatedStudent, setLastUpdatedStudent] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'connecting' | 'connected' | 'error' | 'reconnecting'>('connecting');
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
      
      const channel = supabase
        .channel(`attendance-changes-${date}-${subjectId}`)
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
  }, [date, subjectId, students, reconnectAttempts]);

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    if (readOnly) return;
    
    const newAttendance = {
      ...attendance,
      [studentId]: status
    };
    
    setAttendance(newAttendance);
    setLastUpdatedStudent(studentId);
    onAttendanceChange(studentId, status);
  };

  const getSubscriptionStatusMessage = () => {
    switch (subscriptionStatus) {
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
    switch (subscriptionStatus) {
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

  return (
    <div className="overflow-hidden rounded-md border border-border shadow-sm">
      {subscriptionStatus !== 'connected' && (
        <div className={cn("px-4 py-2 text-sm", getSubscriptionStatusClass())}>
          {getSubscriptionStatusMessage()}
        </div>
      )}
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">Roll No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p>No students found</p>
                  <p className="text-sm text-muted-foreground mt-1">Add students to mark attendance</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => {
              const status = attendance[student.id] || 'absent';
              const isPresent = status === 'present';
              const isHighlighted = lastUpdatedStudent === student.id;
              
              return (
                <TableRow 
                  key={student.id} 
                  className={cn(
                    'h-14 transition-all duration-300',
                    isPresent ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'bg-red-50/50 dark:bg-red-950/20',
                    isHighlighted && 'animate-pulse bg-opacity-80'
                  )}
                >
                  <TableCell className="font-medium">{student.roll_number}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {student.course} • Year {student.year} • Section {student.section}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'present')}
                        className={cn(
                          "px-3 py-1.5 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-1.5",
                          status === 'present'
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-transparent border border-emerald-500 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
                          readOnly && "pointer-events-none opacity-70"
                        )}
                        disabled={readOnly}
                        aria-label="Mark as present"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Present
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className={cn(
                          "px-3 py-1.5 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-1.5",
                          status === 'absent'
                            ? "bg-red-500 text-white shadow-sm"
                            : "bg-transparent border border-red-500 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20",
                          readOnly && "pointer-events-none opacity-70"
                        )}
                        disabled={readOnly}
                        aria-label="Mark as absent"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Absent
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;

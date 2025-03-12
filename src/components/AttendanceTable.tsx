
import React, { useState, useEffect } from 'react';
import { Student } from '../lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '../lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';
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

  // Update local state when initialAttendance prop changes
  useEffect(() => {
    setAttendance(initialAttendance || {});
  }, [initialAttendance]);

  // Subscribe to real-time updates for attendance changes
  useEffect(() => {
    console.log(`Subscribing to attendance updates for date: ${date}, subject: ${subjectId}`);
    
    const channel = supabase
      .channel('attendance-changes')
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
          if (payload.new && payload.new.date === date) {
            const { student_id, status } = payload.new;
            console.log(`Updating attendance for student ${student_id} to ${status}`);
            setAttendance(current => ({
              ...current,
              [student_id]: status as 'present' | 'absent'
            }));
            
            // Show a toast notification for the update
            const studentName = students.find(s => s.id === student_id)?.name || 'Student';
            toast.info(`${studentName}'s attendance updated to ${status}`);
          }
        }
      )
      .subscribe();

    console.log('Subscription created:', channel);

    return () => {
      console.log('Removing subscription');
      supabase.removeChannel(channel);
    };
  }, [date, subjectId, students]);

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    if (readOnly) return;
    
    const newAttendance = {
      ...attendance,
      [studentId]: status
    };
    
    setAttendance(newAttendance);
    onAttendanceChange(studentId, status);
  };

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Roll No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const status = attendance[student.id] || 'absent';
            const isPresent = status === 'present';
            
            return (
              <TableRow 
                key={student.id} 
                className={cn(
                  'h-14 transition-colors duration-200',
                  isPresent ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'bg-red-50/50 dark:bg-red-950/20'
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
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;

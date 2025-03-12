
import React, { useState, useEffect } from 'react';
import { Student } from '../lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '../lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

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

  // Update attendance when initialAttendance changes
  useEffect(() => {
    const updatedAttendance = { ...initialAttendance };
    
    // Set default status as absent for any student without a status
    students.forEach(student => {
      if (!updatedAttendance[student.id]) {
        updatedAttendance[student.id] = 'absent';
      }
    });
    
    setAttendance(updatedAttendance);
  }, [initialAttendance, students]);

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
                  'h-16',
                  isPresent ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'bg-red-50/50 dark:bg-red-950/20'
                )}
              >
                <TableCell className="font-medium">{student.roll_number}</TableCell>
                <TableCell>
                  <span className="font-medium">{student.name}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {student.course} • Year {student.year} • Section {student.section}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'present')}
                      className={cn(
                        "px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2",
                        status === 'present'
                          ? "bg-emerald-500 text-white shadow-md"
                          : "bg-transparent border border-emerald-500 text-emerald-700 hover:bg-emerald-50",
                        readOnly && "pointer-events-none opacity-70"
                      )}
                      disabled={readOnly}
                      aria-label="Mark as present"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'absent')}
                      className={cn(
                        "px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2",
                        status === 'absent'
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-transparent border border-red-500 text-red-700 hover:bg-red-50",
                        readOnly && "pointer-events-none opacity-70"
                      )}
                      disabled={readOnly}
                      aria-label="Mark as absent"
                    >
                      <XCircle className="h-4 w-4" />
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


import React, { useState, useEffect } from 'react';
import { Student } from '../lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '../lib/utils';

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
            <TableHead className="text-right">Attendance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const status = attendance[student.id] || 'absent';
            return (
              <TableRow key={student.id} className="h-16">
                <TableCell className="font-medium">{student.roll_number}</TableCell>
                <TableCell>
                  <span>{student.name}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'present')}
                      className={cn(
                        "px-4 py-2 rounded transition-colors text-sm font-medium",
                        status === 'present'
                          ? "bg-emerald-500 text-white"
                          : "bg-transparent border border-emerald-500 text-emerald-700 hover:bg-emerald-100",
                        readOnly && "pointer-events-none opacity-70"
                      )}
                      disabled={readOnly}
                      aria-label="Mark as present"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'absent')}
                      className={cn(
                        "px-4 py-2 rounded transition-colors text-sm font-medium",
                        status === 'absent'
                          ? "bg-red-500 text-white"
                          : "bg-transparent border border-red-500 text-red-700 hover:bg-red-100",
                        readOnly && "pointer-events-none opacity-70"
                      )}
                      disabled={readOnly}
                      aria-label="Mark as absent"
                    >
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

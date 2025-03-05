
import React, { useState } from 'react';
import { Student } from '../lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Check, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface AttendanceTableProps {
  students: Student[];
  date: string;
  subjectId: string;
  onAttendanceChange: (studentId: string, status: 'present' | 'absent') => void;
  initialAttendance?: Record<string, 'present' | 'absent'>;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  students,
  date,
  subjectId,
  onAttendanceChange,
  initialAttendance = {}
}) => {
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>(
    initialAttendance || {}
  );

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
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
            <TableHead className="w-[80px]">Roll No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Attendance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const status = attendance[student.id] || 'absent';
            return (
              <TableRow key={student.id} className="h-16">
                <TableCell className="font-medium">{student.rollNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img
                        src={student.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span>{student.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'present')}
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                        status === 'present'
                          ? "bg-emerald-500 text-white"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                      aria-label="Mark as present"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'absent')}
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                        status === 'absent'
                          ? "bg-red-500 text-white"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                      aria-label="Mark as absent"
                    >
                      <X className="h-4 w-4" />
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

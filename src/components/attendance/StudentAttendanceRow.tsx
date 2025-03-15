
import React from 'react';
import { Student } from '@/lib/types';
import { TableCell, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentAttendanceRowProps {
  student: Student;
  status: 'present' | 'absent';
  isHighlighted: boolean;
  readOnly: boolean;
  onStatusChange: (studentId: string, status: 'present' | 'absent') => void;
}

const StudentAttendanceRow: React.FC<StudentAttendanceRowProps> = ({
  student,
  status,
  isHighlighted,
  readOnly,
  onStatusChange
}) => {
  const isPresent = status === 'present';
  
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
            onClick={() => onStatusChange(student.id, 'present')}
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
            onClick={() => onStatusChange(student.id, 'absent')}
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
};

export default StudentAttendanceRow;

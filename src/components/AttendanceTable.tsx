
import React from 'react';
import { Student } from '../lib/types';
import { Table, TableBody } from './ui/table';
import { useRealTimeAttendance } from './attendance/useRealTimeAttendance';
import AttendanceStatusIndicator from './attendance/AttendanceStatusIndicator';
import AttendanceTableHeader from './attendance/AttendanceTableHeader';
import StudentAttendanceRow from './attendance/StudentAttendanceRow';
import EmptyStudentList from './attendance/EmptyStudentList';

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
  // Use the extracted hook for real-time attendance functionality
  const {
    attendance,
    lastUpdatedStudent,
    subscriptionStatus,
    reconnectAttempts
  } = useRealTimeAttendance({
    date,
    subjectId,
    students,
    initialAttendance,
    onAttendanceUpdate: onAttendanceChange
  });

  // Handler for attendance status changes
  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    if (readOnly) return;
    onAttendanceChange(studentId, status);
  };

  return (
    <div className="overflow-hidden rounded-md border border-border shadow-sm">
      <AttendanceStatusIndicator 
        status={subscriptionStatus} 
        reconnectAttempts={reconnectAttempts}
      />
      
      <Table>
        <AttendanceTableHeader />
        <TableBody>
          {students.length === 0 ? (
            <EmptyStudentList />
          ) : (
            students.map((student) => {
              const status = attendance[student.id] || 'absent';
              const isHighlighted = lastUpdatedStudent === student.id;
              
              return (
                <StudentAttendanceRow
                  key={student.id}
                  student={student}
                  status={status}
                  isHighlighted={isHighlighted}
                  readOnly={readOnly}
                  onStatusChange={handleAttendanceChange}
                />
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;

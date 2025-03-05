
import { AttendanceRecord } from './types';
import { attendanceRecords } from './mockData';

// Mark attendance for a given date, subject, and list of students
export const markAttendance = (
  date: string,
  subjectId: string,
  studentStatuses: { studentId: string; status: 'present' | 'absent' }[],
  markedById: string
): void => {
  // In a real app, this would send a request to the backend
  // For now, we'll update the mock data
  
  // Remove any existing records for this date and subject
  const filtered = attendanceRecords.filter(
    record => !(record.date === date && record.subjectId === subjectId)
  );
  
  // Add new records
  studentStatuses.forEach(({ studentId, status }) => {
    filtered.push({
      id: `${date}-${studentId}-${subjectId}`,
      date,
      studentId,
      subjectId,
      status,
      markedById,
      markedAt: new Date().toISOString(),
    });
  });
  
  // Update the global attendanceRecords array
  // Note: In a real app, this would be handled by a database
  attendanceRecords.length = 0;
  attendanceRecords.push(...filtered);
  
  console.log(`Attendance marked for ${date} and subject ${subjectId}`);
};

// Get attendance records for a specific student
export const getStudentAttendance = (
  studentId: string,
  startDate?: string,
  endDate?: string
): AttendanceRecord[] => {
  let records = attendanceRecords.filter(record => record.studentId === studentId);
  
  if (startDate) {
    records = records.filter(record => record.date >= startDate);
  }
  
  if (endDate) {
    records = records.filter(record => record.date <= endDate);
  }
  
  return records;
};

// Calculate attendance percentage for a student
export const calculateAttendancePercentage = (
  studentId: string,
  subjectId?: string
): number => {
  const records = attendanceRecords.filter(
    record => record.studentId === studentId && 
    (subjectId ? record.subjectId === subjectId : true)
  );
  
  if (records.length === 0) return 0;
  
  const present = records.filter(record => record.status === 'present').length;
  return Math.round((present / records.length) * 100);
};

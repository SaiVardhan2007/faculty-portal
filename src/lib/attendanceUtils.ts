
import { 
  Student, 
  Subject, 
  AttendanceRecord, 
  AttendanceSummary, 
  SubjectAttendance, 
  StudentAttendance 
} from './types';
import { subjects, attendanceRecords } from './mockData';

// Calculate overall attendance for a student
export const calculateOverallAttendance = (studentId: string): AttendanceSummary => {
  const studentRecords = attendanceRecords.filter(record => record.studentId === studentId);
  const totalClasses = studentRecords.length;
  const present = studentRecords.filter(record => record.status === 'present').length;
  const absent = totalClasses - present;
  const percentage = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;

  return {
    totalClasses,
    present,
    absent,
    percentage
  };
};

// Calculate attendance for a specific subject for a student
export const calculateSubjectAttendance = (studentId: string, subjectId: string): AttendanceSummary => {
  const subjectRecords = attendanceRecords.filter(
    record => record.studentId === studentId && record.subjectId === subjectId
  );
  
  const totalClasses = subjectRecords.length;
  const present = subjectRecords.filter(record => record.status === 'present').length;
  const absent = totalClasses - present;
  const percentage = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;

  return {
    totalClasses,
    present,
    absent,
    percentage
  };
};

// Get full attendance details for a student
export const getStudentAttendance = (student: Student): StudentAttendance => {
  const overall = calculateOverallAttendance(student.id);
  
  const subjectAttendance: SubjectAttendance[] = subjects.map(subject => {
    const summary = calculateSubjectAttendance(student.id, subject.id);
    
    return {
      subjectId: subject.id,
      subjectName: subject.name,
      subjectCode: subject.code,
      summary
    };
  });
  
  return {
    student,
    overall,
    subjects: subjectAttendance
  };
};

// Mark attendance for a specific date, subject and multiple students
export const markAttendance = (
  date: string, 
  subjectId: string, 
  studentStatuses: { studentId: string; status: 'present' | 'absent' }[],
  facultyId: string
): void => {
  // In a real app, this would send a request to the backend
  // For now, we'll update our mock data
  
  studentStatuses.forEach(({ studentId, status }) => {
    const existingIndex = attendanceRecords.findIndex(
      record => 
        record.date === date && 
        record.subjectId === subjectId && 
        record.studentId === studentId
    );
    
    const record: AttendanceRecord = {
      id: `${date}-${studentId}-${subjectId}`,
      date,
      studentId,
      subjectId,
      status,
      markedById: facultyId,
      markedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      attendanceRecords[existingIndex] = record;
    } else {
      attendanceRecords.push(record);
    }
  });
};

// Get subject by ID
export const getSubjectById = (subjectId: string): Subject | undefined => {
  return subjects.find(subject => subject.id === subjectId);
};

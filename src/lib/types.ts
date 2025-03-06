
// Core data models
export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  course: string;
  year: number;
  section: string;
  imageUrl?: string;
}

export interface Faculty {
  id: string;
  email: string;
  name: string;
  department: string;
  subjects: string[];
  password: string; // In a real app, this would be hashed and stored securely
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  facultyId: string;
  courseId: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  subjectId: string;
  status: 'present' | 'absent';
  markedById: string;
  markedAt: string;
}

export interface AttendanceSummary {
  totalClasses: number;
  present: number;
  absent: number;
  percentage: number;
}

export interface SubjectAttendance {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  summary: AttendanceSummary;
}

export interface StudentAttendance {
  student: Student;
  overall: AttendanceSummary;
  subjects: SubjectAttendance[];
}

// Auth related types
export interface AuthUser {
  id: string;
  email: string;
  role: 'faculty' | 'admin';
  name: string;
}

// Added new interface for attendance stats
export interface AttendanceStats {
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
}

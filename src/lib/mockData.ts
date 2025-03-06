
import { Student, Faculty, Subject, AttendanceRecord, AuthUser } from './types';
import { format } from 'date-fns';

// Mock Students - Empty array since we're using Supabase now
export const students: Student[] = [];

// Mock Faculty
export const faculty: Faculty[] = [
  {
    id: '1',
    email: 'rguktong.faculty@gmail.com',
    name: 'Dr. Amit Sharma',
    department: 'Computer Science',
    subjects: ['CS301', 'CS401'],
    password: 'o19.ong.rgukt',
  },
  {
    id: '2',
    email: 'rguktong.admin@gmail.com',
    name: 'Prof. Admin',
    department: 'Administration',
    subjects: ['CS201', 'CS302', 'CS301', 'CS401'],
    password: 'o19.rgukt.ong',
  },
];

// Mock Subjects - Empty array since we're using Supabase now
export const subjects: Subject[] = [];

// Generate empty mock attendance data
export const attendanceRecords: AttendanceRecord[] = [];

// Auth Functions (mock)
export const loginUser = (email: string, password: string): AuthUser | null => {
  const user = faculty.find(f => f.email === email && f.password === password);
  
  if (user) {
    return {
      id: user.id,
      email: user.email,
      role: user.email === 'rguktong.admin@gmail.com' ? 'admin' : 'faculty',
      name: user.name,
    };
  }
  
  return null;
};

export const getCurrentUser = (): AuthUser | null => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user: AuthUser | null): void => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

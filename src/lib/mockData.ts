
import { Student, Faculty, Subject, AttendanceRecord, AuthUser } from './types';
import { format } from 'date-fns';

// Mock Students
export const students: Student[] = [
  {
    id: '1',
    roll_number: 'O19CS001',
    name: 'Arun Kumar',
    course: 'B.Tech',
    year: 3,
    section: 'A',
  },
  {
    id: '2',
    roll_number: 'O19CS002',
    name: 'Priya Singh',
    course: 'B.Tech',
    year: 3,
    section: 'A',
  },
  {
    id: '3',
    roll_number: 'O19CS003',
    name: 'Rahul Sharma',
    course: 'B.Tech',
    year: 3,
    section: 'A',
  },
  {
    id: '4',
    roll_number: 'O19CS004',
    name: 'Nisha Patel',
    course: 'B.Tech',
    year: 3,
    section: 'A',
  },
  {
    id: '5',
    roll_number: 'O19CS005',
    name: 'Vikram Mehra',
    course: 'B.Tech',
    year: 3,
    section: 'A',
  },
  {
    id: '6',
    roll_number: 'O19CS006',
    name: 'Anjali Desai',
    course: 'B.Tech',
    year: 3,
    section: 'A',
  },
  {
    id: '7',
    roll_number: 'O19CS007',
    name: 'Sanjay Gupta',
    course: 'B.Tech',
    year: 3,
    section: 'A',
  },
  {
    id: '8',
    roll_number: 'O19CS008',
    name: 'Kavita Reddy',
    course: 'B.Tech',
    year: 3,
    section: 'A',
  },
  {
    id: '9',
    roll_number: 'O19CS009',
    name: 'Rohan Kapoor',
    course: 'B.Tech',
    year: 3,
    section: 'B',
  },
  {
    id: '10',
    roll_number: 'O19CS010',
    name: 'Meera Rajput',
    course: 'B.Tech',
    year: 3,
    section: 'B',
  },
];

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

// Mock Subjects
export const subjects: Subject[] = [
  {
    id: '1',
    code: 'CS201',
    name: 'Data Structures',
    faculty_id: '2',
    course_id: '1',
  },
  {
    id: '2',
    code: 'CS301',
    name: 'Database Systems',
    faculty_id: '1',
    course_id: '1',
  },
  {
    id: '3',
    code: 'CS302',
    name: 'Computer Networks',
    faculty_id: '2',
    course_id: '1',
  },
  {
    id: '4',
    code: 'CS401',
    name: 'Artificial Intelligence',
    faculty_id: '1',
    course_id: '1',
  },
];

// Generate mock attendance data for the last 30 days
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // For each subject
    subjects.forEach(subject => {
      // For each student
      students.forEach(student => {
        // 80% chance of being present
        const status = Math.random() > 0.2 ? 'present' : 'absent';
        records.push({
          id: `${dateStr}-${student.id}-${subject.id}`,
          date: dateStr,
          student_id: student.id,
          subject_id: subject.id,
          status: status as 'present' | 'absent',
          marked_by_id: subject.faculty_id,
          marked_at: new Date().toISOString(),
        });
      });
    });
  }
  
  return records;
};

export const attendanceRecords = generateMockAttendance();

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

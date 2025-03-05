import { Student, Faculty, Subject, AttendanceRecord, AuthUser } from './types';
import { format } from 'date-fns';

// Mock Students
export const students: Student[] = [
  {
    id: '1',
    rollNumber: 'CS21001',
    name: 'Arun Kumar',
    course: 'B.Tech',
    year: 3,
    section: 'A',
    imageUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    rollNumber: 'CS21002',
    name: 'Priya Singh',
    course: 'B.Tech',
    year: 3,
    section: 'A',
    imageUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '3',
    rollNumber: 'CS21003',
    name: 'Rahul Sharma',
    course: 'B.Tech',
    year: 3,
    section: 'A',
    imageUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    rollNumber: 'CS21004',
    name: 'Nisha Patel',
    course: 'B.Tech',
    year: 3,
    section: 'A',
    imageUrl: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    rollNumber: 'CS21005',
    name: 'Vikram Mehra',
    course: 'B.Tech',
    year: 3,
    section: 'A',
    imageUrl: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: '6',
    rollNumber: 'CS21006',
    name: 'Anjali Desai',
    course: 'B.Tech',
    year: 3,
    section: 'A',
    imageUrl: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: '7',
    rollNumber: 'CS21007',
    name: 'Sanjay Gupta',
    course: 'B.Tech',
    year: 3,
    section: 'A',
    imageUrl: 'https://i.pravatar.cc/150?img=7',
  },
  {
    id: '8',
    rollNumber: 'CS21008',
    name: 'Kavita Reddy',
    course: 'B.Tech',
    year: 3,
    section: 'A',
    imageUrl: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: '9',
    rollNumber: 'CS21009',
    name: 'Rohan Kapoor',
    course: 'B.Tech',
    year: 3,
    section: 'B',
    imageUrl: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '10',
    rollNumber: 'CS21010',
    name: 'Meera Rajput',
    course: 'B.Tech',
    year: 3,
    section: 'B',
    imageUrl: 'https://i.pravatar.cc/150?img=12',
  },
];

// Mock Faculty
export const faculty: Faculty[] = [
  {
    id: '1',
    email: 'dr.sharma@example.com',
    name: 'Dr. Amit Sharma',
    department: 'Computer Science',
    subjects: ['CS301', 'CS401'],
    password: 'password123', // In a real app, this would be hashed
  },
  {
    id: '2',
    email: 'prof.khan@example.com',
    name: 'Prof. Sarah Khan',
    department: 'Computer Science',
    subjects: ['CS201', 'CS302'],
    password: 'password123',
  },
];

// Mock Subjects
export const subjects: Subject[] = [
  {
    id: '1',
    code: 'CS201',
    name: 'Data Structures',
    facultyId: '2',
    courseId: '1',
  },
  {
    id: '2',
    code: 'CS301',
    name: 'Database Systems',
    facultyId: '1',
    courseId: '1',
  },
  {
    id: '3',
    code: 'CS302',
    name: 'Computer Networks',
    facultyId: '2',
    courseId: '1',
  },
  {
    id: '4',
    code: 'CS401',
    name: 'Artificial Intelligence',
    facultyId: '1',
    courseId: '1',
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
          studentId: student.id,
          subjectId: subject.id,
          status: status as 'present' | 'absent',
          markedById: subject.facultyId,
          markedAt: new Date().toISOString(),
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
      role: 'faculty',
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

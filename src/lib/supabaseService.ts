
import { supabase } from "@/integrations/supabase/client";
import { Student, Subject, AttendanceRecord, DbStudent, DbSubject, DbAttendanceRecord, AttendanceStats } from "./types";
import { toast } from "./toast";

// Convert DB student to app student model
export const mapDbStudentToStudent = (dbStudent: DbStudent): Student => ({
  id: dbStudent.id,
  roll_number: dbStudent.roll_number,
  name: dbStudent.name,
  course: dbStudent.course,
  year: dbStudent.year,
  section: dbStudent.section
});

// Convert app student to DB student model
export const mapStudentToDbStudent = (student: Partial<Student>): Partial<DbStudent> => ({
  ...(student.id && { id: student.id }),
  ...(student.roll_number && { roll_number: student.roll_number }),
  ...(student.name && { name: student.name }),
  ...(student.course && { course: student.course }),
  ...(student.year && { year: student.year }),
  ...(student.section && { section: student.section })
});

// Convert DB subject to app subject model
export const mapDbSubjectToSubject = (dbSubject: DbSubject): Subject => ({
  id: dbSubject.id,
  code: dbSubject.code || `SUB${Math.floor(Math.random() * 1000)}`,
  name: dbSubject.name,
  faculty_id: dbSubject.faculty_id,
  course_id: dbSubject.course_id
});

// Convert app subject to DB subject model
export const mapSubjectToDbSubject = (subject: Partial<Subject>): Partial<DbSubject> => ({
  ...(subject.id && { id: subject.id }),
  ...(subject.code && { code: subject.code }),
  ...(subject.name && { name: subject.name }),
  ...(subject.faculty_id && { faculty_id: subject.faculty_id }),
  ...(subject.course_id && { course_id: subject.course_id })
});

// Students API
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('roll_number', { ascending: true });
    
    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
    
    return (data as DbStudent[]).map(mapDbStudentToStudent);
  } catch (error) {
    console.error('Error fetching students:', error);
    toast.error('Failed to fetch students');
    return [];
  }
};

export const addStudent = async (student: Omit<Student, 'id'>): Promise<Student | null> => {
  try {
    console.log('Adding student:', student);
    
    const { data, error } = await supabase
      .from('students')
      .insert({
        roll_number: student.roll_number,
        name: student.name,
        course: student.course,
        year: student.year,
        section: student.section
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding student:', error);
      throw error;
    }
    
    console.log('Student added successfully:', data);
    return mapDbStudentToStudent(data as DbStudent);
  } catch (error: any) {
    console.error('Error adding student:', error);
    toast.error(`Failed to add student: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student | null> => {
  try {
    const dbUpdates = mapStudentToDbStudent(updates);
    
    const { data, error } = await supabase
      .from('students')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating student:', error);
      throw error;
    }
    
    return mapDbStudentToStudent(data as DbStudent);
  } catch (error: any) {
    console.error('Error updating student:', error);
    toast.error(`Failed to update student: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error deleting student:', error);
    toast.error(`Failed to delete student: ${error.message || 'Unknown error'}`);
    return false;
  }
};

// Subjects API
export const fetchSubjects = async (): Promise<Subject[]> => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
    
    return (data as DbSubject[]).map(mapDbSubjectToSubject);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    toast.error('Failed to fetch subjects');
    return [];
  }
};

export const addSubject = async (subject: { name: string; faculty_id: string; course_id: string }): Promise<Subject | null> => {
  try {
    console.log('Adding subject:', subject);
    
    const code = `SUB${Math.floor(Math.random() * 1000)}`;
    
    const { data, error } = await supabase
      .from('subjects')
      .insert({
        code,
        name: subject.name,
        faculty_id: subject.faculty_id,
        course_id: subject.course_id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding subject:', error);
      throw error;
    }
    
    console.log('Subject added successfully:', data);
    return mapDbSubjectToSubject(data as DbSubject);
  } catch (error: any) {
    console.error('Error adding subject:', error);
    toast.error(`Failed to add subject: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const updateSubject = async (id: string, updates: Partial<Subject>): Promise<Subject | null> => {
  try {
    const dbUpdates = mapSubjectToDbSubject(updates);
    
    const { data, error } = await supabase
      .from('subjects')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
    
    return mapDbSubjectToSubject(data as DbSubject);
  } catch (error: any) {
    console.error('Error updating subject:', error);
    toast.error(`Failed to update subject: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const deleteSubject = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error deleting subject:', error);
    toast.error(`Failed to delete subject: ${error.message || 'Unknown error'}`);
    return false;
  }
};

// Attendance API
export const fetchAttendanceRecords = async (date: string, subjectId: string): Promise<Record<string, 'present' | 'absent'>> => {
  try {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('date', date)
      .eq('subject_id', subjectId);
    
    if (error) throw error;
    
    const attendanceMap: Record<string, 'present' | 'absent'> = {};
    (data as DbAttendanceRecord[]).forEach(record => {
      attendanceMap[record.student_id] = record.status;
    });
    
    return attendanceMap;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    toast.error('Failed to fetch attendance records');
    return {};
  }
};

export const saveAttendance = async (
  date: string, 
  subjectId: string, 
  studentStatuses: { studentId: string; status: 'present' | 'absent' }[], 
  markedById: string
): Promise<boolean> => {
  try {
    // First, check if there are any students marked as present
    const presentStudents = studentStatuses.filter(student => student.status === 'present');
    
    // If no students are present, don't mark attendance for this day/subject
    if (presentStudents.length === 0) {
      console.log('No students present, not marking attendance for this class');
      toast.info('No students present, class not recorded');
      return true;
    }
    
    // Delete existing records for this date and subject
    await supabase
      .from('attendance_records')
      .delete()
      .eq('date', date)
      .eq('subject_id', subjectId);
    
    // Create new records
    const records = studentStatuses.map(({ studentId, status }) => ({
      date,
      subject_id: subjectId,
      student_id: studentId,
      status,
      marked_by_id: markedById,
      marked_at: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('attendance_records')
      .insert(records);
    
    if (error) throw error;
    
    toast.success('Attendance saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving attendance:', error);
    toast.error('Failed to save attendance');
    return false;
  }
};

export const calculateAttendanceStats = async (
  date: string, 
  subjectId: string, 
  totalStudentCount: number
): Promise<AttendanceStats> => {
  try {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('status')
      .eq('date', date)
      .eq('subject_id', subjectId);
    
    if (error) throw error;
    
    const presentCount = data.filter(record => record.status === 'present').length;
    
    return {
      totalStudents: totalStudentCount,
      presentStudents: presentCount,
      absentStudents: totalStudentCount - presentCount
    };
  } catch (error) {
    console.error('Error calculating attendance stats:', error);
    return {
      totalStudents: totalStudentCount,
      presentStudents: 0,
      absentStudents: 0
    };
  }
};

export const getStudentAttendanceSummary = async (studentId: string): Promise<{ 
  overall: { total: number, present: number },
  bySubject: Record<string, { total: number, present: number }> 
}> => {
  try {
    // Get all subjects to ensure we count subject days properly
    const { data: subjectsData, error: subjectsError } = await supabase
      .from('subjects')
      .select('id');
    
    if (subjectsError) throw subjectsError;
    
    // Get all dates where attendance was marked for any student for any subject
    const { data: allDatesData, error: allDatesError } = await supabase
      .rpc('get_class_days');
    
    if (allDatesError) throw allDatesError;
    
    // If we don't have a specific function, we can query distinct dates
    const allDates = allDatesData || [];
    
    // Get attendance records for this student
    const { data: studentAttendance, error: attendanceError } = await supabase
      .from('attendance_records')
      .select('subject_id, date, status')
      .eq('student_id', studentId);
    
    if (attendanceError) throw attendanceError;
    
    // For each subject, create a map of dates to attendance status
    const subjectDatesMap: Record<string, Record<string, string>> = {};
    const subjectIds = subjectsData.map(s => s.id);
    
    // Initialize the subject dates map
    subjectIds.forEach(subjectId => {
      subjectDatesMap[subjectId] = {};
    });
    
    // Fill in the attendance records we have
    studentAttendance.forEach(record => {
      if (!subjectDatesMap[record.subject_id]) {
        subjectDatesMap[record.subject_id] = {};
      }
      subjectDatesMap[record.subject_id][record.date] = record.status;
    });
    
    // For each subject, get the list of dates where any attendance was marked
    const subjectClassDates: Record<string, string[]> = {};
    
    // Get all dates where attendance was marked for each subject
    const { data: classDatesData, error: classDatesError } = await supabase
      .from('attendance_records')
      .select('subject_id, date')
      .order('date')
      .distinctOn('subject_id, date');
    
    if (classDatesError) throw classDatesError;
    
    // Group class dates by subject
    classDatesData.forEach(record => {
      if (!subjectClassDates[record.subject_id]) {
        subjectClassDates[record.subject_id] = [];
      }
      if (!subjectClassDates[record.subject_id].includes(record.date)) {
        subjectClassDates[record.subject_id].push(record.date);
      }
    });
    
    // Calculate attendance summary by subject
    const bySubject: Record<string, { total: number, present: number }> = {};
    let totalClasses = 0;
    let totalPresent = 0;
    
    // For each subject
    subjectIds.forEach(subjectId => {
      const classDates = subjectClassDates[subjectId] || [];
      const subjectAttendance = subjectDatesMap[subjectId] || {};
      
      let presentCount = 0;
      
      // For each class date for this subject
      classDates.forEach(date => {
        // If student was present on this date for this subject
        if (subjectAttendance[date] === 'present') {
          presentCount++;
        }
        // If no record exists for this student on this date, count as absent
        // (already handled since we're only counting present if there's a 'present' record)
      });
      
      bySubject[subjectId] = {
        total: classDates.length,
        present: presentCount
      };
      
      totalClasses += classDates.length;
      totalPresent += presentCount;
    });
    
    return {
      overall: { total: totalClasses, present: totalPresent },
      bySubject
    };
  } catch (error) {
    console.error('Error getting student attendance summary:', error);
    return {
      overall: { total: 0, present: 0 },
      bySubject: {}
    };
  }
};

// Calculate working days (days where attendance was marked)
export const calculateWorkingDays = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('date')
      .order('date')
      .distinctOn('date');
    
    if (error) throw error;
    
    return data.length;
  } catch (error) {
    console.error('Error calculating working days:', error);
    return 0;
  }
};

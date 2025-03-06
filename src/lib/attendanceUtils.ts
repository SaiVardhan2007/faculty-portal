
import { supabase } from "@/integrations/supabase/client";
import { Subject, AttendanceRecord } from "./types";

export async function fetchStudentAttendance(studentId: string) {
  try {
    // Get all attendance records for this student
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('student_id', studentId);
    
    if (attendanceError) throw attendanceError;

    // Get all subjects
    const { data: subjectsData, error: subjectsError } = await supabase
      .from('subjects')
      .select('*');
    
    if (subjectsError) throw subjectsError;

    // Process the data to create summary
    const records = attendanceData as AttendanceRecord[];
    const subjects = subjectsData as Subject[];
    
    // Create a map of subject ids to their details
    const subjectMap = new Map<string, Subject>();
    subjects.forEach(subject => {
      subjectMap.set(subject.id, subject);
    });
    
    // Group attendance records by subject_id
    const attendanceBySubject = new Map<string, AttendanceRecord[]>();
    records.forEach(record => {
      if (!attendanceBySubject.has(record.subject_id)) {
        attendanceBySubject.set(record.subject_id, []);
      }
      attendanceBySubject.get(record.subject_id)?.push(record);
    });
    
    // Calculate statistics for each subject
    let totalClasses = 0;
    let totalPresent = 0;
    
    const subjectStats = Array.from(attendanceBySubject.entries()).map(([subject_id, subjectRecords]) => {
      const subject = subjectMap.get(subject_id);
      if (!subject) return null; // Skip if subject not found
      
      const total = subjectRecords.length;
      const present = subjectRecords.filter(r => r.status === 'present').length;
      const absent = total - present;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      totalClasses += total;
      totalPresent += present;
      
      return {
        subjectId: subject_id,
        subjectName: subject.name,
        subjectCode: subject.code,
        summary: {
          totalClasses: total,
          present: present,
          absent: absent,
          percentage: percentage
        }
      };
    }).filter(Boolean);
    
    // Calculate overall percentage
    const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
    
    return {
      overall: {
        totalClasses,
        present: totalPresent,
        absent: totalClasses - totalPresent,
        percentage: overallPercentage
      },
      subjects: subjectStats
    };
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return {
      overall: { totalClasses: 0, present: 0, absent: 0, percentage: 0 },
      subjects: []
    };
  }
}

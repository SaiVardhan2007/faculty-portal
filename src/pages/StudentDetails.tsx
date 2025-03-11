
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import SubjectAttendanceCard from '../components/SubjectAttendanceCard';
import { ArrowLeft, CalendarDays, ClipboardList, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchStudents, fetchSubjects, getStudentAttendanceSummary } from '../lib/supabaseService';
import { AttendanceSummary } from '../lib/types';
import { Loader2 } from 'lucide-react';

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch student data
  const { 
    data: students = [],
    isLoading: isLoadingStudents 
  } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });
  
  // Fetch subjects
  const { 
    data: subjects = [],
    isLoading: isLoadingSubjects 
  } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  });
  
  // Fetch attendance data
  const { 
    data: attendanceData,
    isLoading: isLoadingAttendance,
    error: attendanceError
  } = useQuery({
    queryKey: ['studentAttendance', id],
    queryFn: () => getStudentAttendanceSummary(id || ''),
    enabled: !!id,
  });
  
  const student = students.find(s => s.id === id);
  
  const goBack = () => {
    navigate('/');
  };
  
  // Calculate attendance summaries
  const calculateSubjectAttendance = () => {
    if (!attendanceData || !subjects) return [];
    
    return subjects.map(subject => {
      const subjectData = attendanceData.bySubject[subject.id] || { total: 0, present: 0 };
      
      const summary: AttendanceSummary = {
        totalClasses: subjectData.total,
        present: subjectData.present,
        absent: subjectData.total - subjectData.present,
        percentage: subjectData.total > 0 
          ? Math.round((subjectData.present / subjectData.total) * 100) 
          : 0
      };
      
      return {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectCode: subject.code,
        summary
      };
    });
  };
  
  const overallAttendance: AttendanceSummary = attendanceData 
    ? {
        totalClasses: attendanceData.overall.total,
        present: attendanceData.overall.present,
        absent: attendanceData.overall.total - attendanceData.overall.present,
        percentage: attendanceData.overall.total > 0 
          ? Math.round((attendanceData.overall.present / attendanceData.overall.total) * 100) 
          : 0
      }
    : { totalClasses: 0, present: 0, absent: 0, percentage: 0 };
  
  const subjectAttendance = calculateSubjectAttendance();
  
  if (isLoadingStudents || isLoadingSubjects || isLoadingAttendance) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container px-4 py-10 mx-auto flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container px-4 py-10 mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
          <Button onClick={goBack}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container px-4 py-6 md:py-10 mx-auto">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={goBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Student Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{student.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="font-medium">{student.roll_number}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Course</p>
                    <p className="font-medium">{student.course}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{student.year}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Section</p>
                    <p className="font-medium">{student.section}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Overall Attendance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Present</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{overallAttendance.present}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Absent</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overallAttendance.absent}</p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-950/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Attendance %</p>
                    <p className="text-2xl font-bold text-primary">{overallAttendance.percentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Subject-wise Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subjects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No subjects found. Add subjects in the Admin dashboard.
                  </div>
                ) : subjectAttendance.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No attendance records found for this student.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjectAttendance.map((subject) => (
                      <SubjectAttendanceCard 
                        key={subject.subjectId}
                        subject={subject.subjectName}
                        code={subject.subjectCode}
                        attendance={subject.summary}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;

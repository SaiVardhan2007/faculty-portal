
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { students, subjects, attendanceRecords } from '../lib/mockData';
import { Student, SubjectAttendance } from '../lib/types';
import Header from '../components/Header';
import SubjectAttendanceCard from '../components/SubjectAttendanceCard';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, UserCheck, UserX } from 'lucide-react';
import { cn } from '../lib/utils';

const calculateAttendanceForSubject = (studentId: string, subjectId: string) => {
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

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);
  const [overallAttendance, setOverallAttendance] = useState({
    totalClasses: 0,
    present: 0,
    absent: 0,
    percentage: 0
  });
  
  useEffect(() => {
    if (!id) return;
    
    // Find student
    const foundStudent = students.find(s => s.id === id);
    if (foundStudent) {
      setStudent(foundStudent);
      
      // Calculate attendance for each subject
      const subjectsData = subjects.map(subject => {
        const summary = calculateAttendanceForSubject(id, subject.id);
        
        return {
          subjectId: subject.id,
          subjectName: subject.name,
          subjectCode: subject.code,
          summary
        };
      });
      
      setSubjectAttendance(subjectsData);
      
      // Calculate overall attendance
      const totalClasses = subjectsData.reduce((sum, subject) => sum + subject.summary.totalClasses, 0);
      const totalPresent = subjectsData.reduce((sum, subject) => sum + subject.summary.present, 0);
      const totalAbsent = totalClasses - totalPresent;
      const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
      
      setOverallAttendance({
        totalClasses,
        present: totalPresent,
        absent: totalAbsent,
        percentage: overallPercentage
      });
    }
  }, [id]);
  
  if (!student) {
    return <div className="p-8 text-center">Student not found</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container px-4 py-6 md:py-10 mx-auto animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Students
          </Button>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/3">
              <Card className="backdrop-blur-card glass-card dark:glass-card-dark overflow-hidden">
                <div className="bg-primary/5 pt-8 pb-4 px-4 text-center">
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-background">
                    <img 
                      src={student.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold mt-4">{student.name}</h2>
                  <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Course</span>
                      <span className="font-medium">{student.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year</span>
                      <span className="font-medium">{student.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Section</span>
                      <span className="font-medium">{student.section}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-2/3">
              <Card className="backdrop-blur-card glass-card dark:glass-card-dark mb-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Overall Attendance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-lg">
                      <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Classes</p>
                        <p className="text-xl font-bold">{overallAttendance.totalClasses}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-emerald-500/10 p-4 rounded-lg">
                      <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Present</p>
                        <p className="text-xl font-bold text-emerald-500">{overallAttendance.present}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-red-500/10 p-4 rounded-lg">
                      <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center">
                        <UserX className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Absent</p>
                        <p className="text-xl font-bold text-red-500">{overallAttendance.absent}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Attendance Percentage</span>
                      <span className={cn(
                        "font-bold",
                        overallAttendance.percentage >= 75 ? "text-emerald-500" : 
                        overallAttendance.percentage >= 60 ? "text-amber-500" : "text-red-500"
                      )}>
                        {overallAttendance.percentage}%
                      </span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full",
                          overallAttendance.percentage >= 75 ? "bg-emerald-500" : 
                          overallAttendance.percentage >= 60 ? "bg-amber-500" : "bg-red-500"
                        )}
                        style={{ width: `${overallAttendance.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <h3 className="text-xl font-bold mb-4">Subject-wise Attendance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectAttendance.map((subject, index) => (
                  <SubjectAttendanceCard 
                    key={subject.subjectId} 
                    subject={subject} 
                    className="animate-scale-in"
                    animationDelay={`${index * 0.1}s`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;

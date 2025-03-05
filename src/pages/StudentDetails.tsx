
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { students } from '../lib/mockData';
import { getStudentAttendance } from '../lib/attendanceUtils';
import AttendanceStatusCard from '../components/AttendanceStatusCard';
import SubjectAttendanceCard from '../components/SubjectAttendanceCard';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const student = useMemo(() => {
    return students.find(s => s.id === id);
  }, [id]);
  
  const attendance = useMemo(() => {
    if (!student) return null;
    return getStudentAttendance(student);
  }, [student]);
  
  if (!student || !attendance) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
        <Button onClick={() => navigate('/')}>Back to Students</Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container px-4 py-6 md:py-10 mx-auto animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 -ml-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-primary/20">
              <img 
                src={student.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {student.rollNumber}
                </span>
                <span className="text-sm font-medium bg-secondary px-2 py-0.5 rounded-full">
                  {student.course}
                </span>
                <span className="text-sm font-medium bg-secondary px-2 py-0.5 rounded-full">
                  Year {student.year}
                </span>
                <span className="text-sm font-medium bg-secondary px-2 py-0.5 rounded-full">
                  Section {student.section}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
              <p className="text-muted-foreground mt-1">Attendance Details</p>
            </div>
          </div>
          
          <div className="mb-10">
            <AttendanceStatusCard 
              title="Overall Attendance"
              summary={attendance.overall} 
              className="animate-slide-up" 
            />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Subject-wise Attendance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {attendance.subjects.map((subject, index) => (
              <SubjectAttendanceCard 
                key={subject.subjectId} 
                subject={subject} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;

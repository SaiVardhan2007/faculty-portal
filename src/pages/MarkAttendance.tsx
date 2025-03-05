
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { students, subjects, faculty } from '../lib/mockData';
import { markAttendance } from '../lib/attendanceUtils';
import AttendanceTable from '../components/AttendanceTable';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CalendarIcon, LucideLoader2, Save } from 'lucide-react';
import { toast } from '../lib/toast';
import { cn } from '../lib/utils';

const MarkAttendance: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [subjectId, setSubjectId] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent'>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Get faculty's subjects
  const facultyMember = faculty.find(f => f.id === user?.id);
  const facultySubjects = subjects.filter(s => 
    facultyMember?.subjects.includes(s.code)
  );
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Set default subject
  useEffect(() => {
    if (facultySubjects.length > 0 && !subjectId) {
      setSubjectId(facultySubjects[0].id);
    }
  }, [facultySubjects, subjectId]);
  
  // Reset attendance data when subject or date changes
  useEffect(() => {
    setAttendanceData({});
  }, [subjectId, date]);
  
  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  const handleSave = async () => {
    if (!date || !subjectId || !user) {
      toast.error('Please select date and subject');
      return;
    }
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Prepare student statuses
    const studentStatuses = Object.entries(attendanceData).map(([studentId, status]) => ({
      studentId,
      status
    }));
    
    // If some students don't have attendance marked, mark them absent by default
    const allStudentStatuses = students.map(student => {
      const existingStatus = studentStatuses.find(s => s.studentId === student.id);
      return existingStatus || { studentId: student.id, status: 'absent' as const };
    });
    
    setIsSaving(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      markAttendance(dateStr, subjectId, allStudentStatuses, user.id);
      
      toast.success('Attendance saved successfully');
      
      // Reset state
      setAttendanceData({});
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container px-4 py-6 md:py-10 mx-auto animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Mark Attendance</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the subject, date, and mark attendance for all students
            </p>
          </div>
          
          <Card className="mb-8 backdrop-blur-card glass-card dark:glass-card-dark">
            <CardHeader>
              <CardTitle className="text-xl">Select Class Details</CardTitle>
              <CardDescription>Choose the subject and date to mark attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {facultySubjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.code} - {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {subjectId && date && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Student Attendance</h2>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || Object.keys(attendanceData).length === 0}
                >
                  {isSaving ? (
                    <>
                      <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Attendance
                    </>
                  )}
                </Button>
              </div>
              
              <AttendanceTable
                students={students}
                date={format(date, 'yyyy-MM-dd')}
                subjectId={subjectId}
                onAttendanceChange={handleAttendanceChange}
                initialAttendance={attendanceData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;

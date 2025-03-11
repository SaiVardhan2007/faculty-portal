
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceStats from '../components/AttendanceStats';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CalendarIcon, Loader2, Save, AlertCircle, Info } from 'lucide-react';
import { toast } from '../lib/toast';
import { cn } from '../lib/utils';
import { 
  fetchStudents, 
  fetchSubjects, 
  fetchAttendanceRecords, 
  saveAttendance, 
  calculateAttendanceStats 
} from '../lib/supabaseService';

const MarkAttendance: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [subjectId, setSubjectId] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent'>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({ totalStudents: 0, presentStudents: 0, absentStudents: 0 });
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  // Get all students
  const { 
    data: students = [], 
    isLoading: isLoadingStudents 
  } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents
  });
  
  // Get all subjects
  const { 
    data: subjects = [], 
    isLoading: isLoadingSubjects 
  } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  });

  // Get existing attendance records for selected date and subject
  const { 
    data: existingAttendance = {},
    isLoading: isLoadingAttendance,
    refetch: refetchAttendance
  } = useQuery({
    queryKey: ['attendance', date ? format(date, 'yyyy-MM-dd') : '', subjectId],
    queryFn: () => fetchAttendanceRecords(
      date ? format(date, 'yyyy-MM-dd') : '', 
      subjectId
    ),
    enabled: !!date && !!subjectId,
  });

  // Save attendance mutation
  const saveAttendanceMutation = useMutation({
    mutationFn: ({
      date,
      subjectId,
      attendanceData,
      userId
    }: {
      date: string;
      subjectId: string;
      attendanceData: Record<string, 'present' | 'absent'>;
      userId: string;
    }) => {
      // Convert the attendanceData object to an array of student statuses
      const studentStatuses = students.map(student => ({
        studentId: student.id,
        status: attendanceData[student.id] || 'absent'
      }));
      
      return saveAttendance(date, subjectId, studentStatuses, userId);
    },
    onSuccess: () => {
      // Invalidate all potentially affected queries
      queryClient.invalidateQueries({ 
        queryKey: ['attendance'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['studentAttendance'] 
      });
      queryClient.invalidateQueries({
        queryKey: ['workingDays']
      });
      toast.success('Attendance saved successfully');
    }
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
    
  // Initialize default attendance to absent for all students when subject changes
  useEffect(() => {
    if (subjectId && students.length > 0) {
      const defaultAbsentAttendance: Record<string, 'present' | 'absent'> = {};
      students.forEach(student => {
        defaultAbsentAttendance[student.id] = 'absent';
      });
      
      // Merge with existing attendance data (if any)
      if (!isLoadingAttendance && Object.keys(existingAttendance).length > 0) {
        setAttendanceData({...defaultAbsentAttendance, ...existingAttendance});
      } else {
        setAttendanceData(defaultAbsentAttendance);
      }
      
      // Update stats
      const presentCount = Object.values(existingAttendance).filter(status => status === 'present').length;
      setStats({
        totalStudents: students.length,
        presentStudents: presentCount,
        absentStudents: students.length - presentCount
      });
    } else {
      setAttendanceData({});
      setStats({ totalStudents: 0, presentStudents: 0, absentStudents: 0 });
    }
  }, [subjectId, students, existingAttendance, isLoadingAttendance]);
  
  // Check if the selected date is today or in the past (to determine if readOnly mode)
  useEffect(() => {
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      
      const isPastDate = selectedDate < today;
      const isFutureDate = selectedDate > today;
      
      // Set read-only mode if the date is in the past
      setIsReadOnly(isPastDate || isFutureDate);
    }
  }, [date]);

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    const newAttendanceData = {
      ...attendanceData,
      [studentId]: status
    };
    
    setAttendanceData(newAttendanceData);
    
    // Update stats immediately
    const presentCount = Object.values(newAttendanceData).filter(s => s === 'present').length;
    setStats({
      totalStudents: students.length,
      presentStudents: presentCount,
      absentStudents: students.length - presentCount
    });
  };
  
  const handleSave = async () => {
    if (!date || !subjectId || !user) {
      toast.error('Please select date and subject');
      return;
    }
    
    // Check if selected date is today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    const isToday = selectedDate.getTime() === today.getTime();
      
    if (!isToday) {
      toast.error('You can only mark attendance for today');
      return;
    }
    
    // Check if any student is marked as present
    const anyPresent = Object.values(attendanceData).some(status => status === 'present');
    
    if (!anyPresent) {
      toast.warning('No students are marked present. This class will not be counted.');
    }
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    setIsSaving(true);
    
    try {
      await saveAttendanceMutation.mutateAsync({
        date: dateStr,
        subjectId,
        attendanceData,
        userId: user.id
      });
      
      // Refetch attendance after saving
      refetchAttendance();
    } catch (error) {
      console.error('Failed to save attendance:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubjectChange = (value: string) => {
    setSubjectId(value);
    // Reset attendance data when subject changes
    setAttendanceData({});
  };
  
  const canMarkAttendance = date ? (
    (() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      
      return today.getTime() === selectedDate.getTime();
    })()
  ) : false;
  
  const isLoading = isLoadingStudents || isLoadingSubjects;
  
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
                  <Select value={subjectId} onValueChange={handleSubjectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingSubjects ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : subjects.length === 0 ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          No subjects available
                        </div>
                      ) : (
                        subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.code} - {subject.name}
                          </SelectItem>
                        ))
                      )}
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
              {isReadOnly && (
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {canMarkAttendance ? (
                      "You are viewing today's attendance. You can make changes and save."
                    ) : (
                      "You are viewing attendance records in read-only mode. To mark attendance, select today's date."
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              <AttendanceStats {...stats} />
              
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Student Attendance</h2>
                {canMarkAttendance && (
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving || students.length === 0}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Attendance
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No students found. Please add students in the admin panel.
                </div>
              ) : (
                <AttendanceTable
                  students={students}
                  date={format(date, 'yyyy-MM-dd')}
                  subjectId={subjectId}
                  onAttendanceChange={handleAttendanceChange}
                  initialAttendance={attendanceData}
                  readOnly={!canMarkAttendance}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;

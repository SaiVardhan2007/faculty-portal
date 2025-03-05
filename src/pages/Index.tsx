
import React, { useState } from 'react';
import { students } from '../lib/mockData';
import StudentCard from '../components/StudentCard';
import { Input } from '../components/ui/input';
import Header from '../components/Header';
import { Search, UserCheck, Calendar, Book } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const goToMarkAttendance = () => {
    navigate('/mark-attendance');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container px-4 py-6 md:py-10 mx-auto animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Student Attendance Portal</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              View attendance records for all students. Click on a student to see detailed attendance information.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="backdrop-blur-card glass-card dark:glass-card-dark hover-scale">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Total Students</h3>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-card glass-card dark:glass-card-dark hover-scale">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Working Days</h3>
                  <p className="text-2xl font-bold">22</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-card glass-card dark:glass-card-dark hover-scale">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center">
                  <Book className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Subjects</h3>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full md:w-auto md:min-w-[320px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/70 shadow-sm"
              />
            </div>
            
            <Button onClick={goToMarkAttendance} className="w-full md:w-auto">
              <Calendar className="mr-2 h-4 w-4" />
              Mark Attendance
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            {filteredStudents.map((student, index) => (
              <StudentCard 
                key={student.id} 
                student={student} 
                className="animate-scale-in" 
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))}
            
            {filteredStudents.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No students found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

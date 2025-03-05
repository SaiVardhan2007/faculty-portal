
import React, { useState } from 'react';
import { students } from '../lib/mockData';
import StudentCard from '../components/StudentCard';
import { Input } from '../components/ui/input';
import Header from '../components/Header';
import { Search } from 'lucide-react';

const Index: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          
          <div className="relative mb-8 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/70 shadow-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} className="animate-scale-in" />
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


import React from 'react';
import { Student } from '../lib/types';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import { Badge } from './ui/badge';

interface StudentCardProps {
  student: Student;
  className?: string;
  style?: React.CSSProperties;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, className, style }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/student/${student.id}`);
  };
  
  return (
    <Card 
      onClick={handleClick}
      className={cn(
        'overflow-hidden backdrop-blur-card glass-card transform transition-all duration-300',
        'hover:scale-105 cursor-pointer border border-gray-200/50',
        'dark:glass-card-dark dark:border-gray-800/50 h-full shadow-lg hover:shadow-xl',
        className
      )}
      style={style}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar/Icon with gradient background */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          
          {/* Roll Number Badge */}
          <Badge variant="outline" className="bg-primary/5 text-primary font-medium px-4 py-1">
            {student.roll_number}
          </Badge>
          
          {/* Name */}
          <h3 className="text-xl font-semibold tracking-tight">{student.name}</h3>
          
          {/* Course Info with Icons */}
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>{student.course}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>Year {student.year} • Section {student.section}</span>
            </div>
          </div>
          
          {/* View Profile Button */}
          <div className="pt-2 w-full">
            <div className="text-sm px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/20 text-primary rounded-full hover:from-primary/20 hover:to-primary/30 transition-all font-medium">
              View Full Profile
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;

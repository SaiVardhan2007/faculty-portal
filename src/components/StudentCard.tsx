
import React from 'react';
import { Student } from '../lib/types';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { GraduationCap, Users } from 'lucide-react';
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
        'overflow-hidden backdrop-blur-card glass-card hover:scale-105 cursor-pointer transition-all duration-300',
        'border border-gray-200 dark:glass-card-dark dark:border-gray-800 h-full shadow-sm hover:shadow-md',
        className
      )}
      style={style}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar/Icon */}
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8" />
          </div>
          
          {/* Roll Number */}
          <Badge variant="outline" className="bg-primary/5 text-primary px-3 py-1 text-xs">
            {student.roll_number}
          </Badge>
          
          {/* Name */}
          <h3 className="text-lg font-semibold">{student.name}</h3>
          
          {/* Course Info */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{student.course} • Year {student.year} • Section {student.section}</span>
          </div>
          
          {/* View Profile Button */}
          <div className="mt-2 w-full">
            <div className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
              View Profile
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;

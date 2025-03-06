
import React from 'react';
import { Student } from '../lib/types';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

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
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="text-xl font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg w-full">
            {student.roll_number}
          </span>
          
          <h3 className="text-lg font-medium mt-1">{student.name}</h3>
          
          <div className="flex items-center justify-center text-xs text-muted-foreground mt-1 bg-background/80 rounded-full px-3 py-1">
            <span>{student.course} • Year {student.year} • Section {student.section}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;

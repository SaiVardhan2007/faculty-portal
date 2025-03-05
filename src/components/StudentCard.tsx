
import React from 'react';
import { Student } from '../lib/types';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface StudentCardProps {
  student: Student;
  className?: string;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, className }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/student/${student.id}`);
  };
  
  return (
    <Card 
      onClick={handleClick}
      className={cn(
        'overflow-hidden backdrop-blur-card glass-card hover-scale cursor-pointer transition-all duration-300',
        'border border-gray-200 dark:glass-card-dark dark:border-gray-800',
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4 gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800">
            <img 
              src={student.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
              alt={student.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {student.rollNumber}
              </span>
            </div>
            <h3 className="text-base font-medium mt-1">{student.name}</h3>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>{student.course} • Year {student.year} • Section {student.section}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;

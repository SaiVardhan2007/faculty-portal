
import React from 'react';
import { Student } from '../lib/types';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { UserCircle2 } from 'lucide-react';

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
        'overflow-hidden backdrop-blur-card glass-card hover-scale cursor-pointer transition-all duration-300',
        'border border-gray-200 dark:glass-card-dark dark:border-gray-800',
        className
      )}
      style={style}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4 gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 bg-primary/5">
            {student.imageUrl ? (
              <img 
                src={student.imageUrl} 
                alt={student.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary">
                <UserCircle2 className="w-8 h-8" />
              </div>
            )}
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

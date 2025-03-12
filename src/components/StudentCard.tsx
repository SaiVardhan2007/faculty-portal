
import React from 'react';
import { Student } from '../lib/types';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { GraduationCap } from 'lucide-react';
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
        'hover:scale-102 cursor-pointer border border-gray-200/50',
        'dark:glass-card-dark dark:border-gray-800/50 shadow hover:shadow-md',
        className
      )}
      style={style}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20 shrink-0">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-semibold tracking-tight truncate">{student.name}</h3>
            <Badge variant="outline" className="w-fit text-xs mt-1">
              {student.roll_number}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {student.course} • Year {student.year} • Section {student.section}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;

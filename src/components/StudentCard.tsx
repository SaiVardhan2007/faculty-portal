
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
  showAttendanceStatus?: boolean;
  attendanceStatus?: 'present' | 'absent' | null;
}

const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  className, 
  style,
  showAttendanceStatus = false,
  attendanceStatus = null
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/student/${student.id}`);
  };
  
  return (
    <Card 
      onClick={handleClick}
      className={cn(
        'overflow-hidden backdrop-blur-card glass-card cursor-pointer border border-gray-200/50',
        'hover:scale-102 hover:shadow-md transition-all duration-200',
        'dark:glass-card-dark dark:border-gray-800/50',
        showAttendanceStatus && attendanceStatus === 'present' && 'border-l-4 border-l-emerald-500',
        showAttendanceStatus && attendanceStatus === 'absent' && 'border-l-4 border-l-red-500',
        className
      )}
      style={style}
    >
      <CardContent className="p-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20 shrink-0">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-semibold tracking-tight truncate">{student.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-fit text-xs mt-0.5 px-1.5 py-0 h-5">
                {student.roll_number}
              </Badge>
              {showAttendanceStatus && attendanceStatus && (
                <Badge 
                  variant={attendanceStatus === 'present' ? 'default' : 'destructive'} 
                  className="w-fit text-xs mt-0.5 px-1.5 py-0 h-5 opacity-90"
                >
                  {attendanceStatus === 'present' ? 'Present' : 'Absent'}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {student.course} • Year {student.year} • Section {student.section}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;

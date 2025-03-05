
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';
import { SubjectAttendance } from '../lib/types';
import { Progress } from './ui/progress';

interface SubjectAttendanceCardProps {
  subject: SubjectAttendance;
  className?: string;
}

const SubjectAttendanceCard: React.FC<SubjectAttendanceCardProps> = ({ subject, className }) => {
  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return 'text-emerald-500';
    if (percentage >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className={cn('hover-scale backdrop-blur-card glass-card dark:glass-card-dark', className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {subject.subjectCode}
            </span>
            <CardTitle className="text-base font-medium mt-1">{subject.subjectName}</CardTitle>
          </div>
          <span className={cn(
            "text-lg font-medium",
            getStatusColor(subject.summary.percentage)
          )}>
            {subject.summary.percentage}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Progress 
          value={subject.summary.percentage} 
          className="h-2 mb-3"
          indicatorClassName={getProgressColor(subject.summary.percentage)}
        />
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-secondary rounded-md">
            <p className="text-muted-foreground">Total</p>
            <p className="font-medium">{subject.summary.totalClasses}</p>
          </div>
          <div className="text-center p-2 bg-emerald-500/10 rounded-md">
            <p className="text-muted-foreground">Present</p>
            <p className="font-medium text-emerald-500">{subject.summary.present}</p>
          </div>
          <div className="text-center p-2 bg-red-500/10 rounded-md">
            <p className="text-muted-foreground">Absent</p>
            <p className="font-medium text-red-500">{subject.summary.absent}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectAttendanceCard;

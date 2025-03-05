
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AttendanceSummary } from '../lib/types';

interface AttendanceStatusCardProps {
  title: string;
  summary: AttendanceSummary;
  className?: string;
  subText?: string;
}

const AttendanceStatusCard: React.FC<AttendanceStatusCardProps> = ({ 
  title, 
  summary, 
  className,
  subText
}) => {
  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return 'text-emerald-500';
    if (percentage >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Card className={cn('backdrop-blur-card glass-card dark:glass-card-dark', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {subText && <p className="text-sm text-muted-foreground">{subText}</p>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <div className="w-full aspect-square max-w-[120px] mx-auto">
              <CircularProgressbar
                value={summary.percentage}
                text={`${summary.percentage}%`}
                styles={buildStyles({
                  textSize: '1.5rem',
                  pathColor: getProgressColor(summary.percentage),
                  textColor: getProgressColor(summary.percentage),
                  trailColor: 'rgba(200, 200, 200, 0.3)',
                })}
              />
            </div>
          </div>
          
          <div className="col-span-2 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Classes</p>
                <p className="text-lg font-medium">{summary.totalClasses}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-lg font-medium text-emerald-500">{summary.present}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-lg font-medium text-red-500">{summary.absent}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className={cn("text-lg font-medium", getStatusColor(summary.percentage))}>
                  {summary.percentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceStatusCard;

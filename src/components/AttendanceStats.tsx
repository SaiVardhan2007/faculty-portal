
import React from 'react';
import { Card, CardContent } from './ui/card';
import { Users, UserCheck, UserX } from 'lucide-react';

interface AttendanceStatsProps {
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  totalStudents,
  presentStudents,
  absentStudents
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="backdrop-blur-card glass-card dark:glass-card-dark border-primary/20">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Students</p>
            <h3 className="text-2xl font-bold">{totalStudents}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-card glass-card dark:glass-card-dark border-emerald-500/20">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="bg-emerald-100 p-3 rounded-full">
            <UserCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Present</p>
            <h3 className="text-2xl font-bold">{presentStudents}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-card glass-card dark:glass-card-dark border-red-500/20">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="bg-red-100 p-3 rounded-full">
            <UserX className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Absent</p>
            <h3 className="text-2xl font-bold">{absentStudents}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;

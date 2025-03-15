
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AttendanceTableHeader: React.FC = () => {
  return (
    <TableHeader className="bg-muted/50">
      <TableRow>
        <TableHead className="w-[100px]">Roll No.</TableHead>
        <TableHead>Name</TableHead>
        <TableHead className="text-right">Status</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AttendanceTableHeader;

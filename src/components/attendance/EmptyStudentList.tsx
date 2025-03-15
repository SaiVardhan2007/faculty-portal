
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';

const EmptyStudentList: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={3} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>No students found</p>
          <p className="text-sm text-muted-foreground mt-1">Add students to mark attendance</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyStudentList;

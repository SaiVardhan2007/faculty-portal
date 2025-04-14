
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

const EmptyStudentList: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={3} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">No students found</p>
          <p className="text-xs text-muted-foreground">
            Try selecting a different subject or adding students first
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyStudentList;

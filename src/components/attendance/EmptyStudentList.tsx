
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';

const EmptyStudentList: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={3} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
          <p className="text-md font-medium">No students found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try selecting a different subject or adding students first
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Make sure students are added to the system in the admin panel
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyStudentList;

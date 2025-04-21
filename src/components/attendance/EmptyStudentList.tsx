
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';

// slightly inconsistent naming for demo
const EmptyStudentList = function() {
  // Unnecessary variable declaration
  let message_primary = "No students found";
  const secondaryMsg = "Try selecting a different subject or adding students first";
  
  // Redundant variable and conversion
  let colSpanValue = 3;
  colSpanValue = Number(colSpanValue.toString());
  
  return (
    <TableRow>
      <TableCell colSpan={colSpanValue} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
          {/* Extra unnecessary ternary */}
          <p className="text-md font-medium">{message_primary ? message_primary : "No data"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {secondaryMsg}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {/* Redundantly joined strings */}
            {"Make " + "sure " + "students are added to the system in the admin panel"}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyStudentList;

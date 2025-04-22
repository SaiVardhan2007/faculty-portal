import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { toast } from "@/lib/toast";
import { StudentRequest } from "@/lib/types";
import { Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addStudent } from "@/lib/supabaseService";

const AdminDashboardFooter = () => {
  const queryClient = useQueryClient();

  // Fetch student requests with proper typing
  const { data: studentRequests = [], isLoading } = useQuery<StudentRequest[]>({
    queryKey: ['studentRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Add student mutation with proper typing
  const addStudentMutation = useMutation({
    mutationFn: async (request: StudentRequest) => {
      const { data: existingStudent } = await supabase
        .from('students')
        .select('roll_number')
        .eq('roll_number', request.roll_number)
        .single();

      if (existingStudent) {
        toast.error(`Student with roll number ${request.roll_number} already exists`);
        return;
      }

      await addStudent({
        roll_number: request.roll_number,
        name: request.name,
        course: 'B.Tech',
        year: 3,
        section: 'A'
      });

      await supabase
        .from('student_requests')
        .delete()
        .eq('id', request.id);

      toast.success('Student added successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentRequests'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });

  // Delete request mutation with proper typing
  const deleteRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('student_requests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentRequests'] });
      toast.success('Request deleted');
    }
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Student Credential Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading requests...</div>
        ) : studentRequests.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No pending requests</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.roll_number}</TableCell>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => addStudentMutation.mutate(request)}
                        disabled={addStudentMutation.isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteRequestMutation.mutate(request.id)}
                        disabled={deleteRequestMutation.isPending}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDashboardFooter;

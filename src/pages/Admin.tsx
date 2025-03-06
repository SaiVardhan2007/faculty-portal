
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Trash, Edit, Save, Loader2 } from 'lucide-react';
import { toast } from '../lib/toast';
import { 
  fetchStudents, 
  fetchSubjects, 
  addStudent, 
  updateStudent, 
  deleteStudent,
  addSubject,
  updateSubject,
  deleteSubject
} from '../lib/supabaseService';

const Admin: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [newStudent, setNewStudent] = useState({
    roll_number: '',
    name: '',
    course: 'B.Tech',
    year: 3,
    section: 'A'
  });
  
  const [newSubject, setNewSubject] = useState({
    code: '',
    name: '',
  });
  
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState({
    roll_number: '',
    name: '',
  });
  
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState({
    code: '',
    name: '',
  });

  // Fetch students
  const { 
    data: studentsList = [],
    isLoading: isLoadingStudents,
    error: studentsError
  } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents
  });

  // Fetch subjects
  const { 
    data: subjectsList = [],
    isLoading: isLoadingSubjects, 
    error: subjectsError
  } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects
  });
  
  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setNewStudent({
        roll_number: '',
        name: '',
        course: 'B.Tech',
        year: 3,
        section: 'A'
      });
      toast.success('Student added successfully');
    }
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<{ roll_number: string; name: string }> }) => 
      updateStudent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setEditingStudentId(null);
      toast.success('Student updated successfully');
    }
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
    }
  });

  // Add subject mutation
  const addSubjectMutation = useMutation({
    mutationFn: (subjectData: { code: string; name: string; }) => 
      addSubject({
        ...subjectData,
        faculty_id: user?.id || '1',
        course_id: '1'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setNewSubject({
        code: '',
        name: '',
      });
      toast.success('Subject added successfully');
    }
  });

  // Update subject mutation
  const updateSubjectMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<{ code: string; name: string }> }) => 
      updateSubject(id, {
        ...updates,
        faculty_id: user?.id || '1',
        course_id: '1'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setEditingSubjectId(null);
      toast.success('Subject updated successfully');
    }
  });

  // Delete subject mutation
  const deleteSubjectMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject deleted successfully');
    }
  });
  
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleAddStudent = () => {
    if (!newStudent.roll_number || !newStudent.name) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    addStudentMutation.mutate(newStudent);
  };
  
  const handleAddSubject = () => {
    if (!newSubject.code || !newSubject.name) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    addSubjectMutation.mutate(newSubject);
  };
  
  const handleEditStudent = (id: string) => {
    const student = studentsList.find(s => s.id === id);
    if (student) {
      setEditingStudentId(id);
      setEditingStudent({
        roll_number: student.roll_number,
        name: student.name,
      });
    }
  };
  
  const handleSaveStudent = () => {
    if (!editingStudentId) return;
    
    updateStudentMutation.mutate({
      id: editingStudentId,
      updates: editingStudent
    });
  };
  
  const handleDeleteStudent = (id: string) => {
    deleteStudentMutation.mutate(id);
  };
  
  const handleEditSubject = (id: string) => {
    const subject = subjectsList.find(s => s.id === id);
    if (subject) {
      setEditingSubjectId(id);
      setEditingSubject({
        code: subject.code,
        name: subject.name,
      });
    }
  };
  
  const handleSaveSubject = () => {
    if (!editingSubjectId) return;
    
    updateSubjectMutation.mutate({
      id: editingSubjectId,
      updates: editingSubject
    });
  };
  
  const handleDeleteSubject = (id: string) => {
    deleteSubjectMutation.mutate(id);
  };

  if (studentsError || subjectsError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container px-4 py-10 mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500">Error loading data</h1>
          <p className="mt-2 text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container px-4 py-6 md:py-10 mx-auto animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage students, subjects, and attendance records
            </p>
          </div>
          
          <Tabs defaultValue="students" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Student</CardTitle>
                  <CardDescription>Enter the details for a new student</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-roll">Roll Number</Label>
                      <Input 
                        id="new-roll" 
                        value={newStudent.roll_number}
                        onChange={(e) => setNewStudent({...newStudent, roll_number: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-name">Name</Label>
                      <Input 
                        id="new-name" 
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button 
                        onClick={handleAddStudent} 
                        disabled={addStudentMutation.isPending}
                      >
                        {addStudentMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Student
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Manage Students</CardTitle>
                  <CardDescription>Edit or remove existing students</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStudents ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : studentsList.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No students found. Add a student to get started.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentsList.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              {editingStudentId === student.id ? (
                                <Input 
                                  value={editingStudent.roll_number}
                                  onChange={(e) => setEditingStudent({...editingStudent, roll_number: e.target.value})}
                                />
                              ) : (
                                student.roll_number
                              )}
                            </TableCell>
                            <TableCell>
                              {editingStudentId === student.id ? (
                                <Input 
                                  value={editingStudent.name}
                                  onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                                />
                              ) : (
                                student.name
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                {editingStudentId === student.id ? (
                                  <Button 
                                    size="sm" 
                                    onClick={handleSaveStudent}
                                    disabled={updateStudentMutation.isPending}
                                  >
                                    {updateStudentMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Save className="h-4 w-4" />
                                    )}
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => handleEditStudent(student.id)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleDeleteStudent(student.id)}
                                  disabled={deleteStudentMutation.isPending}
                                >
                                  {deleteStudentMutation.isPending && deleteStudentMutation.variables === student.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash className="h-4 w-4" />
                                  )}
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
            </TabsContent>
            
            <TabsContent value="subjects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Subject</CardTitle>
                  <CardDescription>Enter the details for a new subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-code">Subject Code</Label>
                      <Input 
                        id="new-code" 
                        value={newSubject.code}
                        onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-subject-name">Subject Name</Label>
                      <Input 
                        id="new-subject-name" 
                        value={newSubject.name}
                        onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button 
                        onClick={handleAddSubject}
                        disabled={addSubjectMutation.isPending}
                      >
                        {addSubjectMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Subject
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Manage Subjects</CardTitle>
                  <CardDescription>Edit or remove existing subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSubjects ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : subjectsList.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No subjects found. Add a subject to get started.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjectsList.map((subject) => (
                          <TableRow key={subject.id}>
                            <TableCell>
                              {editingSubjectId === subject.id ? (
                                <Input 
                                  value={editingSubject.code}
                                  onChange={(e) => setEditingSubject({...editingSubject, code: e.target.value})}
                                />
                              ) : (
                                subject.code
                              )}
                            </TableCell>
                            <TableCell>
                              {editingSubjectId === subject.id ? (
                                <Input 
                                  value={editingSubject.name}
                                  onChange={(e) => setEditingSubject({...editingSubject, name: e.target.value})}
                                />
                              ) : (
                                subject.name
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                {editingSubjectId === subject.id ? (
                                  <Button 
                                    size="sm" 
                                    onClick={handleSaveSubject}
                                    disabled={updateSubjectMutation.isPending}
                                  >
                                    {updateSubjectMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Save className="h-4 w-4" />
                                    )}
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => handleEditSubject(subject.id)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleDeleteSubject(subject.id)}
                                  disabled={deleteSubjectMutation.isPending}
                                >
                                  {deleteSubjectMutation.isPending && deleteSubjectMutation.variables === subject.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash className="h-4 w-4" />
                                  )}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;

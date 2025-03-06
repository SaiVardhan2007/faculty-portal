
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Trash, Edit, Save } from 'lucide-react';
import { toast } from '../lib/toast';
import { students, subjects } from '../lib/mockData';

const Admin: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [studentsList, setStudentsList] = useState([...students]);
  const [subjectsList, setSubjectsList] = useState([...subjects]);
  
  const [newStudent, setNewStudent] = useState({
    rollNumber: '',
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
    rollNumber: '',
    name: '',
  });
  
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState({
    code: '',
    name: '',
  });
  
  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleAddStudent = () => {
    if (!newStudent.rollNumber || !newStudent.name) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newId = (Math.max(...studentsList.map(s => parseInt(s.id))) + 1).toString();
    
    setStudentsList([
      ...studentsList,
      {
        id: newId,
        ...newStudent
      }
    ]);
    
    setNewStudent({
      rollNumber: '',
      name: '',
      course: 'B.Tech',
      year: 3,
      section: 'A'
    });
    
    toast.success('Student added successfully');
  };
  
  const handleAddSubject = () => {
    if (!newSubject.code || !newSubject.name) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newId = (Math.max(...subjectsList.map(s => parseInt(s.id))) + 1).toString();
    
    setSubjectsList([
      ...subjectsList,
      {
        id: newId,
        ...newSubject,
        facultyId: user?.id || '1',
        courseId: '1'
      }
    ]);
    
    setNewSubject({
      code: '',
      name: '',
    });
    
    toast.success('Subject added successfully');
  };
  
  const handleEditStudent = (id: string) => {
    const student = studentsList.find(s => s.id === id);
    if (student) {
      setEditingStudentId(id);
      setEditingStudent({
        rollNumber: student.rollNumber,
        name: student.name,
      });
    }
  };
  
  const handleSaveStudent = () => {
    if (!editingStudentId) return;
    
    setStudentsList(
      studentsList.map(student => 
        student.id === editingStudentId 
          ? { ...student, ...editingStudent }
          : student
      )
    );
    
    setEditingStudentId(null);
    toast.success('Student updated successfully');
  };
  
  const handleDeleteStudent = (id: string) => {
    setStudentsList(studentsList.filter(student => student.id !== id));
    toast.success('Student deleted successfully');
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
    
    setSubjectsList(
      subjectsList.map(subject => 
        subject.id === editingSubjectId 
          ? { ...subject, ...editingSubject }
          : subject
      )
    );
    
    setEditingSubjectId(null);
    toast.success('Subject updated successfully');
  };
  
  const handleDeleteSubject = (id: string) => {
    setSubjectsList(subjectsList.filter(subject => subject.id !== id));
    toast.success('Subject deleted successfully');
  };
  
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
                        value={newStudent.rollNumber}
                        onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
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
                      <Button onClick={handleAddStudent}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
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
                                value={editingStudent.rollNumber}
                                onChange={(e) => setEditingStudent({...editingStudent, rollNumber: e.target.value})}
                              />
                            ) : (
                              student.rollNumber
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
                                <Button size="sm" onClick={handleSaveStudent}>
                                  <Save className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => handleEditStudent(student.id)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteStudent(student.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                      <Button onClick={handleAddSubject}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subject
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
                                <Button size="sm" onClick={handleSaveSubject}>
                                  <Save className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => handleEditSubject(subject.id)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteSubject(subject.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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

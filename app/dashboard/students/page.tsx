"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Filter, Trash2, Plus, Download } from "lucide-react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StudentData {
  _id: string
  fullName: string
  phone: string
  gender: string
  ticketNumber: number
  certificateSerial: string
  seminarId: {
    _id: string
    title: string
    type: string
    courseStartDate: Date
    courseEndDate: Date
    location: string
    lectureName: string
  }
  createdAt: Date
}

interface SeminarOption {
  _id: string
  title: string
  type: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([])
  const [seminars, setSeminars] = useState<SeminarOption[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    seminarId: '',
    fullName: '',
    phone: '',
    gender: ''
  })

  useEffect(() => {
    fetchStudents()
    fetchSeminars()
  }, [])

  useEffect(() => {
    if (filter === "all") {
      setFilteredStudents(students)
    } else {
      setFilteredStudents(students.filter(s => s.seminarId?._id === filter))
    }
  }, [filter, students])

  const fetchSeminars = async () => {
    try {
      const response = await fetch('/api/seminars')
      const result = await response.json()
      if (result.success) {
        setSeminars(result.data)
      }
    } catch (error) {
      console.error('Error fetching seminars:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const result = await response.json()
      if (result.success) {
        setStudents(result.data)
        setFilteredStudents(result.data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (student: StudentData) => {
    setSelectedStudent(student)
    setViewOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setStudents(students.filter(s => s._id !== id))
        alert('Student deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student')
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL students? This action cannot be undone!')) return
    
    try {
      const response = await fetch('/api/students', {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setStudents([])
        setFilteredStudents([])
        alert('All students deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting all students:', error)
      alert('Failed to delete students')
    }
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Get the next ticket number for the selected seminar
      const seminarStudents = students.filter(s => s.seminarId._id === formData.seminarId)
      const lastTicket = seminarStudents.length > 0 
        ? Math.max(...seminarStudents.map(s => s.ticketNumber))
        : 0
      
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ticketNumber: lastTicket + 1
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        await fetchStudents()
        setAddOpen(false)
        setFormData({ seminarId: '', fullName: '', phone: '', gender: '' })
        alert('Student added successfully')
      } else {
        alert(result.error || 'Failed to add student')
      }
    } catch (error) {
      console.error('Error adding student:', error)
      alert('Failed to add student')
    } finally {
      setSubmitting(false)
    }
  }

  const exportToExcel = () => {
    // Prepare data for export
    const exportData = filteredStudents.map(student => ({
      'Ticket Number': student.ticketNumber,
      'Certificate Serial': student.certificateSerial,
      'Full Name': student.fullName,
      'Phone': student.phone,
      'Gender': student.gender,
      'Course/Seminar': student.seminarId?.title || 'N/A',
      'Type': student.seminarId?.type || 'N/A',
      'Location': student.seminarId?.location || 'N/A',
      'Lecturer': student.seminarId?.lectureName || 'N/A',
      'Registration Date': format(new Date(student.createdAt), "MMM dd, yyyy")
    }))

    // Convert to CSV
    const headers = Object.keys(exportData[0] || {})
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      )
    ].join('\n')

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `students_${filter === 'all' ? 'all' : seminars.find(s => s._id === filter)?.title || 'filtered'}_${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStudentCount = (seminarId: string) => {
    return students.filter(s => s.seminarId?._id === seminarId).length
  }

  const getFilterLabel = () => {
    if (filter === "all") return "All Students"
    const seminar = seminars.find(s => s._id === filter)
    return seminar ? `${seminar.title} (${seminar.type})` : "Filter"
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Registered Students</h1>
        {students.length > 0 && (
          <Button variant="destructive" onClick={handleDeleteAll} className="w-full sm:w-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle>Students List</CardTitle>
              <CardDescription>
                View all registered students ({filteredStudents.length} total)
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button onClick={() => setAddOpen(true)} className="flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
              {filteredStudents.length > 0 && (
                <Button variant="outline" onClick={exportToExcel} className="flex-1 sm:flex-none">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Filter className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{getFilterLabel()}</span>
                    <span className="sm:hidden">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    <div className="flex justify-between w-full">
                      <span>All Students</span>
                      <span className="text-muted-foreground">{students.length}</span>
                    </div>
                  </DropdownMenuItem>
                  {seminars.map((seminar) => (
                    <DropdownMenuItem key={seminar._id} onClick={() => setFilter(seminar._id)}>
                      <div className="flex justify-between w-full">
                        <span>{seminar.title} ({seminar.type})</span>
                        <span className="text-muted-foreground">{getStudentCount(seminar._id)}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Ticket #</TableHead>
                  <TableHead className="whitespace-nowrap">Certificate Serial</TableHead>
                  <TableHead className="whitespace-nowrap">Full Name</TableHead>
                  <TableHead className="whitespace-nowrap">Phone</TableHead>
                  <TableHead className="whitespace-nowrap hidden md:table-cell">Gender</TableHead>
                  <TableHead className="whitespace-nowrap">Course/Seminar</TableHead>
                  <TableHead className="whitespace-nowrap hidden lg:table-cell">Type</TableHead>
                  <TableHead className="whitespace-nowrap hidden xl:table-cell">Registration Date</TableHead>
                  <TableHead className="whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Loading students...
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No students registered yet
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-bold text-blue-600">{student.ticketNumber}</TableCell>
                    <TableCell className="font-mono text-sm font-semibold text-green-600">
                      {student.certificateSerial || 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{student.fullName}</TableCell>
                    <TableCell className="whitespace-nowrap">{student.phone}</TableCell>
                    <TableCell className="capitalize hidden md:table-cell">{student.gender}</TableCell>
                    <TableCell className="font-semibold whitespace-nowrap">{student.seminarId?.title || "N/A"}</TableCell>
                    <TableCell className="capitalize hidden lg:table-cell">{student.seminarId?.type || "N/A"}</TableCell>
                    <TableCell className="hidden xl:table-cell whitespace-nowrap">
                      {format(new Date(student.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleView(student)}>
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline ml-1">View</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(student._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>


      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Complete information about this student</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base">{selectedStudent.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base">{selectedStudent.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p className="text-base capitalize">{selectedStudent.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ticket Number</p>
                  <p className="text-base font-bold text-blue-600">#{selectedStudent.ticketNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificate Serial</p>
                  <p className="text-base font-mono font-bold text-green-600">{selectedStudent.certificateSerial}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Registered For</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Course/Seminar Title</p>
                    <p className="text-base font-semibold">{selectedStudent.seminarId?.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="text-base capitalize">{selectedStudent.seminarId?.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Lecturer</p>
                    <p className="text-base">{selectedStudent.seminarId?.lectureName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-base">{selectedStudent.seminarId?.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p className="text-base">
                      {selectedStudent.seminarId?.courseStartDate 
                        ? format(new Date(selectedStudent.seminarId.courseStartDate), "MMM dd, yyyy")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p className="text-base">
                      {selectedStudent.seminarId?.courseEndDate 
                        ? format(new Date(selectedStudent.seminarId.courseEndDate), "MMM dd, yyyy")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                <p className="text-base">
                  {format(new Date(selectedStudent.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Student Manually</DialogTitle>
            <DialogDescription>Register a student who didn't use the registration link</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seminarId">Course/Seminar *</Label>
              <Select 
                value={formData.seminarId} 
                onValueChange={(value) => setFormData({...formData, seminarId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course/seminar" />
                </SelectTrigger>
                <SelectContent>
                  {seminars.map((seminar) => (
                    <SelectItem key={seminar._id} value={seminar._id}>
                      {seminar.title} ({seminar.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => setFormData({...formData, gender: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Student"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

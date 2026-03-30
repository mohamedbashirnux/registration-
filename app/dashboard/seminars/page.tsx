"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SeminarForm } from "@/components/reusible/seminar-form"
import { Plus, MoreVertical, Eye, Pencil, Trash2, Link2, Copy } from "lucide-react"
import { format } from "date-fns"

interface SeminarData {
  _id?: string
  title: string
  type: "course" | "seminar"
  courseStartDate: string | Date
  courseEndDate: string | Date
  certificateData: string | Date
  location: string
  lectureImage: string
  lectureName: string
  lectureBio: string
  summary: string
}

export default function SeminarsPage() {
  const [seminars, setSeminars] = useState<SeminarData[]>([])
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [selectedSeminar, setSelectedSeminar] = useState<SeminarData | null>(null)
  const [generatedLink, setGeneratedLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch seminars on component mount
  useEffect(() => {
    fetchSeminars()
  }, [])

  const fetchSeminars = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seminars')
      const result = await response.json()
      if (result.success) {
        setSeminars(result.data)
      }
    } catch (error) {
      console.error('Error fetching seminars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this seminar?')) return
    
    try {
      const response = await fetch(`/api/seminars/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setSeminars(seminars.filter(s => s._id !== id))
      }
    } catch (error) {
      console.error('Error deleting seminar:', error)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL seminars? This action cannot be undone!')) return
    
    try {
      const response = await fetch('/api/seminars', {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setSeminars([])
        alert('All seminars deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting all seminars:', error)
    }
  }

  const handleView = (seminar: SeminarData) => {
    setSelectedSeminar(seminar)
    setViewOpen(true)
  }

  const handleGenerateLink = async (seminar: SeminarData) => {
    try {
      const response = await fetch('/api/registration-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seminarId: seminar._id }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        const link = `${window.location.origin}/register/${result.data.token}`
        setGeneratedLink(link)
        setLinkOpen(true)
      }
    } catch (error) {
      console.error('Error generating link:', error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    alert('Link copied to clipboard!')
  }

  const handleSubmit = async (formData: any) => {
    setSubmitting(true)
    
    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('/api/seminars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSeminars([result.data, ...seminars])
        setOpen(false)
      } else {
        console.error('Error creating seminar:', result.error)
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit form')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Seminars & Courses</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          {seminars.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteAll} className="flex-1 sm:flex-none">
              <Trash2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Delete All</span>
              <span className="sm:hidden">Delete</span>
            </Button>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
              </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pb-4">
                <DialogTitle>Add New Seminar/Course</DialogTitle>
                <DialogDescription>Fill in the details below to create a new seminar or course</DialogDescription>
              </DialogHeader>
              <SeminarForm 
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                loading={loading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Seminars & Courses List</CardTitle>
          <CardDescription>Manage your seminars and courses</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Title</TableHead>
                  <TableHead className="whitespace-nowrap hidden md:table-cell">Type</TableHead>
                  <TableHead className="whitespace-nowrap">Course Dates</TableHead>
                  <TableHead className="whitespace-nowrap hidden lg:table-cell">Certificate Date</TableHead>
                  <TableHead className="whitespace-nowrap hidden xl:table-cell">Location</TableHead>
                  <TableHead className="whitespace-nowrap hidden xl:table-cell">Lecturer Name</TableHead>
                  <TableHead className="whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="text-muted-foreground">Loading seminars...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : seminars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No seminars or courses added yet
                  </TableCell>
                </TableRow>
              ) : (
                seminars.map((seminar) => (
                  <TableRow key={seminar._id}>
                    <TableCell className="font-medium whitespace-nowrap">{seminar.title}</TableCell>
                    <TableCell className="capitalize hidden md:table-cell">{seminar.type}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {seminar.courseStartDate && seminar.courseEndDate 
                        ? `${format(new Date(seminar.courseStartDate), "MMM dd")} - ${format(new Date(seminar.courseEndDate), "MMM dd, yyyy")}`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell whitespace-nowrap">
                      {seminar.certificateData ? format(new Date(seminar.certificateData), "MMM dd, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">{seminar.location}</TableCell>
                    <TableCell className="hidden xl:table-cell">{seminar.lectureName}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(seminar)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGenerateLink(seminar)}>
                            <Link2 className="mr-2 h-4 w-4" />
                            Generate Link
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(seminar._id!)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seminar Details</DialogTitle>
            <DialogDescription>Complete information about this seminar/course</DialogDescription>
          </DialogHeader>
          {selectedSeminar && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Title</p>
                  <p className="text-base font-semibold">{selectedSeminar.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-base capitalize">{selectedSeminar.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-base">{selectedSeminar.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course Start Date</p>
                  <p className="text-base">
                    {selectedSeminar.courseStartDate ? format(new Date(selectedSeminar.courseStartDate), "MMMM dd, yyyy") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course End Date</p>
                  <p className="text-base">
                    {selectedSeminar.courseEndDate ? format(new Date(selectedSeminar.courseEndDate), "MMMM dd, yyyy") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificate Date</p>
                  <p className="text-base">
                    {selectedSeminar.certificateData ? format(new Date(selectedSeminar.certificateData), "MMMM dd, yyyy") : "N/A"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Lecturer Information</p>
                <div className="flex gap-4">
                  {selectedSeminar.lectureImage && (
                    <img 
                      src={selectedSeminar.lectureImage} 
                      alt={selectedSeminar.lectureName}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{selectedSeminar.lectureName}</p>
                    {selectedSeminar.lectureBio && (
                      <p className="text-sm text-muted-foreground mt-2">{selectedSeminar.lectureBio}</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedSeminar.summary && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Summary/Description</p>
                  <p className="text-base">{selectedSeminar.summary}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generated Link Dialog */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Link Generated</DialogTitle>
            <DialogDescription>Share this link with students to register</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg break-all">
              <p className="text-sm">{generatedLink}</p>
            </div>
            <Button onClick={copyToClipboard} className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <p className="text-xs text-muted-foreground">
              This link can only be used once by one student. Generate a new link for each student.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
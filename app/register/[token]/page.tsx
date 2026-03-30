"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { studentSchema, type StudentFormData } from "@/lib/validations/student"
import { format } from "date-fns"

interface SeminarInfo {
  title: string
  type: string
  courseStartDate: Date
  courseEndDate: Date
  certificateData: Date
  location: string
  lectureImage: string
  lectureName: string
  lectureBio: string
  summary: string
}

export default function RegisterPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [seminarInfo, setSeminarInfo] = useState<SeminarInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  })

  const gender = watch("gender")

  useEffect(() => {
    fetchSeminarInfo()
  }, [token])

  const fetchSeminarInfo = async () => {
    try {
      const response = await fetch(`/api/registration-links/${token}`)
      const result = await response.json()
      
      if (result.success) {
        setSeminarInfo(result.data.seminar)
      } else {
        setError(result.error || "Invalid or expired registration link")
      }
    } catch (error) {
      setError("Failed to load registration information")
    } finally {
      setLoading(false)
    }
  }

  const onSubmitForm = async (data: StudentFormData) => {
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/students/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          token
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        const seminarType = seminarInfo?.type === "course" ? "Course" : "Seminar"
        
        const params = new URLSearchParams({
          ticket: result.data.ticketNumber.toString(),
          serial: result.data.certificateSerial || '',
          type: seminarType,
          title: seminarInfo?.title || '',
          location: seminarInfo?.location || '',
          startDate: seminarInfo?.courseStartDate ? new Date(seminarInfo.courseStartDate).toISOString() : '',
          endDate: seminarInfo?.courseEndDate ? new Date(seminarInfo.courseEndDate).toISOString() : '',
          fullName: data.fullName
        })
        
        router.push(`/register/success?${params.toString()}`)
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (error) {
      setError("Failed to submit registration")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-destructive">Registration Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-base mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              Please contact the administrator for a new registration link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!seminarInfo) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Seminar Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {seminarInfo.title} - {seminarInfo.type === "course" ? "Course" : "Seminar"}
            </CardTitle>
            <CardDescription>Review the complete details before registering</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-base capitalize">{seminarInfo.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-base">{seminarInfo.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course Start Date</p>
                  <p className="text-base">
                    {format(new Date(seminarInfo.courseStartDate), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course End Date</p>
                  <p className="text-base">
                    {format(new Date(seminarInfo.courseEndDate), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificate Date</p>
                  <p className="text-base">
                    {format(new Date(seminarInfo.certificateData), "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Lecturer Information</p>
                <div className="flex gap-4">
                  {seminarInfo.lectureImage && (
                    <img 
                      src={seminarInfo.lectureImage} 
                      alt={seminarInfo.lectureName}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{seminarInfo.lectureName}</p>
                    {seminarInfo.lectureBio && (
                      <p className="text-sm text-muted-foreground mt-2">{seminarInfo.lectureBio}</p>
                    )}
                  </div>
                </div>
              </div>

              {seminarInfo.summary && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Summary/Description</p>
                  <p className="text-base">{seminarInfo.summary}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Please fill in your details to complete registration</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="+1234567890"
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={gender} onValueChange={(value) => setValue("gender", value as "male" | "female")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Complete Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
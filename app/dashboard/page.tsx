"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, GraduationCap, UserCheck } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSeminars: 0,
    totalCourses: 0,
    totalUsers: 0,
    loading: true
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch students
      const studentsRes = await fetch('/api/students')
      const studentsData = await studentsRes.json()
      const students = studentsData.success ? studentsData.data : []

      // Fetch seminars
      const seminarsRes = await fetch('/api/seminars')
      const seminarsData = await seminarsRes.json()
      const seminars = seminarsData.success ? seminarsData.data : []

      // Fetch users
      const usersRes = await fetch('/api/users')
      const usersData = await usersRes.json()
      const users = usersData.success ? usersData.data : []

      // Calculate stats
      const courses = seminars.filter((s: any) => s.type === 'course').length
      const seminarCount = seminars.filter((s: any) => s.type === 'seminar').length

      setStats({
        totalStudents: students.length,
        totalSeminars: seminarCount,
        totalCourses: courses,
        totalUsers: users.length,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your system.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : (
              <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Registered students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : (
              <div className="text-2xl font-bold text-green-600">{stats.totalCourses}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Active courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Seminars</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : (
              <div className="text-2xl font-bold text-purple-600">{stats.totalSeminars}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Active seminars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : (
              <div className="text-2xl font-bold text-orange-600">{stats.totalUsers}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Admin users
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/dashboard/seminars" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Add New Seminar/Course</div>
              <div className="text-sm text-muted-foreground">Create a new seminar or course</div>
            </a>
            <a href="/dashboard/students" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Register Student</div>
              <div className="text-sm text-muted-foreground">Manually register a new student</div>
            </a>
            <a href="/dashboard/users" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Manage Users</div>
              <div className="text-sm text-muted-foreground">Add or manage admin users</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>About this registration system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Registrations</span>
              <span className="font-medium">{stats.totalStudents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Programs</span>
              <span className="font-medium">{stats.totalCourses + stats.totalSeminars}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Admins</span>
              <span className="font-medium">{stats.totalUsers}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

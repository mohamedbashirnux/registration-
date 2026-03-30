import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/lib/models/Student';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'course' or 'seminar'
    
    // Build query
    let query = {};
    
    const students = await Student.find(query)
      .populate('seminarId')
      .sort({ createdAt: -1 });
    
    // Filter by type if provided
    let filteredStudents = students;
    if (type) {
      filteredStudents = students.filter((student: any) => 
        student.seminarId?.type === type
      );
    }
    
    return NextResponse.json({ success: true, data: filteredStudents });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await Student.deleteMany({});
    return NextResponse.json({ success: true, message: 'All students deleted' });
  } catch (error) {
    console.error('Error deleting all students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Get seminar details
    const Seminar = (await import('@/lib/models/Seminar')).default;
    const seminar = await Seminar.findById(body.seminarId);
    
    if (!seminar) {
      return NextResponse.json(
        { success: false, error: 'Seminar not found' },
        { status: 404 }
      );
    }
    
    // Generate certificate serial number
    const year = new Date().getFullYear();
    const courseCode = seminar.title.substring(0, 2).toUpperCase();
    const serialNumber = String(body.ticketNumber).padStart(3, '0');
    const certificateSerial = `XH-${year}-${courseCode}-${serialNumber}`;
    
    const student = new Student({
      ...body,
      certificateSerial
    });
    await student.save();
    
    return NextResponse.json({ success: true, data: student }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    );
  }
}

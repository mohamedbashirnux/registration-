import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/lib/models/Student';
import RegistrationLink from '@/lib/models/RegistrationLink';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { token, fullName, phone, gender } = body;
    
    // Verify the registration link
    const link = await RegistrationLink.findOne({ token });
    
    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Invalid registration link' },
        { status: 404 }
      );
    }
    
    if (link.isUsed) {
      return NextResponse.json(
        { success: false, error: 'This registration link has already been used' },
        { status: 400 }
      );
    }
    
    if (new Date() > link.expiresAt) {
      return NextResponse.json(
        { success: false, error: 'This registration link has expired' },
        { status: 400 }
      );
    }
    
    // Get the next ticket number for this seminar
    const lastStudent = await Student.findOne({ seminarId: link.seminarId })
      .sort({ ticketNumber: -1 })
      .select('ticketNumber');
    
    const ticketNumber = lastStudent && lastStudent.ticketNumber ? lastStudent.ticketNumber + 1 : 1;
    
    // Get seminar details for certificate serial
    const Seminar = (await import('@/lib/models/Seminar')).default;
    const seminar = await Seminar.findById(link.seminarId);
    
    if (!seminar) {
      return NextResponse.json(
        { success: false, error: 'Seminar not found' },
        { status: 404 }
      );
    }
    
    const year = new Date().getFullYear();
    const courseCode = seminar.title.substring(0, 2).toUpperCase();
    const serialNumber = String(ticketNumber).padStart(3, '0');
    const certificateSerial = `XH-${year}-${courseCode}-${serialNumber}`;
    
    console.log('Last student:', lastStudent);
    console.log('New ticket number:', ticketNumber);
    console.log('Certificate serial:', certificateSerial);
    
    // Create student record
    const student = new Student({
      fullName,
      phone,
      gender,
      ticketNumber,
      certificateSerial,
      seminarId: link.seminarId,
      registrationToken: token
    });
    
    const savedStudent = await student.save();
    console.log('Saved student:', savedStudent);
    
    // Mark link as used
    link.isUsed = true;
    link.usedBy = fullName;
    await link.save();
    
    return NextResponse.json({ success: true, data: savedStudent }, { status: 201 });
  } catch (error) {
    console.error('Error registering student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register student' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RegistrationLink from '@/lib/models/RegistrationLink';
import Seminar from '@/lib/models/Seminar';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await connectDB();
    const { token } = await params;
    
    const link = await RegistrationLink.findOne({ token }).populate('seminarId');
    
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
    
    console.log('Populated seminar data:', link.seminarId);
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        seminar: link.seminarId 
      } 
    });
  } catch (error) {
    console.error('Error fetching registration link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registration link' },
      { status: 500 }
    );
  }
}
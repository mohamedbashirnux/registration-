import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Seminar from '@/lib/models/Seminar';

export async function GET() {
  try {
    await connectDB();
    const seminars = await Seminar.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: seminars });
  } catch (error) {
    console.error('Error fetching seminars:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch seminars' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('Received seminar data:', body);
    
    const seminar = new Seminar(body);
    await seminar.save();
    
    return NextResponse.json({ success: true, data: seminar }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating seminar:', error);
    console.error('Error details:', error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create seminar' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await Seminar.deleteMany({});
    return NextResponse.json({ success: true, message: 'All seminars deleted' });
  } catch (error) {
    console.error('Error deleting all seminars:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete seminars' },
      { status: 500 }
    );
  }
}